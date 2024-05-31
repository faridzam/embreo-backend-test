import pool from "../../config/database";

export default async function CompanySeeder() {
  try {
    await pool.query(`
      INSERT INTO companies (name)
      VALUES
        ('Human Resource Company 1'),
        ('Human Resource Company 2'),
        ('Human Resource Company 3'),
        ('Vendor Company 1'),
        ('Vendor Company 2'),
        ('Vendor Company 3')
      ON CONFLICT DO NOTHING;
    `);
    console.log('Company seeding complete.');
  } catch (error) {
    console.error('Error running company seeds:', error);
  }
}