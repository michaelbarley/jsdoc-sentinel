import { injectable } from "inversify";

export interface JsDocBlock {
  text: string;
  params: string[];
  hasReturns: boolean;
  hasThrows: boolean;
}

export interface ICommentExtractor {
  extract(source: string): JsDocBlock[];
}

@injectable()
export class JsDocExtractor implements ICommentExtractor {
  private static readonly JSDOC_RE = /\/\*\*[\s\S]*?\*\//g;
  private static readonly PARAM_RE = /@param\s+(?:\{[^}]+\}\s*)?([\w$.]+)/g;

  extract(source: string): JsDocBlock[] {
    const blocks: JsDocBlock[] = [];

    for (const m of source.matchAll(JsDocExtractor.JSDOC_RE)) {
      const text = m[0];
      const params = Array.from(
        text.matchAll(JsDocExtractor.PARAM_RE),
        (p) => p[1]
      );
      const hasReturns = /@returns?\b/.test(text);
      const hasThrows = /@throws?\b/.test(text);
      blocks.push({ text, params, hasReturns, hasThrows });
    }
    return blocks;
  }
}
