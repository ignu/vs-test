import * as vscode from "vscode";

import { getExtensionSettings } from "./settings";
export default function getTestCommand(
  document: vscode.TextDocument,
  lineNumber: Number
) {
  const { languageId } = document;
  const settings = getExtensionSettings();
  console.log("========");
  console.log(settings);
  console.log("settings ========");

  console.log("getting test command for", languageId);

  const { command, flags } = settings.jest;

  const testName = "cool";
  const rv = `${command} ${flags} -t '${testName}'`;
  return rv;
}
