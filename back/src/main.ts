import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

<<<<<<< HEAD
  const config = new DocumentBuilder()
    .setTitle('Ft_transendence')
    .setDescription('42 project API')
    .setVersion('1.0')
    .build();
=======
	const config = new DocumentBuilder()
		.setTitle('Ft_transcendence')
		.setDescription('42 project API')
		.setVersion('1.0')
		.build();
>>>>>>> lrandria

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe()).enableCors({
    origin: process.env.CORS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.BACK_PORT);
}
bootstrap();
