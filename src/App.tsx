import Hero from "./components/Hero";
import { MascotPeek } from "./components/Swoosh";

const bizagent = [
  "1개월 PoC로 시작한 리걸 AI 제품의 프론트엔드를 단독 담당, 유료 엔터프라이즈 SaaS 확장 과정의 핵심 AI UX 설계·구현",
  "법률 업무의 리서치·문서 확인·출처 검증·문서 생성을 LLM/RAG 기반 워크플로우로 전환하는 사용자 경험 제품화",
  "SSE 기반 LLM/RAG 챗 UX — 답변 생성·출처 표시·후속 탐색과 중단/에러/완료 상태를 하나의 대화 흐름으로 통합",
  "통합 검색: 조건 단위 캐싱 · in-flight Promise 병합 · URL 상태 동기화로 중복 요청 제거, 탭 전환 응답성 개선",
  "사내 REF 링크 규격 + Markdown tokenizer 확장으로 답변 내 법령·문서 출처에서 원문 조항으로 이동하는 Citation UX 구현",
  "PDF.js 뷰어에 가상 스크롤·스크롤 위치 동기화·OCR BBox 오버레이를 적용해 다중 페이지·스캔 문서 탐색 안정화",
  "SSE 기반 워크플로우 상태 복구 · Canvas 문서 생성/편집 · DOCX/PDF export 플로우 구현",
  "정규 릴리스 태깅 · FE 배포 · QA 사이클 · 핫픽스 대응으로 운영 제품 릴리스 안정성 개선",
  "사내 변호사·기획·AI/BE 팀과 협업해 법률 실무 요구를 제품 UX로 구체화, AI→BE→FE 순차 배포·QA 진행을 정리·공유",
];

const migration = [
  "SvelteKit 제품을 React 19 + Vite + Turborepo 모노레포로 단계적 전환",
  "Claude Code · Codex · Cursor · MCP를 활용해 설계·구현·리뷰·검증 단계를 분리한 AI-assisted 마이그레이션 프로세스 운영",
  "처음엔 'AI로 전환 속도 좀 올려보자'에 가까웠는데, 운영 제품을 옮기다 보니 AI가 맞는 말투로 틀릴 때가 제일 무섭다는 걸 배움",
  "그래서 결과를 바로 믿지 않고 소스·테스트·브라우저를 같이 보게 만들었고, 자주 터지는 실수는 프롬프트 규칙과 체크리스트에 적어두는 방식으로 바꿔감",
  "라우팅·페이지 셸·i18n·hosted mode를 분리하며 기존 기능을 신규 React 구조로 재구성",
  "기존 SvelteKit 화면과 새 React 화면을 나란히 비교하며, '겉보기엔 비슷한데 실제로는 다른' 부분을 테스트와 화면 확인으로 잡아냄",
  "반복되는 마이그레이션 작업은 다음에도 다시 써먹을 수 있게 프롬프트 규칙 · 체크리스트 · 검증 순서로 정리",
];

type TimedNote = {
  head: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

const workshop: TimedNote[] = [
  {
    head: "Claude · Codex · Cursor · OpenCode를 같이 굴립니다",
    body:
      "설계는 Claude(OMC), 구현은 Codex/OMX medium(가성비·속도 둘 다 좋아서 애용), 자잘한 건 Cursor Composer 2.5. 쿼터가 모자라면 OpenCode Go 같은 풀로 빠집니다. 한 도구에 매몰되지 않는 게 셋업의 기본 전제예요.",
    createdAt: "2026-06-02",
    updatedAt: "2026-06-02",
  },
  {
    head: "문제 크기에 맞춰 모델을 가릅니다",
    body:
      "복잡한 설계는 ralplan과 deep-interview로 깊게 파고, 가벼운 건 Codex 5.5 fast medium이나 Cursor Composer로 끊어요. 큰 모델에 작은 문제 던지는 게 시간·비용 양쪽에서 가장 큰 낭비라서요.",
    createdAt: "2026-06-02",
    updatedAt: "2026-06-05",
  },
  {
    head: "기본 모델과 화면 분석 모델을 나눕니다",
    body:
      "상시 대화와 가벼운 정리는 빠른 모델에 맡기고, 마우스 조작·스크린샷 분석처럼 화면 이해가 필요한 세션만 vision-capable 모델로 올립니다. 속도와 정확도를 한 모델에 모두 맡기지 않는 쪽이 운영이 안정적입니다.",
    createdAt: "2026-06-05",
    updatedAt: "2026-06-05",
  },
  {
    head: "어디서 열어도 규칙·컨텍스트가 따라온다",
    body:
      "node_modules, .env, .mcp.json, 에이전트 메모리, 스킬 — worktree나 clone 사이에서 끊기면 짜증나잖아요. 심볼릭 링크로 묶어두면 어떤 도구로 들어가도 같은 셋업이 따라옵니다.",
    createdAt: "2026-06-02",
    updatedAt: "2026-06-02",
  },
  {
    head: "수정 전에 도미노부터 봅니다",
    body:
      "MCP로 심볼이랑 참조를 따라가서, 이 한 줄 고치면 어디까지 같이 깨지는지 먼저 확인해요. 큰 코드베이스에선 그게 회귀 막는 가장 싼 방법이거든요.",
    createdAt: "2026-06-02",
    updatedAt: "2026-06-02",
  },
  {
    head: "AI가 끝났다고 끝난 게 아닙니다",
    body:
      "결과물은 항상 사람이 한 번 더 봅니다. 회귀 두 번 안 맞으려고 테스트 코드는 무조건 같이 남기는 룰을 문서에 박아뒀어요. 최근엔 goal 기능으로 작업 목표를 미리 묶어두는 것도 같이 굴려보는 중.",
    createdAt: "2026-06-02",
    updatedAt: "2026-06-02",
  },
  {
    head: "하네스는 자동화보다 검증 계약이 먼저입니다",
    body:
      "외부 Claude Code 하네스 사례를 볼 때도 도구 숫자보다 auto-select, contract-first QA, filesystem = truth 같은 운영 원칙을 먼저 봅니다. 우리 쪽에는 목표 → 증거 → 검증 → 공개 가능한 요약 순서로만 흡수합니다.",
    createdAt: "2026-06-02",
    updatedAt: "2026-06-02",
  },
];

const opsNotes: TimedNote[] = [
  {
    head: "지식베이스는 원문 저장소가 아니라 작업 방향판입니다",
    body:
      "Hermes 세션 검색, 스킬, 사용자 KB, GitHub/local repo 메타데이터를 묶되 토큰·메일·개인 메시지 원문은 배제합니다. 매일 공개 가능한 변화만 골라 개인 사이트 업데이트 후보로 올립니다.",
    createdAt: "2026-06-02",
    updatedAt: "2026-06-02",
  },
  {
    head: "어떤 맥에서 열어도 같은 컨텍스트로 시작합니다",
    body:
      "맥미니와 맥북 사이에서 레포·에이전트 규칙·스킬·검증 루틴이 끊기지 않게 경로와 실행 규칙을 고정합니다. 새 세션은 먼저 KB와 handoff가 아니라 실제 repo 상태부터 확인합니다.",
    createdAt: "2026-06-02",
    updatedAt: "2026-06-02",
  },
  {
    head: "완료 선언보다 증거를 먼저 남깁니다",
    body:
      "git diff --check, build, 브라우저 smoke, 로그, 스크린샷처럼 재현 가능한 근거를 completion의 일부로 둡니다. 실패하면 실패 로그에 privacy-safe하게 남기고, 억지 커밋은 하지 않습니다.",
    createdAt: "2026-06-02",
    updatedAt: "2026-06-02",
  },
  {
    head: "리소스 가드도 자동화의 일부입니다",
    body:
      "일일 업데이트는 CPU·메모리·사용량 스냅샷을 먼저 보고 병렬 에이전트 수를 조절합니다. 장기 실행·zombie 후보는 승인 목록으로 분리하고, 실행 중인 프로세스는 사람 승인 없이 끊지 않습니다.",
    createdAt: "2026-06-02",
    updatedAt: "2026-06-02",
  },
  {
    head: "온톨로지의 목적은 실수 재발 방지입니다",
    body:
      "OntologyHub는 단순한 공유 메모장이 아니라, observed → authored → pulled → applied → verified 상태를 나눠 다른 기기에서 같은 실수를 반복하지 않게 만드는 장치로 다룹니다.",
    createdAt: "2026-06-02",
    updatedAt: "2026-06-02",
  },
  {
    head: "작은 일에는 작은 검증 예산을 둡니다",
    body:
      "모든 요청을 고위험 작업처럼 깊게 파면 속도가 망가집니다. 작업 크기와 위험도에 따라 읽을 컨텍스트, 테스트 강도, 증거 수준을 먼저 정하고 필요한 때만 깊게 들어갑니다.",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
  },
  {
    head: "검증을 통과해야 빌드·배포로 갑니다",
    body:
      "포트폴리오 자동 업데이트는 읽기 전용 콘텐츠 검증을 먼저 실행하고, 실패하면 빌드·배포를 중단합니다.",
    createdAt: "2026-07-14",
    updatedAt: "2026-07-14",
  },
];

const builds = [
  {
    name: "AI 가계부",
    tag: "공개 실험",
    desc:
      "자연어·이미지 기반 소비 내역 입력과 입력 특성별 다중 LLM 라우팅을 구현. Origin 검증, rate limit, AES-256-GCM 필드 암호화까지 붙여 웹+모바일 단일 코드베이스(Capacitor)로 운영.",
    stack: "Next.js · Supabase · Capacitor · MiniMax / Fireworks / Kimi",
    link: "https://household-account-book-tawny.vercel.app",
    note: "데모는 공개 URL에서 이용할 수 있습니다.",
    created: "2025.11",
    updated: "2026-06-24",
  },
  {
    name: "Vapor UI Compliance Workbench",
    tag: "공개 도구",
    desc:
      "규칙 엔진의 결정론적 검사만으로 PASS/WARN/FAIL을 판정하며, 레이아웃·Vapor 컴포넌트·토큰/스타일·접근성·반응형/테마·코드 품질·문서 준비도의 7개 게이트를 측정하는 로컬 UI 컴플라이언스 감사 도구.",
    stack: "React · TypeScript · Vite · Vapor UI · Tailwind CSS v4",
    link: "https://github.com/maj0rika/vapor-compliance-workbench",
    note: "공개 GitHub README 기반으로 추가",
    created: "2026-05-27",
    updated: "2026-05-27",
  },
  {
    name: "dreamrealm",
    tag: "공개 실험",
    desc:
      "AI 기반 영속적 세계 구축 아이디어를 TypeScript로 탐색한 공개 실험. 세계관·상태·사용자 상호작용을 제품 화면으로 옮기는 방향을 검토합니다.",
    stack: "TypeScript · AI Product Prototype · Worldbuilding UX",
    link: "https://github.com/maj0rika/dreamrealm",
    note: "공개 GitHub repo 설명 기반으로 추가",
    created: "2026-06-09",
    updated: "2026-06-09",
  },
  {
    name: "ht-exercise-counter",
    tag: "공개 자동화",
    desc:
      "운동 인증 카운팅을 자동화하기 위한 Python 기반 공개 유틸리티. 반복 기록을 사람이 검수 가능한 숫자와 로그로 바꾸는 작은 도구입니다.",
    stack: "Python · Automation · Tracking Utility",
    link: "https://github.com/maj0rika/ht-exercise-counter",
    note: "공개 GitHub repo 메타데이터 기반으로 추가",
    created: "2026-06-09",
    updated: "2026-06-09",
  },
  {
    name: "mac-ai-orphan-cleaner",
    tag: "공개 도구",
    desc:
      "고아 MCP·AI 툴체인 헬퍼와 유휴 렌더러 프로세스를 안전 기준을 통과한 경우에만 정리하는 macOS용 Shell 도구. 단일 상태값 대신 부모 체인·실행 경로·누적 CPU 변화 등 복수 조건을 함께 확인해 오탐 정리를 줄이는 방향으로 안전 기준을 보강합니다.",
    stack: "Shell · macOS · AI Tooling Ops",
    link: "https://github.com/maj0rika/mac-ai-orphan-cleaner",
    note: "공개 GitHub repo 메타데이터 기반으로 추가",
    created: "2026-04",
    updated: "2026-08-08",
  },
  {
    name: "agent-skills",
    tag: "공개 지식 자산",
    desc:
      "AI coding agent가 재사용할 수 있는 production-grade engineering skill과 운영 규칙을 모아두는 공개 저장소.",
    stack: "Shell · Agent Workflow · Engineering Playbook",
    link: "https://github.com/maj0rika/agent-skills",
    note: "공개 GitHub repo 메타데이터 기반으로 추가",
    created: "2026-04",
    updated: "2026-06-08",
  },
];

const history = [
  {
    company: "BHSN — Frontend Engineer",
    period: "2023.08 — 현재",
    note: "Allibee Business Agent (리걸 AI SaaS) · CLM (계약 관리 솔루션). 위 본업 섹션 참조.",
  },
  {
    company: "CodeRecipe — Frontend Developer",
    period: "2022.02 — 2023.04",
    note:
      "물류 SaaS Logipasta Admin 실시간 미리보기 개편 (관련 기술지원 문의 50%+ 감소), 공통 UI 컴포넌트 설계. 뉴스 플랫폼 QNN24를 PHP → Vue3/Nuxt 전환, S3 Signed URL 업로드 · I'mport 결제 연동.",
  },
  {
    company: "세라에스이 — Embedded Developer",
    period: "2019.01 — 2022.02",
    note:
      "산업용 오일 센서 모니터링 펌웨어 · RFID 장비 개선 (특허 출원 참여). RFID 인식거리 개선으로 현대엘리베이터 납품.",
  },
];

function dateTimeValue(value: string) {
  return value.replace(/\./g, "-");
}

function DateStamp({ kind, value, label }: { kind: "created" | "updated" | "added"; value: string; label: string }) {
  const text = kind === "created" ? "작성일" : kind === "added" ? "추가일" : "업데이트";
  return (
    <span className="stamp" aria-label={`${label} ${value}`}>
      {text} · <time dateTime={dateTimeValue(value)}>{value}</time>
    </span>
  );
}

function SectionHead({ chapter, title, updated }: { chapter: string; title: string; updated?: string }) {
  return (
    <header className="mb-10 grid gap-2 sm:mb-12 sm:grid-cols-[160px_1fr] sm:items-baseline sm:gap-8">
      <span className="label-mono">{chapter}</span>
      <div className="grid gap-1.5">
        <h2 className="font-display text-2xl font-bold leading-tight tracking-[-0.012em] text-(--color-ink) sm:text-[2.1rem]" style={{ fontWeight: 700 }}>{title}</h2>
        {updated && <DateStamp kind="updated" value={updated} label="마지막 업데이트" />}
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-dvh">
      <Hero />

      <main id="main-content" className="paper-grain relative bg-(--color-paper-2)" tabIndex={-1}>
        {/* 차례 — 빠른 읽기 경로 */}
        <nav aria-label="차례" className="note-index mx-auto w-full max-w-[860px] px-6 pt-16 sm:px-10 sm:pt-20">
          <p className="label-mono mb-3">· 차례 · 30초 스캔</p>
          <ol className="note-index__list">
            <li><a className="note-index__link" href="#bizagent">본업 — 리걸 AI SaaS</a></li>
            <li><a className="note-index__link" href="#workshop">공방 — AI 도구 셋업</a></li>
            <li><a className="note-index__link" href="#ops">운영 — 컨텍스트·검증</a></li>
            <li><a className="note-index__link" href="#builds">공개 실험</a></li>
            <li><a className="note-index__link" href="#history">이력 7년</a></li>
            <li><a className="note-index__link" href="#knock">연락</a></li>
          </ol>
        </nav>

        {/* 본업 */}
        <section id="bizagent" className="mx-auto w-full max-w-[860px] px-6 py-24 sm:px-10 sm:py-28">
          <SectionHead chapter="i · 본업" title="Business Agent — 리걸 AI SaaS Frontend" updated="2026-07-20" />
          <p className="mb-3 max-w-[64ch] text-[1.02rem] leading-[1.8] text-(--color-ink-2)">
            BHSN의 리걸 AI 에이전트예요. 2024년 7월부터 프론트엔드를 단독으로 담당해 왔습니다.
            지금은 Agent 단독 유료 구독이 <strong className="font-semibold text-(--color-ink)">329개 워크스페이스</strong> · <strong className="font-semibold text-(--color-ink)">495개 라이선스</strong>. 참고로 Allibee 플랫폼 전체(Agent + CLM)는 누적 가입 <span className="text-(--color-ink-3)">2,767 워크스페이스 · 10,393 계정</span>이고, 위 Agent 숫자는 그중 유료 구독분입니다.
            율촌·CJ 같은 엔터프라이즈 고객사에 납품하면서 들어오는 실사용 피드백은 가능한 한 SaaS 공통 기능으로 녹여 넣습니다. <span className="text-(--color-ink-3)">(2026.05 기준)</span>
          </p>
          <p className="mb-8 font-mono text-xs text-(--color-ink-3)">
            데모는 공개 URL <a className="quill-link" href="https://demo.allibee.ai" target="_blank" rel="noreferrer" aria-label="Business Agent 데모 (새 탭)">demo.allibee.ai</a>에서 이용할 수 있습니다.
          </p>
          <ul className="space-y-3 text-[0.98rem] leading-[1.78] text-(--color-ink-2)">
            {bizagent.map((b) => (
              <li key={b} className="grid grid-cols-[auto_1fr] gap-x-3">
                <span aria-hidden className="select-none text-(--color-moss)">—</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 border-t border-(--color-ink)/10 pt-8">
            <h3 className="font-mono text-xs uppercase tracking-[0.24em] text-(--color-moss)">
              · Business Agent React 마이그레이션 · 2026.04 — 현재
            </h3>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <DateStamp kind="added" value="2026-06-02" label="추가일" />
              <DateStamp kind="updated" value="2026-06-18" label="업데이트" />
            </div>
            <p className="mt-3 mb-4 max-w-[60ch] text-sm italic text-(--color-ink-3)">
              전환 배경 — 설치형(온프레미스) 엔터프라이즈 도입 가속 · 모바일 디자인 대응 · React 인력 확보 및 인수인계 용이성.
            </p>
            <ul className="space-y-3 text-[0.98rem] leading-[1.78] text-(--color-ink-2)">
              {migration.map((b) => (
                <li key={b} className="grid grid-cols-[auto_1fr] gap-x-3">
                  <span aria-hidden className="select-none text-(--color-moss)">—</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 작업장 / AX */}
        <section id="workshop" className="bg-(--color-paper)">
          <div className="mx-auto w-full max-w-[860px] px-6 py-24 sm:px-10 sm:py-28">
            <SectionHead
              chapter="ii · 공방 · AX"
              title="AI 도구 셋업이 어쩌다 본업의 절반이 됐어요."
              updated="2026-06-05"
            />
            <p className="mb-10 max-w-[62ch] text-[1.02rem] leading-[1.8] text-(--color-ink-2)">
              한 AI 도구에 매몰되면 그 도구가 막히는 날이 작업이 멈추는 날이 됩니다. 그래서 도구를 일찍부터 분산하고, 규칙·컨텍스트·검증을 같은 표준으로 묶어서 굴려요.
            </p>
            <ol className="space-y-9">
              {workshop.map((w, i) => (
                <li key={w.head} className="grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-7">
                  <span className="num-display text-2xl text-(--color-moss-light) sm:text-3xl" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-(--color-ink) sm:text-xl">{w.head}</h4>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <DateStamp kind="added" value={w.createdAt} label="추가일" />
                      <DateStamp kind="updated" value={w.updatedAt} label="업데이트" />
                    </div>
                    <p className="mt-1.5 text-[0.98rem] leading-[1.78] text-(--color-ink-2)">{w.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <aside className="mt-12 space-y-3 border-l-2 border-(--color-moss-light) pl-5 text-[0.95rem] leading-[1.8] text-(--color-ink-2)">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--color-moss)">
                · 지금 다루는 것 · 다음 시도
              </p>
              <p>
                개인 맥미니에 학습형 에이전트 <strong className="font-semibold text-(--color-ink)">Hermes</strong>를 띄워 세션 검색·스킬·크론 작업을 계속 축적하고 있습니다.
                도구가 나를 학습하게 하되, 공개 가능한 요약과 민감 원문을 분리하는 게 다음 셋업의 핵심이에요.
              </p>
              <p>
                <strong className="font-semibold text-(--color-ink)">Gemini 3.5 Flash</strong>랑 <strong className="font-semibold text-(--color-ink)">Antigravity CLI</strong>도 나왔지만, 3.5 Pro가 나오면 그때 넣어보려고 합니다 —
                모델이 충분히 강해질 때까지 기다리는 것도 도구 선택의 일부라서요.
              </p>
            </aside>
          </div>
        </section>

        {/* Knowledge Ops */}
        <section id="ops" className="mx-auto w-full max-w-[860px] px-6 py-24 sm:px-10 sm:py-28">
          <SectionHead chapter="iii · 운영" title="컨텍스트를 쌓되, 공개 가능한 것만 밖으로 보냅니다." updated="2026-07-14" />
          <p className="mb-10 max-w-[62ch] text-[1.02rem] leading-[1.8] text-(--color-ink-2)">
            AI-assisted development는 모델 이름표를 모으는 일이 아니라, 흩어진 문서·결정·반복 질문을 다시 찾을 수 있게 묶는 일입니다.
            여러 기기와 여러 에이전트가 같은 맥락에서 출발하고, 한 기기에서 배운 실패를 다른 기기에서 반복하지 않도록 결과는 사람이 검증 가능한 증거로 다시 묶어야 합니다.
          </p>
          <div className="space-y-9">
            {opsNotes.map((note, i) => (
              <article key={note.head} className="grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-7">
                <div className="num-display text-2xl text-(--color-moss-light) sm:text-3xl" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="label-mono mb-1">· 운영 원칙 {String(i + 1).padStart(2, "0")}</p>
                  <h3 className="text-lg font-bold text-(--color-ink) sm:text-xl">{note.head}</h3>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <DateStamp kind="added" value={note.createdAt} label="추가일" />
                    <DateStamp kind="updated" value={note.updatedAt} label="업데이트" />
                  </div>
                  <p className="mt-1.5 text-[0.98rem] leading-[1.78] text-(--color-ink-2)">{note.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Side Projects */}
        <section id="builds" className="mx-auto w-full max-w-[860px] px-6 py-24 sm:px-10 sm:py-28">
          <SectionHead chapter="iv · side" title="공개 실험" updated="2026-07-05" />
          <p className="mb-10 max-w-[62ch] text-[0.98rem] leading-[1.8] text-(--color-ink-2)">
            아래 프로젝트들은 현재 지속 운영 중인 서비스라기보다, 아이디어와 구현 과정을 공개해 둔 실험이자 아카이브입니다.
          </p>
          <div className="space-y-10">
            {builds.map((p, i) => (
              <article key={p.name} className="grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-7">
                <div className="num-display text-2xl text-(--color-moss-light) sm:text-3xl">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-xl font-bold text-(--color-ink) sm:text-2xl">{p.name}</h3>
                    <span className="font-mono text-[11px] tracking-wider text-(--color-ink-3)">{p.tag}</span>
                  </div>
                  <p className="mt-1.5 text-[0.98rem] leading-[1.78] text-(--color-ink-2)">{p.desc}</p>
                  <div className="mt-2 font-mono text-xs text-(--color-moss)">{p.stack}</div>
                  {(p.created || p.updated) && (
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {p.created && <DateStamp kind="created" value={p.created} label="만든 날" />}
                      {p.updated && <DateStamp kind="updated" value={p.updated} label="마지막 업데이트" />}
                    </div>
                  )}
                  {p.note && (
                    <div className="mt-1 font-mono text-[11px] text-(--color-ink-3)">{p.note}</div>
                  )}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="quill-link mt-2 inline-block text-sm" aria-label={`${p.name} 라이브 사이트 (새 탭)`}>
                      라이브 보기 →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 이력 7년 */}
        <section id="history" className="bg-(--color-paper)">
          <div className="mx-auto w-full max-w-[860px] px-6 py-24 sm:px-10 sm:py-28">
            <SectionHead chapter="v · 이력 7년" title="처음 만진 건 임베디드, 지금은 AX 프론트엔드." updated="2026.05" />
            <ol className="space-y-7">
              {history.map((h) => (
                <li key={h.company} className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <div className="font-mono text-xs tracking-wider text-(--color-ink-3)">{h.period}</div>
                  <div>
                    <h4 className="text-base font-bold text-(--color-ink) sm:text-lg">{h.company}</h4>
                    <p className="mt-1 text-[0.95rem] leading-[1.75] text-(--color-ink-2)">{h.note}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12 border-t border-(--color-ink)/10 pt-8">
              <h3 className="font-mono text-xs uppercase tracking-[0.24em] text-(--color-moss)">
                · Education
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-(--color-ink-2)">
                호서대학교 정보통신공학과 수석 졸업 (4.2/4.5) · 2013.03 — 2019.02
              </p>
            </div>
          </div>
        </section>

        {/* 연락 */}
        <section id="knock" className="mx-auto w-full max-w-[860px] px-6 py-24 sm:px-10 sm:py-28">
          <SectionHead chapter="vi · 연락 · Knock" title="얘기 나눠요." updated="2026.06" />
          <div className="grid items-end gap-8 sm:grid-cols-[1fr_auto]">
            <div className="space-y-5">
              <p className="max-w-[58ch] text-[1.02rem] leading-[1.8] text-(--color-ink-2)">
                AI 제품 UX, 엔터프라이즈 SaaS, AI 도구 셋업 — 같이 만질 사람을 찾는 곳이라면 메일 한 통 주세요.
                Svelte 좋아하는 마음으로 React로 넘어가는 중이고, Claude Code · Codex · MCP 같이 굴려보고 싶은 분들과 얘기하는 게 제일 재밌습니다.
              </p>
              <p className="max-w-[58ch] text-[0.95rem] leading-[1.8] text-(--color-ink-3)">
                이런 걸 적어 주시면 답이 빨라요 — 함께 만질 제품·범위, 기대하는 역할, 대략의 일정.
              </p>
              <ul className="contact-reasons" aria-label="연락하면 좋은 주제">
                <li>AX 도입 · AI 도구 셋업을 실제 제품 흐름에 붙이는 일</li>
                <li>프론트엔드 협업 · SvelteKit에서 React로 넘어가는 마이그레이션</li>
                <li>Claude Code · Codex · MCP를 같이 굴려보는 커피챗</li>
              </ul>
              <a
                href="mailto:neu5563@naver.com?subject=maj0rika.com%20%E2%80%94%20%EA%B0%99%EC%9D%B4%20%EB%A7%8C%EB%93%A4%20%EC%A0%9C%EC%95%88&body=%ED%95%A8%EA%BB%98%20%EB%A7%8C%EC%A7%88%20%EC%A0%9C%ED%92%88%2F%EB%B2%94%EC%9C%84%3A%0A%EA%B8%B0%EB%8C%80%ED%95%98%EB%8A%94%20%EC%97%AD%ED%95%A0%3A%0A%EB%8C%80%EB%9E%B5%EC%9D%98%20%EC%9D%BC%EC%A0%95%3A%0A"
                className="doodle-box doodle-hover font-display text-lg font-bold text-(--color-ink)"
                aria-label="제안 내용을 담아 이메일 보내기 (neu5563@naver.com)"
              >
                메일로 제안 보내기 →
              </a>
              <dl className="space-y-2 font-mono text-[0.9rem] text-(--color-ink-2)">
                <div className="flex gap-3"><dt className="w-16 text-(--color-ink-3)">email</dt><dd><a className="quill-link" href="mailto:neu5563@naver.com" aria-label="이메일 neu5563@naver.com">neu5563@naver.com</a></dd></div>
                <div className="flex gap-3"><dt className="w-16 text-(--color-ink-3)">tel</dt><dd><a className="quill-link" href="tel:+821022438353" aria-label="전화 010-2243-8353">010-2243-8353</a></dd></div>
                <div className="flex gap-3"><dt className="w-16 text-(--color-ink-3)">github</dt><dd><a className="quill-link" href="https://github.com/maj0rika" target="_blank" rel="noreferrer" aria-label="GitHub @maj0rika (새 탭)">@maj0rika</a></dd></div>
                <div className="flex gap-3"><dt className="w-16 text-(--color-ink-3)">demo</dt><dd><a className="quill-link" href="https://demo.allibee.ai" target="_blank" rel="noreferrer" aria-label="Business Agent 데모 사이트 (새 탭)">demo.allibee.ai</a></dd></div>
              </dl>
            </div>
            <MascotPeek className="h-32 w-24 sm:h-40 sm:w-32" />
          </div>
        </section>

        <footer className="mx-auto w-full max-w-[860px] px-6 pb-12 pt-4 sm:px-10">
          <hr className="mb-6 border-t border-(--color-ink)/10" />
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.28em] text-(--color-ink-3)">
            © {new Date().getFullYear()} · Lee Taehee · maj0rika.com
          </p>
        </footer>
      </main>
    </div>
  );
}
