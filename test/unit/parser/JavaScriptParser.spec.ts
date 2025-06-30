import { JavaScriptParser } from "../../../src/parser/JavaScriptParser";

describe("JavaScriptParser", () => {
  const parser = new JavaScriptParser();

  it("parses function declarations", () => {
    const src = "function sum(a, b) { return a + b }";
    const [sig] = parser.parse(src);
    expect(sig).toMatchObject({
      name: "sum",
      params: [
        { name: "a", optional: false },
        { name: "b", optional: false },
      ],
    });
  });

  it("parses function expressions", () => {
    const src = "const diff = function (a, b) { return a - b }";
    const [sig] = parser.parse(src);
    expect(sig.name).toBe("diff");
  });

  it("parses arrow functions", () => {
    const src = "const mul = (a, b) => a * b";
    const [sig] = parser.parse(src);
    expect(sig.params.length).toBe(2);
    expect(sig.name).toBe("mul");
  });

  it("skips empty parameter entries in declarations", () => {
    const src = "function foo(a, , b) {}";
    const [sig] = parser.parse(src);
    expect(sig.params.map(p => p.name)).toEqual(["a", "b"]);
  });

  it("skips empty parameter entries in arrow functions", () => {
    const src = "const foo = (a, , b) => a + b";
    const [sig] = parser.parse(src);
    expect(sig.params.map(p => p.name)).toEqual(["a", "b"]);
  });
});
