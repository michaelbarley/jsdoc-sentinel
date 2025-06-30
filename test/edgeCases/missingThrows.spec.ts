import { analyzer, load } from "./_shared";

describe("missingThrows", () => {
  it.each(["js", "ts"])("flags missingThrows in %s", (lang) => {
    const diffs = analyzer.analyze(load(lang as "js" | "ts", "missingThrows"));
    expect(diffs[0].missingThrows).toBe(true);
  });
});
