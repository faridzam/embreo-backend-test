import pool from "../config/database";
import { Company } from "../models/company";

export const getAllVendorService = async (): Promise<Company[]> => {
  const resultUser = await pool.query(
    'SELECT company_id FROM users WHERE role_id = $1',
    [2]
  );
  const result = await pool.query(
    'SELECT * FROM companies WHERE id = ANY ($1)',
    [resultUser.rows.map((user) => user.company_id)]
  );
  return result.rows as Company[];
};