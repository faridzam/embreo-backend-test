import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import pool from '../config/database';
import { Account } from '../models/account';
import { AuthenticatedUser } from '../models/apiRequest';
import { Company } from '../models/company';
import { Role } from '../models/role';
import { User } from '../models/user';

export const loginUser = async (username: string, password: string): Promise<string | null> => {
  const resultAccount = await pool.query('SELECT * FROM accounts WHERE username = $1', [username]);
  const resultUser = await pool.query('SELECT * FROM users WHERE id = $1', [resultAccount.rows[0].user_id]);
  const resultCompany = await pool.query('SELECT * FROM companies WHERE id = $1', [resultUser.rows[0].company_id]);
  const resultRole = await pool.query('SELECT * FROM roles WHERE id = $1', [resultUser.rows[0].role_id]);

  if (
    resultAccount.rows.length === 0
    || resultUser.rows.length === 0
    || resultCompany.rows.length === 0
    || resultRole.rows.length === 0
  ) {
    return null;
  }

  const account = resultAccount.rows[0] as Account;
  const user = resultUser.rows[0] as User;
  const company = resultCompany.rows[0] as Company;
  const role = resultRole.rows[0] as Role;

  const passwordMatch = await bcrypt.compare(password, account.password);

  if (!passwordMatch) {
    return null;
  }

  const token = jwt.sign({ account, user, company, role } as AuthenticatedUser, config.secret, {
    expiresIn: '1h',
  });

  return token;
};