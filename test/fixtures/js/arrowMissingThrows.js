/**
 * Parses JSON text.
 * (Missing throws tag on purpose)
 */
const safeParse = (txt) => {
  if (typeof txt !== "string") {
    throw new Error("Input must be a string"); // ← can throw
  }
  return JSON.parse(txt);
};
