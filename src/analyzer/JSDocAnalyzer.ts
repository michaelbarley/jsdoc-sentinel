import { injectable, inject } from "inversify";
import { IParser } from "../parser/IParser";
import { ICommentExtractor, JsDocBlock } from "../comment/ICommentExtractor";
import { diffParams } from "./Heuristic";

export interface DocDiff {
  name: string;
  line: number;
  missingParams: string[];
  extraParams: string[];
  missingReturns: boolean;
  extraReturns: boolean;
  missingThrows: boolean;
  extraThrows: boolean;
}

const PARAM_RE = /@param\s+(?:\{[^}]+\}\s*)?([\w$.]+)/g;

@injectable()
export class JSDocAnalyzer {
  constructor(
    @inject("IParser") private readonly parser: IParser,
    @inject("ICommentExtractor") private readonly extractor: ICommentExtractor
  ) {}

  analyze(source: string): DocDiff[] {
    const sigs = this.parser.parse(source);
    const lines = source.split(/\r?\n/);

    const docMatches: { block: JsDocBlock; endLine: number }[] = [];
    const jsdocRe = /\/\*\*[\s\S]*?\*\//g;

    for (const m of source.matchAll(jsdocRe)) {
      const text = m[0];

      const params = Array.from(text.matchAll(PARAM_RE), (p) => p[1]);
      const hasReturns = /@returns?\b/.test(text);
      const hasThrows = /@throws?\b/.test(text);

      const endIdx = m.index! + text.length;
      const endLine = source.slice(0, endIdx).split(/\r?\n/).length - 1;

      docMatches.push({
        block: { text, params, hasReturns, hasThrows },
        endLine,
      });
    }

    const diffs: DocDiff[] = [];
    let searchStart = 0;

    for (const sig of sigs) {
      const declRegex = new RegExp(
        `(?:function\\s+${sig.name}\\b|(?:const|let|var)\\s+${sig.name}\\b[^=]*=)`,
        ""
      );
      const declLine = lines.findIndex(
        (ln, i) => i >= searchStart && declRegex.test(ln)
      );
      if (declLine < 0) continue;

      const docMeta = docMatches.find((d) => d.endLine === declLine - 1);
      if (!docMeta) {
        searchStart = declLine;
        continue;
      }
      const doc = docMeta.block;

      const { missing, extra } = diffParams(
        sig.params.map((p) => p.name),
        doc.params
      );

      const { returnsValue } = this.scanBodyForReturns(lines, declLine);
      const missingReturns = returnsValue && !doc.hasReturns;
      const extraReturns = !returnsValue && doc.hasReturns;

      const { throws: actualThrows } = this.scanBodyForThrows(lines, declLine);
      const missingThrows = actualThrows && !doc.hasThrows;
      const extraThrows = !actualThrows && doc.hasThrows;

      if (
        missing.length ||
        extra.length ||
        missingReturns ||
        extraReturns ||
        missingThrows ||
        extraThrows
      ) {
        diffs.push({
          name: sig.name,
          line: declLine,
          missingParams: missing,
          extraParams: extra,
          missingReturns,
          extraReturns,
          missingThrows,
          extraThrows,
        });
      }

      searchStart = declLine;
    }
    return diffs;
  }

  private scanBodyForReturns(
    lines: string[],
    declLine: number
  ): { returnsValue: boolean } {
    const firstLine = lines[declLine];

    const arrow = firstLine.match(/=>\s*(.*)$/);
    if (arrow && !arrow[1].startsWith("{")) {
      const expr = arrow[1].trim();

      if (!/^(void\b|undefined\b)/i.test(expr)) {
        return { returnsValue: true };
      }
      return { returnsValue: false };
    }

    let brace = 0,
      inBody = false,
      returnsValue = false;

    for (let i = declLine; i < lines.length; i++) {
      for (const ch of lines[i]) {
        if (ch === "{") {
          brace++;
          inBody = true;
        }
        if (ch === "}") brace--;
      }

      if (inBody) {
        const m = lines[i].match(/\breturn\b([^;]*)/);
        if (m) {
          const after = m[1].trim();
          if (after && after !== ";") returnsValue = true;
        }
      }

      if (inBody && brace === 0) break;
    }
    return { returnsValue };
  }

  private scanBodyForThrows(
    lines: string[],
    declLine: number
  ): { throws: boolean } {
    const firstLine = lines[declLine];
    if (/=>\s*[^\s{(]/.test(firstLine)) return { throws: false };

    let brace = 0,
      inBody = false,
      throws = false;
    for (let i = declLine; i < lines.length; i++) {
      for (const ch of lines[i]) {
        if (ch === "{") {
          brace++;
          inBody = true;
        }
        if (ch === "}") brace--;
      }
      if (inBody && lines[i].includes("throw ")) throws = true;
      if (inBody && brace === 0) break;
    }
    return { throws };
  }
}
