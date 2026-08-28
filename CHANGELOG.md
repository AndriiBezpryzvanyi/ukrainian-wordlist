# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

While the project is at `0.x`, the data schema is considered unstable and may change without a major version bump.

## [Unreleased]

## [0.1.0] — 2026-08-28

### Added
- Initial wordlist structure: nouns and adjectives split into per-letter JSONL files (`words/а.jsonl` … `words/я.jsonl`, `ь` excluded).
- Controlled tag vocabulary in `tags.json`.
- Validator (`scripts/validate.mjs`) checking JSON schema, required fields, apostrophe form (U+2019), duplicates, tags, and the fixed set of alphabet files.
- GitHub Action running the validator on PRs and pushes to `main`.
- Editor configs to silence "confusable characters" warnings (VSCode, JetBrains).

[Unreleased]: https://github.com/AndriiBezpryzvanyi/ukrainian-wordlist/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/AndriiBezpryzvanyi/ukrainian-wordlist/releases/tag/v0.1.0
