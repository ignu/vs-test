import * as assert from 'assert';
import hasPackage from '../lib/javascript/hasPackage';

suite('Extension Tests', function() {
  const elixirFile =
    '/Users/ignu/code/oss/vs-test/src/test/examples/elixir_project/test/cool_test.ex';

  test.skip('returns packages', async (done: any) => {
    const result = await hasPackage('jest', elixirFile);
    assert(result);
    done();
  });
});
