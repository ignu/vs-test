import * as vscode from "vscode";

export default function getTestCommand(
  document: vscode.TextDocument,
  lineNumber: Number
) {
  const { languageId } = document;

  console.log("getting test command for", languageId);

  return "yarn test";
}
