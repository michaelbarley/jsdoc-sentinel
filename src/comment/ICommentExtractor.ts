export interface JsDocBlock {
  text: string;
  params: string[];
  hasReturns: boolean;
  hasThrows: boolean;
}

export interface ICommentExtractor {
  extract(source: string): JsDocBlock[];
}
