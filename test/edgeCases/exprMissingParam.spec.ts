import { analyzer, load } from "./_shared";

describe("exprMissingParam", () => {
  it.each(["js", "ts"])("flags missingParams in %s", (lang) => {
    const diffs = analyzer.analyze(load(lang as "js" | "ts", "exprMissingParam"));
    expect(diffs[0].missingParams).toContain("b");
  });
});

