import * as assert from "assert";
import * as vscode from "vscode";

import getTestCommand from "../lib/getTestCommand";

suite("getTestCommand", () => {
  test("Can get a valid Jest test", done => {
    // const jestFile = path.join(__dirname, "examples", "jest.js");
    const jestFile = "/Users/ignu/code/oss/vs-test/src/test/examples/jest.js";

    vscode.workspace.openTextDocument(jestFile).then(
      document => {
        assert.equal(getTestCommand(document, 4), "yarn test");
        done();
      },
      error => {
        assert.fail(error, error);
        done();
      }
    );
  });
});
