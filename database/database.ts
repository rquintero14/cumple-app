import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabaseAsync('cumple.db');

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