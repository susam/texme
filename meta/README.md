Developer Notes
===============

This document is useful for developers of TeXMe.


Setup
-----

To set up the development environment for TeXMe, follow these steps:

 1. Install Node. Here are example commands for macOS and Debian-based
    distributions:

        # On macOS
        brew install node

        # On Debian
        sudo make install_node_deb

 2. Install dependencies by running this command at the top-level
    directory of the project:

        npm install

 3. Run the tests:

        npm test

 4. Open `examples/get-started.html` and `examples/demo.html` with a web
    browser.


Release Checklist
-----------------

Perform the following tasks for every release:

  - Update version in README.md.
  - Update version in package.json.
  - Update version in Makefile.
  - Update copyright notice in LICENSE.md.
  - Update copyright notice in texme.js.
  - Update CHANGES.md.
  - Run tests.

        npm test

  - Update minified script.

        npm run min

  - Commit changes.

        git status
        git add -p

  - Tag the release.

        VERSION=<VERSION>

        git commit -em "Set version to $VERSION"
        git tag $VERSION -m "TeXMe $VERSION"
        git push origin master $VERSION 

  - Publish package.

        npm login
        npm publish

  - Publish documentation and examples.

        make live


Post-Release Checklist
----------------------

Perform the following tasks after every release:

  - Update version in package.json to the next dev version (`X.Y.Z-dev` format).

  - Commit.

        git add -p
        git status

        VERSION=$(sed -n 's/.*version.*: "\(.*\)",/\1/p' package.json)
        echo VERSION: $VERSION

        git commit -em "Set version to $VERSION"
        git push origin master
