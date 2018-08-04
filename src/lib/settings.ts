import * as vscode from "vscode";

export interface IPluginSettings {
  jest: {
    command: string;
    flags: string;
  };
}

export function getExtensionSettings(): IPluginSettings {
  const config = vscode.workspace.getConfiguration("vstest");
  return {
    jest: {
      command: config.get<string>("jest.command") || "npm run test",
      flags: config.get<string>("jest.flags") || ""
    }
  };
}
