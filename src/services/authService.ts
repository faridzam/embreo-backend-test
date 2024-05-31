import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import pool from '../config/database';
import { Account } from '../models/account';

export const loginUser = async (username: string, password: string): Promise<string | null> => {
  const result = await pool.query('SELECT * FROM accounts WHERE username = $1', [username]);

  if (result.rows.length === 0) {
    return null;
  }

  const account = result.rows[0] as Account;

  const passwordMatch = await bcrypt.compare(password, account.password);

  if (!passwordMatch) {
    return null;
  }

  const token = jwt.sign({ id: account.id, username: account.username }, config.secret, {
    expiresIn: '1h',
  });

  return token;
};