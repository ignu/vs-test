import * as vscode from "vscode";

export interface IPluginSettings {
  jest: {
    command: string;
    flags: string;
  };
}

export function getExtensionSettings(): IPluginSettings {
  const config = vscode.workspace.getConfiguration("vstest");
  console.log("======== actual config");
  console.log(config);
  console.log("======== actual config");
  return {
    jest: {
      command: config.get<string>("jest.binaryPath") || "npm run test",
      flags: config.get<string>("jest.flags") || ""
    }
  };
}
