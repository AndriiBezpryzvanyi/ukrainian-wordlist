#!/usr/bin/env node
// Verifies a VERSION change is a valid MINOR or MAJOR bump (or no change at all).
// PATCH bumps must not be committed manually — they happen automatically on merge.
//
// usage: node scripts/check-version-bump.mjs <old> <new>

const [, , oldV, newV] = process.argv;
if (!oldV || !newV) {
  console.error("usage: check-version-bump.mjs <old> <new>");
  process.exit(2);
}

const parse = (v, label) => {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
  if (!m) {
    console.error(`✗ ${label} version "${v}" is not valid SemVer (MAJOR.MINOR.PATCH)`);
    process.exit(2);
  }
  return m.slice(1, 4).map(Number);
};

const [oM, on, op] = parse(oldV, "old");
const [nM, nn, np] = parse(newV, "new");

if (oldV === newV) {
  console.log(`✓ VERSION unchanged (${oldV}) — PATCH bump will be applied automatically on merge`);
  process.exit(0);
}

if (nM === oM + 1 && nn === 0 && np === 0) {
  console.log(`✓ MAJOR bump: ${oldV} → ${newV}`);
  process.exit(0);
}

if (nM === oM && nn === on + 1 && np === 0) {
  console.log(`✓ MINOR bump: ${oldV} → ${newV}`);
  process.exit(0);
}

console.error(`✗ Invalid VERSION change: ${oldV} → ${newV}`);
console.error("Only MINOR (X.Y+1.0) or MAJOR (X+1.0.0) bumps may be committed manually.");
console.error("PATCH bumps happen automatically after a PR is merged into main.");
process.exit(1);
