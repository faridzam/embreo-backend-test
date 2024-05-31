import pool from "../../config/database";

export async function EventDateMigration() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_dates (
        id SERIAL PRIMARY KEY,
        event_id INT REFERENCES events(id),
        date DATE NOT NULL,
        CONSTRAINT fk_eventDate_event FOREIGN KEY (event_id) REFERENCES events(id)
      );
    `)
    console.log('event_date migration complete.');
  } catch (error) {
    console.error('Error running event_date migration:', error);
  }
}