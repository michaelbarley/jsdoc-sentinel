import { Container } from "inversify";

import { IParser } from "../parser/IParser";
import { TypeScriptParser } from "../parser/TypeScriptParser";
import { JavaScriptParser } from "../parser/JavaScriptParser";
import { CompositeParser } from "../parser/CompositeParser";

import { ICommentExtractor } from "../comment/ICommentExtractor";
import { JsDocExtractor } from "../comment/JsDocExtractor";

import { JSDocAnalyzer } from "../analyzer/JSDocAnalyzer";
import { DiagnosticService } from "../diagnostics/DiagnosticService";

const container = new Container();

container.bind(TypeScriptParser).toSelf().inSingletonScope();
container.bind(JavaScriptParser).toSelf().inSingletonScope();

container.bind<IParser>("IParser").to(CompositeParser).inSingletonScope();

container
  .bind<ICommentExtractor>("ICommentExtractor")
  .to(JsDocExtractor)
  .inSingletonScope();

container.bind<JSDocAnalyzer>(JSDocAnalyzer).toSelf().inSingletonScope();
container
  .bind<DiagnosticService>(DiagnosticService)
  .toSelf()
  .inSingletonScope();

export { container };
