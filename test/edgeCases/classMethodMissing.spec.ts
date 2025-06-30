import { analyzer, load } from "./_shared";

describe("classMethodMissing", () => {
  it.each(["js", "ts"])("produces zero diffs in %s", (lang) => {
    const diffs = analyzer.analyze(
      load(lang as "js" | "ts", "classMethodMissing")
    );
    expect(diffs).toHaveLength(0);
  });
});
