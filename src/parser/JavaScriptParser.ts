import { injectable } from "inversify";
import { FunctionSignature, ParamInfo } from "./Signature";
import { IParser } from "./IParser";

@injectable()
export class JavaScriptParser implements IParser {
  private static FN_DECL_RE = /function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)/g;

  private static FN_EXPR_RE =
    /(const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*function\s*\(([^)]*)/g;

  private static ARROW_RE =
    /(const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*\(([^)]*)\)\s*(?::\s*[^=><]+?)?\s*=>/g;

  parse(source: string): FunctionSignature[] {
    const sigs: FunctionSignature[] = [];

    const capture = (re: RegExp, nameIdx: number, paramsIdx: number) => {
      for (const m of source.matchAll(re)) {
        const name = m[nameIdx];
        const params = this.splitParams(m[paramsIdx]);
        sigs.push({ name, params, returnsVoid: false });
      }
    };

    capture(JavaScriptParser.FN_DECL_RE, 1, 2);
    capture(JavaScriptParser.FN_EXPR_RE, 2, 3);
    capture(JavaScriptParser.ARROW_RE, 2, 3);

    return sigs;
  }

  private splitParams(list: string): ParamInfo[] {
    if (!list.trim()) return [];

    const topLevelParts: string[] = [];
    let current = "";
    let depth = 0;

    for (const ch of list) {
      if (ch === "," && depth === 0) {
        topLevelParts.push(current.trim());
        current = "";
        continue;
      }
      if (ch === "{" || ch === "[" || ch === "(") depth++;
      if (ch === "}" || ch === "]" || ch === ")") depth--;
      current += ch;
    }
    if (current.trim()) topLevelParts.push(current.trim());

    const params: ParamInfo[] = [];

    for (let part of topLevelParts) {
      if (!part) continue;

      part = part
        .replace(/=[^,]+$/, "")
        .replace(/:.+$/, "")
        .replace(/^\.\.\./, "")
        .trim();

      if (!/^[\[{]/.test(part)) {
        params.push({ name: part, optional: false });
        continue;
      }

      for (const m of part.matchAll(/([A-Za-z_$][\w$]*)/g)) {
        params.push({ name: m[1], optional: false });
      }
    }

    return params;
  }
}
