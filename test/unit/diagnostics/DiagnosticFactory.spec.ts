import {
  DiagnosticFactory,
  Issue,
} from "../../../src/diagnostics/DiagnosticFactory";
import * as vscode from "vscode";

describe("DiagnosticFactory", () => {
  it("converts Issue objects into vscode.Diagnostics", () => {
    const issues: Issue[] = [
      { line: 2, message: "@param 'foo' missing" },
      { line: 5, message: "@param 'bar' is obsolete" },
    ];

    const diagnostics = DiagnosticFactory.fromIssues(issues);

    expect(diagnostics).toHaveLength(2);

    const [diag1, diag2] = diagnostics;

    expect(diag1.message).toBe("@param 'foo' missing");
    expect(diag1.range.start.line).toBe(2);
    expect(diag1.severity).toBe(vscode.DiagnosticSeverity.Warning);

    expect(diag2.message).toBe("@param 'bar' is obsolete");
    expect(diag2.range.start.line).toBe(5);
  });
});
