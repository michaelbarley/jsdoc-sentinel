import { CompositeParser } from "../../../src/parser/CompositeParser";
import { container } from "../../../src/container/inversify.config";

describe("CompositeParser", () => {
  const parser = container.get<CompositeParser>("IParser");

  it("combines TS & JS signatures", () => {
    const src = `
      export function foo(a: string) {}
      const bar = (x, y) => x + y;
    `;
    const sigs = parser
      .parse(src)
      .map((s) => s.name)
      .sort();
    expect(sigs).toEqual(["bar", "foo"]);
  });
  it("deduplicates functions with the same name", () => {
    const src = `
    function dup() {}
    const dup = (x: number) => x;
  `;
    const names = parser.parse(src).filter((s) => s.name === "dup");
    expect(names).toHaveLength(1);
  });
});
