import pool from "../../config/database";

export default async function AccountSeeder() {
  try {
    await pool.query(`
      INSERT INTO accounts (user_id, username, password)
      VALUES
        (1, 'company1', '$2a$12$GFPgdEHguO7NEn/YzCb1C.f7Uml4zA51xuiUA/IC/b7oKlIjuCt9e'),
        (2, 'company2', '$2a$12$GFPgdEHguO7NEn/YzCb1C.f7Uml4zA51xuiUA/IC/b7oKlIjuCt9e'),
        (3, 'company3', '$2a$12$GFPgdEHguO7NEn/YzCb1C.f7Uml4zA51xuiUA/IC/b7oKlIjuCt9e'),
        (4, 'company4', '$2a$12$GFPgdEHguO7NEn/YzCb1C.f7Uml4zA51xuiUA/IC/b7oKlIjuCt9e'),
        (5, 'company5', '$2a$12$GFPgdEHguO7NEn/YzCb1C.f7Uml4zA51xuiUA/IC/b7oKlIjuCt9e'),
        (6, 'company6', '$2a$12$GFPgdEHguO7NEn/YzCb1C.f7Uml4zA51xuiUA/IC/b7oKlIjuCt9e')
      ON CONFLICT DO NOTHING;
    `);
    console.log('Account seeding complete.');
  } catch (error) {
    console.error('Error running account seeds:', error);
  }
}