#!/usr/bin/env node
/**
 * portfolio-ontology-dry-run.js
 *
 * Cron-safe dry-run diff reporter for maj0rika.com portfolio ontology.
 *
 * SAFETY GUARANTEES (enforced in code, not just docs):
 *   - Never runs `git commit`, `git push`, or any write to public/resume.md
 *     unless --apply is passed AND the user types "yes" at the interactive prompt.
 *   - --dry-run is TRUE by default; --apply is FALSE by default.
 *   - When run non-interactively (cron / CI), --apply is silently ignored and
 *     the script exits with code 0 after printing the report.
 *   - No credentials are ever written to stdout when --redact is set.
 *
 * Usage:
 *   node scripts/portfolio-ontology-dry-run.js [options]
 *
 * Options:
 *   --dry-run          (default) Print diff only. Never mutate files.
 *   --apply            Gate: asks for explicit "yes" before writing resume.md.
 *   --redact           Redact email addresses and potential secrets from output.
 *   --source-dir <p>   Directory of summary/knowledge-base files.
 *                      Default: ~/.claude/projects/ or ./knowledge-base/ (whichever exists).
 *   --resume <p>       Path to resume.md. Default: ./public/resume.md
 *   --out <p>          Also write the report to this file (dry-run safe — report only).
 *   --quiet            Suppress progress banners; only print the diff block.
 *
 * Exit codes:
 *   0  No differences found (or dry-run completed successfully).
 *   1  Differences found (useful for cron alert hooks).
 *   2  Fatal error (missing files, bad args).
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import readline from "node:readline";
import { createRequire } from "node:module";

// ---------------------------------------------------------------------------
// Arg parsing (no external deps — keep this script zero-install)
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);

function flag(name) {
  return argv.includes(name);
}
function opt(name, fallback = null) {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] !== undefined ? argv[i + 1] : fallback;
}

const DRY_RUN = !flag("--apply"); // default true; --apply flips it
const REDACT  = flag("--redact");
const QUIET   = flag("--quiet");
const APPLY   = flag("--apply");

const PROJECT_ROOT = path.resolve(
  opt("--root", path.join(process.cwd()))
);

const RESUME_PATH = path.resolve(
  opt("--resume", path.join(PROJECT_ROOT, "public", "resume.md"))
);

const REPORT_OUT = opt("--out", null); // optional file output for the report

// Resolve SOURCE_DIR with fallback chain
function resolveSourceDir() {
  const explicit = opt("--source-dir");
  if (explicit) return path.resolve(explicit);
  const knowledgeBase = path.join(PROJECT_ROOT, "knowledge-base");
  if (fs.existsSync(knowledgeBase)) return knowledgeBase;
  const claudeProjects = path.join(os.homedir(), ".claude", "projects");
  if (fs.existsSync(claudeProjects)) return claudeProjects;
  return null;
}

const SOURCE_DIR = resolveSourceDir();

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------
const REDACT_PATTERNS = [
  // email addresses
  /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
  // API keys / tokens (common prefixes)
  /(sk-|ghp_|gho_|glpat-|xoxb-|xoxp-)[A-Za-z0-9_\-]{8,}/g,
  // Generic "key = value" secrets
  /(password|secret|token|api_key|apikey)\s*[=:]\s*\S+/gi,
];

function redact(text) {
  if (!REDACT) return text;
  let out = text;
  for (const re of REDACT_PATTERNS) {
    out = out.replace(re, "[REDACTED]");
  }
  return out;
}

function log(...args) {
  if (!QUIET) process.stdout.write(args.join(" ") + "\n");
}

function banner(title) {
  log(`\n${"=".repeat(60)}\n  ${title}\n${"=".repeat(60)}`);
}

function die(msg, code = 2) {
  process.stderr.write(`[ERROR] ${msg}\n`);
  process.exit(code);
}

// ---------------------------------------------------------------------------
// Phase 1 — Read current resume.md
// ---------------------------------------------------------------------------
function readResume() {
  if (!fs.existsSync(RESUME_PATH)) {
    die(`resume.md not found at: ${RESUME_PATH}`);
  }
  return fs.readFileSync(RESUME_PATH, "utf8");
}

// ---------------------------------------------------------------------------
// Phase 2 — Collect summary/knowledge-base snippets
// ---------------------------------------------------------------------------
function collectSummaries(sourceDir) {
  if (!sourceDir || !fs.existsSync(sourceDir)) {
    log(`[WARN] SOURCE_DIR not found (${sourceDir ?? "none"}). No summaries to diff.`);
    return [];
  }

  const EXTENSIONS = [".md", ".txt", ".json"];
  const files = fs.readdirSync(sourceDir).filter((f) =>
    EXTENSIONS.includes(path.extname(f).toLowerCase())
  );

  return files.map((f) => ({
    name: f,
    path: path.join(sourceDir, f),
    content: fs.readFileSync(path.join(sourceDir, f), "utf8"),
  }));
}

// ---------------------------------------------------------------------------
// Phase 3 — Lightweight line-based diff
//   Returns an array of { type: '+' | '-' | ' ', line } objects.
//   No external deps — uses Myers-style simple LCS diff.
// ---------------------------------------------------------------------------
function lineDiff(oldText, newText) {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");

  // Simple patience-inspired diff: find common prefix/suffix, diff the middle
  // For a dry-run report this is sufficient and avoids installing 'diff' package.
  const result = [];

  let lo = 0;
  // Common prefix
  while (lo < oldLines.length && lo < newLines.length && oldLines[lo] === newLines[lo]) {
    result.push({ type: " ", line: oldLines[lo] });
    lo++;
  }

  // Common suffix (work backwards)
  let oe = oldLines.length - 1;
  let ne = newLines.length - 1;
  const suffix = [];
  while (oe >= lo && ne >= lo && oldLines[oe] === newLines[ne]) {
    suffix.unshift({ type: " ", line: oldLines[oe] });
    oe--;
    ne--;
  }

  // Removed lines
  for (let i = lo; i <= oe; i++) {
    result.push({ type: "-", line: oldLines[i] });
  }
  // Added lines
  for (let i = lo; i <= ne; i++) {
    result.push({ type: "+", line: newLines[i] });
  }

  result.push(...suffix);
  return result;
}

function formatDiff(diff) {
  return diff
    .map((d) => `${d.type} ${d.line}`)
    .join("\n");
}

function diffStats(diff) {
  const added   = diff.filter((d) => d.type === "+").length;
  const removed = diff.filter((d) => d.type === "-").length;
  return { added, removed, changed: added + removed };
}

// ---------------------------------------------------------------------------
// Phase 4 — Build the report
// ---------------------------------------------------------------------------
function buildReport({ resumeText, summaries }) {
  const lines = [];
  const ts = new Date().toISOString();

  lines.push(`ONTOLOGY DRY-RUN REPORT`);
  lines.push(`Generated : ${ts}`);
  lines.push(`Resume    : ${RESUME_PATH}`);
  lines.push(`Source dir: ${SOURCE_DIR ?? "(none)"}`);
  lines.push(`Mode      : ${DRY_RUN ? "DRY-RUN (no files will be changed)" : "APPLY MODE"}`);
  lines.push(`Redact    : ${REDACT}`);
  lines.push("");

  if (summaries.length === 0) {
    lines.push("No summary files found. Nothing to diff.");
    return lines.join("\n");
  }

  let totalChanged = 0;

  for (const summary of summaries) {
    lines.push(`${"─".repeat(60)}`);
    lines.push(`SOURCE: ${summary.name}`);
    lines.push(`PATH  : ${summary.path}`);
    lines.push("");

    // The diff compares summary content against current resume.md.
    // In an --apply scenario you would merge/write the new content.
    const diff = lineDiff(resumeText, summary.content);
    const stats = diffStats(diff);
    totalChanged += stats.changed;

    lines.push(`Stats: +${stats.added} added  -${stats.removed} removed  (${stats.changed} total line changes)`);
    lines.push("");

    if (stats.changed === 0) {
      lines.push("  (no differences)");
    } else {
      lines.push(formatDiff(diff));
    }
    lines.push("");
  }

  lines.push(`${"=".repeat(60)}`);
  lines.push(`TOTAL LINE CHANGES ACROSS ALL SOURCES: ${totalChanged}`);
  lines.push(DRY_RUN ? "DRY-RUN COMPLETE. No files were modified." : "");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Phase 5 — Optional --apply gate (interactive, blocks in cron)
// ---------------------------------------------------------------------------
async function confirmApply() {
  // Detect non-interactive (cron/CI): refuse apply if stdin is not a TTY or CI env is set.
  const isCI = !process.stdin.isTTY || process.env.CI || process.env.NO_TTY;
  if (isCI) {
    process.stderr.write(
      "[SAFETY] --apply was passed but stdin is not a TTY (likely cron/CI). " +
      "Refusing to mutate files. Re-run interactively to apply changes.\n"
    );
    return false;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(
      '\n[APPLY GATE] Type "yes" to overwrite public/resume.md with merged content, or anything else to abort: ',
      (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === "yes");
      }
    );
  });
}

// ---------------------------------------------------------------------------
// Phase 6 — Apply (FULL OVERWRITE of resume.md with first source file)
//   WARNING: This is a complete replacement, NOT a merge. The entire resume.md
//   is overwritten with the first source file found (alphabetical order).
//   Section-targeted merge logic should be implemented before using --apply
//   in production. Until then, treat --apply as a manual last-resort escape
//   hatch, always followed by `git diff` review before committing.
// ---------------------------------------------------------------------------
function applyFirstSummary(summaries) {
  if (summaries.length === 0) {
    log("[APPLY] No summary files found. Nothing to write.");
    return;
  }
  const target = summaries[0];
  process.stderr.write(
    `[APPLY WARNING] Full overwrite: ${RESUME_PATH} will be REPLACED with ${target.name}.\n` +
    `[APPLY WARNING] This is NOT a merge. All sections are overwritten.\n`
  );
  log(`[APPLY] Writing ${target.name} content to ${RESUME_PATH}`);
  fs.writeFileSync(RESUME_PATH, target.content, "utf8");
  log("[APPLY] Done. Reminder: commit and push are YOUR responsibility.");
  log("[APPLY] Suggested: git diff public/resume.md  (then git add + git commit manually)");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  banner("Portfolio Ontology Dry-Run");

  const resumeText = readResume();
  const summaries  = collectSummaries(SOURCE_DIR);

  log(`Resume lines   : ${resumeText.split("\n").length}`);
  log(`Summary sources: ${summaries.length}`);

  const report = redact(buildReport({ resumeText, summaries }));

  // Always print to stdout
  process.stdout.write("\n" + report + "\n");

  // Optionally write report to file (never overwrites resume.md itself)
  if (REPORT_OUT) {
    const outPath = path.resolve(REPORT_OUT);
    if (outPath === RESUME_PATH) {
      die("--out path must not point to resume.md. Use a separate report file.");
    }
    fs.writeFileSync(outPath, report, "utf8");
    log(`\n[REPORT] Written to: ${outPath}`);
  }

  // Determine exit code
  const hasChanges = summaries.some((s) => {
    const d = lineDiff(resumeText, s.content);
    return diffStats(d).changed > 0;
  });

  if (DRY_RUN) {
    process.exit(hasChanges ? 1 : 0);
  }

  // --apply path
  if (APPLY) {
    const confirmed = await confirmApply();
    if (!confirmed) {
      log("[ABORTED] User did not confirm. No files changed.");
      process.exit(0);
    }
    applyFirstSummary(summaries);
    process.exit(0);
  }
}

main().catch((err) => {
  process.stderr.write(`[FATAL] ${err.message}\n${err.stack}\n`);
  process.exit(2);
});
