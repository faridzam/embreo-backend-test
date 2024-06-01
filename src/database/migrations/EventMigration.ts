import pool from "../../config/database";

export async function EventMigration() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_event_user FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `)
    console.log('Event migration complete.');
  } catch (error) {
    console.error('Error running event migration:', error);
  }
}