import pool from "../../config/database";

export async function CompanyMigration() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
    `)
    console.log('Company migration complete.');
  } catch (error) {
    console.error('Error running company migration:', error);
  }
}