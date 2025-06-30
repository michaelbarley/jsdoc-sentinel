import { analyzer, load } from "./_shared";

describe("extraReturns", () => {
  it.each(["js", "ts"])("flags extraReturns in %s", (lang) => {
    const diffs = analyzer.analyze(load(lang as "js" | "ts", "extraReturns"));
    expect(diffs[0].extraReturns).toBe(true);
  });
});
