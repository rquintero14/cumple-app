export function calculateAge(
  day: number,
  month: number,
  year: number
): number {
  const today = new Date();

  let age = today.getFullYear() - year;

  const birthdayThisYear = new Date(
    today.getFullYear(),
    month - 1,
    day
  );

  if (today < birthdayThisYear) {
    age--;
  }

  return age;
}