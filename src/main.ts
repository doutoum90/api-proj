import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe, Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');

dotenv.config();

async function bootstrap() {
  logger.log('Démarrage de l’application...');
  logger.log(`NODE_ENV: ${process.env.NODE_ENV || 'non défini'}`);
  logger.log(`DATABASE_URL: ${process.env.DATABASE_URL || 'non défini'}`);

  try {
    logger.log('Création de l’instance NestJS...');// dernier affiché, les logs suivants ne sont pas affichés
    const app = await NestFactory.create(AppModule);
    logger.log('Instance NestJS créée avec succès');

    app.enableCors({
      origin: process.env.NODE_ENV === 'production' ? 'https://front-r396.onrender.com' : 'http://localhost:5173',
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    });
    logger.log('CORS configuré');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    logger.log('Pipes globaux configurés');

    const port = process.env.PORT || 3000;
    logger.log(`Tentative de liaison au port ${port}...`);
    await app.listen(port);
    logger.log(`Application démarrée sur le port ${port}`);
  } catch (error: any) {
    console.error('Erreur brute:', error); // Log brut pour Render
    logger.error('Erreur lors du démarrage', error.stack || error.message || error);
    throw error;
  }
}

bootstrap().catch((error) => {
  console.error('Erreur critique:', error);
  logger.error('Erreur critique dans bootstrap', error.stack || error.message || error);
});