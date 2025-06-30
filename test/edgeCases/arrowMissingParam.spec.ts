import { analyzer, load } from "./_shared";

describe("arrowMissingParam", () => {
  it.each(["js", "ts"])("flags missingParams in %s", (lang) => {
    const diffs = analyzer.analyze(
      load(lang as "js" | "ts", "arrowMissingParam")
    );
    expect(diffs[0].missingParams).toContain("b");
  });
});
