import pool from "../../config/database";

export default async function UserSeeder() {
  try {
    await pool.query(`
      INSERT INTO users (role_id, company_id, name)
      VALUES
        (1, 1, 'Human Resource 1'),
        (1, 2, 'Human Resource 2'),
        (1, 3, 'Human Resource 3'),
        (2, 4, 'Vendor 1'),
        (2, 5, 'Vendor 2'),
        (2, 6, 'Vendor 3')
      ON CONFLICT DO NOTHING;
    `);
    console.log('User seeding complete.');
  } catch (error) {
    console.error('Error running user seeds:', error);
  }
}