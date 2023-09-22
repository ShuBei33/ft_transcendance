import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS,
    methods: 'GET,POST',
    credentials: true,
  });
  await app.listen(process.env.FILESERVICE_PORT || 5170);
}
bootstrap();
