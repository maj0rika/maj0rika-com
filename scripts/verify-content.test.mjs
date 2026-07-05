#!/usr/bin/env node
// scripts/verify-content.test.mjs
//
// Adversarial self-test for verify-content.mjs. Proves the gate (a) passes the
// real tree and (b) actually BITES when a locked fact / forbidden phrase / anchor
// / a11y string / date stamp is broken.
//
// It NEVER mutates the real source: it copies the allowlisted files + the verifier
// into a throwaway OS-temp fixture, mutates the COPY, runs the verifier there as a
// child process, and asserts on its --json output. Zero writes inside the repo.
//
// Run:  node scripts/verify-content.test.mjs   (exit 0 = all assertions passed)

import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const SELF = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SELF, "..");
const COPY = [
  "package.json",
  "index.html",
  "src/App.tsx",
  "src/components/Hero.tsx",
  "src/components/Swoosh.tsx",
  "src/styles.css",
  "public/resume.html",
  "public/resume.md",
  "scripts/verify-content.mjs",
];

function freshFixture() {
  const dir = mkdtempSync(join(tmpdir(), "maj0rika-verify-"));
  for (const rel of COPY) {
    const dest = join(dir, rel);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(join(ROOT, rel), dest);
  }
  return dir;
}

function runVerify(dir, args = []) {
  try {
    const stdout = execFileSync("node", [join(dir, "scripts/verify-content.mjs"), "--json", ...args], { encoding: "utf8" });
    return JSON.parse(stdout);
  } catch (e) {
    // non-zero exit still prints JSON to stdout
    return JSON.parse(e.stdout);
  }
}

function mutate(dir, rel, fn) {
  const p = join(dir, rel);
  const before = readFileSync(p, "utf8");
  const after = fn(before);
  if (after === before) throw new Error(`mutation no-op for ${rel} — fixture text drifted`);
  writeFileSync(p, after);
}

function hasError(report, id) {
  return report.results.some((r) => r.id === id && r.status === "error");
}

// --- test definitions -------------------------------------------------------
let pass = 0, fail = 0;
const failures = [];
function expect(name, cond) {
  if (cond) { pass++; }
  else { fail++; failures.push(name); }
}

// 0. Baseline: the real tree must pass clean.
{
  const dir = freshFixture();
  try {
    const r = runVerify(dir);
    expect("baseline passes (ok:true)", r.ok === true);
    expect("baseline has zero errors", r.summary.errors === 0);
    const strict = runVerify(dir, ["--strict"]);
    expect("strict baseline has zero errors", strict.summary.errors === 0);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

// Each mutation: {name, file, fn, id} — after mutating, `id` must be an error.
const MUTATIONS = [
  { name: "KPI cross-wire (329 → 계정)", file: "src/App.tsx",
    fn: (s) => s.replace("329개 워크스페이스", "329개 계정"), id: "facts.crosswire.agent.workspaces" },
  { name: "KPI number deleted (10,393)", file: "src/App.tsx",
    fn: (s) => s.replace("10,393", "10393999"), id: "facts.platform.accounts" },
  { name: "KPI inflation (2,700+ 워크스페이스)", file: "public/resume.md",
    fn: (s) => s.replace("## Education", "운영 규모 2,700+ 워크스페이스\n\n## Education"), id: "facts.no_inflation" },
  { name: 'forbidden "혼자"', file: "src/App.tsx",
    fn: (s) => s.replace("프론트엔드를 단독으로 담당", "혼자 프론트엔드를 담당"), id: "forbidden.copy" },
  { name: 'forbidden "AI magic"', file: "public/resume.md",
    fn: (s) => s.replace("## Skills", "## AI magic\n\n## Skills"), id: "forbidden.copy" },
  { name: "anchor id renamed (builds)", file: "src/App.tsx",
    fn: (s) => s.replace('id="builds"', 'id="builds-x"'), id: "anchors.section_ids" },
  { name: "orphan nav link", file: "src/components/Hero.tsx",
    fn: (s) => s.replace('href="#builds"', 'href="#nope"'), id: "anchors.no_orphan_links" },
  { name: "mascot gains non-empty alt", file: "src/components/Hero.tsx",
    fn: (s) => s.replace('alt=""', 'alt="마조리카 개구리"'), id: "a11y.mascot_decorative" },
  { name: "pause control loses aria-pressed", file: "src/components/Hero.tsx",
    fn: (s) => s.replace("aria-pressed={userPaused}", "data-pressed={userPaused}"), id: "a11y.pause_control" },
  { name: "html lang flipped to en", file: "index.html",
    fn: (s) => s.replace('<html lang="ko">', '<html lang="en">'), id: "a11y.html_lang" },
  { name: "focus outline removed", file: "src/styles.css",
    fn: (s) => s.replace("outline: 2px dashed var(--color-ink);", "outline: none;"), id: "a11y.css_hooks" },
  { name: "malformed date stamp (1-digit month)", file: "src/App.tsx",
    fn: (s) => s.replace('title="공개 실험"', 'title="공개 실험" updated="2026.5"'), id: "dates.stamp_format" },
  // multi-file: break a KPI in resume.html (not App) to exercise the per-file loop
  { name: "KPI broken in resume.html (2,767)", file: "public/resume.html",
    fn: (s) => s.replace("2,767", "2767000"), id: "facts.platform.workspaces" },
  // inflation by appending "+" to the REAL locked number
  { name: "inflation on real number (2,767+)", file: "src/App.tsx",
    fn: (s) => s.replace("2,767 워크스페이스", "2,767+ 워크스페이스"), id: "facts.no_inflation" },
];

for (const m of MUTATIONS) {
  const dir = freshFixture();
  try {
    mutate(dir, m.file, m.fn);
    const r = runVerify(dir);
    expect(`catches: ${m.name} → ${m.id}`, hasError(r, m.id));
  } catch (e) {
    fail++; failures.push(`${m.name} (harness error: ${e.message})`);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

// Benign edits that must NOT trigger a given error (false-positive guards).
const NEGATIVES = [
  { name: "data-updated attr is not a date stamp", file: "src/App.tsx",
    fn: (s) => s.replace('id="bizagent"', 'id="bizagent" data-updated="build-1234"'), notId: "dates.stamp_format" },
  { name: "dynamic updated={expr} is skipped (not a literal)", file: "src/App.tsx",
    fn: (s) => s.replace('title="공개 실험"', 'title="공개 실험" updated={meta}'), notId: "dates.stamp_format" },
  { name: "html lang with extra dir attr stays valid", file: "index.html",
    fn: (s) => s.replace('<html lang="ko">', '<html lang="ko" dir="ltr">'), notId: "a11y.html_lang" },
  { name: "resume <main> attribute reorder stays valid", file: "public/resume.html",
    fn: (s) => s.replace('<main id="resume-main" tabindex="-1">', '<main tabindex="-1" id="resume-main">'), notId: "a11y.skip_link.resume" },
];

for (const m of NEGATIVES) {
  const dir = freshFixture();
  try {
    mutate(dir, m.file, m.fn);
    const r = runVerify(dir);
    expect(`ignores (no false positive): ${m.name} → !${m.notId}`, !hasError(r, m.notId));
  } catch (e) {
    fail++; failures.push(`${m.name} (harness error: ${e.message})`);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

// --- report -----------------------------------------------------------------
console.log(`\nverify-content self-test: ${pass} passed, ${fail} failed`);
if (fail) {
  console.log("FAILED:");
  for (const f of failures) console.log("  ✗ " + f);
  process.exit(1);
}
console.log("✓ gate passes the real tree and bites every injected regression");
process.exit(0);
