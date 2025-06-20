import * as vscode from 'vscode';

export function activate(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.commands.registerCommand('commentSync.hello', () =>
      vscode.window.showInformationMessage('Comment-Sync up and running!'),
    ),
  );
}

export function deactivate(): void {/* noop */}
