import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { CommonModule } from '@app/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from '@app/entity';
import { JwtAuthGuard } from '@app/auth';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Exam])],
  controllers: [ExamController],
  providers: [
    ExamService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class ExamModule {}
