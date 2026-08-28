#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORDS_DIR = join(ROOT, "words");
const TAGS_FILE = join(ROOT, "tags.json");
const VERSION_FILE = join(ROOT, "VERSION");

const ALLOWED_POS = new Set(["noun", "adj"]);
const ALLOWED_GENDER = new Set(["masc", "fem", "neut"]);
const UK_LETTER = /^[а-щьюяїієґА-ЩЬЮЯЇІЄҐ’\-]+$/;
const BAD_APOSTROPHES = { "'": "U+0027 (')", "ʼ": "U+02BC (ʼ)" };
const REQUIRED_FIELDS = ["word", "pos", "tags"];

// Ukrainian alphabet minus "ь" (there are no lemmas starting with a soft sign).
// This list is fixed — new files may not be added, existing files may not be deleted.
const ALPHABET = [
  "а","б","в","г","ґ","д","е","є","ж","з",
  "и","і","ї","й","к","л","м","н","о","п",
  "р","с","т","у","ф","х","ц","ч","ш","щ",
  "ю","я",
];
const EXPECTED_FILES = new Set(ALPHABET.map((l) => `${l}.jsonl`));

const allowedTags = new Set(JSON.parse(readFileSync(TAGS_FILE, "utf8")).tags);

let errors = 0;
const seen = new Map();

// VERSION file: exactly one line, SemVer.
if (!existsSync(VERSION_FILE)) {
  err("VERSION", "missing file — must contain a SemVer version string");
} else {
  const raw = readFileSync(VERSION_FILE, "utf8");
  if (raw.replace(/\r?\n$/, "").includes("\n")) {
    err("VERSION", "must contain exactly one line");
  }
  const version = raw.trim();
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    err("VERSION", `"${version}" is not a valid SemVer version (expected MAJOR.MINOR.PATCH)`);
  }
}

const actualFiles = new Set(readdirSync(WORDS_DIR));
for (const file of [...actualFiles].sort()) {
  if (!EXPECTED_FILES.has(file)) {
    err(`words/${file}`, "unexpected file — allowed files are exactly one per Ukrainian letter (ь excluded); do not add new files");
  }
}
for (const file of [...EXPECTED_FILES].sort()) {
  if (!actualFiles.has(file)) {
    err(`words/${file}`, "missing file — wordlist files must not be deleted");
  }
}

for (const file of [...EXPECTED_FILES].sort()) {
  const path = join(WORDS_DIR, file);
  if (!existsSync(path)) continue;
  const expectedLetter = file.replace(/\.jsonl$/, "").toLowerCase();
  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  lines.forEach((line, i) => {
    if (!line.trim()) return;
    const loc = `${file}:${i + 1}`;

    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      return err(loc, "invalid JSON");
    }

    for (const f of REQUIRED_FIELDS) {
      if (!(f in entry)) return err(loc, `missing field "${f}"`);
    }

    const { word, pos, gender, tags } = entry;

    if (typeof word !== "string" || word.length === 0) return err(loc, `"word" must be a non-empty string`);
    for (const [ch, label] of Object.entries(BAD_APOSTROPHES)) {
      if (word.includes(ch)) return err(loc, `"${word}": wrong apostrophe ${label} — use ’ (U+2019)`);
    }
    if (!UK_LETTER.test(word)) return err(loc, `"${word}": non-Ukrainian characters`);
    if (word !== word.toLowerCase()) return err(loc, `"${word}": must be lowercase`);
    if (word[0] !== expectedLetter) return err(loc, `"${word}" does not belong to ${file}`);

    if (!Array.isArray(pos) || pos.length === 0) return err(loc, `"${word}": "pos" must be a non-empty array`);
    for (const p of pos) {
      if (!ALLOWED_POS.has(p)) return err(loc, `"${word}": unknown pos "${p}"`);
    }

    const isNoun = pos.includes("noun");
    if (isNoun) {
      if (!ALLOWED_GENDER.has(gender)) {
        return err(loc, `"${word}": noun must have "gender" (masc/fem/neut)`);
      }
    } else if (gender !== undefined) {
      return err(loc, `"${word}": "gender" is only allowed for nouns`);
    }

    if (!Array.isArray(tags) || tags.length === 0) return err(loc, `"${word}": "tags" must be a non-empty array`);
    for (const t of tags) {
      if (typeof t !== "string" || t.length === 0) return err(loc, `"${word}": empty tag`);
      if (!allowedTags.has(t)) return err(loc, `"${word}": unknown tag "${t}" (add it to tags.json)`);
    }

    const key = `${word}|${[...pos].sort().join(",")}`;
    if (seen.has(key)) return err(loc, `duplicate "${word}" (already at ${seen.get(key)})`);
    seen.set(key, loc);
  });
}

function err(loc, msg) {
  errors++;
  console.error(`✗ ${loc}: ${msg}`);
}

if (errors) {
  console.error(`\n${errors} error(s)`);
  process.exit(1);
} else {
  console.log(`✓ Validated ${seen.size} words — all good`);
}
