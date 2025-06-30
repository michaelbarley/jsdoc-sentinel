import { analyzer, load } from "./_shared";

describe("defaultParamMissing", () => {
  it.each(["js", "ts"])("flags missingParams in %s", (lang) => {
    const diffs = analyzer.analyze(
      load(lang as "js" | "ts", "defaultParamMissing")
    );
    expect(diffs[0].missingParams).toContain("exc");
  });
});
