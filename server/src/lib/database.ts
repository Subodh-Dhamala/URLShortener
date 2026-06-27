import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [__dirname + `/../entities/*.${isProd ? 'js' : 'ts'}`],
  migrations: [__dirname + `/../migrations/*.${isProd ? 'js' : 'ts'}`],
  synchronize: false,
});