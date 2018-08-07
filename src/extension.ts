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

const runTest = (testType: "Focused" | "File") => {
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

  const command = getTestCommand(document, line, testType);

  if (!command) {
    vscode.window.showWarningMessage("VsTest: No test found.");
    return;
  }
  run(command);
};

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.runFocusedTest",
    () => runTest("Focused")
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.runCurrentTestFile", () =>
      runTest("File")
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log("deactivated");
}
