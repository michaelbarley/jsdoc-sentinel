import { DiagnosticService } from "../../../src/diagnostics/DiagnosticService";
import { Issue } from "../../../src/diagnostics/DiagnosticFactory";
import * as vscode from "vscode";

describe("DiagnosticService", () => {
  const service = new DiagnosticService();
  const doc = { uri: vscode.Uri.file("foo.ts") } as vscode.TextDocument;

  it("pushes diagnostics returned from the factory", () => {
    const issues: Issue[] = [
      { line: 1, message: "@param 'x' missing" },
      { line: 3, message: "@param 'y' is obsolete" },
    ];

    service.setDiagnostics(doc, issues);

    const diags = (service as any).collection.get(doc.uri);
    expect(diags).toHaveLength(2);
    expect(diags[0].message).toBe("@param 'x' missing");
    expect(diags[0].severity).toBe(vscode.DiagnosticSeverity.Warning);
  });

  it("clears diagnostics when given an empty list", () => {
    service.setDiagnostics(doc, []);
    const diags = (service as any).collection.get(doc.uri);
    expect(diags).toHaveLength(0);
  });
});
