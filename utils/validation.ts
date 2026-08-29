export function validateName(name: string): string | null {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return "Ingresa el nombre de la persona.";
  }

  if (trimmedName.length < 2) {
    return "El nombre debe tener al menos 2 caracteres.";
  }

  if (trimmedName.length > 100) {
    return "El nombre no puede superar los 100 caracteres.";
  }

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/;

  if (!nameRegex.test(trimmedName)) {
    return "El nombre solo puede contener letras, espacios, guiones y apóstrofes.";
  }

  return null;
}

export function validateDay(day: string): string | null {
  if (!day.trim()) {
    return "Ingresa el día.";
  }

  if (!/^\d+$/.test(day)) {
    return "El día debe contener solamente números.";
  }

  const dayNumber = Number(day);

  if (dayNumber < 1 || dayNumber > 31) {
    return "El día debe estar entre 1 y 31.";
  }

  return null;
}

export function validateMonth(month: string): string | null {
  if (!month.trim()) {
    return "Ingresa el mes.";
  }

  if (!/^\d+$/.test(month)) {
    return "El mes debe contener solamente números.";
  }

  const monthNumber = Number(month);

  if (monthNumber < 1 || monthNumber > 12) {
    return "El mes debe estar entre 1 y 12.";
  }

  return null;
}

export function validateYear(year: string): string | null {
  if (!year.trim()) {
    return null;
  }

  if (!/^\d+$/.test(year)) {
    return "El año debe contener solamente números.";
  }

  if (year.length !== 4) {
    return "El año debe tener 4 dígitos.";
  }

  const yearNumber = Number(year);
  const currentYear = new Date().getFullYear();

  if (yearNumber < 1) {
    return "El año no es válido.";
  }

  if (yearNumber > currentYear) {
    return "El año no puede ser posterior al año actual.";
  }

  return null;
}

export function validateDate(
  day: string,
  month: string,
  year: string
): string | null {
  const dayNumber = Number(day);
  const monthNumber = Number(month);

  const yearNumber = year.trim()
    ? Number(year)
    : 2000;

  const date = new Date(yearNumber, monthNumber - 1, dayNumber);

  if (
    date.getFullYear() !== yearNumber ||
    date.getMonth() !== monthNumber - 1 ||
    date.getDate() !== dayNumber
  ) {
    return "La fecha ingresada no existe.";
  }

  return null;
}