import { analyzer, load } from "./_shared";

describe("objectReturnMissingReturns", () => {
  it.each(["js", "ts"])("flags missingReturns in %s", (lang) => {
    const [d] = analyzer.analyze(
      load(lang as "js" | "ts", "objectReturnMissingReturns")
    );
    expect(d.missingReturns).toBe(true);
    expect(d.extraReturns).toBe(false);
  });
});
