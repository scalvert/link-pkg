# link-tarball

Link another package's tarball to this package

## Usage

```sh
npx link-tarball <other-package-path>
```

Running `npx link-tarball` will build a tarball of the package at the given path and link it to the current package. This is useful for testing changes to a package who's dependencies may interfere with the current package's dependencies, such as React.

## Example

```sh
npx link-tarball ../some-other-package
✔ Successfully linked some-other-package.tar.gz to my-package
```

Now, in `my-package`'s root, run node with the following arguments:

```sh
node --preserve-symlinks --preserve-symlinks-main <script>
```

This will ensure that the linked tarball is used instead of the installed version of the package.