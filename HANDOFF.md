# HANDOFF — maj0rika.com (이태희 개인 사이트)

> 이 문서는 다른 AI 에이전트(Codex 등)가 받아서 바로 작업할 수 있게 자기완결적으로 작성됨. 작업 전에 반드시 끝까지 읽고, 변경 후에는 § 검증 체크리스트 통과 필수.

---

## 0. Quick Status (한눈에)

| | |
|---|---|
| **Live URL** | https://maj0rika.com (apex), https://www.maj0rika.com (308→apex) |
| **호스팅** | Vercel · 프로젝트 `maj0rika-com` · 팀 `maj0rikas-projects` |
| **도메인 등록기관** | Vercel (만료 2027-05-21) |
| **레포지토리** | GitHub `maj0rika/maj0rika-com` · 로컬 `/Users/taeheelee/Desktop/git/maj0rika-com` |
| **현재 브랜치** | `main` |
| **빌드 도구** | Vite 6.4.2 + pnpm 10.5.0 + Node 24.x |
| **배포 명령** | `npx vercel deploy --prod --yes` |
| **마지막 작업** | GitHub 연결 이후 공식 마조리카 PNG/WebP 및 OG 이미지 최적화 반영 |

---

## 1. Context Snapshot

- **사용자**: 이태희 (Lee Taehee · GitHub `@maj0rika` · neu5563@naver.com · 010-2243-8353)
- **포지셔닝**: AX Frontend Engineer (LLM/RAG SaaS · AI-native dev workflow)
- **본업**: BHSN — 리걸 AI 에이전트 'Business Agent' 프론트엔드 단독 담당 (2024.07~)
- **사이트 목적**: 개인 포트폴리오 / 채용 소통 / 마조리카 닉네임 브랜딩
- **마스코트**: 꼬마마법사 레미(오자마조 도레미) 등장 캐릭터 **마조리카** (마녀 → 마녀개구리 형태). 녹색 알 모양 몸, 머리 위 흰 소용돌이, 큰 빨간 입술, 보라 발

---

## 2. Stack & Architecture

### Tech Stack
- **React 19 + Vite 6 + TypeScript 5.7**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, `@theme` 토큰 방식 — v3 config.js 아님)
- **framer-motion 12** (모든 모션에 `useReducedMotion` 가드 필수)
- **pnpm 10.5** workspace 아님, 단일 패키지

### File Map (요점만)
```
maj0rika-com/
├─ HANDOFF.md                     ← 이 문서
├─ index.html                     폰트 로드 (Kalam · Gaegu · Caveat · JetBrains Mono) + favicons + skip-link target
├─ vercel.json                    캐시 헤더 + www→apex 308 redirect (host has clause)
├─ vite.config.ts                 react + tailwindcss plugins
├─ tsconfig.json                  strict: true
├─ package.json                   pnpm scripts: dev / build / preview
├─ public/
│   ├─ majorica-frog.png          (860×1200) 공식 Majopedia PNG, alpha-transparent ★ 직접 그리지 말 것
│   ├─ majorica-frog-sm.png       (286×400) hero 인라인용
│   ├─ favicon-32.png · favicon-64.png · favicon-512.png · apple-touch-icon.png
│   ├─ resume.html                이력서 정식 페이지 (charset utf-8 명시, 자체 스타일)
│   └─ resume.md                  이력서 마크다운 (다운로드용; 직접 서빙은 charset 문제 있음)
└─ src/
    ├─ main.tsx                   ReactDOM root
    ├─ App.tsx                    Hero + main(5 섹션) + footer
    ├─ styles.css                 @theme 토큰 · 손글씨 폰트 · doodle 컴포넌트(.doodle-box, .doodle-underline) · paper-grain · :focus-visible · prefers-reduced-motion
    ├─ components/
    │   ├─ Hero.tsx               첫 화면 ★ 변경 시 가장 민감
    │   ├─ Mascot.tsx             단순 img 래퍼 (현재 Hero에서 직접 img로 인라인 사용 → 거의 미사용)
    │   └─ Swoosh.tsx             MascotPeek (footer 데코)
```

### 페이지 구조 (App.tsx)
```
<Hero/>                          첫 화면, 풀-뷰포트
<main id="main-content">
  i · 본업       (#bizagent)     Business Agent + React 마이그레이션
  ii · 공방·AX   (#workshop)     AI 도구 셋업 5개 카드 + aside(Hermes·Gemini 실험)
  iii · side     (#builds)       AI 가계부 (단일)
  iv · 이력 7년  (#history)      BHSN/CodeRecipe/세라 + Education
  v · 연락       (#knock)        연락처 + MascotPeek
</main>
```

---

## 3. Locked Design Decisions (변경 금지 항목)

> 사용자가 명시적으로 결정/거부한 사항들. 다시 시도하면 즉시 롤백 요구당함.

| # | 결정 | 근거 |
|---|------|------|
| L1 | **마스코트 = 공식 Majopedia PNG** (`/majorica-frog-sm.png`) | 직접 그린 SVG는 사용자가 거부함. "내가 준 마조리카 이미지 어따 버리고 안 쓰냐" |
| L2 | **손글씨/낙서 무드** (Kalam 영문 + Gaegu 한글) | 사용자가 참고 이미지로 요청. 폰트만 바꾸면 안 되고 doodle-box·doodle-underline 보더도 같이 가야 함 |
| L3 | **"혼자" 표현 금지** | "혼자 만든" 같은 단어는 커뮤니케이션 부족으로 보임. "단독 담당", "함께 설계" 사용 |
| L4 | **자동 5초 사이클 + 수동 pause/play 버튼 필수** | WCAG 2.2.2 준수. hover 일시정지만으론 키보드 유저 못 씀 |
| L5 | **마스코트는 글자 사이 괄호 안 글리프로 배치** (concept #5 Typographic Spell) | concept-spark/ref-hunter/identity-voice 3-에이전트 합의로 채택된 방향. 분산된 떠다니는 5마리 시도는 너무 시끄러워서 거부됨 |
| L6 | **모션 예산: ambient 1 + reactive 1 최대** | 마스코트 좌우 흔들림(ambient) + 호버 시 괄호 회전(reactive). 그 이상 추가 시 "시끄럽다"고 거부됨 |
| L7 | **단일 viewport 첫 화면** | "스크롤해야 보이는 홈페이지 말고" — 첫 화면에서 정체성 다 전달 |
| L8 | **AI 슬롭 디자인 절대 금지** | 보라 그라디언트, neon, 3-column SaaS feature grid, "Built for X" 카피, system-ui 폰트, gradient CTA, bento — 전부 |
| L9 | **녹색 계열 컬러만** | 사용자 명시. 마조리카 자체 색에서 출발한 이끼/숲 톤. 마스코트 발 색인 plum(#6a4a85)은 캐릭터 충실이라 허용 |
| L10 | **영문 변형엔 lang="en"** | 스크린리더 발음 정확도 |

---

## 4. Content Facts (사실관계 — 잘못 쓰면 면접에서 무너짐)

### 숫자 (2026-05-20 Slack `#03_비상임시tf-agent-legal-런칭` 채널 기준)
- **Agent 단독 유료 구독**: 329 워크스페이스 · 495 라이선스 ← Hero subhead에 박혀있음
- **Allibee 플랫폼 전체 (Agent + CLM 합산)**: 누적 2,767 워크스페이스 · 10,393 계정 ← 이건 본업 섹션에만, 명시적으로 "플랫폼 전체"로 분리해야 함
- ⚠️ **두 숫자를 섞어 쓰지 말 것**. 사용자가 명시적으로 정정함: "어쩌다 2,700+/10,000+ 까지 왔습니다"는 거짓말이 됨

### 경력
- FE 4년+ (2022.02~), SWE 7년+ (임베디드 포함, 2019.01~)
- BHSN 2023.08~현재 · CodeRecipe 2022.02~2023.04 · 세라에스이 2019.01~2022.02
- Allibee Business Agent 단독 담당 2024.07~현재
- React+Vite+Turborepo 마이그레이션 진행 중 2026.04~현재
- 학력: 호서대학교 정보통신공학과 수석 졸업 (4.2/4.5)

### 사이드 프로젝트 (현재 사이트에 노출)
- **AI 가계부** — Next.js + Supabase + Capacitor · 데모 `https://household-account-book-tawny.vercel.app` (test@test.com / test1234)
- ※ **FitMe/DreamRealm는 사이트에서 제거됨** (이력서에서도 빠짐 — 사용자가 정리)

### 데모/접근
- Business Agent: `https://demo.allibee.ai` (`dummy@dummy.com` / `testtest1!`)

### 마조리카 (마스코트)
- 출처: 꼬마마법사 레미(오자마조 도레미) 등장 캐릭터, 마녀 → 마녀개구리 변신
- 시각 특징: 녹색 알 모양 몸, **머리 위 흰 소용돌이**, 작은 검정 점 눈, **큰 빨간 입술**(중앙), **보라 발 두 개**, 살구색 볼터치
- 보이스: **동료-비평가** (츤데레 마녀 원작 설정). 째려보긴 하지만 떠나지는 않음. 칭찬 잘 안 함

---

## 5. Voice (카피 톤)

### 5 Rules
1. 숫자가 있으면 숫자로 ("많은 사용자" ❌ → "329 워크스페이스" ✅)
2. 포지션이 아니라 한 일을 ("Senior FE" ❌ → "Business Agent 단독 담당" ✅)
3. 부풀리지도, 모르는 척하지도 않음 ("Svelte 4년 메인, React는 마이그레이션으로 들어가는 중")
4. AI는 도구가 아니라 작업 환경으로 ("Claude Code↔Codex 핸드오프 직접 만들어 씀")
5. 마조리카는 진지하게 농담함

### Forbidden Phrases (사이트에 절대 등장 금지)
- "열정적인 프론트엔드 개발자"
- "마법같은 AI 활용 / AI magic"
- "🚀 ship fast / crafting beautiful experiences"
- "사용자 경험을 혁신하는"
- "다재다능한 개발자"
- "함께 성장하는"
- 자기 형용사 일체 (열정·꼼꼼·다재다능·창의적 ...)

### Hero 6 Variants (현재 적용된 카피, 그대로 유지)
```ts
const VARIANTS = [
  { pre: "리걸 AI 만들다 보니", post: " 도 4년차예요." },
  { pre: "한 달 PoC라더니, 4년째", post: " 와 굴리는 중." },
  { pre: "Svelte 잘 합니다.", post: " 가 React 가자고 해서요." },
  { pre: "Cursor 깔러 갔다가, MCP 서버 만들고 왔어요", post: "." },
  { pre: "법령 출처 안 달면 변호사가 안 써요", post: "." },
  { pre: "AX Frontend, Seoul", post: " — since 2019.", lang: "en" },
];
```
※ `(🐸)`은 사이에 글리프로 들어가는 마스코트 자리. `pre` + ` (마스코트) ` + `post` 순.

---

## 6. Accessibility (현재 통과 항목 — 회귀 금지)

| WCAG | 구현 위치 |
|---|---|
| 1.1.1 비텍스트 | 모든 마스코트 이미지 `aria-hidden` + `alt=""`, h1에 `<span className="sr-only">{pre} 마조리카 {post}</span>` |
| 2.2.2 일시정지 | `<button aria-pressed={userPaused}>` Hero.tsx 컨트롤 |
| 2.3.3 모션 최소화 | `useReducedMotion()` 가드 + `@media (prefers-reduced-motion: reduce)` global CSS |
| 2.4.1 skip-link | `index.html`/`App.tsx`/`resume.html` 모두 `<a href="#main-content" class="skip-link">` |
| 2.4.7 focus | global `:focus-visible { outline: 2px dashed }` |
| 3.1.2 부분 언어 | 영문 variant에 `lang="en"` 자동 적용 |
| 4.1.2 role/name/value | progressbar에 `aria-valuemin/max/now`, 버튼들 `aria-label` |

---

## 7. 인프라 / 운영

### 배포
```bash
npx vercel deploy --prod --yes
# 그 다음 새 deployment를 alias에 매핑
npx vercel alias set <new-deployment-url> maj0rika.com
npx vercel alias set <new-deployment-url> www.maj0rika.com
```
- 빌드 ~10초, 번들 JS gzip 112KB · CSS gzip 5.4KB
- Vercel 자동 SSL · auto-deploy on alias

### 도메인
- 등록기관: **Vercel** (직접 구매)
- apex `maj0rika.com` = primary (200)
- `www.maj0rika.com` = 308 redirect to apex (vercel.json `redirects` block, host `has` clause)
- ICANN 이메일 인증 필요 (neu5563@naver.com, 15일 내 안 하면 도메인 잠김)
- 만료: 2027-05-21

### 환경 변수
- 없음. 완전 정적 SPA. 빌드 타임 시크릿도 없음

### Git
- 원격: `https://github.com/maj0rika/maj0rika-com.git`
- 로컬: `/Users/taeheelee/Desktop/git/maj0rika-com`
- 기본 브랜치: `main`
- 작업 전 `HOME=/Users/taeheelee git fetch origin` + `HOME=/Users/taeheelee git pull --ff-only origin main`으로 동기화.
- 사용자/cron이 만들지 않은 dirty 변경이 있으면 덮어쓰거나 커밋하지 말고 먼저 보고.

---

## 8. 검증 체크리스트 (모든 변경 후 통과 의무)

### 빌드 게이트
- [ ] `pnpm exec tsc --noEmit` — 0 errors
- [ ] `pnpm build` — 정상 종료, `dist/` 생성
- [ ] dev server (`pnpm dev`) — 콘솔 에러/경고 0

### UI 게이트 (브라우저 수동 확인)
- [ ] http://localhost:5173 첫 화면이 단일 viewport에 다 보임
- [ ] Hero 6개 variant가 5초마다 자동으로 사이클
- [ ] 마스코트 hover하면 사이클 일시정지
- [ ] pause/play 버튼 작동 (`▶ play` / `❚❚ pause` 토글)
- [ ] ← → 버튼으로 이전/다음 이동
- [ ] 마스코트가 괄호 `( )` 사이에 글자 높이로 정렬됨
- [ ] 영문 variant 표시 시 italic 적용
- [ ] resume 링크 → /resume.html 새 탭, 한글 깨짐 없음
- [ ] 5개 섹션 모두 정상 표시 (본업·공방·side·이력·연락)
- [ ] 본업 섹션 숫자: Agent 329/495, 플랫폼 2,767/10,393 분리 표기
- [ ] 공방 섹션 5개 카드 + Hermes/Gemini aside
- [ ] 모바일 (375px) 깨지지 않음

### A11y 게이트
- [ ] Tab으로 모든 인터랙티브 요소 도달 (skip-link → nav → cycle → controls → subhead links → footer)
- [ ] 키보드만으로 사이클 조작 가능
- [ ] VoiceOver 켜고 h1 변경 시 새 내용 announced
- [ ] 시스템 reduced-motion 켜면 자동 사이클 멈추고 progress bar 정적

### 프로덕션 게이트
- [ ] `https://maj0rika.com/` 200 응답
- [ ] `https://www.maj0rika.com/` 308 → apex
- [ ] `https://maj0rika.com/resume.html` 200, 한글 정상

---

## 9. 잘 막히는 곳 / 함정

| 함정 | 대응 |
|---|---|
| Tailwind v4 — config.js 없음 | 토큰은 `styles.css`의 `@theme {...}` 블록에 정의. v3 식 `tailwind.config.js` 만들면 안 됨 |
| Vite가 .md에 charset 안 붙임 | `resume.md` 직접 서빙하면 한글 깨짐. `resume.html` 만들어둔 이유 |
| Vercel SPA fallback | 현재 anchor 기반이라 라우팅 불필요. React Router 추가하려면 `vercel.json`에 rewrites 룰 추가 필요 |
| framer-motion `useReducedMotion()` | 항상 호출 후 `prefersReduced` 분기. exit 애니메이션도 가드 |
| 마조리카 PNG 비율 | 860×1200 portrait. inline 사용 시 `style={{ width: "1.15em", height: "1.35em" }}` + `object-contain`. 비율 깨면 입술 찌그러짐 |
| 손글씨 폰트 line-height | Gaegu/Kalam은 일반 `leading-tight` 적용 시 글자가 잘림. 1.12 이상 권장 |
| pnpm global bin 미설정 | `vercel` CLI는 `npx vercel` 로 호출 (`pnpm add -g`로는 PATH 안 잡힘) |
| Vercel 토큰 추출 | `~/Library/Application Support/com.vercel.cli/auth.json` 접근은 보안 정책상 막힘. CLI 통해서만 작업 |

---

## 10. 자연스러운 다음 작업 후보 (사용자가 고를 만한 것)

- [ ] **Vercel Git Integration 상태 확인** — GitHub 연결은 완료됨. Vercel preview/prod 자동 배포 연결 여부만 확인
- [ ] **Vercel Analytics 켜기** — 무료 tier 충분
- [ ] **OG 이미지 생성** — 현재 메타태그는 있지만 og:image 없음 (소셜 공유 시 미리보기 빈약). 1200×630 OG 카드 PNG 생성 → public/og.png 후 index.html에 link
- [ ] **Lighthouse 점수 측정** — 현재 미측정. perf/a11y/best-practices 100점 목표
- [ ] **이미지 webp 최적화** — `majorica-frog.png` (212KB)는 webp로 50% 감량 가능
- [ ] **Hermes 에이전트 경험 반영** — 몇 주 사용 후 공방 섹션 aside 업데이트
- [ ] **Gemini 3.5 Pro 출시 시** — 공방 섹션 스택에 추가

### 사용자가 명시적으로 안 한다고 한 것
- ❌ Hero에 떠다니는 마스코트 5마리 다시 추가 — 너무 시끄러움
- ❌ 그리모어/노트북 에세이 longform 직조 — 너무 sleepy
- ❌ 직접 그린 SVG 마조리카 — 공식 PNG 그대로 사용

---

## 11. 컨텍스트 압축본 (한 단락)

이태희(@maj0rika) FE 4y+/SWE 7y+, BHSN 리걸 AI 'Business Agent' 단독 담당(329 워크스페이스·495 라이선스 유료), 현재 SvelteKit→React+Vite+Turborepo 마이그레이션 진행 중. 사이트는 손글씨 무드(Kalam+Gaegu), 단일 viewport hero에 6개 자동 사이클 문장 + 글자 사이 괄호에 들어가는 공식 마조리카 PNG 마스코트. 이하 5개 섹션(본업/공방/side/이력/연락). 모션은 ambient 1 + reactive 1로 제한. 색은 녹색 계열 + 마조리카 색에서 출발한 도들 팔레트. Tailwind v4, framer-motion, useReducedMotion 가드. Vercel 배포(maj0rika.com), 도메인 Vercel 등록, www→apex 308. WCAG 통과(skip-link, aria-live, pause control 등). 데이터: Agent 단독 숫자와 플랫폼 전체 숫자는 명시적으로 분리해 표기. 카피 톤은 직설·동사+숫자+고유명사, 자기 형용사 금지.

---

## 12. 핸드오프 메시지 (사용자 → 다음 에이전트)

> "이 사이트 디자인은 손글씨 낙서 무드로 잡혀있고, 마조리카는 공식 PNG 그대로 써야 해. 헤로 6문장, 5섹션 구조, 정확한 숫자(329/495)는 락. 변경 후 검증 체크리스트(§8) 통과 안 하면 배포 금지. 함정(§9) 미리 읽어둬. 모르면 사용자에게 물어보고, 추측해서 디자인 결정 바꾸지 마."

— signed, Claude (handoff completed at <fill in: 2026-05-21 KST>)
