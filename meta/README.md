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
