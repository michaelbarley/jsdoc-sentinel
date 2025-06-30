import * as vscode from "vscode";

export interface Issue {
  line: number;
  message: string;
}

export class DiagnosticFactory {
  private static readonly MAX_COLUMN = 200;

  static fromIssues(issues: readonly Issue[]): vscode.Diagnostic[] {
    return issues.map(
      (issue) =>
        new vscode.Diagnostic(
          new vscode.Range(
            issue.line,
            0,
            issue.line,
            DiagnosticFactory.MAX_COLUMN
          ),
          issue.message,
          vscode.DiagnosticSeverity.Warning
        )
    );
  }
}
