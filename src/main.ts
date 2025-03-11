import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'; // Importer dotenv

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Ajout de CORS
  const cors = require('cors');
  app.use(cors());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
