import pool from "../../config/database";

export async function RoleMigration() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
    `)
    console.log('Role migration complete.');
  } catch (error) {
    console.error('Error running role migration:', error);
  }
}