import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import type { LoginDTO, RegisterDTO, UserResponseDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() registerDTO: RegisterDTO): Promise<UserResponseDTO> {
    return this.authService.register(registerDTO);
  }
  @Post('login')
  login(@Body() loginDTO: LoginDTO): Promise<UserResponseDTO> {
    return this.authService.login(loginDTO);
  }

  @Get()
  validate(@Req() request: Request): UserResponseDTO {
    return this.authService.validate(request.user!);
  }
}
