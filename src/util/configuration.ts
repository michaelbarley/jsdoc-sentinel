import * as vscode from "vscode";

export interface ExtensionConfig {
  enableAI: boolean;
}

class Configuration implements ExtensionConfig {
  get enableAI(): boolean {
    const cfg = vscode.workspace.getConfiguration("jsdocSentinel");
    return cfg.get<boolean>("enableAI", false);
  }
}

export const config: ExtensionConfig = new Configuration();
