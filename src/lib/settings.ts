import * as vscode from "vscode";

type RunIn = "terminal" | "iTerm";
export interface IPluginSettings {
  focusIterm: boolean;
  runIn: RunIn;
  testUnit: {
    command: string;
  };
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
    focusIterm: config.get<boolean>("focusIterm") || false,
    runIn: config.get<RunIn>("runIn") || "terminal",
    testUnit: {
      command: config.get<string>("testUnit.command") || "ruby -I test"
    },
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
