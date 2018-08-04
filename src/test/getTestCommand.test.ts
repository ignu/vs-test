import * as assert from "assert";
import * as path from "path";
import * as vscode from "vscode";

import getTestCommand from "../lib/getTestCommand";

suite("getTestCommand", () => {
  test("Can get a valid Jest test", done => {
    vscode.workspace
      .openTextDocument(path.join(__dirname, "examples", "jest.js"))
      .then(
        document => {
          assert.equal(getTestCommand(document, 4), 4);
          done();
        },
        error => {
          assert.fail(error, "");
          done();
        }
      );
  });
});
