import { analyzer, load } from "./_shared";

describe("destructuredParamMissing", () => {
  it.each(["js", "ts"])("flags missing 'name' in %s", (lang) => {
    const [d] = analyzer.analyze(
      load(lang as "js" | "ts", "destructuredParamMissing")
    );
    expect(d.missingParams).toContain("name");
    expect(d.extraParams).toHaveLength(0);
  });
});
