import * as vscode from "vscode";

export interface IPluginSettings {
  jest: {
    command: string;
    flags: string;
  };
  elixir: {
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
    },
    elixir: {
      command: config.get<string>("elixir.command") || "mix test",
      flags: config.get<string>("elixir.flags") || ""
    }
  };
}
