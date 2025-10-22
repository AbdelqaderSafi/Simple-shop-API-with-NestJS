import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { request, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Token_Payload } from '../types/user-auth.type';
import { DatabaseService } from 'src/modules/database/database.service';
import { removeFields } from 'src/modules/utils/object.util';
import { Reflector } from '@nestjs/core';
import { IsPublic } from 'src/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: DatabaseService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    // route public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IsPublic, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // get request
    const req = context.switchToHttp().getRequest<Request>();

    // authoraizatin header
    const authHeader = req.headers.authorization;
    // auth header = "Bearer <token>"
    const jwt = authHeader?.split(' ')[1];
    if (!jwt) {
      throw new UnauthorizedException();
    }

    try {
      // validate jwt
      const payload = this.jwtService.verify<Token_Payload>(jwt);

      // get user from db
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { id: BigInt(payload.sub) },
      });

      // attach user to request
      request.user = {
        ...removeFields(user, ['password']),
        id: String(user.id),
      };
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
