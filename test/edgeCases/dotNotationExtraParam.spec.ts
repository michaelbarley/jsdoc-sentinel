import { analyzer, load } from "./_shared";

describe("dotNotationExtraParam", () => {
  it.each(["js", "ts"])("flags extra 'user.name' in %s", (lang) => {
    const [d] = analyzer.analyze(
      load(lang as "js" | "ts", "dotNotationExtraParam")
    );
    expect(d.extraParams).toContain("user.name");
    expect(d.missingParams).toHaveLength(0);
  });
});
