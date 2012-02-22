This a reimplementation of CLICAL.

Target environment is HTML5 compatible browser.

Some initial prototyping is done with Python.

Development
-----------

The development environment for the Javascript libraries requires Node and
npm. After installing those, run

    npm link
    npm -s test (or npm config set loglevel silent)

Tests go to tests subdirectory.

Development docs
----------------

- nodeunit: https://github.com/caolan/nodeunit#readme
- peg.js: http://pegjs.majda.cz/documentation

TODO
----

- Build a JS parser with PEG.js
- port algebra proto into JS