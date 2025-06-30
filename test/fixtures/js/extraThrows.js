/**
 * Gets absolute value.
 * @param n number
 * @throws {Error} obsolete
 * @returns {number}
 */
function abs(n) {
  return n < 0 ? -n : n; // cannot throw
}
