export class Uri {
  static file(path: string) {
    return new Uri(path);
  }
  private constructor(public fsPath: string) {}
}
export class Position {
  constructor(public line: number, public character: number) {}
}

export class Range {
  constructor(
    public startLine: number,
    public startCharacter: number,
    public endLine: number,
    public endCharacter: number
  ) {
    this.start = { line: startLine, character: startCharacter } as any;
    this.end = { line: endLine, character: endCharacter } as any;
  }
  start: { line: number; character: number };
  end: { line: number; character: number };
}

export const DiagnosticSeverity = {
  Error: 0,
  Warning: 1,
  Information: 2,
  Hint: 3,
} as const;
type Severity = (typeof DiagnosticSeverity)[keyof typeof DiagnosticSeverity];

export class Diagnostic {
  constructor(
    public range: Range,
    public message: string,
    public severity: Severity = DiagnosticSeverity.Hint
  ) {}
}

export const CodeActionKind = { QuickFix: "quickfix" } as const;

export class WorkspaceEdit {
  public changes: Record<string, unknown[]> = {};
  insert() {
  }
  delete() {
  }
}

export class CodeAction {
  constructor(public title: string, public kind: unknown) {}
  edit?: WorkspaceEdit;
  diagnostics?: unknown[];
}

const _commandRegistry: Record<string, (...args: any[]) => any> = {};

export const commands = {
  registerCommand(cmd: string, callback: (...args: any[]) => any) {
    _commandRegistry[cmd] = callback;
    return { dispose: () => {} };
  },
  executeCommand(cmd: string, ...args: any[]) {
    const fn = _commandRegistry[cmd];
    if (!fn) {
      return Promise.reject(new Error(`Command "${cmd}" not found`));
    }
    const result = fn(...args);
    return result instanceof Promise ? result : Promise.resolve(result);
  },
};

export const languages = {
  createDiagnosticCollection: (name: string) => {
    const store: Record<string, Diagnostic[]> = {};
    return {
      name,
      set: (uri: Uri, diags: Diagnostic[]) => {
        store[uri.fsPath] = diags;
      },
      get: (uri: Uri) => store[uri.fsPath] ?? [],
      clear: () => Object.keys(store).forEach((k) => delete store[k]),
    };
  },
  registerCodeActionsProvider: (
    selector: unknown,
    provider: unknown,
    meta: unknown
  ) => {
    return { dispose: () => {} };
  },
};

export const window = {};

export const workspace = {
  getConfiguration: (section: string) => ({
    get: (key: string, defaultValue: any) => defaultValue,
  }),
  onDidSaveTextDocument: (listener: unknown) => ({ dispose: () => {} }),
  findFiles: async () => [] as any[],
  openTextDocument: async () => ({} as any),
};
