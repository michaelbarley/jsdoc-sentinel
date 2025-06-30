import { analyzer, load } from "./_shared";

describe("nestedThrowMissing (TS only)", () => {
  it("flags missing @throws when inner function throws", () => {
    const diffs = analyzer.analyze(load("ts", "nestedThrowMissing"));
    expect(diffs[0].missingThrows).toBe(true);
  });
});
