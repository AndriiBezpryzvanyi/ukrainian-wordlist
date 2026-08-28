# Contributing

Thank you for helping build this wordlist! The rules are simple.

## What we accept

- **Nouns** and **adjectives** (for now).
- **Lemmas (base forms):**
  - noun — nominative singular (`книга`, not `книги`);
  - adjective — nominative singular masculine (`великий`, not `велика`).
- Unambiguous, commonly used words.

## What we do NOT accept

- Russianisms, surzhyk.
- Proper nouns (names, place names, brands).
- Archaic, narrowly dialectal, or slang words.
- Words with unclear spelling or meaning.
- Duplicates (check that the word is not already there).

## Entry format

One line = one word (JSONL). Files are split by the first letter of the lemma: `words/а.jsonl`, `words/б.jsonl`, etc.

**Noun:**
```json
{"word":"книга","pos":["noun"],"gender":"fem","tags":["object"]}
```

**Adjective:**
```json
{"word":"великий","pos":["adj"],"tags":["size"]}
```

**Word that is both noun and adjective** (e.g. «черговий»):
```json
{"word":"черговий","pos":["noun","adj"],"gender":"masc","tags":["person"]}
```

### Fields

| Field | Required | Value |
|-------|----------|-------|
| `word` | yes | lemma, lowercase, Ukrainian letters only (`'` and `-` allowed) |
| `pos` | yes | array of: `"noun"`, `"adj"` |
| `gender` | for nouns only | `"masc"`, `"fem"`, `"neut"` |
| `tags` | yes, non-empty | only tags listed in [`tags.json`](tags.json) |

### Tags

Allowed tags live in [`tags.json`](tags.json). If a tag you need is missing — add it in the same PR and briefly explain why.

## Validate before opening a PR

```bash
node scripts/validate.mjs
```

The validator checks:
- every required field is present and non-empty;
- the word is placed in the correct file (by first letter);
- every tag exists in `tags.json`;
- no duplicates;
- the set of files in `words/` matches the Ukrainian alphabet exactly (one file per letter, `ь` excluded) — new files may not be added and existing ones may not be deleted.

## Editor warnings about "confusable" characters

Some editors flag Cyrillic letters like `а`, `о`, `р` as "confusable with ASCII" (this is a security feature meant for source code, not for text data). This repo ships configs that silence these warnings:

- **VSCode / Cursor / Windsurf / VSCodium** — see [.vscode/settings.json](.vscode/settings.json).
- **JetBrains IDEs** (WebStorm, IntelliJ, PyCharm, GoLand, Rider) — see [.idea/inspectionProfiles/Project_Default.xml](.idea/inspectionProfiles/Project_Default.xml).
- **Other editors** (Sublime, Vim, Zed, Emacs, …) — no standard mechanism exists. Disable the corresponding lint/spellcheck manually if needed.

## Do not edit `VERSION`

The [VERSION](VERSION) file is managed automatically. When your PR is merged, CI bumps the PATCH number and creates a `vX.Y.Z` tag. Any manual PATCH edit in a PR will be rejected by CI. MINOR and MAJOR bumps are reserved for the maintainer.

## PR style

- One PR = one topic (one letter / one theme). Easier to review.
- In the description: how many words added and the source (if any).
