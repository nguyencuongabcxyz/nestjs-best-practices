import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { GlobalServicesModule } from './global-services/global-services.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    GlobalServicesModule,
    AuthModule,
  ],
})
export class AppModule {}
