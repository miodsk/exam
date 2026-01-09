import { Controller, Get, Query } from '@nestjs/common';
import { AnalyseService } from './analyse.service';

@Controller('analyse')
export class AnalyseController {
  constructor(private readonly analyseService: AnalyseService) {}
  @Get('ranking')
  async ranking(@Query('examId') examId: number) {
    return await this.analyseService.ranking(examId);
  }
}
