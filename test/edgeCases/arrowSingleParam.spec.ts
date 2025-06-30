import { analyzer, load } from "./_shared";

describe("arrowSingleParam", () => {
  it("returns no diffs for single-param arrows without parentheses (JS only)", () => {
    const diffs = analyzer.analyze(load("js", "arrowSingleParam"));
    expect(diffs).toHaveLength(0);
  });
});
