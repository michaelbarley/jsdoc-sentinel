import { analyzer, load } from "./_shared";

describe("arrowMissingReturns", () => {
  it.each(["js", "ts"])("flags missingReturns in %s", (lang) => {
    const diffs = analyzer.analyze(
      load(lang as "js" | "ts", "arrowMissingReturns")
    );
    expect(diffs[0].missingReturns).toBe(true);
  });
});
