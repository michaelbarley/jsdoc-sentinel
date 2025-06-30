import { analyzer, load } from "./_shared";

describe("asyncReturnMissing (TS only)", () => {
  it("flags missing @returns for async value return", () => {
    const diffs = analyzer.analyze(load("ts", "asyncReturnMissing"));
    expect(diffs[0].missingReturns).toBe(true);
  });
});
