TeXMe Developer Notes
=====================

This document contains notes that may be useful to the developers of
TeXMe.


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
        git add .
        git commit

  - Tag the release.

        VERSION=<VERSION>
        git tag $VERSION -m "TeXMe $VERSION"
        git push origin master $VERSION 

  - Publish package.

        npm login
        npm publish

  - Publish documentation and examples.

        make pushdocs
