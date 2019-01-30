import * as vscode from "vscode";
import { getExtensionSettings } from "../settings";
import { Resolver } from "../../types";

const getJsTestName = (document: vscode.TextDocument, lineNumber: number) => {
  for (let line = lineNumber; line >= 0; line--) {
    const { text } = document.lineAt(line);

    const regex = /it ?\(["'](.+)["']/;
    const match = text.match(regex);

    if (match) {
      const testName = match[1];
      return testName.trim();
    }
  }

  return null;
};

const getFileName = (document: vscode.TextDocument) => {
  const match = document.fileName.match(/\w+(?:\.\w+).*$/);
  if (!match) {
    return null;
  }
  return match[0].replace(".js", "").replace(".test", "");
};

export const resolveJavaScript: Resolver = (document, lineNumber, testType) => {
  const settings = getExtensionSettings();

  const { command, flags } = settings.jest;

  const testName =
    testType === "File"
      ? getFileName(document)
      : getJsTestName(document, lineNumber);

  if (!testName) {
    return null;
  }
  return `${command} ${flags} -t '${testName}'`;
};
