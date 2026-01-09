import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '@app/entity';
import { CommonModule } from '@app/auth';
import { JwtAuthGuard } from '@app/auth';
import { APP_GUARD } from '@nestjs/core';
import { ExcelModule } from '@app/excel';
import { Exam } from '@app/entity';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EXAM_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 8888,
        },
      },
    ]),
    CommonModule,
    TypeOrmModule.forFeature([Answer, Exam]),
    ExcelModule,
  ],
  controllers: [AnswerController],
  providers: [
    AnswerService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AnswerModule {}
