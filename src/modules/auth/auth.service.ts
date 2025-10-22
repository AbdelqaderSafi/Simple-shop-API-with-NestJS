import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO, RegisterDTO, UserResponseDTO } from './dto/auth.dto';
import * as argon from 'argon2';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from 'src/types/declartion-mergin';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService<EnvVariables>,
  ) {}

  async register(registerDTO: RegisterDTO): Promise<UserResponseDTO> {
    // Hash password
    const hashedPassword = await this.hashPassword(registerDTO.password);

    // Store user in db with hashed password
    const createdUser = await this.userService.create({
      ...registerDTO,
      password: hashedPassword,
    });

    // Create jwt token
    const token = this.generateJwtToken(createdUser.id, createdUser.role);

    // return user data + token
    return {
      userData:
        this.userService.mapUserWithoutPasswordAndCastBigint(createdUser),
      token,
    };
  }

  async login(loginDto: LoginDTO): Promise<UserResponseDTO> {
    // find user by email
    const foundUser = await this.userService.findByEmailOrThrow(loginDto.email);
    // verify password with argon
    const isPasswordValid = await this.verifyPassword(
      loginDto.password,
      foundUser.password,
    );
    // throw error if not match
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // generate jwt token
    const token = this.generateJwtToken(foundUser.id, foundUser.role);
    // return user data and token
    return {
      userData: this.userService.mapUserWithoutPasswordAndCastBigint(foundUser),
      token,
    };
  }

  validate(userPayload: UserResponseDTO['userData']) {
    // generate jwt token
    const token = this.generateJwtToken(
      BigInt(userPayload.id),
      userPayload.role,
    );
    // return user data and token
    return {
      userData: userPayload,
      token,
    };
  }

  private hashPassword(password: string) {
    // implement password hashing logic here
    return argon.hash(password);
  }

  private verifyPassword(password: string, hashedPassword: string) {
    return argon.verify(hashedPassword, password);
  }

  private generateJwtToken(userId: bigint | number, role: UserRole) {
    return this.jwtService.sign(
      { sub: String(userId), role },
      { expiresIn: '30d' },
    );
  }
}
