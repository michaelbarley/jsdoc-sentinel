import { TypeScriptParser } from "../../../src/parser/TypeScriptParser";

describe("TypeScriptParser", () => {
  it("extracts function name and params", () => {
    const src = "export function foo(a: string, b?: number): void {}";
    const sigs = new TypeScriptParser().parse(src);
    expect(sigs[0]).toMatchObject({
      name: "foo",
      params: [
        { name: "a", optional: false },
        { name: "b", optional: true },
      ],
      returnsVoid: true,
    });
  });
});
