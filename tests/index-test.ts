import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { describe, beforeEach, afterEach, test, expect } from 'vitest';
import { createBinTester } from '@scalvert/bin-tester';
import { Project } from 'fixturify-project';

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

  test('errors if package to link is not a dependency or devDependency', async () => {
    let otherPackage = new Project('some-other-package', '1.0.0');
    await otherPackage.write({
      'index.js': 'console.log("hello world");',
    });

    let result = await runBin(otherPackage.baseDir);

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toMatch(
      /✖ some-other-package is not a dependency or devDependency in .*\/package.json/
    );
  });

  test('links a tarball when package to link is a dependency', async () => {
    let otherPackage = new Project('some-other-package', '1.0.0');
    await otherPackage.write({
      'index.js': 'console.log("hello world");',
    });

    project.addDependency('some-other-package', '1.0.0', otherPackage.baseDir);
    await project.write();

    let result = await runBin(otherPackage.baseDir);
    let projectPackageJson = JSON.parse(
      fs.readFileSync(path.join(project.baseDir, 'package.json'), 'utf8')
    );

    expect(result.exitCode).toEqual(0);
    expect(result.stdout).toEqual(
      `✔ Successfully linked ${otherPackage.baseDir}${path.sep}some-other-package-1.0.0.tgz to ${project.baseDir}`
    );
    expect(
      Object.keys(projectPackageJson.dependencies).includes(
        'some-other-package'
      )
    ).toEqual(true);
  });

  test('links a tarball when package to link is a devDependency', async () => {
    let otherPackage = new Project('some-other-package', '1.0.0');
    await otherPackage.write({
      'index.js': 'console.log("hello world");',
    });

    project.addDevDependency(
      'some-other-package',
      '1.0.0',
      otherPackage.baseDir
    );
    await project.write();

    let result = await runBin(otherPackage.baseDir);
    let projectPackageJson = JSON.parse(
      fs.readFileSync(path.join(project.baseDir, 'package.json'), 'utf8')
    );

    expect(result.exitCode).toEqual(0);
    expect(result.stdout).toEqual(
      `✔ Successfully linked ${otherPackage.baseDir}${path.sep}some-other-package-1.0.0.tgz to ${project.baseDir}`
    );
    expect(
      Object.keys(projectPackageJson.devDependencies).includes(
        'some-other-package'
      )
    ).toEqual(true);
  });
});
