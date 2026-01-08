import { NestFactory } from '@nestjs/core';
import { ExamModule } from './exam.module';
import { Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from '@app/interceptor/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ExamModule);

  // 1. 仅仅是配置微服务
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 8888,
    },
  });

  await app.startAllMicroservices();
  const config = new DocumentBuilder()
    .setTitle('考试系统 - Exam')
    .setDescription('Exam接口')
    .setVersion('1.0')
    .addBearerAuth() // 如果你的接口需要 JWT 鉴权，必须加这一行
    .build();

  // 2. 创建文档
  const document = SwaggerModule.createDocument(app, config);

  // 3. 设置访问路径（例如：http://localhost:3000/api-docs）
  SwaggerModule.setup('api-docs', app, document);
  // 3. 启动 HTTP 监听
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3002);

  console.log(`HTTP 运行在: http://localhost:3002`);
  console.log(`微服务 EXAM 运行在端口: 8888`);
}

bootstrap();
