import { Module } from '@nestjs/common';
import { AnalyseController } from './analyse.controller';
import { AnalyseService } from './analyse.service';
import { CommonModule } from '@app/auth';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@app/auth';
import { RedisModule } from '@app/redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer, Exam, User } from '@app/entity';
@Module({
  imports: [
    CommonModule,
    RedisModule,
    TypeOrmModule.forFeature([Answer, Exam, User]),
  ],
  controllers: [AnalyseController],
  providers: [
    AnalyseService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AnalyseModule {}
