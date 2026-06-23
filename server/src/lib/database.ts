import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({

type: 'postgres',
url: process.env.DATABASE_URL,
ssl: {rejectUnauthorized: false},
entities: ['src/entities/*.ts'],
migrations: ['src/migrations/*.ts'],
synchronize: false,

})