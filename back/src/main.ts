import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('POKÉ-PONG')
    .setDescription('Documentation API for Transcendence 42 project')
	.addBearerAuth()
    .setVersion('ALPHA')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe()).enableCors({
	origin: (origin, callback) => {
		const allowedOrigins = [
		  process.env.SWAGGER,
		  process.env.CORS,
		];
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) === -1) {
		  return callback(new Error(`La politique CORS pour cette origine ne permet pas l'accès depuis l'origine spécifiée.`), false);
		}
		return callback(null, true);
	  },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.BACK_PORT);
}
bootstrap();
