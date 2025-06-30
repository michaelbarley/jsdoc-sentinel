import * as vscode from "vscode";
import { registerScanWorkspaceCommand } from "../../src/commands/ScanWorkspaceCommand";
import { container } from "../../src/container/inversify.config";
import { DiagnosticService } from "../../src/diagnostics/DiagnosticService";

if (!(vscode as any).commands) {
  (vscode as any).commands = {
    _commands: {} as Record<string, (...args: any[]) => any>,
    registerCommand(cmd: string, callback: (...args: any[]) => any) {
      this._commands[cmd] = callback;
      return { dispose: () => {} };
    },
    executeCommand(cmd: string, ...args: any[]) {
      const fn = this._commands[cmd];
      if (!fn) {
        return Promise.reject(new Error(`Command "${cmd}" not found`));
      }
      const result = fn(...args);
      return result instanceof Promise ? result : Promise.resolve(result);
    },
  };
}

describe("JSDoc Sentinel: Audit Workspace integration", () => {
  const fakeUri = vscode.Uri.file("foo.ts");
  const source = `
/**
 * No params documented
 */
function foo(bar: number): number {
  return bar;
}
`;
  const fakeDoc: any = {
    uri: fakeUri,
    getText: () => source,
    lineCount: source.split(/\r?\n/).length,
    lineAt: (n: number) => {
      const text = source.split(/\r?\n/)[n] || "";
      return { text };
    },
  };

  beforeAll(() => {
    (vscode.workspace as any).findFiles = jest
      .fn()
      .mockResolvedValue([fakeUri]);
    (vscode.workspace as any).openTextDocument = jest
      .fn()
      .mockResolvedValue(fakeDoc);
    (vscode.window as any).showInformationMessage = jest.fn();
    registerScanWorkspaceCommand({ subscriptions: [] } as any);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("finds the missing tags and populates diagnostics", async () => {
    await (vscode as any).commands.executeCommand("jsdocSentinel.scanWorkspace");

    const diagService = container.get(DiagnosticService) as any;
    const diagnostics = diagService.collection.get(fakeUri);

    expect(diagnostics).toHaveLength(2);
    const messages = diagnostics.map((d: any) => d.message);
    expect(messages).toContain("@param 'bar' missing");
    expect(messages).toContain("@returns missing");

    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      "JSDoc Sentinel: audited 1 file."
    );
  });
  it("shows plural wording when >1 file is scanned", async () => {
    const uri2 = vscode.Uri.file("bar.ts");
    (vscode.workspace as any).findFiles.mockResolvedValueOnce([fakeUri, uri2]);
    (vscode.workspace as any).openTextDocument
      .mockResolvedValueOnce(fakeDoc)
      .mockResolvedValueOnce(fakeDoc);

    await (vscode as any).commands.executeCommand("jsdocSentinel.scanWorkspace");

    expect(vscode.window.showInformationMessage).toHaveBeenLastCalledWith(
      "JSDoc Sentinel: audited 2 files."
    );
  });
  it("surfaces obsolete tags as diagnostics", async () => {
    const analyzer = container.get(
      require("../../src/analyzer/JSDocAnalyzer").JSDocAnalyzer
    ) as any;
    jest.spyOn(analyzer, "analyze").mockReturnValueOnce([
      {
        name: "z",
        line: 3,
        missingParams: [],
        extraParams: ["gone"],
        missingReturns: false,
        extraReturns: true,
        missingThrows: false,
        extraThrows: true,
      },
    ]);

    await (vscode as any).commands.executeCommand("jsdocSentinel.scanWorkspace");
    const diagService = container.get(DiagnosticService) as any;
    const msgs = diagService.collection.get(fakeUri).map((d: any) => d.message);

    expect(msgs).toEqual([
      "@param 'gone' is obsolete",
      "@returns is obsolete",
      "@throws is obsolete",
    ]);
  });
});
