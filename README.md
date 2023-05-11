# @scalvert/link-pkg

Link another package's tarball to this package

## Usage

```sh
npx @scalvert/link-pkg <other-package-path>
```

Running `npx @scalvert/link-pkg` will build a tarball of the package at the given path and link it to the current package. This is useful for testing changes to a package who's dependencies may interfere with the current package's dependencies, such as React.

## Example

```sh
npx @scalvert/link-pkg ../some-other-package
✔ Successfully linked some-other-package.tar.gz to my-package
```