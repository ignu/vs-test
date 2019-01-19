import * as assert from "assert";
import * as vscode from "vscode";
import { pathTo } from "./testUtils";

import getTestCommand from "../lib/getTestCommand";
const assertMatch = (string: string | null, regex: RegExp) => {
  const match = (string || "").match(regex);
  assert.ok(!!match, `Expected "${string}" to match ${regex}`);
};

suite("getTestCommand", () => {
  suite("elixir", () => {
    const elixirFile = pathTo(
      "src/test/examples/elixir_project/test/cool_test.ex"
    );
    const nonTestFile = pathTo("src/test/examples/elixir_project/cool.ex");

    test("Returns null when not on in a test", async () => {
      const document = await vscode.workspace.openTextDocument(elixirFile);
      const command = getTestCommand(document, 6, "Focused");
      assertMatch(command, /mix test(.)+:6$/);
    });

    test("Remembers the last test when no longer in a test", async () => {
      const document = await vscode.workspace.openTextDocument(elixirFile);
      getTestCommand(document, 5, "Focused");
      const nonTestDoc = await vscode.workspace.openTextDocument(nonTestFile);
      const command = getTestCommand(nonTestDoc, 6, "Focused");

      assertMatch(command, /mix test(.)+:5$/);
    });

    test("can run entire file", async () => {
      const document = await vscode.workspace.openTextDocument(elixirFile);
      getTestCommand(document, 5, "File");
      const nonTestDoc = await vscode.workspace.openTextDocument(nonTestFile);
      const command = getTestCommand(nonTestDoc, 6, "Focused") || "";
      const match = command.match(/mix test(.)+ex$/);

      assert.ok(!!match);
    });
  });

  suite("test-unit", () => {
    const testFile = pathTo(
      "src/test/examples/test_unit_project/test/models/cool_test.rb"
    );

    test("can run a focused test unit file", async () => {
      const document = await vscode.workspace.openTextDocument(testFile);
      const actualCommand = getTestCommand(document, 2, "Focused");
      const expectedCommand =
        "ruby -I test test/models/cool_test.rb --name='cool example'";

      assert.equal(expectedCommand, actualCommand);
    });
  });

  suite("jest", () => {
    const jestFile = pathTo("src/test/examples/JestFile.test.js");

    test("Returns null when not on in a test", async () => {
      const document = await vscode.workspace.openTextDocument(jestFile);
      const expectedCommand =
        "./node_modules/.bin/jest --no-coverage -t 'good test'";

      assert.equal(getTestCommand(document, 1, "Focused"), expectedCommand);
    });

    test("Can remember previous command", async () => {
      let document = await vscode.workspace.openTextDocument(jestFile);
      const expectedCommand =
        "./node_modules/.bin/jest --no-coverage -t 'good test'";

      assert.equal(getTestCommand(document, 4, "Focused"), expectedCommand);
    });

    test("Can get a valid Jest test", async () => {
      const document = await vscode.workspace.openTextDocument(jestFile);
      const expectedCommand =
        "./node_modules/.bin/jest --no-coverage -t 'good test'";

      assert.equal(getTestCommand(document, 4, "Focused"), expectedCommand);
      assert.equal(getTestCommand(document, 1, "Focused"), expectedCommand);
    });

    test("can run entire file", async () => {
      const document = await vscode.workspace.openTextDocument(jestFile);
      const expectedCommand =
        "./node_modules/.bin/jest --no-coverage -t 'JestFile'";

      assert.equal(getTestCommand(document, 4, "File"), expectedCommand);
    });
  });
});
