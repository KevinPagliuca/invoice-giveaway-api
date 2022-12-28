export function generateRandomId(length?: number) {
  const skip = 2;
  const take = skip + length || 8;

  return Math.random().toString(36).substring(skip, take).toUpperCase();
}
