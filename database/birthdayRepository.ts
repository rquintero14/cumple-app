import { getDatabase } from './database';

export type Birthday = {
  id: number;
  name: string;
  day: number;
  month: number;
  year?: number | null;
};

export async function addBirthday(
  name: string,
  day: number,
  month: number,
  year?: number | null
) {
  const db = await getDatabase();

  await db.runAsync(
    `
    INSERT INTO birthdays (name, day, month, year)
    VALUES (?, ?, ?, ?)
    `,
    name,
    day,
    month,
    year ?? null
  );
}

export async function getBirthdays(): Promise<Birthday[]> {
  const db = await getDatabase();

  const birthdays = await db.getAllAsync<Birthday>(
    `
    SELECT *
    FROM birthdays
    ORDER BY month ASC, day ASC, name ASC
    `
  );

  return birthdays;
}