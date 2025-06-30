/**
 * Parses JSON.
 * @param txt raw json
 *          ── NO throws tag on purpose ──
 */
export function parseJson(txt: string): unknown {
  // Explicit throw so the analyser can spot that “something CAN throw”
  if (!txt.trim()) {
    throw new Error("Empty input");
  }

  return JSON.parse(txt);
}
