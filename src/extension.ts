"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.runFocusedTest",
    () => {
      let editor = vscode.window.activeTextEditor;

      if (!editor) {
        // TODO: run last test
        console.log("No file selected");
        return;
      }

      let selection = editor.selection;
      const line = selection.active.line;
      vscode.window.showInformationMessage(`Running test on line #${line}`);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log("deactivated");
}
