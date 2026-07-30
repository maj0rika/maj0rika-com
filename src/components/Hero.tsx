import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const CYCLE_MS = 5000;

type Variant = { pre: string; post: string; lang?: "ko" | "en" };

const VARIANTS: Variant[] = [
  { pre: "리걸 AI 만들다 보니", post: "도 4년차예요." },
  { pre: "한 달 PoC라더니, 4년째", post: "와 굴리는 중." },
  { pre: "Svelte 잘 합니다.", post: "가 React 가자고 해서요." },
  { pre: "Cursor 깔러 갔다가, MCP 서버 만들고 왔어요", post: "." },
  { pre: "AI가 끝냈다고요? 저는", post: "로 다시 봅니다." },
  { pre: "법령 출처 안 달면 변호사가 안 써요", post: "." },
  { pre: "Software Engineer, Seoul", post: " — since 2019.", lang: "en" },
];

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const prefersReduced = useReducedMotion();

  const paused = userPaused || hoverPaused || tabHidden || !!prefersReduced;
  const current = VARIANTS[idx];

  const next = () => setIdx((i) => (i + 1) % VARIANTS.length);
  const prev = () => setIdx((i) => (i - 1 + VARIANTS.length) % VARIANTS.length);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, CYCLE_MS);
    return () => clearTimeout(t);
  }, [idx, paused]);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const sentenceLang = current.lang ?? "ko";

  return (
    <section
      id="top"
      className="relative isolate flex min-h-dvh w-full flex-col overflow-hidden"
      aria-label="이태희 소개"
    >
      <a href="#main-content" className="skip-link">본문으로 건너뛰기</a>

      {/* TOP NAV */}
      <header className="relative z-20 mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 pt-7 sm:px-10 sm:pt-9">
        <a
          href="#top"
          className="font-display text-xl font-bold text-(--color-ink) sm:text-2xl"
          aria-label="maj0rika.com 홈"
        >
          maj0rika.com
        </a>
        <nav
          aria-label="주요 섹션"
          className="flex flex-wrap items-center gap-3 font-display text-base sm:gap-6 sm:text-lg"
        >
          <a href="#bizagent" className="hover:text-(--color-clay)">본업</a>
          <a href="#workshop" className="hover:text-(--color-clay)">공방</a>
          <a href="#ops" className="hover:text-(--color-clay)">운영</a>
          <a href="#builds" className="hover:text-(--color-clay)">side</a>
          <a href="#history" className="hover:text-(--color-clay)">7년</a>
          <a href="#knock" className="hover:text-(--color-clay)">연락</a>
        </nav>
      </header>

      {/* MAIN POSTER */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] grow flex-col justify-center px-6 sm:px-10">
        <p className="label-mono mb-6 sm:mb-8">
          Lee Taehee · AX Frontend Engineer · LLM/RAG SaaS
        </p>

        <div
          className="group block text-left"
          onMouseEnter={() => setHoverPaused(true)}
          onMouseLeave={() => setHoverPaused(false)}
        >
          <button
            type="button"
            onClick={next}
            aria-label={`다음 소개 문장으로 (현재 ${idx + 1} / ${VARIANTS.length})`}
            className="block w-full cursor-pointer text-left focus:outline-none focus-visible:outline-none focus-visible:ring-0"
            onFocus={() => setHoverPaused(true)}
            onBlur={() => setHoverPaused(false)}
          >
            <h1 aria-live="polite" aria-atomic="true">
              <span className="sr-only">
                {current.pre} 마조리카{current.post}
              </span>
            </h1>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={idx}
                aria-hidden="true"
                initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: prefersReduced ? 0 : 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                lang={sentenceLang}
                className={
                  "font-display font-bold leading-[1.18] text-(--color-ink) " +
                  (sentenceLang === "en"
                    ? "text-[clamp(2.4rem,7vw,6.4rem)]"
                    : "text-[clamp(2.2rem,6.2vw,5.8rem)]")
                }
              >
                <span>{current.pre}</span>
                <span className="mx-1 inline-flex translate-y-[0.2em] items-baseline">
                  <span className="font-display font-bold text-(--color-ink) transition-transform duration-300 ease-out group-hover:-rotate-[6deg]">
                    (
                  </span>
                  <motion.span
                    className="mx-1 inline-block"
                    animate={prefersReduced ? undefined : { rotate: [-3, 3, -3] }}
                    transition={prefersReduced ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: "1.15em", height: "1.35em" }}
                  >
                    <img
                      src="/majorica-frog-sm.webp"
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  </motion.span>
                  <span className="font-display font-bold text-(--color-ink) transition-transform duration-300 ease-out group-hover:rotate-[6deg]">
                    )
                  </span>
                </span>
                <span>{current.post}</span>
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Controls — hand-drawn */}
          <div
            className="mt-6 flex items-center gap-3 font-display text-lg text-(--color-ink-2)"
            role="group"
            aria-label="소개 문장 컨트롤"
          >
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? "자동 재생 시작" : "자동 재생 일시정지"}
              aria-pressed={userPaused}
              className="doodle-box font-display text-sm sm:text-base"
            >
              <span aria-hidden="true">{userPaused ? "▶ play" : "❚❚ pause"}</span>
            </button>

            <span
              className="relative inline-block h-[3px] w-20 overflow-hidden"
              role="progressbar"
              aria-label={`현재 ${idx + 1}번째 문장, 총 ${VARIANTS.length}개`}
              aria-valuemin={1}
              aria-valuemax={VARIANTS.length}
              aria-valuenow={idx + 1}
              style={{
                background: "color-mix(in oklab, var(--color-ink) 18%, transparent)",
                borderRadius: "2px",
              }}
            >
              {!paused && !prefersReduced && (
                <motion.span
                  key={idx}
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0"
                  style={{ background: "var(--color-ink)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                />
              )}
              {(paused || prefersReduced) && (
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-full" style={{ background: "color-mix(in oklab, var(--color-ink) 30%, transparent)" }} />
              )}
            </span>

            <span aria-hidden="true" className="text-base sm:text-lg">
              마조리카 한 번 찔러보세요 · {idx + 1}/{VARIANTS.length}
            </span>

            <button
              type="button"
              onClick={prev}
              aria-label="이전 문장"
              className="ml-auto text-lg hover:text-(--color-clay) sm:ml-0 sm:text-xl"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="다음 문장"
              className="text-lg hover:text-(--color-clay) sm:text-xl"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="mt-10 max-w-[58ch] text-[1.15rem] leading-[1.7] text-(--color-ink-2) sm:mt-14 sm:text-[1.25rem]">
          <p>
            BHSN에서 리걸 AI 에이전트 <strong className="doodle-underline font-bold text-(--color-ink)">'Business Agent'</strong> 프론트엔드를 단독으로 담당하고 있어요.
          </p>
          <p className="mt-2">
            한 달짜리 PoC였는데, 지금은 유료 구독 워크스페이스 <strong className="font-bold text-(--color-ink)">329</strong> · 라이선스 <strong className="font-bold text-(--color-ink)">495</strong>까지 왔습니다. <span className="text-(--color-ink-3)">(2026.05 기준)</span>
          </p>
          <p className="mt-2">
            AI 도구는 일하다 만지기 시작했는데, 어느 순간 그게 또 일이 돼버렸네요.
          </p>
        </div>

        {/* 연장통 — 손에 익은 도구 (recruiter 5초 스캔용 margin-note ribbon) */}
        <p className="stack-strip">
          <span className="stack-lead">· 연장통 · 손에 익은 도구 </span>
          <span className="stack-group">프론트 </span>
          <span className="stack-item">TypeScript </span>
          <span aria-hidden="true" className="stack-sep">·</span>
          <span className="stack-chip">React</span>
          <span aria-hidden="true" className="stack-sep">·</span>
          <span className="stack-item"> SvelteKit </span>
          <span aria-hidden="true" className="stack-sep">·</span>
          <span className="stack-item">Next.js </span>

          <span className="stack-group">AI UX </span>
          <span className="stack-item">LLM 스트리밍(SSE) </span>
          <span aria-hidden="true" className="stack-sep">·</span>
          <span className="stack-chip stack-chip--alt">출처 검증 UX</span>
          <span aria-hidden="true" className="stack-sep">·</span>
          <span className="stack-item"> PDF.js </span>

          <span className="stack-group">도구 </span>
          <span className="stack-item">Claude Code </span>
          <span aria-hidden="true" className="stack-sep">·</span>
          <span className="stack-item">MCP </span>
        </p>
      </div>

      {/* BOTTOM */}
      <footer className="relative z-10 mx-auto flex w-full max-w-[1280px] items-end justify-between gap-6 px-6 pb-7 font-display text-base text-(--color-ink-3) sm:px-10 sm:pb-9 sm:text-lg">
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <span>© Lee Taehee</span>
          <span className="hidden sm:inline" aria-hidden="true">FE 4y+ · SWE 7y+</span>
          <span className="sr-only">프론트엔드 4년 이상, 소프트웨어 엔지니어링 7년 이상.</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a className="doodle-box doodle-hover hover:text-(--color-clay)" href="https://demo.allibee.ai" target="_blank" rel="noreferrer" aria-label="Business Agent 데모 (새 탭)">demo</a>
          <a className="hover:text-(--color-clay)" href="mailto:neu5563@naver.com" aria-label="이메일 보내기">say hi</a>
          <a className="hover:text-(--color-clay)" href="https://github.com/maj0rika" target="_blank" rel="noreferrer" aria-label="GitHub @maj0rika (새 탭)">github</a>
          <a className="hover:text-(--color-clay)" href="/resume.html" target="_blank" rel="noreferrer" aria-label="이력서 (새 탭)">resume</a>
          <a className="hover:text-(--color-clay)" href="#bizagent" aria-label="본업 섹션으로 이동">scroll ↓</a>
        </div>
      </footer>
    </section>
  );
}
