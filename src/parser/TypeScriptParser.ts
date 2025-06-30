import ts from "typescript";
import { injectable } from "inversify";
import { FunctionSignature } from "./Signature";

export interface IParser {
  parse(source: string): FunctionSignature[];
}

@injectable()
export class TypeScriptParser implements IParser {
  parse(source: string): FunctionSignature[] {
    const sf = ts.createSourceFile(
      "tmp.ts",
      source,
      ts.ScriptTarget.Latest,
      true
    );
    const sigs: FunctionSignature[] = [];

    const visit = (node: ts.Node): void => {
      if (ts.isFunctionLike(node) && node.name) {
        sigs.push({
          name: node.name.getText(sf),
          params: node.parameters.map((p) => ({
            name: p.name.getText(sf),
            optional: !!p.questionToken,
          })),
          returnsVoid: node.type?.getText(sf) === "void",
        });
      }
      ts.forEachChild(node, visit);
    };

    visit(sf);
    return sigs;
  }
}
