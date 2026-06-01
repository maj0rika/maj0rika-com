#!/usr/bin/env node
// scripts/verify-content.mjs
//
// Content-integrity gate for maj0rika.com. Static, zero-dependency, read-only.
// Catches the regressions a daily "ontology -> portfolio update" agent is most
// likely to introduce BEFORE build/deploy: broken locked facts, mixed-up KPI
// numbers, forbidden marketing copy, anchor-id regressions, accessibility-string
// regressions, and malformed/missing date stamps.
//
// Design goals (see docs/portfolio-update-checklist.md):
//   - Node built-ins ONLY. No deps, no network, no writes, no shelling out.
//   - Reads ONLY the fixed file allowlist below (never .env, secrets, or git).
//   - Deterministic. Exit 0 = ok, exit 1 = error (or operational failure).
//   - WARN never fails the build; --strict upgrades the conditional date WARNs.
//   - Zero false positives on a known-good tree (every ERROR check passes today).
//
// To add a rule: append one object to the CHECKS array (Zone B). Locked values
// live in Zone A. Engine (Zone C) and main (Zone D) rarely change.
//
// Usage:  node scripts/verify-content.mjs [--strict] [--json] [--quiet] [--no-color] [--help]

import { readFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const SELF_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SELF_DIR, ".."); // <root>/scripts/ -> <root>

// ───────────────────────────── Zone A — locked facts ─────────────────────────
// The ONLY files this script is allowed to read. No globbing, no discovery.
const FILES = Object.freeze({
  app: "src/App.tsx",
  hero: "src/components/Hero.tsx",
  swoosh: "src/components/Swoosh.tsx",
  resumeHtml: "public/resume.html",
  resumeMd: "public/resume.md",
  indexHtml: "index.html",
  stylesCss: "src/styles.css",
});
// styles.css carries 4 §6 a11y invariants (focus-visible, reduced-motion,
// .sr-only, .skip-link); it must exist, else those guards silently vanish.
const REQUIRED_FILES = Object.freeze(["app", "hero", "swoosh", "resumeHtml", "resumeMd", "indexHtml", "stylesCss"]);
// User-facing copy that carries the locked facts / forbidden-copy surface.
const CONTENT = Object.freeze(["app", "hero", "resumeHtml", "resumeMd"]);

// Locked KPI numbers. Agent (paid) numbers and Allibee platform (cumulative)
// numbers MUST stay separated — HANDOFF §4 ("두 숫자를 섞어 쓰지 말 것").
const KPI = Object.freeze([
  { id: "agent.workspaces", num: "329", unit: "워크스페이스", files: ["app", "hero", "resumeHtml", "resumeMd"] },
  { id: "agent.licenses", num: "495", unit: "라이선스", files: ["app", "hero", "resumeHtml", "resumeMd"] },
  // Platform totals live ONLY in the 본업 section + resume, never the Hero.
  { id: "platform.workspaces", num: "2,767", unit: "워크스페이스", files: ["app", "resumeHtml", "resumeMd"] },
  { id: "platform.accounts", num: "10,393", unit: "계정", files: ["app", "resumeHtml", "resumeMd"] },
]);
const KPI_UNITS = Object.freeze(["워크스페이스", "라이선스", "계정"]);

// Other locked content facts (verbatim public strings).
const LOCKED_FACTS = Object.freeze([
  { id: "education.gpa", needle: "4.2/4.5", files: ["app", "resumeHtml", "resumeMd"] },
  { id: "contact.email", needle: "neu5563@naver.com", files: ["app", "resumeHtml", "resumeMd"] },
  { id: "contact.github", needle: "@maj0rika", files: ["app", "resumeMd"] },
  { id: "contact.demo", needle: "demo.allibee.ai", files: ["app", "resumeHtml", "resumeMd"] },
]);

// Forbidden copy (ERROR). Reported by id only — never echo matched text.
const FORBIDDEN_ERROR = Object.freeze([
  { id: "passionate_dev", re: /열정적인\s*프론트엔드\s*개발자/ },
  { id: "ai_magic_ko", re: /마법\s*같은\s*AI|AI\s*마법/ },
  { id: "ai_magic_en", re: /\bAI\s+magic\b/i },
  { id: "ship_fast", re: /\bship\s+fast\b/i },
  { id: "crafting_beautiful", re: /crafting\s+beautiful\s+experiences/i },
  { id: "innovate_ux", re: /사용자\s*경험을\s*혁신하는/ },
  { id: "innovate_bare", re: /혁신하는/ },
  { id: "versatile_dev", re: /다재다능한\s*개발자/ },
  { id: "grow_together", re: /함께\s*성장하는/ },
  { id: "alone_honja", re: /혼자/ }, // L3: use "단독 담당" instead. No legit-substring collision in this domain.
]);
// Heuristic self-praise / vague copy (WARN — context can legitimize).
const FORBIDDEN_WARN = Object.freeze([
  { id: "adj_passion", re: /열정/ },
  { id: "adj_meticulous", re: /꼼꼼/ },
  { id: "adj_creative", re: /창의적/ },
  { id: "adj_versatile", re: /다재다능/ },
  { id: "vague_many_users", re: /많은\s*사용자/ },
  { id: "seniority_title", re: /\b(Senior|Lead|Principal)\s+(FE|Frontend|Engineer|Developer)\b/i },
]);

// Required in-page anchors. Grouped by DOM: App renders Hero, so nav links in
// Hero and section ids in App share one document.
const ANCHOR_GROUPS = Object.freeze([
  { id: "site", files: ["app", "hero"], requiredIds: ["top", "main-content", "bizagent", "workshop", "ops", "builds", "history", "knock"] },
  { id: "resume", files: ["resumeHtml"], requiredIds: ["resume-main"] },
]);

const MASCOT_ASSET = "/majorica-frog"; // official asset family (png/webp); never a hand-drawn SVG.
const DATE_STAMP_VALUE = /^(?:\d{4}\.(0[1-9]|1[0-2])|\d{4}-(0[1-9]|1[0-2])(?:-\d{2})?)$/; // YYYY.MM or YYYY-MM(-DD)
const DATE_TIME_VALUE = /^\d{4}-(0[1-9]|1[0-2])(?:-\d{2})?$/; // YYYY-MM(-DD) (the <time dateTime>)

// ───────────────────────────── Zone B — check registry ───────────────────────
// Each check: { id, title, severity:'error'|'warn', run(ctx) -> Finding[] }
// A Finding: { status:'error'|'warn', message, file?, line?, upgradable? }
// Empty array => the check passed (an implicit OK finding is synthesized).

const CHECKS = [
  // ---- facts ----
  ...KPI.map((k) => check(`facts.${k.id}`, `KPI ${k.num} ${k.unit} present & correctly paired`, "error", (ctx) => {
    const out = [];
    for (const key of k.files) {
      const f = ctx.files[key];
      if (!f) continue;
      if (!kpiPaired(f.stripped, k.num, k.unit)) {
        out.push(err(`locked number ${k.num} not tightly paired with "${k.unit}"`, f.path, lineOfNeedle(f, k.num)));
      }
    }
    return out;
  })),
  ...KPI.map((k) => check(`facts.crosswire.${k.id}`, `KPI ${k.num} never mislabeled`, "error", (ctx) => {
    const wrong = KPI_UNITS.filter((u) => u !== k.unit);
    const out = [];
    for (const key of k.files) {
      const f = ctx.files[key];
      if (!f) continue;
      const bad = kpiCrosswire(f.stripped, k.num, wrong);
      if (bad) out.push(err(`number ${k.num} appears tightly paired with wrong unit "${bad}"`, f.path, lineOfNeedle(f, k.num)));
    }
    return out;
  })),
  check("facts.no_inflation", "No KPI inflation (rounded 2,700+/10,000+ or locked-number+)", "error", (ctx) => {
    const out = [];
    const reEnd = /[\d,]*00\s*\+\s*(워크스페이스|계정|라이선스)/; // "N00+ 워크스페이스"
    const reStart = /(워크스페이스|계정|라이선스)\s*[\d,]*00\s*\+/; // "워크스페이스 N00+"
    const reLit = /(2,?700|10,?000)\s*\+/; // the explicitly-named lie
    // ...and appending "+" to a REAL locked number ("2,767+", "329+") is also inflation.
    const reLockedPlus = KPI.map((k) => new RegExp(escapeRe(k.num) + "\\s*\\+"));
    for (const key of CONTENT) {
      const f = ctx.files[key];
      if (!f) continue;
      for (const re of [reEnd, reStart, reLit, ...reLockedPlus]) {
        if (re.test(f.stripped)) { out.push(err("KPI inflation detected (HANDOFF §4 forbids merging/rounding the two number sets)", f.path)); break; }
      }
    }
    return out;
  }),
  ...LOCKED_FACTS.map((lf) => check(`facts.${lf.id}`, `Locked fact "${lf.id}" present`, "error", (ctx) => {
    const out = [];
    for (const key of lf.files) {
      const f = ctx.files[key];
      if (!f) continue;
      if (!f.raw.includes(lf.needle)) out.push(err(`expected locked fact "${lf.id}" missing`, f.path));
    }
    return out;
  })),

  // ---- forbidden copy ----
  check("forbidden.copy", "No forbidden marketing/voice phrases", "error", (ctx) => {
    const out = [];
    for (const key of CONTENT) {
      const f = ctx.files[key];
      if (!f) continue;
      for (const p of FORBIDDEN_ERROR) {
        const m = p.re.exec(f.raw);
        if (m) out.push(err(`forbidden phrase id "${p.id}" present`, f.path, lineOf(f.raw, m.index)));
      }
    }
    return out;
  }),
  check("forbidden.self_praise", "No self-adjectives / vague copy (review)", "warn", (ctx) => {
    const out = [];
    for (const key of CONTENT) {
      const f = ctx.files[key];
      if (!f) continue;
      for (const p of FORBIDDEN_WARN) {
        const m = p.re.exec(f.raw);
        if (m) out.push(warn(`possible self-praise/vague copy id "${p.id}" — review`, f.path, lineOf(f.raw, m.index)));
      }
    }
    return out;
  }),

  // ---- anchors ----
  check("anchors.section_ids", "Required section ids present", "error", (ctx) => {
    const out = [];
    for (const g of ANCHOR_GROUPS) {
      const ids = collectIds(ctx, g.files);
      for (const want of g.requiredIds) {
        if (!ids.has(want)) out.push(err(`required anchor id "${want}" missing (group: ${g.id})`, ctx.files[g.files[0]]?.path));
      }
    }
    return out;
  }),
  check("anchors.no_orphan_links", "Every in-page #link resolves to an id", "error", (ctx) => {
    const out = [];
    for (const g of ANCHOR_GROUPS) {
      const ids = collectIds(ctx, g.files);
      for (const key of g.files) {
        const f = ctx.files[key];
        if (!f) continue;
        for (const m of f.raw.matchAll(/href=(?:"#([\w-]+)"|'#([\w-]+)')/g)) {
          const target = m[1] || m[2];
          if (!ids.has(target)) out.push(err(`nav link "#${target}" has no matching id (group: ${g.id})`, f.path, lineOf(f.raw, m.index)));
        }
      }
    }
    return out;
  }),

  // ---- accessibility (current-passing WCAG items must not regress) ----
  check("a11y.skip_link.site", "Hero skip-link + #main-content target", "error", (ctx) => {
    const out = [];
    const hero = ctx.files.hero, app = ctx.files.app;
    if (hero && !/href="#main-content"[^>]*\bskip-link\b/.test(hero.raw) && !/\bskip-link\b[^>]*href="#main-content"/.test(hero.raw))
      out.push(err('Hero skip-link to "#main-content" missing', hero.path));
    if (app && !/id="main-content"/.test(app.raw)) out.push(err('skip-link target id="main-content" missing', app.path));
    if (app && /id="main-content"/.test(app.raw) && !/id="main-content"[^>]*tabIndex=\{-1\}/.test(app.raw))
      out.push(warn("main#main-content should keep tabIndex={-1} so skip-link moves focus", app.path));
    return out;
  }),
  check("a11y.skip_link.resume", "resume.html skip-link + #resume-main target", "error", (ctx) => {
    const f = ctx.files.resumeHtml;
    if (!f) return [];
    const out = [];
    // Order-agnostic: accept skip-link attrs in either order.
    if (!/href="#resume-main"[^>]*class="skip-link"/.test(f.raw) && !/class="skip-link"[^>]*href="#resume-main"/.test(f.raw))
      out.push(err('resume skip-link to "#resume-main" missing', f.path));
    // Bind id + tabindex to the SAME <main ...> open tag, any attribute order.
    const mainTags = [...f.raw.matchAll(/<main\b[^>]*>/g)].map((m) => m[0]);
    const target = mainTags.find((t) => /id="resume-main"/.test(t));
    if (!target) out.push(err('resume target id="resume-main" missing on <main>', f.path));
    else if (!/tabindex="-1"/.test(target)) out.push(err('resume <main id="resume-main"> needs tabindex="-1"', f.path));
    return out;
  }),
  check("a11y.mascot_decorative", "Mascot images stay decorative (alt='' + aria-hidden)", "error", (ctx) => {
    const out = [];
    for (const key of ["hero", "swoosh", "app"]) {
      const f = ctx.files[key];
      if (!f) continue;
      for (const m of f.raw.matchAll(/<img\b[\s\S]*?\/?>/g)) {
        const tag = m[0];
        if (!tag.includes(MASCOT_ASSET)) continue;
        const line = lineOf(f.raw, m.index);
        const nonEmptyAlt = /\balt=(["'])(?!\1)[^"']/.test(tag); // alt="something"
        if (nonEmptyAlt) out.push(err("mascot <img> must have empty alt (decorative) — found non-empty alt", f.path, line));
        else if (!/\balt=(["'])\1/.test(tag)) out.push(err("mascot <img> missing alt=\"\"", f.path, line));
        // Accept "true" / 'true' / {true} and the JSX boolean shorthand; reject only a real absence/false.
        const ariaHiddenTrue = /aria-hidden\s*=\s*(?:["']true["']|\{true\})/.test(tag);
        const ariaHiddenShorthand = /aria-hidden(?=[\s/>])/.test(tag) && !/aria-hidden\s*=/.test(tag);
        if (!ariaHiddenTrue && !ariaHiddenShorthand) out.push(err('mascot <img> missing aria-hidden="true"', f.path, line));
      }
    }
    return out;
  }),
  check("a11y.pause_control", "Pause/play control has aria-pressed + both label states", "error", (ctx) => {
    const f = ctx.files.hero;
    if (!f) return [];
    const out = [];
    if (!/aria-pressed=\{userPaused\}/.test(f.raw)) out.push(err("pause button aria-pressed={userPaused} missing", f.path));
    if (!f.raw.includes("자동 재생 시작")) out.push(err('pause control "자동 재생 시작" label missing', f.path));
    if (!f.raw.includes("자동 재생 일시정지")) out.push(err('pause control "자동 재생 일시정지" label missing', f.path));
    return out;
  }),
  check("a11y.progressbar", "Progressbar role + aria-value attrs (on one element)", "error", (ctx) => {
    const f = ctx.files.hero;
    if (!f) return [];
    // Bind the value attrs to the SAME element that carries role="progressbar".
    const tag = /<[a-zA-Z][^>]*role="progressbar"[^>]*>/.exec(f.raw);
    if (!tag) return [err('role="progressbar" element missing', f.path)];
    const out = [];
    const line = lineOf(f.raw, tag.index);
    for (const [needle, label] of [
      [/aria-valuemin=/, "aria-valuemin"],
      [/aria-valuemax=/, "aria-valuemax"],
      [/aria-valuenow=/, "aria-valuenow"],
    ]) {
      if (!needle.test(tag[0])) out.push(err(`progressbar ${label} missing on the role="progressbar" element`, f.path, line));
    }
    return out;
  }),
  check("a11y.h1_live_region", "h1 aria-live + sr-only mascot name", "error", (ctx) => {
    const f = ctx.files.hero;
    if (!f) return [];
    const out = [];
    // Bind to the <h1> itself so moving aria-live onto another element is caught.
    const h1Open = /<h1\b[^>]*>/.exec(f.raw);
    const h1Block = /<h1\b[\s\S]*?<\/h1>/.exec(f.raw);
    if (!h1Open) return [err("Hero <h1> missing", f.path)];
    if (!/aria-live="polite"/.test(h1Open[0])) out.push(err('h1 aria-live="polite" missing', f.path, lineOf(f.raw, h1Open.index)));
    if (!/aria-atomic="true"/.test(h1Open[0])) out.push(err('h1 aria-atomic="true" missing', f.path, lineOf(f.raw, h1Open.index)));
    const inside = h1Block ? h1Block[0] : "";
    if (!/className="sr-only"/.test(inside)) out.push(err("sr-only span missing inside <h1>", f.path));
    if (!inside.includes("마조리카")) out.push(err('accessible mascot name "마조리카" missing from <h1> sr-only', f.path));
    return out;
  }),
  check("a11y.en_lang_binding", "English Hero variant gets lang binding (WCAG 3.1.2)", "error", (ctx) => {
    const f = ctx.files.hero;
    if (!f) return [];
    const out = [];
    if (!/lang=\{sentenceLang\}/.test(f.raw)) out.push(err("Hero sentence lang={sentenceLang} binding missing", f.path));
    if (!/sentenceLang\s*=\s*current\.lang\s*\?\?\s*"ko"/.test(f.raw)) out.push(err('sentenceLang default (current.lang ?? "ko") missing', f.path));
    if (!/lang:\s*"en"/.test(f.raw)) out.push(warn('no variant declares lang: "en"', f.path));
    return out;
  }),
  check("a11y.html_lang", 'Documents declare lang="ko"', "error", (ctx) => {
    const out = [];
    // Tolerate extra/reordered attributes: <html lang="ko" dir="ltr"> is still valid.
    for (const key of ["indexHtml", "resumeHtml"]) {
      const f = ctx.files[key];
      if (f && !/<html\b[^>]*\blang="ko"/.test(f.raw)) out.push(err('<html lang="ko"> missing', f.path));
    }
    return out;
  }),
  check("a11y.meta_description", "index.html has non-empty meta description", "error", (ctx) => {
    const f = ctx.files.indexHtml;
    if (!f) return [];
    const m = /<meta\s+name="description"\s+content="([^"]*)"/.exec(f.raw);
    if (!m) return [err('<meta name="description"> missing', f.path)];
    if (m[1].trim().length < 10) return [err("meta description is empty/too short", f.path, lineOf(f.raw, m.index))];
    return [];
  }),
  check("a11y.css_hooks", "styles.css keeps a11y hooks (focus-visible, reduced-motion, sr-only, skip-link)", "error", (ctx) => {
    const f = ctx.files.stylesCss;
    if (!f) return []; // optional file
    const out = [];
    if (!/:focus-visible\s*\{[^}]*outline:/.test(f.raw)) out.push(err(":focus-visible outline rule missing", f.path));
    if (/:focus-visible\s*\{[^}]*outline:\s*(none|0)\b/.test(f.raw)) out.push(err(":focus-visible must not remove the outline", f.path));
    if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(f.raw)) out.push(err("prefers-reduced-motion guard missing", f.path));
    if (!/\.sr-only\s*\{/.test(f.raw)) out.push(err(".sr-only utility class missing (Hero relies on it)", f.path));
    if (!/\.skip-link\s*\{/.test(f.raw)) out.push(err(".skip-link class missing (Hero relies on it)", f.path));
    return out;
  }),
  check("a11y.reduced_motion_js", "Hero gates auto-advance on useReducedMotion()", "error", (ctx) => {
    const f = ctx.files.hero;
    if (!f) return [];
    const out = [];
    if (!/useReducedMotion/.test(f.raw)) out.push(err("Hero must import/use useReducedMotion()", f.path));
    if (!/paused\s*=\s*[^;]*prefersReduced/.test(f.raw)) out.push(err("`paused` expression must include prefersReduced (else carousel ignores reduced-motion)", f.path));
    return out;
  }),
  check("a11y.resume_motion", "resume.html has its own focus-visible + reduced-motion", "error", (ctx) => {
    const f = ctx.files.resumeHtml;
    if (!f) return [];
    const out = [];
    if (!/:focus-visible\s*\{[^}]*outline:/.test(f.raw)) out.push(err("resume :focus-visible outline missing", f.path));
    if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(f.raw)) out.push(err("resume prefers-reduced-motion guard missing", f.path));
    return out;
  }),

  // ---- mascot identity (Locked Design Decisions L1/L5) ----
  check("mascot.official_asset", "Hero mascot uses the official asset (not a hand-drawn SVG)", "warn", (ctx) => {
    const f = ctx.files.hero;
    if (!f) return [];
    const out = [];
    if (!f.raw.includes(MASCOT_ASSET)) out.push(warn(`Hero no longer references the official mascot asset (${MASCOT_ASSET}*)`, f.path));
    // A new inline <svg> labelled as the mascot would violate L1.
    for (const m of f.raw.matchAll(/<svg\b[\s\S]*?aria-label="([^"]*)"/g)) {
      if (/마조리카|majorica|frog|개구리/i.test(m[1])) out.push(warn("inline <svg> labelled as the mascot — L1 forbids a hand-drawn mascot", f.path, lineOf(f.raw, m.index)));
    }
    return out;
  }),

  // ---- date stamps (conditional; --strict upgrades the section/freshness WARNs) ----
  check("dates.stamp_format", "created/updated/dateTime string stamps are well-formed", "error", (ctx) => {
    const out = [];
    for (const key of ["app", "hero"]) {
      const f = ctx.files[key];
      if (!f) continue;
      // String-literal stamps only: created/updated as a JSX attr (=) or object key (:).
      // Lookbehind on [\w-] skips data-updated / foo-created etc. Dynamic brace
      // stamps (updated={fn(x)}) are not statically checkable, so they are skipped.
      for (const m of f.raw.matchAll(/(?<![\w-])(created|updated)\s*[:=]\s*"([^"]*)"/g)) {
        if (!DATE_STAMP_VALUE.test(m[2])) out.push(err(`${m[1]} stamp "${m[2]}" is not YYYY.MM or YYYY-MM(-DD)`, f.path, lineOf(f.raw, m.index)));
      }
      for (const m of f.raw.matchAll(/(?<![\w-])dateTime\s*=\s*"([^"]*)"/g)) {
        const v = m[1];
        if (!DATE_TIME_VALUE.test(v)) out.push(err(`<time dateTime="${v}"> is not YYYY-MM(-DD)`, f.path, lineOf(f.raw, m.index)));
      }
    }
    return out;
  }),
  check("dates.section_updated", "Each content section carries an `updated` stamp", "warn", (ctx) => {
    const f = ctx.files.app;
    if (!f) return [];
    // Match the whole element to its real end (self-closing /> or </SectionHead>);
    // do NOT stop at a `>` inside the title (e.g. a title mentioning <Suspense>).
    const heads = [...f.raw.matchAll(/<SectionHead\b[\s\S]*?(?:\/>|<\/SectionHead>)/g)];
    const featureActive = /\bupdated=/.test(f.raw);
    const out = [];
    for (const m of heads) {
      if (!/\bupdated=/.test(m[0])) {
        // Silent unless the date feature is active OR --strict (engine upgrades 'upgradable').
        if (featureActive || ctx.opts.strict) out.push(mk(ctx.opts.strict ? "error" : "warn", "a content section is missing an `updated` stamp", f.path, lineOf(f.raw, m.index), true));
      }
    }
    return out;
  }),
  check("dates.freshness", "Newest `updated` stamp is not in the future", "warn", (ctx) => {
    const f = ctx.files.app;
    if (!f) return [];
    const stamps = [...f.raw.matchAll(/\bupdated=("?)(\d{4}[.-]\d{2}(?:-\d{2})?)\1/g)].map((m) => m[2].replace(/\./g, "-").slice(0, 7));
    if (!stamps.length) return [];
    const newest = stamps.sort().at(-1);
    const now = new Date();
    const cur = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}`;
    if (newest > cur) return [mk(ctx.opts.strict ? "error" : "warn", `newest updated stamp ${newest} is after current month ${cur}`, f.path, undefined, true)];
    return [];
  }),

  // ---- design-drift (advisory; only when the relevant feature is present) ----
  check("design.scroll_margin", "Anchored sections define scroll-margin when an in-page index exists", "warn", (ctx) => {
    const app = ctx.files.app, css = ctx.files.stylesCss;
    if (!app || !css) return [];
    const hasIndexNav = /note-index|aria-label="차례"/.test(app.raw);
    if (hasIndexNav && !/scroll-margin/.test(css.raw)) return [warn("in-page index present but styles.css has no scroll-margin (anchored headings may hide under the top)", css.path)];
    return [];
  }),
  check("design.stamp_style", "`.stamp` style exists when date stamps render", "warn", (ctx) => {
    const app = ctx.files.app, css = ctx.files.stylesCss;
    if (!app || !css) return [];
    if (/className="stamp"/.test(app.raw) && !/\.stamp\s*\{/.test(css.raw)) return [warn('DateStamp renders className="stamp" but styles.css has no .stamp rule', css.path)];
    return [];
  }),
  check("structure.hero_variants", "Hero VARIANTS array is non-empty", "warn", (ctx) => {
    const f = ctx.files.hero;
    if (!f) return [];
    const m = /const VARIANTS[^=]*=\s*\[([\s\S]*?)\];/.exec(f.raw);
    if (!m) return [warn("could not locate Hero VARIANTS array (refactored?)", f.path)];
    const count = (m[1].match(/\{\s*pre:/g) || []).length;
    if (count < 1) return [warn("Hero VARIANTS array appears empty", f.path)];
    return []; // NOTE: count is intentionally NOT asserted — it changes legitimately (HANDOFF is stale at 6; code has 7).
  }),
];

// ───────────────────────────── Zone C — engine ───────────────────────────────
function check(id, title, severity, run) { return { id, title, severity, run }; }
function mk(status, message, file, line, upgradable) { return { status, message, file, line, upgradable: !!upgradable }; }
function err(message, file, line) { return mk("error", message, file, line, false); }
function warn(message, file, line) { return mk("warn", message, file, line, false); }

function lineOf(text, index) {
  if (index == null || index < 0) return undefined;
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}
function lineOfNeedle(file, needle) {
  const i = file.raw.indexOf(needle);
  return i === -1 ? undefined : lineOf(file.raw, i);
}

// Strip JSX/HTML tags AND markdown emphasis/code markers, then collapse
// whitespace, so number<->unit proximity holds even when markup interrupts them
// — e.g. `워크스페이스 <strong>329</strong>` (JSX) or `워크스페이스 **2,767**` (md).
// `stripped` is consumed only by the KPI proximity/inflation regexes, so dropping
// `* _ \`` is safe (they never carry KPI semantics) and removes a false-positive class.
function stripMarkup(text) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_`]+/g, "")
    .replace(/\s+/g, " ");
}
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// Tight pairing: number and unit separated only by whitespace and an optional
// counter `개`. A "·"/"," separator (legit adjacent different pairs) does NOT match.
function kpiPaired(stripped, num, unit) {
  const n = escapeRe(num), u = escapeRe(unit);
  const numThenUnit = new RegExp(`(?<![\\d,])${n}\\s*개?\\s*${u}`);
  const unitThenNum = new RegExp(`${u}\\s*${n}(?![\\d,])`);
  return numThenUnit.test(stripped) || unitThenNum.test(stripped);
}
function kpiCrosswire(stripped, num, wrongUnits) {
  const n = escapeRe(num);
  for (const u of wrongUnits) {
    const w = escapeRe(u);
    if (new RegExp(`(?<![\\d,])${n}\\s*개?\\s*${w}`).test(stripped)) return u;
    if (new RegExp(`${w}\\s*${n}(?![\\d,])`).test(stripped)) return u;
  }
  return null;
}

// Tolerate quote style and simple JSX-expression ids so a constants refactor
// (id="x" -> id={'x'} / id={`x`}) doesn't false-orphan every anchor.
const ID_RE = /\bid=(?:"([\w-]+)"|'([\w-]+)'|\{\s*['"`]([\w-]+)['"`]\s*\})/g;
function collectIds(ctx, fileKeys) {
  const ids = new Set();
  for (const key of fileKeys) {
    const f = ctx.files[key];
    if (!f) continue;
    for (const m of f.raw.matchAll(ID_RE)) ids.add(m[1] || m[2] || m[3]);
  }
  return ids;
}

function loadContext(opts) {
  const files = {};
  const ioErrors = [];
  for (const [key, rel] of Object.entries(FILES)) {
    try {
      const raw = readFileSync(join(ROOT, rel), "utf8");
      files[key] = { key, path: rel, raw, stripped: stripMarkup(raw) };
    } catch (e) {
      if (REQUIRED_FILES.includes(key)) ioErrors.push({ key, path: rel, code: e.code || "EREAD" });
      // optional files (stylesCss) silently absent
    }
  }
  return { files, ioErrors, opts };
}

function runChecks(ctx) {
  const results = [];
  for (const c of CHECKS) {
    let findings = [];
    try {
      findings = c.run(ctx) || [];
    } catch (e) {
      findings = [err(`check threw: ${e.message}`)];
    }
    if (findings.length === 0) {
      results.push({ id: c.id, severity: c.severity, status: "ok", message: c.title });
    } else {
      for (const f of findings) {
        let status = f.status;
        if (status === "warn" && f.upgradable && ctx.opts.strict) status = "error";
        results.push({ id: c.id, severity: c.severity, status, message: f.message, file: f.file, line: f.line });
      }
    }
  }
  return results;
}

// ───────────────────────────── Zone D — CLI / output ─────────────────────────
function parseArgs(argv) {
  const opts = { strict: false, json: false, quiet: false, color: undefined, help: false };
  for (const a of argv) {
    switch (a) {
      case "--strict": opts.strict = true; break;
      case "--json": opts.json = true; break;
      case "--quiet": opts.quiet = true; break;
      case "--no-color": opts.color = false; break;
      case "--help": case "-h": opts.help = true; break;
      default:
        process.stderr.write(`unknown flag: ${a}\n`);
        process.exit(1);
    }
  }
  return opts;
}

function colorize(opts) {
  const useColor = opts.color === false ? false
    : (opts.json ? false : (process.stdout.isTTY && !process.env.NO_COLOR && process.env.TERM !== "dumb"));
  const wrap = (code) => (s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);
  return { red: wrap("31"), yellow: wrap("33"), green: wrap("32"), dim: wrap("2"), bold: wrap("1") };
}

function printHelp() {
  process.stdout.write(`maj0rika content verifier — static, read-only pre-deploy gate

Usage: node scripts/verify-content.mjs [options]

Options:
  --strict     Upgrade conditional date warnings (missing/future updated stamp) to errors.
  --json       Emit a single stable JSON object to stdout (machine/cron parsing).
  --quiet      Suppress per-check OK lines; print only warnings, errors, and the summary.
  --no-color   Disable ANSI colour (auto-off when not a TTY or NO_COLOR is set).
  -h, --help   Show this help and exit 0.

Exit codes: 0 = all checks passed (warnings allowed) · 1 = error or operational failure.
Reads only a fixed allowlist of source files. No network, no writes, no secrets.
`);
}

function formatHuman(results, ctx, c) {
  const lines = [];
  const counts = tally(results);
  const order = ["facts", "forbidden", "anchors", "a11y", "mascot", "dates", "design", "structure"];
  const groups = new Map();
  for (const r of results) {
    const cat = r.id.split(".")[0];
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat).push(r);
  }
  lines.push(c.bold("maj0rika content verification") + (ctx.opts.strict ? c.dim("  [strict]") : ""));
  lines.push("");
  for (const cat of [...order, ...[...groups.keys()].filter((k) => !order.includes(k))]) {
    const rs = groups.get(cat);
    if (!rs) continue;
    for (const r of rs) {
      if (r.status === "ok" && ctx.opts.quiet) continue;
      const glyph = r.status === "error" ? c.red("✗") : r.status === "warn" ? c.yellow("⚠") : c.green("✓");
      const loc = r.file ? c.dim(`  ${r.file}${r.line ? ":" + r.line : ""}`) : "";
      lines.push(`  ${glyph} ${c.dim(r.id.padEnd(26))} ${r.message}${loc}`);
    }
  }
  lines.push("");
  lines.push(c.dim("─".repeat(60)));
  const verdict = counts.errors > 0 ? c.red("FAIL") : c.green("PASS");
  lines.push(`${counts.ok} ok · ${counts.warnings} warn · ${counts.errors} error  →  ${verdict} (exit ${counts.errors > 0 ? 1 : 0})`);
  return lines.join("\n");
}

function tally(results) {
  return {
    ok: results.filter((r) => r.status === "ok").length,
    warnings: results.filter((r) => r.status === "warn").length,
    errors: results.filter((r) => r.status === "error").length,
  };
}

function main() {
  // Node version guard — fail fast & clean, never a stack trace.
  const major = Number(process.versions.node.split(".")[0]);
  if (Number.isFinite(major) && major < 18) {
    process.stderr.write(`Node >=18 required, found ${process.versions.node}\n`);
    process.exit(1);
  }

  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) { printHelp(); process.exit(0); }
  const c = colorize(opts);

  // Repo-root guard — fail closed if copied elsewhere.
  let pkgName = "";
  try { pkgName = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).name || ""; } catch { /* handled below */ }
  if (pkgName !== "maj0rika-com") {
    const msg = "not in the maj0rika-com repo root (env.not_in_repo)";
    if (opts.json) process.stdout.write(JSON.stringify({ ok: false, version: SCHEMA_VERSION, error: msg }) + "\n");
    else process.stderr.write(msg + "\n");
    process.exit(1);
  }

  const ctx = loadContext(opts);

  // Missing required files => operational errors (don't crash).
  const ioResults = ctx.ioErrors.map((io) => ({ id: "io.missing_file", severity: "error", status: "error", message: `required file unreadable (${io.code})`, file: io.path }));
  const results = [...ioResults, ...runChecks(ctx)];
  const counts = tally(results);
  const exit = counts.errors > 0 ? 1 : 0;

  if (opts.json) {
    process.stdout.write(JSON.stringify({
      ok: exit === 0,
      version: SCHEMA_VERSION,
      strict: opts.strict,
      checkedFiles: Object.keys(ctx.files).length,
      summary: { total: results.length, ...counts },
      results,
    }, null, 2) + "\n");
  } else {
    process.stdout.write(formatHuman(results, ctx, c) + "\n");
  }
  process.exit(exit);
}

main();
