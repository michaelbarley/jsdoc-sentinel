import { analyzer, load } from "./_shared";

describe("singleLineExtraReturns", () => {
  it.each(["js", "ts"])("flags extraReturns in %s", (lang) => {
    const [d] = analyzer.analyze(
      load(lang as "js" | "ts", "singleLineExtraReturns")
    );
    expect(d.extraReturns).toBe(true);
    expect(d.missingReturns).toBe(false);
  });
});
