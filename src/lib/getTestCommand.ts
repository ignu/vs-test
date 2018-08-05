import * as vscode from "vscode";

import { getExtensionSettings } from "./settings";

const getJsTestName = (document: vscode.TextDocument, lineNumber: number) => {
  for (let line = lineNumber; line >= 0; line--) {
    const { text } = document.lineAt(line);

    const regex = /it ?\(["'](.+)["']/;
    const match = text.match(regex);

    if (match) {
      return match[1];
    }
  }

  return null;
};

export default function getTestCommand(
  document: vscode.TextDocument,
  lineNumber: number
) {
  // const { languageId } = document;
  const settings = getExtensionSettings();

  const { command, flags } = settings.jest;

  const testName = getJsTestName(document, lineNumber);
  if (!testName) {
    return null;
  }
  const rv = `${command} ${flags} -t '${testName}'`;
  console.log(rv);
  return rv;
}
