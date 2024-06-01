import pool from "../../config/database";

export async function EventVendorMigration() {
  try {
    await pool.query(`
      DROP TYPE IF EXISTS status_type;
      CREATE TYPE status_type AS ENUM ('pending', 'approved', 'rejected');
      CREATE TABLE IF NOT EXISTS event_vendors (
        id SERIAL PRIMARY KEY,
        event_id INT REFERENCES events(id),
        user_id INT REFERENCES users(id),
        status status_type NOT NULL,
        remarks VARCHAR(255),
        updated_at DATE,
        CONSTRAINT fk_eventVendor_event FOREIGN KEY (event_id) REFERENCES events(id),
        CONSTRAINT fk_eventVendor_vendor FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT unique_event_user_combination UNIQUE (event_id, user_id)
      );
    `)
    console.log('event_vendor migration complete.');
  } catch (error) {
    console.error('Error running event_vendor migration:', error);
  }
}