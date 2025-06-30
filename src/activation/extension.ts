import "reflect-metadata";

import * as vscode from "vscode";
import { container } from "../container/inversify.config";
import { JSDocAnalyzer } from "../analyzer/JSDocAnalyzer";
import { DiagnosticService } from "../diagnostics/DiagnosticService";
import { registerScanWorkspaceCommand } from "../commands/ScanWorkspaceCommand";

export function activate(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.commands.registerCommand("jsdocSentinel.hello", () =>
      vscode.window.showInformationMessage("Comment-Sync up and running!")
    )
  );

  const analyzer = container.get(JSDocAnalyzer);
  const diagService = container.get(DiagnosticService);
  ctx.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((doc) => {
      if (!["typescript", "javascript"].includes(doc.languageId)) {
        return;
      }
      const diffs = analyzer.analyze(doc.getText());
      const issues = diffs.flatMap((d) => [
        ...d.missingParams.map((n) => ({
          line: d.line,
          message: `@param '${n}' missing`,
        })),
        ...d.extraParams.map((n) => ({
          line: d.line,
          message: `@param '${n}' is obsolete`,
        })),
        ...(d.missingReturns
          ? [{ line: d.line, message: "@returns missing" }]
          : []),
        ...(d.extraReturns
          ? [{ line: d.line, message: "@returns is obsolete" }]
          : []),
        ...(d.missingThrows
          ? [{ line: d.line, message: "@throws missing" }]
          : []),
        ...(d.extraThrows
          ? [{ line: d.line, message: "@throws is obsolete" }]
          : []),
      ]);
      diagService.setDiagnostics(doc, issues);
    })
  );

  registerScanWorkspaceCommand(ctx);
}

export function deactivate(): void {
}
