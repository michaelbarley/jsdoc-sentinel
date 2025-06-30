import { analyzer, load } from "./_shared";

describe("restParam", () => {
  it.each(["js", "ts"])("handles …rest parameters in %s", (lang) => {
    const diffs = analyzer.analyze(load(lang as "js" | "ts", "restParam"));
    expect(diffs).toHaveLength(0); // no spurious “…nums”
  });
});
