/**
 * Wrapper without throws tag.
 */
export function wrapper() {
  function inner() {
    throw new Error("boom");
  }
  return inner(); // outer may throw, but JSDoc says nothing
}
