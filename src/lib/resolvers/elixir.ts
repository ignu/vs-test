import * as vscode from "vscode";
import { getExtensionSettings } from "../settings";
import { Resolver } from "../../types";

const getPath = (uri: vscode.Uri) => vscode.workspace.asRelativePath(uri);

export const resolveElixir : Resolver = ( document, lineNumber, testType) => {
  const settings = getExtensionSettings();
  const uri = document.uri;
  if (!uri.fsPath.match(/_test.ex(s)?$/)) {
    return null;
  }
  const lineString = testType === "Focused" ? `:${lineNumber}` : "";
  const path = `${getPath(uri)}${lineString}`;
  console.log("PATH", path);
  const { command, flags } = settings.elixir;
  return `${command} ${path} ${flags}`.trim();
};
