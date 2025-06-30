/**
 * Parses JSON text.
 * (Missing throws tag on purpose)
 */
export const safeParse = (txt: string) => {
  if (!txt.trim()) {
    throw new Error("Empty input"); // can throw
  }
  return JSON.parse(txt);
};
