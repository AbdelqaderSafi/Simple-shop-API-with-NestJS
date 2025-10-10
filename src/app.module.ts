import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [AuthModule, UserModule, DatabaseModule],
})
export class AppModule {}
