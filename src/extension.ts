import * as vscode from "vscode";
import getTestCommand from "./lib/getTestCommand";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.runFocusedTest",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        // TODO: run last test
        vscode.window.showInformationMessage(`No file selected`);
        return;
      }

      const document = editor.document;

      if (!document) {
        vscode.window.showInformationMessage(`No document open`);
        return;
      }

      const line = editor.selection.active.line;

      const command = getTestCommand(document, line);

      vscode.window.showInformationMessage(`Test command is #${command}`);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log("deactivated");
}
