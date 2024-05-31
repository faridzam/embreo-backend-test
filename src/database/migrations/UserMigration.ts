import pool from "../../config/database";

export async function UserMigration() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        role_id INT REFERENCES roles(id),
        company_id INT REFERENCES companies(id),
        name VARCHAR(100) NOT NULL,
        CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id),
        CONSTRAINT fk_user_company FOREIGN KEY (company_id) REFERENCES companies(id),
        CONSTRAINT unique_role_company_combination UNIQUE (role_id, company_id)
      );
    `)
    console.log('User migration complete.');
  } catch (error) {
    console.error('Error running user migration:', error);
  }
}