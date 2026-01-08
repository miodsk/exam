import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from '@app/interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('考试系统 - 用户服务')
    .setDescription('用户管理')
    .setVersion('1.0')
    .addBearerAuth() // 如果你的接口需要 JWT 鉴权，必须加这一行
    .build();

  // 2. 创建文档
  const document = SwaggerModule.createDocument(app, config);

  // 3. 设置访问路径（例如：http://localhost:3000/api-docs）
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.port ?? 3001);
  console.log(`HTTP 运行在: http://localhost:${process.env.port ?? 3001}`);
  console.log('这里是user');
}

bootstrap();
