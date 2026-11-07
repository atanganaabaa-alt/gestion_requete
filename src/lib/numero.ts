export function formatNumero(year: number, existingCount: number): string {
  return `REQ-${year}-${String(existingCount + 1).padStart(5, "0")}`;
}
