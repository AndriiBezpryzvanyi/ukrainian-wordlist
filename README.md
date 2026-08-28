# ukrainian-wordlist

[![Validate wordlist](https://github.com/AndriiBezpryzvanyi/ukrainian-wordlist/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/AndriiBezpryzvanyi/ukrainian-wordlist/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An open, community-maintained wordlist of Ukrainian words with part-of-speech marks and thematic tags — a shared source of Ukrainian vocabulary for word games, NLP, education, and any project that needs it.

## What's inside

- **Base forms (lemmas)** of nouns and adjectives.
- No Russianisms, surzhyk, or ambiguous words.
- **No proper nouns** (names, place names, brands) and **no abbreviations**.
- Data lives in [`words/`](words/), split by first letter (`words/а.jsonl`, `words/б.jsonl`, …).

## File conventions

- **Format:** plain text, one word per line ([JSONL](https://jsonlines.org/)).
- **Encoding:** UTF-8 **without BOM**.
- **Line endings:** LF (`\n`), not CRLF.

## Apostrophe

Ukrainian uses an apostrophe in words like `бур’ян`, `м’ясо`, `п’ять`.

**Use only `’` — U+2019 (RIGHT SINGLE QUOTATION MARK).**

These are **not accepted** and will fail validation:

| Character | Codepoint | Name |
|-----------|-----------|------|
| `'` | U+0027 | APOSTROPHE (typewriter / ASCII) |
| `ʼ` | U+02BC | MODIFIER LETTER APOSTROPHE |

One consistent form keeps the wordlist searchable and joinable across projects.

## Entry format

```json
{"word":"книга","pos":["noun"],"gender":"fem","tags":["object"]}
{"word":"великий","pos":["adj"],"tags":["size"]}
{"word":"черговий","pos":["noun","adj"],"gender":"masc","tags":["person"]}
```

Full field rules — see [CONTRIBUTING.md](CONTRIBUTING.md). Allowed tags — see [tags.json](tags.json).

## Validate

```bash
node scripts/validate.mjs
```

## Versioning

The current version lives in the [VERSION](VERSION) file and follows [Semantic Versioning](https://semver.org/):

- **PATCH** — words added, tags added, typo fixes. **Bumped automatically** on every merge to `main`.
- **MINOR** — additive schema changes (new field, new part of speech). Bumped manually by the maintainer.
- **MAJOR** — breaking schema changes. Bumped manually by the maintainer.

Contributors **do not edit `VERSION`**. Any attempt to bump PATCH in a PR is rejected by CI. Only the maintainer may edit `VERSION`, and only to perform a MINOR (`X.Y+1.0`) or MAJOR (`X+1.0.0`) bump.

Each release is tagged as `vX.Y.Z`. Notable changes are recorded in [CHANGELOG.md](CHANGELOG.md).

While the project is at `0.x`, the schema is considered unstable — expect changes without a major bump.

## Contributing

PRs are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before adding words.

## License

[MIT](LICENSE).
