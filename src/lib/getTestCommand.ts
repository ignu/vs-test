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
  return rv;
}
