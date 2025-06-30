
/**
 * Sums numbers.
 * @param {...number} nums numbers
 * @returns {number}
 */
export function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

