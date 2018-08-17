import * as vscode from "vscode";

const testResourcDir =
  ".vscode-test/stable/Visual Studio Code.app/Contents/Resources/app";

export const getTestRoot = () => vscode.env.appRoot.replace(testResourcDir, "");
export const pathTo = (relativeFile: string) => {
  return `${getTestRoot()}/${relativeFile}`;
};
