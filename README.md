# link-tarball

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