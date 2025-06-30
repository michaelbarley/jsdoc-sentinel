import { inject, injectable } from "inversify";
import { IParser } from "../parser/TypeScriptParser";
import { ICommentExtractor } from "./JsDocExtractor";

@injectable()
export class CommentSyncService {
  constructor(
    @inject("IParser") private readonly parser: IParser,
    @inject("ICommentExtractor") private readonly extractor: ICommentExtractor
  ) {}

  findMissingParams(source: string): { fn: string; missing: string[] }[] {
    const sigs = this.parser.parse(source);
    const docs = this.extractor.extract(source);

    return sigs
      .map((sig, i) => {
        const docParams = docs[i]?.params ?? [];
        const missing = sig.params
          .filter((p) => !docParams.includes(p.name))
          .map((p) => p.name);
        return { fn: sig.name, missing };
      })
      .filter((r) => r.missing.length);
  }
}
