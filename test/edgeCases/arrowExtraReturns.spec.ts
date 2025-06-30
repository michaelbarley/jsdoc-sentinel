import { analyzer, load } from "./_shared";

describe("arrowExtraReturns", () => {
  it.each(["js", "ts"])(
    "flags extraReturns in %s",
    (lang) => {
      const diffs = analyzer.analyze(load(lang as "js" | "ts", "arrowExtraReturns"));
      expect(diffs[0].extraReturns).toBe(true);
    }
  );
});

