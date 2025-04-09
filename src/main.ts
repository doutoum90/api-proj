import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');

dotenv.config();
async function bootstrap() {
  logger.log('Démarrage de l’application...');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT || 3000;
  logger.log(`Tentative de liaison au port ${port}...`);
  await app.listen(port);
  logger.log(`Application démarrée sur le port ${port}`);
}
bootstrap().catch((error) => {
  logger.error('Erreur lors du démarrage', error);
});