import { fileURLToPath } from 'url';
import { describe, beforeEach, afterEach, test, expect } from 'vitest';
import { createBinTester } from '@scalvert/bin-tester';

describe('link-tarball', () => {
  let project;
  let { setupProject, teardownProject, runBin } = createBinTester({
    binPath: fileURLToPath(new URL('../bin/index.mjs', import.meta.url)),
  });

  beforeEach(async () => {
    project = await setupProject();
  });

  afterEach(() => {
    teardownProject();
  });

  test('outputs help', async () => {
    let result = await runBin('--help');

    expect(result.stdout).toMatchInlineSnapshot(`
      "
        Link another package's tarball to this package

        Usage
          $ npx link-tarball <package path>

        Example
          $ npx link-tarball ../some-other-package
          ✔ Successfully linked some-other-package.tar.gz to my-package
      "
    `);
  });
});
