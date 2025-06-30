import { analyzer, load } from "./_shared";

describe("extraThrows", () => {
  it.each(["js", "ts"])("flags extraThrows in %s", (lang) => {
    const diffs = analyzer.analyze(load(lang as "js" | "ts", "extraThrows"));
    expect(diffs[0].extraThrows).toBe(true);
  });
});
