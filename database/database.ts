import * as SQLite from 'expo-sqlite';

export async function getDatabase() {
  const db = await SQLite.openDatabaseAsync('cumple.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS birthdays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      day INTEGER NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER
    );
  `);

  return db;
}