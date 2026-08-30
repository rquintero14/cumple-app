import { getDatabase } from './database';

export type Birthday = {
  id: number;
  name: string;
  day: number;
  month: number;
  year?: number | null;
};

// CREAR
export async function addBirthday(
  name: string,
  day: number,
  month: number,
  year?: number | null
) {
  const db = await getDatabase();

  const result = await db.runAsync(
    `
    INSERT INTO birthdays (name, day, month, year)
    VALUES (?, ?, ?, ?)
    `,
    name,
    day,
    month,
    year ?? null
  );

  return result.lastInsertRowId;
}

// COMPROBAR NOMBRE DUPLICADO
export async function isNameAlreadyUsed(
  name: string,
  excludeId?: number
): Promise<boolean> {
  const db = await getDatabase();

  const normalizedName = name.trim().toLowerCase();

  let result;

  if (excludeId !== undefined) {
    result = await db.getFirstAsync<{ count: number }>(
      `
      SELECT COUNT(*) as count
      FROM birthdays
      WHERE LOWER(TRIM(name)) = ?
      AND id != ?
      `,
      normalizedName,
      excludeId
    );
  } else {
    result = await db.getFirstAsync<{ count: number }>(
      `
      SELECT COUNT(*) as count
      FROM birthdays
      WHERE LOWER(TRIM(name)) = ?
      `,
      normalizedName
    );
  }

  return (result?.count ?? 0) > 0;
}

// LEER
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

// EDITAR
export async function updateBirthday(
  id: number,
  name: string,
  day: number,
  month: number,
  year?: number | null
) {
  const db = await getDatabase();

  await db.runAsync(
    `
    UPDATE birthdays
    SET name = ?, day = ?, month = ?, year = ?
    WHERE id = ?
    `,
    name,
    day,
    month,
    year ?? null,
    id
  );
}

// ELIMINAR
export async function deleteBirthday(id: number) {
  const db = await getDatabase();

  await db.runAsync(
    `
    DELETE FROM birthdays
    WHERE id = ?
    `,
    id
  );
}