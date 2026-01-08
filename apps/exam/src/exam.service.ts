import { BadRequestException, Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AddExamDto, SaveExamDto } from '@app/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '@app/entity/exam.entity';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam) private readonly examRepository: Repository<Exam>,
  ) {}

  async addExam(examInfo: AddExamDto, userId: number) {
    return await this.examRepository.save({
      ...examInfo,
      content: '',
      createUserId: userId,
    });
  }

  async list(userId: number, bin: string) {
    if (bin === 'true') {
      return await this.examRepository.find({
        where: { createUserId: userId, isDelete: true },
      });
    }
    return await this.examRepository.find({
      where: { createUserId: userId, isDelete: false },
    });
  }

  async delete(userId: number, examId: number) {
    const exam = await this.examRepository.findOne({
      where: { id: examId, createUserId: userId },
    });
    if (!exam) {
      throw new BadRequestException('Exam not found or unauthorized');
    }
    await this.examRepository.save({
      ...exam,
      isDelete: true,
    });
    return { message: 'Exam deleted successfully' };
  }

  async save(dto: SaveExamDto) {
    const exam = await this.examRepository.findOne({
      where: { id: dto.id },
    });
    if (!exam) {
      throw new BadRequestException('Exam not found');
    }
    exam.content = dto.content;
    await this.examRepository.save(exam);
    return { message: 'Exam content saved successfully' };
  }

  async getExamById(examId: number) {
    const exam = await this.examRepository.findOne({
      where: { id: examId },
    });
    if (!exam) {
      throw new BadRequestException('Exam not found');
    }
    return exam;
  }

  async publish(userId: number, examId: number) {
    const exam = await this.examRepository.findOne({
      where: { id: examId, createUserId: userId },
    });
    if (!exam) {
      throw new BadRequestException('Exam not found or unauthorized');
    }
    exam.isPublish = true;
    await this.examRepository.save(exam);
    return { message: 'Exam published successfully' };
  }
}
