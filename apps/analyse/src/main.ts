import { NestFactory } from '@nestjs/core';
import { AnalyseModule } from './analyse.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from '@app/interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AnalyseModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('考试系统 - analyse')
    .setDescription('analyse接口')
    .setVersion('1.0')
    .addBearerAuth() // 如果你的接口需要 JWT 鉴权，必须加这一行
    .build();

  // 2. 创建文档
  const document = SwaggerModule.createDocument(app, config);

  // 3. 设置访问路径（例如：http://localhost:3000/api-docs）
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3004);
  console.log(`HTTP 运行在: http://localhost:3004`);
  console.log('这里是analyse');
}

bootstrap();
