import { Injectable } from '@nestjs/common';
import { RedisService } from '@app/redis';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from '@app/entity';
import { Repository } from 'typeorm';
@Injectable()
export class AnalyseService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async ranking(examId: number) {
    const rankingKey = `ranking:${examId}`;

    // 1. 一次性查出所有数据
    const answers = await this.answerRepository.find({
      where: { examId },
    });

    // 2. 在内存中组装数据，不要在循环里 await
    const members: Record<string, number> = {};
    for (const answer of answers) {
      members[answer.answererId] = answer.score;
    }

    // 3. 只有当有数据时才调用一次 Redis
    if (Object.keys(members).length > 0) {
      // 利用你写的 zadd 方法，它支持接收整个 Record
      await this.redisService.zadd(rankingKey, members);
    }

    // 4. 获取前 10 名
    return await this.redisService.zrange(rankingKey, 0, 10);
  }
}
