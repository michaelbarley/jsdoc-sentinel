import * as vscode from "vscode";
import { container } from "../container/inversify.config";
import { JSDocAnalyzer } from "../analyzer/JSDocAnalyzer";
import { DiagnosticService } from "../diagnostics/DiagnosticService";

export function registerScanWorkspaceCommand(
  ctx: vscode.ExtensionContext
): void {
  const command = vscode.commands.registerCommand(
    "jsdocSentinel.scanWorkspace",
    async () => {
      const analyzer = container.get(JSDocAnalyzer);
      const diagService = container.get(DiagnosticService);
      const uris = await vscode.workspace.findFiles(
        "**/*.{ts,tsx,js,jsx}",
        "**/node_modules/**"
      );

      await Promise.all(
        uris.map(async (uri) => {
          const doc = await vscode.workspace.openTextDocument(uri);

          if (!doc) return;

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

      vscode.window.showInformationMessage(
        `JSDoc Sentinel: audited ${uris.length} file${
          uris.length === 1 ? "" : "s"
        }.`
      );
    }
  );
  ctx.subscriptions.push(command);
}
