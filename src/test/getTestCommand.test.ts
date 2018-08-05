import * as assert from "assert";
import * as vscode from "vscode";

import getTestCommand from "../lib/getTestCommand";

suite("getTestCommand", () => {
  const jestFile =
    "/Users/ignu/code/oss/vs-test/src/test/examples/jest.test.js";
  const onError = (callback: Function) => {
    return (reason: any) => {
      assert.fail(reason, reason);
      callback();
    };
  };

  test("Returns null when not on in a test", done => {
    vscode.workspace.openTextDocument(jestFile).then(document => {
      const expectedCommand =
        "./node_modules/.bin/jest --no-coverage -t 'good test'";
      assert.equal(getTestCommand(document, 1), expectedCommand);
      done();
    }, onError(done));
  });

  test("Can remember previous command", done => {
    vscode.workspace.openTextDocument(jestFile).then(document => {
      const expectedCommand =
        "./node_modules/.bin/jest --no-coverage -t 'good test'";
      assert.equal(getTestCommand(document, 4), expectedCommand);
      done();
    }, onError(done));
  });

  test("Can get a valid Jest test", done => {
    vscode.workspace.openTextDocument(jestFile).then(document => {
      const expectedCommand =
        "./node_modules/.bin/jest --no-coverage -t 'good test'";
      assert.equal(getTestCommand(document, 4), expectedCommand);
      assert.equal(getTestCommand(document, 1), expectedCommand);
      done();
    }, onError(done));
  });
});
