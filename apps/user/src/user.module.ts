import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RedisModule } from '@app/redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/entity';
import { DatabaseModule } from '@app/database';
import { EmailModule } from '@app/email';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule, JwtAuthGuard } from '@app/auth';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    CommonModule,
    TypeOrmModule.forFeature([User]),
    EmailModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
