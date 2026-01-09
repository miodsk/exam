import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer, Exam } from '@app/entity';
import { Repository } from 'typeorm';
import { AddAnswerDto } from '@app/dto';
import { BadRequestException } from '@nestjs/common';
import { type Question } from '@app/types';
@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async add(answer: AddAnswerDto, userId: number) {
    const isHaven = await this.answerRepository.findOne({
      where: {
        examId: answer.examId,
        answererId: userId,
      },
    });
    if (isHaven) {
      throw new BadRequestException('你已经答过这份试卷了');
    }
    const exam = await this.examRepository.findOne({
      where: {
        id: answer.examId,
      },
    });
    if (!exam) {
      throw new BadRequestException('试卷不存在');
    }
    let questions: Question[] = [];
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      questions = JSON.parse(exam.content);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new BadRequestException('试卷内容格式错误');
      }
    }

    let answers: Record<number, string | string[]> = {};
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      answers = JSON.parse(answer.content);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new BadRequestException('答卷内容格式错误');
      }
    }
    let totalScore = 0;
    questions.forEach((question) => {
      const answer = answers[question.id];
      if (answer) {
        if (question.type === 'radio') {
          if (answer === question.answer) {
            totalScore += question.score;
          }
        } else if (question.type === 'checkbox') {
          if (answer instanceof Array) {
            if (answer.every((item) => question.answer.includes(item))) {
              totalScore += question.score;
            }
          }
        } else if (question.type === 'input') {
          if (answer === question.answer) {
            totalScore += question.score;
          }
        }
      }
    });
    const newAnswer = new Answer();
    newAnswer.answererId = userId;
    newAnswer.examId = answer.examId;
    newAnswer.score = totalScore;
    newAnswer.content = answer.content;
    return await this.answerRepository.save(newAnswer);
  }
  async list(examId: number) {
    return await this.answerRepository.find({
      where: {
        examId,
      },
      relations: ['answerer', 'exam'],
    });
  }
  async findByUserId(userId: number) {
    return await this.answerRepository.find({
      where: {
        answererId: userId,
      },
      relations: ['answerer', 'exam'],
    });
  }
  async find(id: number) {
    return await this.answerRepository.findOne({
      where: {
        id,
      },
      relations: ['answerer', 'exam'],
    });
  }
}
