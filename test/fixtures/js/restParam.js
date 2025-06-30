/**
 * Sums numbers.
 * @param {...number} nums numbers
 * @returns {number} sum
 */
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
