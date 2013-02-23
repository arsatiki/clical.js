To contribute, pick an issue or look through the source code. Then mail me a patch or file a pull request.

Before you do that, please read Goals and Practices sections below.

Goals
=====

For the 1.0 release, the purpose is to replicate the functionality of the original Clical. Well, up to a point anyway. The browser is a different environment to 286 computers of the last millennium.

Also, there is no immediate need to add any server backends for persistence. Saving and loading data can be done with localStorage at first.

After 1.0, extensions and radically new features such as visualization may be included.

Version numbers
---------------

We'll follow the [semantic versioning][semver] approach. In a nutshell:
* three-component version numbers: major.minor.patch
* bugfixes increment patch number
* new features increment minor version
* backwards incompatible modifications increment major version

These rules don't apply to 0.x.y versions, but we'll try to stick with them anyway.

[semver]: http://semver.org/

Practices
=========

Before 1.0, let's KEEP IT SIMPLE.

Prefer naive algorithms over fancier ones, if the only benefit is performance. First we make it work, then make it nice.

Avoid dependencies. Managing dependencies is like looking after kids; if they're not yours, you must really really like them. Only add dependencies, which give you significant leverage with regard to features. Do not add convinience dependencies, at least until the pain of inconvinience has grown too great.

Do not add dependencies to pre-1.0 software.

Syntax
------

- tabs are tabs
- camelCase names

Development
-----------

The development environment for the Javascript libraries requires Node and
npm. After installing those, run

    npm link
    npm -s test (or npm config set loglevel silent)

Tests go to tests subdirectory.

Reference
=========

Library documentation
---------------------

- nodeunit: https://github.com/caolan/nodeunit#readme
- MathJax: http://docs.mathjax.org/en/latest/
