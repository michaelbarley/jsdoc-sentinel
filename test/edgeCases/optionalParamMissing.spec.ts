import { analyzer, load } from "./_shared";

describe("optionalParamMissing (TS only)", () => {
  it("flags missing optional param", () => {
    const diffs = analyzer.analyze(load("ts", "optionalParamMissing"));
    expect(diffs[0].missingParams).toContain("b");
  });
});
