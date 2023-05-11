#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { execa } from 'execa';
import logSymbols from 'log-symbols';
import meow from 'meow';

const cli = meow(
  `
  Links another package's tarball to this package.

	Usage
	  $ npx link-pkg <package path>


	Example
	  $ npx link-pkg ../some-other-package
    ✔ Successfully linked some-other-package.tar.gz to my-package
`,
  {
    importMeta: import.meta,
    flags: {},
  }
);

async function getTarballPath(otherPackagePath) {
  const { stdout } = await execa('npm', ['pack'], { cwd: otherPackagePath });

  return path.join(otherPackagePath, stdout.trim());
}

function getPackageReference(dependencyGroup, packageName) {
  if (dependencyGroup && dependencyGroup[packageName]) {
    return dependencyGroup;
  }

  return '';
}

async function getPackageJson(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

  return [packageJson, packageJsonPath];
}

async function linkPkg(thisPackagePath, otherPackagePath) {
  try {
    const [packageJson, packageJsonPath] = await getPackageJson(
      thisPackagePath
    );
    const [otherPackageJson] = await getPackageJson(otherPackagePath);

    const dependencyGroup =
      getPackageReference(packageJson.dependencies, otherPackageJson.name) ||
      getPackageReference(packageJson.devDependencies, otherPackageJson.name);

    if (!dependencyGroup) {
      console.error(
        `${logSymbols.error} ${otherPackageJson.name} is not a dependency or devDependency in ${thisPackagePath}/package.json`
      );

      process.exit(1);
    }

    const tarballPath = await getTarballPath(otherPackagePath);

    if (!tarballPath) {
      console.error(
        `${logSymbols.error} Could not find tarball path in npm pack output in ${otherPackagePath}`
      );

      process.exit(1);
    }

    dependencyGroup[otherPackageJson.name] = tarballPath;

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log(
      `${logSymbols.success} Successfully linked ${tarballPath} to ${thisPackagePath}`
    );
  } catch (error) {
    console.error(
      `${logSymbols.error} An error occurred while updating package.json:`,
      error
    );
  }
}

const baseDir = process.cwd();

await linkPkg(baseDir, cli.input[0]);
