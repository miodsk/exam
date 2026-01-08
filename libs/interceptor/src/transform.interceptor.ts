// transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as expressResponse } from 'express';

// 定义标准的返回对象接口
export interface Response<T> {
  code: number;
  message: string;
  data: T | null;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response: expressResponse = context.switchToHttp().getResponse();
    const statusCode: number = response.statusCode; // 获取当前请求的 HTTP 状态码

    return next.handle().pipe(
      map((data: T): Response<T> => {
        return {
          // 如果 Controller 返回的是对象，则包裹进去
          // 如果没有返回数据，data 就是 null
          data: data ?? null,
          code: statusCode,
          message: 'success',
        };
      }),
    );
  }
}
