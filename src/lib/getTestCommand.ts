import * as vscode from "vscode";
import lastTest from "./lastTest";

import { getExtensionSettings } from "./settings";

const getJsTestName = (document: vscode.TextDocument, lineNumber: number) => {
  for (let line = lineNumber; line >= 0; line--) {
    const { text } = document.lineAt(line);

    const regex = /it ?\(["'](.+)["']/;
    const match = text.match(regex);

    if (match) {
      const testName = match[1];
      return testName;
    }
  }

  return null;
};

const testCommandResolvers = {
  jest: (document: vscode.TextDocument, lineNumber: number) => {
    const settings = getExtensionSettings();

    const { command, flags } = settings.jest;

    const testName = getJsTestName(document, lineNumber);
    if (!testName) {
      return null;
    }
    return `${command} ${flags} -t '${testName}'`;
  },
  elixir: (document: vscode.TextDocument, lineNumber: number) => {
    const settings = getExtensionSettings();
    const uri = document.uri;
    if (!uri.fsPath.match(/_test.ex$/)) {
      return null;
    }
    const path = `${vscode.workspace.asRelativePath(uri)}:${lineNumber}`;
    const { command, flags } = settings.elixir;
    return `${command} ${path} ${flags}`;
  }
};

const getTestType = (document: vscode.TextDocument) => {
  const { languageId } = document;
  switch (languageId) {
    case "javascript":
      return "jest";
      break;
    case "elixir":
      return "elixir";
      break;
    default:
      vscode.window.showErrorMessage(`${languageId} is not supported`);
      return null;
  }
};

const remember = (callback: any) => {
  const command = callback();
  if (command) {
    return lastTest.save(command);
  } else {
    return lastTest.load();
  }
};

export default function getTestCommand(
  document: vscode.TextDocument,
  lineNumber: number
) {
  const framework = getTestType(document);
  const resolver = framework && testCommandResolvers[framework];

  if (!resolver) {
    return null;
  }
  return remember(() => resolver(document, lineNumber));
}
