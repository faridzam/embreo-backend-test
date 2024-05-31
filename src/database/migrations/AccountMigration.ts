import pool from "../../config/database";

export async function AccountMigration() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        username VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(72) NOT NULL,
        CONSTRAINT fk_account_user FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `)
    console.log('Account migration complete.');
  } catch (error) {
    console.error('Error running account migration:', error);
  }
}