// Utilidades para formateo y validación de datos

/**
 * Formatea un número de celular colombiano a "XXX XXXXXXX"
 * Ej: "3216549870" -> "321 6549870"
 */
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('3')) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  }
  // Si no es válido, devolvemos los dígitos sin formato (o el valor original)
  return digits || value;
}

/**
 * Valida que el número de celular tenga 10 dígitos y comience con 3.
 * Acepta con o sin espacios: "3216549870" o "321 6549870"
 */
export function isValidPhoneNumber(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 && digits.startsWith('3');
}

/**
 * Valida que un número de documento contenga solo dígitos y tenga una longitud entre 1 y 15.
 */
export function isValidDocumentNumber(value: string): boolean {
  return /^\d{1,15}$/.test(value);
}