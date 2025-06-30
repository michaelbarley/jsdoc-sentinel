import { analyzer, load } from "./_shared";

describe("missingParam", () => {
  it.each(["js", "ts"])(
    "flags missingParams in %s",
    (lang) => {
      const diffs = analyzer.analyze(load(lang as "js" | "ts", "missingParam"));
      expect(diffs[0].missingParams).toContain("b");
    }
  );
});

