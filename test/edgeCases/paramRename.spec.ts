import { analyzer, load } from "./_shared";

describe("paramRename", () => {
  it.each(["js", "ts"])("flags missing *and* extra params in %s", (lang) => {
    const diffs = analyzer.analyze(load(lang as "js" | "ts", "paramRename"));
    expect(diffs[0].missingParams).toContain("newName");
    expect(diffs[0].extraParams).toContain("oldName");
  });
});
