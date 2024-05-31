import pool from "../../config/database";

export async function EventVendorMigration() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_vendors (
        id SERIAL PRIMARY KEY,
        event_id INT REFERENCES events(id),
        user_id INT REFERENCES users(id),
        CONSTRAINT fk_eventVendor_event FOREIGN KEY (event_id) REFERENCES events(id),
        CONSTRAINT fk_eventVendor_vendor FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `)
    console.log('event_vendor migration complete.');
  } catch (error) {
    console.error('Error running event_vendor migration:', error);
  }
}