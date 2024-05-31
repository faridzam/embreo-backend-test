import pool from "../../config/database";

export default async function RoleSeeder() {
  try {
    await pool.query(`
      INSERT INTO roles (name)
      VALUES
        ('Human Resource'),
        ('Vendor')
      ON CONFLICT DO NOTHING;
    `);
    console.log('Role seeding complete.');
  } catch (error) {
    console.error('Error running role seeds:', error);
  }
}