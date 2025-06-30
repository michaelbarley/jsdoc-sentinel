export interface ParamInfo {
  name: string;
  optional: boolean;
}

export interface FunctionSignature {
  name: string;
  params: ParamInfo[];
  returnsVoid: boolean;
}
