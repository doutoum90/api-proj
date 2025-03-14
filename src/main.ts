import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.use(bodyParser.raw({ type: 'application/json' }));
  // Ajout de CORS
  const cors = require('cors');
  app.use(cors());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();