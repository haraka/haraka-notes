# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/).

### Unreleased

### [1.1.3] - 2026-05-19

- fix(security): reject prototype path segments to prevent prototype pollution
- fix: warn when overwriting a falsy intermediate value
- fix: clone array path arguments so callers' arrays are not mutated
- fix: throw a descriptive `TypeError` for non-string/array paths
- doc: README `onlyIfUndefined` → `onlyWhenUndefined`

### [1.1.2] - 2026-05-18

- change: test runnner is now node:test

### [1.1.1] - 2025-01-13

- dep(eslint): upgrade to v9

### [1.1.0] - 2024-05-03

- set: added 'default' mode. See docs. #

### [1.0.7] - 2024-04-08

- use `[files]` in package.json. Delete .npmignore.
- doc: Changes -> CHANGELOG
- ci: more shared workflows
- lint: remove duplicate / stale rules from .eslintrc

### [1.0.6] - 2022-05-27

- chore(ci): depend on shared GHA workflows

### 1.0.5 - 2022-01-26

- feat: make it possible to set a false value
- chore(ci): bump lowest node.js version to 14

### [1.0.4] - 2021-02-04

- CI: replace Travis & AppVeyor with GitHub actions
- CI: automatically publish upon release.

### 1.0.3 - 2020-03-23

- bump packaging versions
- remove package-lock.json
- codeclimate: moved functions out of constructor

### 1.0.2 - 2017-09-07

- if an object is passed in, populate the notes with it

### 1.0.1 - 2017-09-04

- initial release

[1.0.4]: https://github.com/haraka/haraka-notes/releases/tag/1.0.4
[1.0.6]: https://github.com/haraka/haraka-notes/releases/tag/1.0.6
[1.0.7]: https://github.com/haraka/haraka-notes/releases/tag/v1.0.7
[1.1.0]: https://github.com/haraka/haraka-notes/releases/tag/v1.1.0
[1.1.1]: https://github.com/haraka/haraka-notes/releases/tag/v1.1.1
[1.1.2]: https://github.com/haraka/haraka-notes/releases/tag/v1.1.2
[1.1.3]: https://github.com/haraka/haraka-notes/releases/tag/v1.1.3
