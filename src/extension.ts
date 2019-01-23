import * as vscode from "vscode";
import getTestCommand from "./lib/getTestCommand";
import { exec } from "child_process";
import { getExtensionSettings } from "./lib/settings";

const getOrCreateTerminal = () => {
  const count = (<any>vscode.window).terminals.length;
  if (count) {
    const terminals = <vscode.Terminal[]>(<any>vscode.window).terminals;
    return terminals[count - 1];
  }
  return vscode.window.createTerminal("vstest");
};

const run = (command: string) => {
  const settings = getExtensionSettings();
  settings.runIn === "iTerm"
    ? runInITerm(command, settings.focusIterm) :
    runInTerminal(command);
};

const runTest = (testType: "Focused" | "File") => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
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

  // TODO: add a setting to disable this.
  document.save();

  run(command);
};

function runInTerminal(command: string) {
  let terminal = getOrCreateTerminal();
  vscode.window.showInformationMessage(`VsTest: Running ${command}.....`);
  terminal.sendText(command);
}

function runInITerm(command: string, activate: boolean) {
  const esc = (s: string) => s.replace(/\'/g, "'\"'\"'");
  const iTermCommand =
    `osascript ` +
    ` -e 'tell app "iTerm"' ` +
    ` -e 'set mysession to current session of current window' ` +
    ` -e 'set mysession to current session of current window' ` +
    ` -e 'tell mysession to write text "${esc(command)}"' ` +
    ` ${activate ? "-e 'activate'" : ""} ` +
    ` -e 'end tell'`;

  exec(iTermCommand);
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "vstest.runFocusedTest",
    () => runTest("Focused")
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerCommand("vstest.runCurrentTestFile", () =>
      runTest("File")
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log("deactivated");
}
