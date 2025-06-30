import * as vscode from "vscode";
import { injectable } from "inversify";
import { Issue, DiagnosticFactory } from "./DiagnosticFactory";

@injectable()
export class DiagnosticService {
  private readonly collection =
    vscode.languages.createDiagnosticCollection("jsdocSentinel");

  public setDiagnostics(document: vscode.TextDocument, issues: Issue[]): void {
    const diagnostics = DiagnosticFactory.fromIssues(issues);
    this.collection.set(document.uri, diagnostics);
  }
}
