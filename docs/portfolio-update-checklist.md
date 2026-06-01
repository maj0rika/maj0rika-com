# Portfolio Update Checklist — maj0rika.com 콘텐츠 안전 루프

매일 도는 자동 에이전트가 "온톨로지 → 포트폴리오 업데이트"를 수행할 때, 콘텐츠를
바꾸고 → 검증하고 → 통과하면 배포하는 **일일 안전 루프**를 위한 운영 가이드다.
중심에는 `scripts/verify-content.mjs`(읽기 전용 콘텐츠 검증 하니스)가 있다. 에이전트가
사실관계(KPI 숫자)·금지 카피·접근성·앵커를 깨뜨린 채로 배포하는 것을 막는 게이트다.

> 이 문서는 HANDOFF.md §8 (검증 체크리스트)를 **보완**하며, 대체하지 않는다.
> HANDOFF.md는 락된 사실관계와 디자인 결정의 single source of truth로 남는다.

HANDOFF.md는 프로젝트 전체 핸드오프 + §8 검증 체크리스트(빌드/UI/A11y/프로덕션 게이트)를
다룬다. 이 문서는 그중 `verify-content.mjs`를 중심으로 한 **콘텐츠 안전 루프**만 좁게 다룬다.

---

## 1. 일일 루프 (순서 있는 게이트)

콘텐츠 변경은 반드시 아래 순서대로, 앞 단계가 통과해야 다음으로 넘어간다.

```
sync  →  콘텐츠 편집  →  verify  →  (pass)  build  →  (pass)  deploy
                            │                  │
                          fail                fail
                            └── 중단, 배포 금지 ─┘
```

1. **sync** — live repo를 최신으로 맞춘다 (`git pull`).
2. **콘텐츠 편집** — 온톨로지/지식베이스 결과를 허용 파일에만 반영한다.
3. **verify** — `node scripts/verify-content.mjs` 실행. exit 0이어야 통과.
4. **build** — verify 통과 시에만 `pnpm build`.
5. **deploy** — build 통과 시에만 배포.

> **검증을 통과하지 못하면 build/deploy를 절대 진행하지 않는다.**
> (HANDOFF §8: 검증 체크리스트 통과 안 하면 배포 금지.)
> verify는 read-only·no-network·no-write라서 게이트로 안전하게 앞단에 둘 수 있다.

검증 대상은 고정 allowlist다: `src/App.tsx`, `src/components/Hero.tsx`,
`src/components/Swoosh.tsx`, `public/resume.html`, `public/resume.md`, `index.html`,
`src/styles.css`. 스크립트는 자기 위치에서 repo 루트를 찾으므로 CWD와 무관하게 동작한다.

---

## 2. 명령어 치트시트

`HOME`이 설정돼 있으면 `pnpm <script>`, 아니면 `HOME=/Users/taeheelee npx pnpm@10.5.0 <script>`로 호출한다.

| 용도 | 명령 | 비고 |
|------|------|------|
| 사람이 로컬 확인 | `pnpm verify` | `node scripts/verify-content.mjs`. 컬러 출력, OK 라인 포함 |
| 머신/JSON (cron) | `pnpm verify:json` | `--json`. stdout에 안정적인 JSON 한 덩어리 |
| strict (스탬프 추가 후) | `pnpm verify:strict` | `--strict`. 날짜 스탬프 WARN을 ERROR로 승격 |
| 자체 테스트 | `pnpm verify:test` | `node scripts/verify-content.test.mjs`. 게이트가 실제로 무는지 검증 |

직접 호출 시 플래그:
`--strict`(조건부 날짜 WARN → ERROR), `--json`(머신/cron 파싱),
`--quiet`(체크별 OK 라인 숨김 — 경고·에러·요약은 출력), `--no-color`(TTY 아니거나 `NO_COLOR`면 자동 off), `--help`.

`verify:test`는 일부러 망가진 입력으로 게이트가 ERROR를 내는지 확인하는 adversarial 자체 테스트다.
하니스 자체를 수정했을 때 회귀 확인용으로 돌린다.

---

## 3. cron/에이전트용 셸 게이트 스니펫

복붙해서 쓸 수 있는 게이트. verify 실패 시 build/deploy로 넘어가지 않고 즉시 종료한다.

```sh
#!/bin/sh
set -eu
export HOME=/Users/taeheelee

# 라이브 repo (HANDOFF 기준). 이 worktree(automation-harness)는 샌드박스 복사본이다.
cd /Users/taeheelee/Desktop/git/maj0rika-com

# 1) 콘텐츠 게이트 — 통과 못 하면 여기서 중단 (배포 금지)
node scripts/verify-content.mjs --quiet || exit 1

# 2) 빌드 — verify 통과 후에만
pnpm build

# 3) deploy 단계 (HANDOFF §7 배포 절차에 맞춰 채운다)
# pnpm deploy  # 또는 vercel 배포 + alias 매핑
```

`set -eu`로 빌드 실패도 자동 중단된다. `--quiet`는 cron 로그 노이즈를 줄인다(에러·요약만 남음).
JSON으로 게이트하려면 5절 대신 6절의 `.ok` 패턴을 쓴다.

---

## 4. 각 체크 카테고리가 지키는 것

세부 락 값과 사유는 HANDOFF §4(사실관계)·§5(Voice/금지 카피)·§6(접근성)이 source of truth다.
여기서는 요약만 둔다.

- **facts.\*** (ERROR) — 락된 KPI 숫자가 존재하고 단위와 올바르게 짝지어졌는지, 그리고
  두 숫자 집합이 **분리** 유지되는지. 예: Agent 유료 = 329 워크스페이스 / 495 라이선스 ≠
  Allibee 플랫폼 누적 = 2,767 워크스페이스 / 10,393 계정. cross-wire(숫자가 엉뚱한 단위와
  붙음) 탐지, anti-inflation(반올림 "2,700+/10,000+" 금지), 기타 락 사실(GPA 4.2/4.5,
  contact 이메일/github/demo)도 포함. 정확한 숫자는 **HANDOFF §4 참조**.
- **forbidden.copy** (ERROR) — HANDOFF §5의 금지 문구. 매칭된 텍스트는 절대 출력하지 않고
  phrase id로만 보고한다("혼자", "혁신하는", "AI magic" 등).
- **forbidden.self_praise** (WARN) — 자기 형용사 휴리스틱(열정/꼼꼼/창의적/다재다능)과
  모호한 카피. 자동 차단이 아니라 사람 리뷰용 플래그.
- **anchors.\*** (ERROR) — 필수 섹션 id(bizagent, workshop, ops, builds, history, knock +
  top, main-content, resume-main) 존재, 모든 in-page `#link`가 실제 id로 연결되는지(orphan 없음).
  nav 링크는 Hero.tsx에 있지만 대부분의 타깃은 App.tsx에 있으므로 두 파일을 union해서 본다.
- **a11y.\*** (ERROR) — skip-link + 타깃, 마스코트 이미지 decorative 유지(`alt=""` + `aria-hidden`),
  pause 컨트롤 `aria-pressed` + 라벨 2종, progressbar role + aria-values, h1 `aria-live` +
  sr-only "마조리카", en variant lang 바인딩, `html lang="ko"`, meta description,
  styles.css a11y 훅(`:focus-visible`/reduced-motion/`.sr-only`/`.skip-link`),
  Hero `useReducedMotion` 가드, resume.html 자체 focus/reduced-motion.
- **mascot.\*** (WARN) — Hero가 공식 에셋(`/majorica-frog*`)을 계속 참조하는지, 손그림 마스코트
  SVG가 없는지 (Locked Design L1/L5).
- **dates.\*** (조건부) — 잘못된 형식의 created/updated/dateTime 스탬프는 **항상 ERROR**
  (created/updated는 `YYYY.MM`, `<time dateTime>`는 `YYYY-MM`). 섹션에 `updated` 스탬프가
  없으면 평소엔 WARN, `--strict`에선 ERROR. 미래 날짜 스탬프는 WARN(`--strict`에선 ERROR).
  커밋된 트리는 날짜 스탬프 기능 이전 상태라 일반 실행은 clean이고 `--strict`는 누락 스탬프를
  잡는다 — 의도된 동작. `--strict`는 일일 편집이 스탬프를 추가한 **뒤에만** 돌린다.
- **design.\*** (WARN, advisory) — 해당 기능이 있을 때만 발동(in-page index가 있으면
  scroll-margin, DateStamp가 렌더되면 `.stamp` 스타일).
- **structure.hero_variants** (WARN) — Hero VARIANTS 배열이 비어있지 않은지. **변형 개수는
  일부러 단언하지 않는다** — HANDOFF는 6, 코드는 7이며 개수는 정당하게 바뀔 수 있다.

---

## 5. Exit 코드와 JSON 스키마

- **exit 0** = 통과 (WARN은 허용된다).
- **exit 1** = ERROR가 하나라도 있거나 운영 실패(필수 파일 못 읽음 등).

`--json`은 stdout에 안정적인 JSON 한 덩어리를 낸다. 성공 경로 형태:

```json
{
  "ok": true,
  "version": 1,
  "strict": false,
  "checkedFiles": 7,
  "summary": { "total": 42, "ok": 40, "warnings": 2, "errors": 0 },
  "results": [
    { "id": "facts.no_inflation", "severity": "error", "status": "ok", "message": "..." },
    { "id": "forbidden.copy", "severity": "error", "status": "error", "message": "forbidden phrase id \"...\" present", "file": "src/App.tsx", "line": 88 }
  ]
}
```

`results[].file`과 `results[].line`은 해당될 때만 붙는다. 운영 실패 시에는
`{ "ok": false, "version": 1, "error": "<message>" }` 형태가 나온다.

**에이전트는 `ok` 필드로 게이트한다** (exit 코드와 동일 의미). 예:

```sh
node scripts/verify-content.mjs --json --quiet \
  | node -e 'process.exit(JSON.parse(require("fs").readFileSync(0)).ok ? 0 : 1)' \
  || exit 1
```

`results` 배열을 돌면 `status === "error"`인 항목의 `id` / `file:line` / `message`로
무엇이 막았는지 알 수 있다(콘텐츠 원문은 노출되지 않음).

---

## 6. `--strict`는 언제 쓰나

`--strict`는 일일 편집에서 `created` / `updated` 스탬프를 **추가한 뒤에만** 쓴다.

- 평소 실행: 스탬프 없는 섹션은 WARN → 게이트 통과. 현재 커밋 트리는 스탬프 기능 이전이라 clean.
- `--strict`: 누락/미래 스탬프를 ERROR로 승격. 스탬프를 막 넣었을 때 freshness를 강제하고 싶을 때.

순서: 콘텐츠 + 스탬프 편집 → `verify` (통과 확인) → `verify:strict` (스탬프 무결성 확인) → build.
스탬프를 아직 안 넣었는데 `--strict`를 돌리면 의도대로 실패하므로, 스탬프 도입 전에는 일반 `verify`만 쓴다.

---

## 7. 프라이버시 / cron 노트

- 하니스는 **secret·network·write가 전혀 없다.** 읽기 전용이라 cron에서 안전하다.
- **로그를 commit하지 않는다.** 로깅이 필요하면 stdout을 repo 밖이나 `.omc/` 아래
  gitignore된 경로로 리다이렉트한다(예: `>> .omc/logs/verify-$(date +%F).log`).
- 실패 라인은 `id` + `file:line` + 짧은 메시지뿐이다. 초안 콘텐츠나 매칭된 금지 문구 원문은
  로그에 새지 않는다(금지 카피는 phrase id로만 보고).
- `--quiet`로 cron 로그를 줄이고, JSON 게이트 시 `--json`을 쓴다.

---

## 8. 하니스 확장하기

규칙을 하나 추가하려면 `scripts/verify-content.mjs`에서:

1. **Zone A** (locked values)에 새 락 값을 등록한다.
2. **Zone B**의 `CHECKS` 배열에 객체 하나를 append한다 —
   `{ id, title, severity: 'error'|'warn', run(ctx) -> Finding[] }`.
   (Zone C 엔진 / Zone D main은 거의 손대지 않는다.)
3. `scripts/verify-content.test.mjs`에 adversarial 케이스를 추가해 게이트가 무는지 증명한다.
4. **현재 트리에서 ERROR 체크는 false positive 0을 유지한다.** 새 ERROR가 현재 콘텐츠를
   잘못 막으면 게이트 신뢰가 깨진다. 자신 없으면 WARN으로 두고 사람 리뷰에 맡긴다.

id는 카테고리 접두사 컨벤션을 따른다(`facts.*`, `forbidden.*`, `anchors.*`, `a11y.*`,
`mascot.*`, `dates.*`, `design.*`, `structure.*`). 추가 후 `pnpm verify`와 `pnpm verify:test`를
둘 다 통과해야 한다.
