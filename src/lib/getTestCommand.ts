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
      lastTest.save(testName);
      return testName;
    }
  }

  return lastTest.load();
};

const testCommandResolvers = {
  jest: (document: vscode.TextDocument, lineNumber: number) => {
    const settings = getExtensionSettings();

    const { command, flags } = settings.jest;

    const testName = getJsTestName(document, lineNumber);
    if (!testName) {
      return null;
    }
    const rv = `${command} ${flags} -t '${testName}'`;
    return rv;
  },
  elixir: (document: vscode.TextDocument, lineNumber: number) => {
    return "mix test test/cool_test.ex:6";
  }
};

const getTestType = (document: vscode.TextDocument) => {
  const { languageId } = document;
  switch (languageId) {
    case "javascript":
      return "jest";
      break;
    case "elixir":
      return "jest";
      break;
    default:
      vscode.window.showErrorMessage(`${languageId} is not supported`);
      return null;
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
  return resolver(document, lineNumber);
}
