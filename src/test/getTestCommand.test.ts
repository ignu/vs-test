import * as assert from "assert";
import * as vscode from "vscode";

import getTestCommand from "../lib/getTestCommand";

suite("getTestCommand", () => {
  test("Can get a valid Jest test", done => {
    // const jestFile = path.join(__dirname, "examples", "jest.js");
    const jestFile =
      "/Users/ignu/code/oss/vs-test/src/test/examples/jest.test.js";

    vscode.workspace.openTextDocument(jestFile).then(
      document => {
        const expectedCommand =
          "./node_modules/.bin/jest --no-coverage -t 'good test'";
        assert.equal(getTestCommand(document, 4), expectedCommand);
        done();
      },
      error => {
        assert.fail(error, error);
        done();
      }
    );
  });
});
