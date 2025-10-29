import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { GlobalServicesModule } from './global-services/global-services.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    GlobalServicesModule,
  ],
})
export class AppModule {}
