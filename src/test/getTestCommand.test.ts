import * as assert from "assert";
import * as vscode from "vscode";

import getTestCommand from "../lib/getTestCommand";

suite("getTestCommand", () => {
  const onError = (callback: Function) => {
    return (reason: any) => {
      assert.fail(reason, reason);
      callback();
    };
  };

  suite("elixir", () => {
    const elixirFile =
      "/Users/ignu/code/oss/vs-test/src/test/examples/elixir_project/test/cool_test.ex";
    const nonTestFile =
      "/Users/ignu/code/oss/vs-test/src/test/examples/elixir_project/cool.ex";

    test("Returns null when not on in a test", done => {
      vscode.workspace.openTextDocument(elixirFile).then(document => {
        const command = getTestCommand(document, 6) || "";
        const match = command.match(/mix test(.)+:6/);
        assert.ok(!!match);
        done();
      }, onError(done));
    });

    test("Remembers the last test when no longer in a test", done => {
      vscode.workspace.openTextDocument(elixirFile).then(document => {
        getTestCommand(document, 5);
        vscode.workspace.openTextDocument(nonTestFile).then(document => {
          const command = getTestCommand(document, 6) || "";
          const match = command.match(/mix test(.)+:5/);
          assert.ok(!!match);
          done();
        });
      }, onError(done));
    });
  });

  suite("jest", () => {
    const jestFile =
      "/Users/ignu/code/oss/vs-test/src/test/examples/jest.test.js";

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
});
