import { UserResponseDTO } from 'src/modules/auth/dto/auth.dto';

declare global {
  namespace Express {
    interface Request {
      user?: UserResponseDTO['userData'];
    }
  }
}
