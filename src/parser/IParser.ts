import { FunctionSignature } from "./Signature";

export interface IParser {
  parse(source: string): FunctionSignature[];
}
