import { NestFactory } from '@nestjs/core';
import { AnswerModule } from './answer.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from '@app/interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AnswerModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('考试系统 - Answer')
    .setDescription('Answer接口')
    .setVersion('1.0')
    .addBearerAuth() // 如果你的接口需要 JWT 鉴权，必须加这一行
    .build();

  // 2. 创建文档
  const document = SwaggerModule.createDocument(app, config);

  // 3. 设置访问路径（例如：http://localhost:3000/api-docs）
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3003);
  console.log(`HTTP 运行在: http://localhost:3003`);
  console.log('这里是answer');
}

bootstrap();
