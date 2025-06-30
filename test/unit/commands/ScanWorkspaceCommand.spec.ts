import * as vscode from "vscode";
import { registerScanWorkspaceCommand } from "../../../src/commands/ScanWorkspaceCommand";
import { container } from "../../../src/container/inversify.config";
import { JSDocAnalyzer } from "../../../src/analyzer/JSDocAnalyzer";
import { DiagnosticService } from "../../../src/diagnostics/DiagnosticService";

describe("ScanWorkspaceCommand", () => {
  const fakeUri1 = vscode.Uri.file("one.ts");
  const fakeUri2 = vscode.Uri.file("two.ts");

  beforeAll(() => {
    (vscode.workspace as any).findFiles = jest
      .fn()
      .mockResolvedValue([fakeUri1, fakeUri2]);
    (vscode.workspace as any).openTextDocument = jest
      .fn()
      .mockResolvedValueOnce({ uri: fakeUri1, getText: () => "" })
      .mockResolvedValueOnce(undefined);
    (vscode.window as any).showInformationMessage = jest.fn();

    registerScanWorkspaceCommand({ subscriptions: [] } as any);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("skips when openTextDocument yields no doc", async () => {
    const analyzer = container.get(JSDocAnalyzer);
    const analyzeSpy = jest.spyOn(analyzer, "analyze").mockReturnValueOnce([]);
    await vscode.commands.executeCommand("jsdocSentinel.scanWorkspace");
    expect(analyzeSpy).toHaveBeenCalledTimes(1);
  });

  it("maps missingThrows into a @throws missing message", async () => {
    const analyzer = container.get(JSDocAnalyzer);
    jest.spyOn(analyzer, "analyze").mockReturnValue([
      {
        name: "foo",
        line: 0,
        missingParams: [],
        extraParams: [],
        missingReturns: false,
        extraReturns: false,
        missingThrows: true,
        extraThrows: false,
      },
    ]);
    const diagService = container.get(DiagnosticService) as any;
    const setSpy = jest.spyOn(diagService, "setDiagnostics");

    (vscode.workspace as any).findFiles = jest
      .fn()
      .mockResolvedValue([fakeUri1]);
    (vscode.workspace as any).openTextDocument = jest
      .fn()
      .mockResolvedValue({ uri: fakeUri1, getText: () => "" });

    await vscode.commands.executeCommand("jsdocSentinel.scanWorkspace");

    const issues = setSpy.mock.calls.pop()![1] as any[];
    expect(issues).toEqual([{ line: 0, message: "@throws missing" }]);
  });
});
