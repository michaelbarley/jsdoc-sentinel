/**
 * Gets absolute value.
 * @param n number
 * @throws obsolete
 * @returns absolute
 */
export function abs(n: number): number {
  return n < 0 ? -n : n; // cannot throw
}
