import { analyzer, load } from "./_shared";

describe("extraParam", () => {
  it.each(["js", "ts"])("flags extraParams in %s", (lang) => {
    const diffs = analyzer.analyze(load(lang as "js" | "ts", "extraParam"));
    expect(diffs[0].extraParams).toContain("c");
  });
});
