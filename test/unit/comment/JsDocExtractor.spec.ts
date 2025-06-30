// test/unit/comment/JsDocExtractor.spec.ts
import { JsDocExtractor } from "../../../src/comment/JsDocExtractor";

describe("JsDocExtractor", () => {
  const extractor = new JsDocExtractor();
  const block = `
  /**
   * Does something.
   * @param x value
   * @returns result
   * @throws Error if invalid
   */`;

  const [doc] = extractor.extract(block);

  it("collects @param tags", () => {
    expect(doc.params).toEqual(["x"]);
  });

  it("detects @returns", () => {
    expect(doc.hasReturns).toBe(true);
  });

  it("detects @throws", () => {
    expect(doc.hasThrows).toBe(true);
  });
});
