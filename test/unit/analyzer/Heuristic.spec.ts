import { diffParams } from "../../../src/analyzer/Heuristic";

describe("diffParams full matrix", () => {
  it("no differences", () => {
    expect(diffParams(["a", "b"], ["a", "b"])).toEqual({
      missing: [],
      extra: [],
    });
  });
  it("detects missing only", () => {
    expect(diffParams(["a", "b"], ["a"])).toEqual({
      missing: ["b"],
      extra: [],
    });
  });
  it("detects extra only", () => {
    expect(diffParams(["a"], ["a", "b"])).toEqual({
      missing: [],
      extra: ["b"],
    });
  });
});
