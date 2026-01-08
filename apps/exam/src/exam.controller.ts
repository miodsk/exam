import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';
import { AddExamDto, SaveExamDto } from '@app/dto';
import { type Request } from 'express';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post('add')
  async addExam(@Body() examInfo: AddExamDto, @Req() req: Request) {
    const userId = req.user.id;
    return await this.examService.addExam(examInfo, userId);
  }

  @Get('list')
  async list(@Req() req: Request, @Query('bin') bin: string) {
    const userId = req.user.id;
    return this.examService.list(userId, bin);
  }

  @Get('/detail/:id')
  async detail(@Param('id') id: string) {
    return this.examService.getExamById(+id);
  }

  @Delete('delete/:id')
  async del(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user.id;
    return this.examService.delete(userId, +id);
  }

  @Post('save')
  async save(@Body() dto: SaveExamDto) {
    return this.examService.save(dto);
  }

  @Get('publish/:id')
  async publish(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user.id;
    return this.examService.publish(userId, +id);
  }
}
