import { injectable, inject } from "inversify";
import { IParser } from "./IParser";
import { TypeScriptParser } from "./TypeScriptParser";
import { JavaScriptParser } from "./JavaScriptParser";
import { FunctionSignature } from "./Signature";

@injectable()
export class CompositeParser implements IParser {
  constructor(
    @inject(TypeScriptParser)
    private readonly tsParser: TypeScriptParser = new TypeScriptParser(),
    @inject(JavaScriptParser)
    private readonly jsParser: JavaScriptParser = new JavaScriptParser()
  ) {}

  parse(source: string): FunctionSignature[] {
    const all = [
      ...this.tsParser.parse(source),
      ...this.jsParser.parse(source),
    ];
    const seen = new Set<string>();
    return all.filter((sig) => {
      if (seen.has(sig.name)) return false;
      seen.add(sig.name);
      return true;
    });
  }
}
