import { analyzer, load } from "./_shared";

describe("arrowExtraThrows", () => {
  it.each(["js", "ts"])("flags extraThrows in %s", (lang) => {
    const diffs = analyzer.analyze(
      load(lang as "js" | "ts", "arrowExtraThrows")
    );
    expect(diffs[0].extraThrows).toBe(true);
  });
});
