import { Injectable } from '@nestjs/common';

import { RegisterDTO, UserResponseDTO } from '../auth/dto/auth.dto';
import { DatabaseService } from '../database/database.service';
import { User } from 'generated/prisma';
import { removeFields } from '../utils/object.util';

@Injectable()
export class UserService {
  constructor(private prismaService: DatabaseService) {}

  create(registerDTO: RegisterDTO) {
    return this.prismaService.user.create({
      data: registerDTO,
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findByEmailOrThrow(email: string) {
    return this.prismaService.user.findUniqueOrThrow({
      where: { email },
    });
  }

  findOne(id: bigint) {
    return `This action returns a #${id} user`;
  }

  update(id: bigint) {
    return `This action updates a #${id} user`;
  }

  remove(id: bigint) {
    return `This action removes a #${id} user`;
  }
  mapUserWithoutPasswordAndCastBigint(user: User): UserResponseDTO['userData'] {
    const userWithoutPassword = removeFields(user, ['password']);

    return {
      ...userWithoutPassword,
      id: String(userWithoutPassword.id),
    };
  }
}
