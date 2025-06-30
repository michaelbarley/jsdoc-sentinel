import { CommentSyncService } from "../../../src/comment/CommentSyncService";
import { CompositeParser } from "../../../src/parser/CompositeParser";
import { JsDocExtractor } from "../../../src/comment/JsDocExtractor";

describe("CommentSyncService", () => {
  const service = new CommentSyncService(
    new CompositeParser(),
    new JsDocExtractor()
  );

  it("finds parameters present in code but missing in JSDoc", () => {
    const src = `
    /**
     * @param a description
     */
    function foo(a: string, b: number) {}
    `;
    expect(service.findMissingParams(src)).toEqual([
      { fn: "foo", missing: ["b"] },
    ]);
  });
  it("returns empty when docs are complete", () => {
    const src = `
  /**
   * @param x ok
   */
  function bar(x: number) {}
  `;
    expect(service.findMissingParams(src)).toEqual([]);
  });
  it("handles a mix of documented and undocumented functions", () => {
    const src = `
  /** @param a ok */
  function good(a: number) {}

  // no JSDoc at all - should be flagged
  function bad(a: string, b: string) {}

  /** @param x documented */
  function done(x: string) {}
  `;
    const result = service.findMissingParams(src);

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        { fn: "bad", missing: ["a", "b"] },
        { fn: "done", missing: ["x"] },
      ])
    );
  });
});
