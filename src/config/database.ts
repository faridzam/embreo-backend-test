import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({path: `.env.${process.env.NODE_ENV}`});


const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

export default pool;
