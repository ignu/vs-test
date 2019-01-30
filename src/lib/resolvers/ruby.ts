import * as vscode from "vscode";
import { getExtensionSettings } from "../settings";
import { Resolver } from "../../types";

const getTestUnitTestName = (
  document: vscode.TextDocument,
  lineNumber: number
) => {
  for (let line = lineNumber; line >= 0; line--) {
    const { text } = document.lineAt(line);

    const regex = /test ["'](.+)["'] do/;
    const match = text.match(regex);

    if (match) {
      const testName = match[1];
      return testName.trim();
    }
  }

  return null;
};

export const resolveRuby: Resolver = (document, lineNumber, testType) => {
  const settings = getExtensionSettings();

  const { command } = settings.testUnit;

  const uri = document.uri.fsPath;
  if (!uri.match(/_test.rb?$/)) {
    return null;
  }

  const path = uri.substr(uri.lastIndexOf("/test/") + 1, uri.length);
  if (!path) {
    return null;
  }

  const testOpts =
    testType === "File"
      ? ""
      : `TESTOPTS="--name='${getTestUnitTestName(document, lineNumber)}'"`;

  return `${command} TEST="${path}" ${testOpts}`;
};
