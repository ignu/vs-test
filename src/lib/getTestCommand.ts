import * as vscode from "vscode";
import lastTest from "./lastTest";
import { getExtensionSettings } from "./settings";

type TestType = "Focused" | "File";

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

const getJsTestName = (document: vscode.TextDocument, lineNumber: number) => {
  for (let line = lineNumber; line >= 0; line--) {
    const { text } = document.lineAt(line);

    const regex = /it ?\(["'](.+)["']/;
    const match = text.match(regex);

    if (match) {
      const testName = match[1];
      return testName.trim();
    }
  }

  return null;
};

const getFileName = (document: vscode.TextDocument) => {
  const match = document.fileName.match(/\w+(?:\.\w+).*$/);
  if (!match) {
    return null;
  }
  return match[0].replace(".js", "").replace(".test", "");
};

const getPath = (uri: vscode.Uri) => vscode.workspace.asRelativePath(uri);

const testCommandResolvers = {
  jest: (
    document: vscode.TextDocument,
    lineNumber: number,
    testType: TestType
  ) => {
    const settings = getExtensionSettings();

    const { command, flags } = settings.jest;

    const testName =
      testType === "File"
        ? getFileName(document)
        : getJsTestName(document, lineNumber);

    if (!testName) {
      return null;
    }
    return `${command} ${flags} -t '${testName}'`;
  },
  ruby: (
    document: vscode.TextDocument,
    lineNumber: number,
    testType: TestType
  ) => {
    const settings = getExtensionSettings();

    const { command } = settings.testUnit;

    const uri = document.uri;
    if (!uri.fsPath.match(/_test.rb?$/)) {
      return null;
    }

    console.log('🦄 - uri', uri);
    console.log(vscode.workspace.workspaceFolders);
    const folder = vscode.workspace.getWorkspaceFolder(uri);
    console.log("😼folder", folder);
    if (folder) {
      console.log(folder.uri);
      console.log(getPath(folder.uri));
    }
    console.log("🦄 - 121212121212121212", 121212121212121212);

    const testName =
      testType === "File"
        ? ""
        : ` --name='${getTestUnitTestName(document, lineNumber)}'`;

    return `${command} ${getPath(uri)} ${testName}'`;
  },
  elixir: (
    document: vscode.TextDocument,
    lineNumber: number,
    testType: TestType
  ) => {
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
  }
};

const getTestType = (document: vscode.TextDocument) => {
  const { languageId } = document;
  switch (languageId) {
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
