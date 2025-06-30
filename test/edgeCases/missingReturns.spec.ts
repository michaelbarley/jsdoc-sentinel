import { analyzer, load } from "./_shared";

describe("missingReturns", () => {
  it.each(["js", "ts"])("flags missingReturns in %s", (lang) => {
    const diffs = analyzer.analyze(load(lang as "js" | "ts", "missingReturns"));
    expect(diffs[0].missingReturns).toBe(true);
  });
});
