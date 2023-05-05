# Obsidian Core

[![Lint and test](https://github.com/wanadev/obsidian-core/actions/workflows/tests.yml/badge.svg)](https://github.com/wanadev/obsidian-core/actions/workflows/tests.yml)
[![NPM Version](http://img.shields.io/npm/v/obsidian-core.svg?style=flat)](https://www.npmjs.com/package/obsidian-core)
[![License](http://img.shields.io/npm/l/obsidian-core.svg?style=flat)](https://github.com/wanadev/obsidian-core/blob/master/LICENSE)
[![Discord](https://img.shields.io/badge/chat-Discord-8c9eff?logo=discord&logoColor=ffffff)](https://discord.gg/BmUkEdMuFp)

> Miscellaneous libraries related to Obsidian projects...


## Install

    npm install obsidian-core

## Contributing

### Questions

If you have any question, you can:

* [Open an issue on GitHub][gh-issue]
* [Ask on discord][discord]

### Bugs

If you found a bug, please [open an issue on Github][gh-issue] with as much information as possible.

### Pull Requests

Please consider [filing a bug][gh-issue] before starting to work on a new feature. This will allow us to discuss the best way to do it. This is of course not necessary if you just want to fix some typo or small errors in the code.

### Coding Style / Lint

To check coding style, run the follwoing command:

    npx grunt jshint

### Tests

Tu run tests, use the following command:

    npx grunt test


[gh-issue]: https://github.com/wanadev/obsidian-core/issues
[discord]: https://discord.gg/BmUkEdMuFp


## Changelog

* **[NEXT]** (changes on master that have not been released yet):

    * Nothing yet ;)

* **v1.4.1:**

    * Updated dependencies (@jbghoul, #44)
    * Replaced deprecated mocha-phantomjs by mocha-headless-chrome to run tests (@jbghoul, #44)
