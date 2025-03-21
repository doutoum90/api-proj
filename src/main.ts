import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors = require('cors');

  app.enableCors({
    origin: 'http://localhost:5173',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });
  app.use(cors());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();