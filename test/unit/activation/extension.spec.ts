import * as vscode from "vscode";
import { activate, deactivate } from "../../../src/activation/extension";
import { container } from "../../../src/container/inversify.config";
import { JSDocAnalyzer, DocDiff } from "../../../src/analyzer/JSDocAnalyzer";
import { DiagnosticService } from "../../../src/diagnostics/DiagnosticService";

describe("Extension Activation & Deactivation", () => {
  let fakeCtx: any;
  let saveListener: (doc: vscode.TextDocument) => void;
  let analyzer: JSDocAnalyzer;
  let diagService: DiagnosticService;

  beforeAll(() => {
    fakeCtx = { subscriptions: [] };

    jest.spyOn(vscode.commands, "registerCommand");

    jest
      .spyOn(vscode.workspace, "onDidSaveTextDocument")
      .mockImplementation((cb) => {
        saveListener = cb as any;
        return { dispose: () => {} };
      });

    analyzer = container.get(JSDocAnalyzer);
    diagService = container.get(DiagnosticService);

    jest.spyOn(analyzer, "analyze").mockReturnValue([
      {
        name: "foo",
        line: 1,
        missingParams: ["a"],
        extraParams: ["obsolete"],
        missingReturns: false,
        extraReturns: false,
        missingThrows: false,
        extraThrows: false,
      },
    ] as DocDiff[]);

    jest.spyOn(diagService, "setDiagnostics");

    activate(fakeCtx);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("registers hello and scanWorkspace commands", () => {
    expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
      "jsdocSentinel.hello",
      expect.any(Function)
    );
    expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
      "jsdocSentinel.scanWorkspace",
      expect.any(Function)
    );
  });

  it("registers a save listener and processes saved TS documents", () => {
    expect(saveListener).toBeDefined();

    const fakeDoc = {
      languageId: "typescript",
      getText: () => "dummy source",
      uri: { fsPath: "file.ts" },
    } as unknown as vscode.TextDocument;

    saveListener(fakeDoc);

    expect(analyzer.analyze).toHaveBeenCalledWith("dummy source");

    expect(diagService.setDiagnostics).toHaveBeenCalledWith(fakeDoc, [
      { line: 1, message: "@param 'a' missing" },
      { line: 1, message: "@param 'obsolete' is obsolete" },
    ]);
  });

  it("does not process non-TS/JS documents", () => {
    const fakeOther = {
      languageId: "plaintext",
      getText: () => "ignored",
      uri: { fsPath: "ignore.txt" },
    } as unknown as vscode.TextDocument;

    saveListener(fakeOther);

    expect(analyzer.analyze).not.toHaveBeenCalledWith("ignored");
  });

  it("adds disposables into context.subscriptions", () => {
    expect(fakeCtx.subscriptions.length).toBeGreaterThan(0);
  });

  it("hello command shows the toast message", async () => {
    (vscode.window as any).showInformationMessage = jest.fn();

    await vscode.commands.executeCommand("jsdocSentinel.hello");

    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      "Comment-Sync up and running!"
    );
  });

  it("deactivate() is a no-op", () => {
    expect(deactivate()).toBeUndefined();
  });

  it("maps every kind of diff into diagnostics", () => {
    (analyzer.analyze as jest.Mock).mockReturnValueOnce([
      {
        name: "ret",
        line: 10,
        missingParams: [],
        extraParams: [],
        missingReturns: true,
        extraReturns: false,
        missingThrows: true,
        extraThrows: false,
      },
    ]);
    const doc1 = {
      languageId: "typescript",
      getText: () => "src1",
      uri: { fsPath: "ret.ts" },
    } as unknown as vscode.TextDocument;
    saveListener(doc1);
    expect(diagService.setDiagnostics).toHaveBeenLastCalledWith(doc1, [
      { line: 10, message: "@returns missing" },
      { line: 10, message: "@throws missing" },
    ]);

    (analyzer.analyze as jest.Mock).mockReturnValueOnce([
      {
        name: "voidFn",
        line: 20,
        missingParams: [],
        extraParams: [],
        missingReturns: false,
        extraReturns: true,
        missingThrows: false,
        extraThrows: true,
      },
    ]);
    const doc2 = {
      languageId: "typescript",
      getText: () => "src2",
      uri: { fsPath: "void.ts" },
    } as unknown as vscode.TextDocument;
    saveListener(doc2);
    expect(diagService.setDiagnostics).toHaveBeenLastCalledWith(doc2, [
      { line: 20, message: "@returns is obsolete" },
      { line: 20, message: "@throws is obsolete" },
    ]);
  });
});
