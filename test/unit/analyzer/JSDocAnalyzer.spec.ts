import { JSDocAnalyzer, DocDiff } from "../../../src/analyzer/JSDocAnalyzer";
import { CompositeParser } from "../../../src/parser/CompositeParser";
import { JsDocExtractor } from "../../../src/comment/JsDocExtractor";
import { IParser } from "../../../src/parser/IParser";
import { ICommentExtractor } from "../../../src/comment/ICommentExtractor";
import { FunctionSignature } from "../../../src/parser/Signature";

const analyzer = new JSDocAnalyzer(new CompositeParser(), new JsDocExtractor());

/** Convenience helper – runs the analyser and returns the diffs. */
const diffs = (src: string): DocDiff[] => analyzer.analyze(src);

describe("JSDocAnalyzer – classic functions", () => {
  it("reports a missing @returns when the implementation returns a value", () => {
    const src = `
    /** No return tag */
    function foo() { return 1; }`;
    const [d] = diffs(src);
    expect(d.missingReturns).toBe(true);
    expect(d.extraReturns).toBe(false);
  });

  it("reports an unnecessary @returns when the implementation is void", () => {
    const src = `
    /** @returns something */
    function bar(): void { }`;
    const [d] = diffs(src);
    expect(d.extraReturns).toBe(true);
    expect(d.missingReturns).toBe(false);
  });

  it("detects param mismatches", () => {
    const src = `
    /** @param a doc */
    function baz(a: number, b: number) {}`;
    const [d] = diffs(src);
    expect(d.missingParams).toEqual(["b"]);
    expect(d.extraParams).toEqual([]);
  });

  it("returns zero diffs when doc & impl match perfectly", () => {
    const src = `
    /**
     * @param x
     * @param y
     * @returns sum
     */
    function add(x: number, y: number) { return x + y; }`;
    expect(diffs(src)).toHaveLength(0);
  });
});

describe("JSDocAnalyzer - arrow functions", () => {
  it("flags missing @returns for expression-body arrow that returns a value", () => {
    const src = `
    /** @param x value */
    const arrow1 = (x: number) => x * 2;`;
    const [d] = diffs(src);
    expect(d.missingReturns).toBe(true);
    expect(d.extraReturns).toBe(false);
  });

  it("flags unnecessary @returns for block-body arrow that returns void", () => {
    const src = `
    /** @returns something */
    const arrow2 = () => { /* do nothing */ };`;
    const [d] = diffs(src);
    expect(d.extraReturns).toBe(true);
    expect(d.missingReturns).toBe(false);
  });

  it("detects @param diffing for arrows", () => {
    const src = `
    /** @param a only */
    const arrow3 = (a: string, b: string) => a + b;`;
    const [d] = diffs(src);
    expect(d.missingParams).toEqual(["b"]);
    expect(d.extraParams).toEqual([]);
  });

  it("flags extra @throws when an expression arrow cannot throw", () => {
    const src = `
    /** @throws always */
    const arrow4 = (n: number) => n + 1;`;
    const [d] = diffs(src);
    expect(d.extraThrows).toBe(true);
    expect(d.missingThrows).toBe(false);
  });

  it("returns zero diffs for a perfectly documented arrow", () => {
    const src = `
    /**
     * @param n value
     * @returns doubled
     */
    const arrow5 = (n: number) => n * 2;`;
    expect(diffs(src)).toHaveLength(0);
  });
});

class StubParser implements IParser {
  parse(): FunctionSignature[] {
    return [{ name: "ghost", params: [], returnsVoid: false }];
  }
}
class EmptyExtractor implements ICommentExtractor {
  extract() {
    return [];
  }
}

it("gracefully skips signatures whose declaration is missing", () => {
  const ghostAnalyzer = new JSDocAnalyzer(
    new StubParser(),
    new EmptyExtractor()
  );
  expect(ghostAnalyzer.analyze("// no real functions here")).toEqual([]);
});

it("reports missing @throws when implementation throws", () => {
  const src = `
    /** no throws documented */
    function danger() {
      if (true) {
        throw new Error("boom");
      }
    }`;
  const [d] = diffs(src);
  expect(d.missingThrows).toBe(true);
  expect(d.extraThrows).toBe(false);
});

it("ignores functions that have no JSDoc block at all", () => {
  const src = `
    // some ordinary comment
    function noDoc(a: number) { return a; }`;
  expect(diffs(src)).toEqual([]);
});

it("handles @param with {type}", () => {
  const src = `
    /**
     * @param {string} title
     * @param {string} author
     */
    function Book(title, author) {}
  `;
  expect(analyzer.analyze(src)).toHaveLength(0);
});

it("does not flag missing @returns for expression-body arrows that return undefined", () => {
  const src = `
    /** No returns tag */
    const foo = () => undefined;
  `;
  expect(diffs(src)).toHaveLength(0);
});
