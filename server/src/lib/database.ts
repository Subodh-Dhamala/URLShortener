import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  
  /*  render*/

  entities: [__dirname + '/../entities/*.js'],
   migrations: [__dirname + '/../migrations/*.js'], 
   
   
/*dev */
  // entities: [__dirname + '/../entities/*.ts'],
  // migrations: [__dirname + '/../migrations/*.ts'],


  synchronize: false,
});