import * as vscode from "vscode";
import lastTest from "./lastTest";
import { TestType } from "../types";
import { resolveRuby } from "./resolvers/ruby";
import { resolveElixir } from "./resolvers/elixir";
import { resolveJavaScript } from "./resolvers/javascript";

const testCommandResolvers = {
  jest: resolveJavaScript,
  ruby: resolveRuby,
  elixir: resolveElixir
};

const getTestType = (document: vscode.TextDocument) => {
  const { languageId } = document;
  switch (languageId) {
    case "typescript":
      return "jest";
      break;
    case "javascript":
      return "jest";
      break;
    case "elixir":
      return "elixir";
      break;
    case "ruby":
      return "ruby";
      break;
    default:
      console.warn(`🤢 ${languageId} is not supported`);
      vscode.window.showErrorMessage(`${languageId} is not supported`);
      return null;
  }
};

const remember = (callback: any) => {
  const command = callback();
  if (command) {
    return lastTest.save(command);
  } else {
    return lastTest.load();
  }
};

export default function getTestCommand(
  document: vscode.TextDocument,
  lineNumber: number,
  testType: TestType
) {
  const framework = getTestType(document);
  const resolver = framework && testCommandResolvers[framework];

  if (!resolver) {
    return null;
  }
  return remember(() => resolver(document, lineNumber, testType));
}
