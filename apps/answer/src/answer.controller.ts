import {
  Controller,
  Get,
  Inject,
  Body,
  Post,
  Req,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AddAnswerDto } from '@app/dto';
import { type Request } from 'express';
import { ListAnswerVo } from '@app/vo/list-answer.vo';
import { ExcelService } from '@app/excel';
import { DontNeedAuth } from '@app/decorator/decorator';
@Controller('answer')
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly excelService: ExcelService,
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
  @Post('add')
  async add(@Body() dto: AddAnswerDto, @Req() req: Request) {
    const userId = req.user.id;
    return await this.answerService.add(dto, userId);
  }
  @Get('list')
  async list(@Query('examId') examId: string): Promise<ListAnswerVo> {
    if (!examId) {
      throw new BadRequestException('examId 不能为空');
    }
    const res = await this.answerService.list(+examId);
    return {
      answers: res,
    };
  }

  @Get('find/:id')
  async find(@Param('id') id: string) {
    return await this.answerService.find(+id);
  }
  @Get('findByUserId')
  async findByUserId(@Req() req: Request) {
    const userId = req.user.id;
    return await this.answerService.findByUserId(userId);
  }
  @Get('export')
  @DontNeedAuth()
  async export(@Query('examId') examId: string) {
    if (!examId) {
      throw new BadRequestException('examId 不能为空');
    }
    const data = await this.answerService.list(+examId);
    const columns = [
      { header: 'ID', key: 'id', width: 20 },
      { header: '分数', key: 'score', width: 30 },
      { header: '答题人', key: 'answerer', width: 30 },
      { header: '试卷', key: 'exam', width: 30 },
      { header: '创建时间', key: 'createTime', width: 30 },
    ];
    const res = data.map((item) => {
      return {
        id: item.id,
        score: item.score,
        answerer: item.answerer.username,
        exam: item.exam.name,
        createTime: item.createTime,
      };
    });
    return this.excelService.export(columns, res, 'answers.xlsx');
  }
}
