# ![Vs-Test](https://github.com/ignu/vs-test/raw/master/assets/logo.png)

Adding the power of [vim-test](https://github.com/janko-m/vim-test) to VS Code

## Features

- `Run Focused Test` - if you're in a test file, run the test under the cursor
- `Run Test File` - Run all the tests in the file

## Configuration

### Global

- `vstest.runInIterm` - If true, will run tests the last active iTerm window instead of the deidcated terminal
- `vstest.focusIterm` - If true, will activate iTerm on test runs

### JavaScript

- `vstest.jest.command` - The path to the Jest binary, or an npm command to run tests prefixed with `--` e.g. `node_modules/.bin/jest` or `npm test --`
- `vstest.jest.flags` - Flags to pass to jest

### Elixir

- `vstest.elixir.command` - The command to start the elixir test runner
- `vstest.elixir.flags` - Flags to pass elixir tests
