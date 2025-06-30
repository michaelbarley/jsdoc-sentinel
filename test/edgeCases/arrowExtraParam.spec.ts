import { analyzer, load } from "./_shared";

describe("arrowExtraParam", () => {
  it.each(["js", "ts"])("flags extraParams in %s", (lang) => {
    const diffs = analyzer.analyze(
      load(lang as "js" | "ts", "arrowExtraParam")
    );
    expect(diffs[0].extraParams).toContain("b");
  });
});
