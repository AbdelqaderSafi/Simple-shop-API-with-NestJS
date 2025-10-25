import { RegisterDTO } from 'src/modules/auth/dto/auth.dto';
import z, { ZodType } from 'zod';

export const validationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email().toLowerCase(), // validate and transform to lowercase
  password: z.string().min(6).max(100),
  role: z.enum(['CUSTOMER', 'MERCHANT']),
}) satisfies ZodType<RegisterDTO>;
