/**
 * Parses JSON.
 * @param {string} txt raw json
 *          ── NO throws tag on purpose ──
 */
function parseJson(txt) {
  // Explicit throw so the analyser can spot that “something CAN throw”
  if (typeof txt !== "string") {
    throw new Error("Input must be a string");
  }

  return JSON.parse(txt);
}
