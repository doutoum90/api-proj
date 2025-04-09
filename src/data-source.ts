import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

const logger = new Logger('DataSource');

logger.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);

dotenv.config();


export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
  } : false,
  logging: true,
});