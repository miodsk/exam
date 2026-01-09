import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: Redis;

  async keys(pattern: string) {
    return await this.redisClient.keys(pattern);
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
  async zadd(key: string, members: Record<string, number>) {
    const mem: (string | number)[] = [];
    for (const key in members) {
      mem.push(members[key], key);
    }
    return await this.redisClient.zadd(key, ...mem);
  }
  async zrange(key: string, start: number = 0, stop: number = -1) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return this.redisClient.zrange(key, start, stop, 'WITHSCORES', 'REV');
  }
  async zscore(key: string, value: string) {
    return await this.redisClient.zscore(key, value);
  }
}
