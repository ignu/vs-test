import * as vscode from "vscode";
import getTestCommand from "./lib/getTestCommand";

const getOrCreateTerminal = () => {
  const count = (<any>vscode.window).terminals.length;
  if (count) {
    const terminals = <vscode.Terminal[]>(<any>vscode.window).terminals;
    return terminals[count - 1];
  }
  return vscode.window.createTerminal("vstest");
};

const run = (command: string) => {
  let terminal = getOrCreateTerminal();
  vscode.window.showInformationMessage(`VsTest: Running ${command}.....`);
  terminal.sendText(command);
};

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.runFocusedTest",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        // TODO: run last test
        vscode.window.showInformationMessage(`VsTest: No file selected`);
        return;
      }

      const document = editor.document;

      if (!document) {
        vscode.window.showInformationMessage(`VsTest: No document open`);
        return;
      }

      const line = editor.selection.active.line;

      const command = getTestCommand(document, line);

      if (!command) {
        vscode.window.showWarningMessage("VsTest: No test found.");
        return;
      }
      run(command);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log("deactivated");
}
