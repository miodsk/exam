import { Controller, Get, Inject } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    @Inject('EXAM_SERVICE') private readonly examClient: ClientProxy,
  ) {}

  @Get()
  async getHello() {
    const value = await firstValueFrom(
      this.examClient.send<string>('sum', [1, 2, 3, 4, 5]),
    );
    console.log('Sum from Exam Service:', value);
    return this.answerService.getHello() + value;
  }
}
