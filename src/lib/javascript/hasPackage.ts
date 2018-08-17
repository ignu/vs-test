import * as vscode from "vscode";

async function hasPackage(name: string, file: string) {
  vscode.workspace.openTextDocument(file).then(doc => {
    const regex = /name/;
    return doc.getText().match(regex);
  });
}

export default hasPackage;
