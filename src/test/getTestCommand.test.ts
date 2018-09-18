import * as assert from "assert";
import * as vscode from "vscode";
import { pathTo } from "./testUtils";

import getTestCommand from "../lib/getTestCommand";
const assertMatch = (string: string | null, regex: RegExp) => {
  const match = (string || "").match(regex);
  assert.ok(!!match, `Expected "${string}" to match ${regex}`);
};

suite("getTestCommand", () => {
  const onError = (callback: Function) => {
    return (reason: any) => {
      assert.fail(reason, reason);
      callback();
    };
  };

  suite("elixir", () => {
    const elixirFile = pathTo(
      "src/test/examples/elixir_project/test/cool_test.ex"
    );
    const nonTestFile = pathTo("src/test/examples/elixir_project/cool.ex");

    test("Returns null when not on in a test", done => {
      vscode.workspace.openTextDocument(elixirFile).then(document => {
        const command = getTestCommand(document, 6, "Focused");
        assertMatch(command, /mix test(.)+:6$/);
        done();
      }, onError(done));
    });

    test("Remembers the last test when no longer in a test", done => {
      vscode.workspace.openTextDocument(elixirFile).then(document => {
        getTestCommand(document, 5, "Focused");
        vscode.workspace.openTextDocument(nonTestFile).then(document => {
          const command = getTestCommand(document, 6, "Focused");
          assertMatch(command, /mix test(.)+:5$/);
          done();
        });
      }, onError(done));
    });

    test("can run entire file", done => {
      vscode.workspace.openTextDocument(elixirFile).then(document => {
        getTestCommand(document, 5, "File");
        vscode.workspace.openTextDocument(nonTestFile).then(document => {
          const command = getTestCommand(document, 6, "Focused") || "";
          const match = command.match(/mix test(.)+ex$/);
          assert.ok(!!match);
          done();
        });
      }, onError(done));
    });
  });

  suite("test-unit", () => {
    const testFile = pathTo(
      "src/test/examples/test_unit_project/test/models/cool_test.rb"
    );

    test.only("can run a focused test unit file", done => {
      vscode.workspace.openTextDocument(testFile).then(document => {
        const actualCommand = getTestCommand(document, 2, "Focused");
        const expectedCommand =
          "ruby - I test src/test/examples/test_unit_project/test/models/cool_test.rb --name='/test_example$/'";

        console.log(actualCommand);
        console.log("------");

        assert.equal(expectedCommand, actualCommand);
        done();
      }, onError(done));
    });
  });

  suite("jest", () => {
    const jestFile = pathTo("src/test/examples/JestFile.test.js");

    test("Returns null when not on in a test", done => {
      vscode.workspace.openTextDocument(jestFile).then(document => {
        const expectedCommand =
          "./node_modules/.bin/jest --no-coverage -t 'good test'";
        assert.equal(getTestCommand(document, 1, "Focused"), expectedCommand);
        done();
      }, onError(done));
    });

    test("Can remember previous command", done => {
      vscode.workspace.openTextDocument(jestFile).then(document => {
        const expectedCommand =
          "./node_modules/.bin/jest --no-coverage -t 'good test'";
        assert.equal(getTestCommand(document, 4, "Focused"), expectedCommand);
        done();
      }, onError(done));
    });

    test("Can get a valid Jest test", done => {
      vscode.workspace.openTextDocument(jestFile).then(document => {
        const expectedCommand =
          "./node_modules/.bin/jest --no-coverage -t 'good test'";
        assert.equal(getTestCommand(document, 4, "Focused"), expectedCommand);
        assert.equal(getTestCommand(document, 1, "Focused"), expectedCommand);
        done();
      }, onError(done));
    });

    test("can run entire file", done => {
      vscode.workspace.openTextDocument(jestFile).then(document => {
        const expectedCommand =
          "./node_modules/.bin/jest --no-coverage -t 'JestFile'";
        assert.equal(getTestCommand(document, 4, "File"), expectedCommand);
        done();
      }, onError(done));
    });
  });
});
