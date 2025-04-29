import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

const logger = new Logger('DataSource');

logger.log(`DATABASE_URL: ${process.env.DATABASE_URL || 'non défini'}`);
logger.log(`NODE_ENV: ${process.env.NODE_ENV || 'non défini'}`);

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: process.env.NODE_ENV === 'production' ? ['dist/**/*.entity.js'] : ['src/**/*.entity.ts'],
  migrations: process.env.NODE_ENV === 'production' ? ['dist/migrations/*.js'] : ['src/migrations/*.ts'],
  synchronize: false,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  logging: true,
});