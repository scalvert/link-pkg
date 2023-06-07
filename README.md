# link-tarball

![CI Build](https://github.com/scalvert/link-tarball/workflows/CI%20Build/badge.svg)
[![npm version](https://badge.fury.io/js/%40scalvert%2Flink-tarball.svg)](https://badge.fury.io/js/%40scalvert%2Flink-tarball)
[![License](https://img.shields.io/npm/l/@checkup/cli.svg)](https://github.com/checkupjs/checkup/blob/master/package.json)
![Dependabot](https://badgen.net/badge/icon/dependabot?icon=dependabot&label)
![Volta Managed](https://img.shields.io/static/v1?label=volta&message=managed&color=yellow&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAeQC6AMEpK7AhAAAACXBIWXMAAAsSAAALEgHS3X78AAAAB3RJTUUH5AMGFS07qAYEaAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFmSURBVDjLY2CgB/g/j0H5/2wGW2xyTAQ1r2DQYOBgm8nwh+EY6TYvZtD7f9rn5e81fAGka17GYPL/esObP+dyj5Cs+edqZsv/V8o//H+z7P+XHarW+NSyoAv8WsFszyKTtoVBM5Tn7/Xys+zf7v76vYrJlPEvAwPjH0YGxp//3jGl/L8LU8+IrPnPUkY3ZomoDQwOpZwMv14zMHy8yMDwh4mB4Q8jA8OTgwz/L299wMDyx4Mp9f9NDAP+bWVwY3jGsJpB3JaDQVCEgYHlLwPDfwYWRqVQJgZmHoZ/+3PPfWP+68Mb/Pw5sqUoLni9ipuRnekrAwMjA8Ofb6K8/PKBF5nU7RX+Hize8Y2DOZTP7+kXogPy1zrH+f/vT/j/Z5nUvGcr5VhJioUf88UC/59L+/97gUgDyVH4YzqXxL8dOs/+zuFLJivd/53HseLPPHZPsjT/nsHi93cqozHZue7rLDYhUvUAADjCgneouzo/AAAAAElFTkSuQmCC&link=https://volta.sh)

Link another package's tarball to this package

## Usage

```sh
npx link-tarball <other-package-path>
```

Running `npx link-tarball` will build a tarball of the package at the given path and link it to the current package. This is useful for testing changes to a package who's dependencies may interfere with the current package's dependencies, such as React.

## Example

Let's say you have a package called `my-package` that depends on `some-other-package`. You want to test a change to `some-other-package` in `my-package`, but `some-other-package` depends on React, which is also a dependency of `my-package`. This will cause React to be installed twice, which will cause errors.

To avoid this, you can link `some-other-package`'s tarball to `my-package`, which will circumvent the dependency resolution process. To do this, run the following command in `my-package`'s root:

```sh
npx link-tarball ../some-other-package
✔ Successfully linked some-other-package.tar.gz to my-package
```

Now, in `my-package`'s root, run node with the following arguments:

```sh
node --preserve-symlinks --preserve-symlinks-main <path-to-module>
```

This will ensure that the linked tarball is used instead of the installed version of the package.