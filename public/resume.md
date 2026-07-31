# 이태희 (Lee Taehee)

**AX Frontend Engineer** · LLM/RAG SaaS · AI-native Development Workflow

neu5563@naver.com · 010-2243-8353 · https://maj0rika.com · GitHub [@maj0rika](https://github.com/maj0rika)

업데이트: 2026-07-29

---

## Summary

LLM/RAG 기반 엔터프라이즈 SaaS의 사용자 경험과 AI-assisted 개발 프로세스를 함께 설계해 온 **AX Frontend Engineer**입니다. *(Frontend 4년+ / Software Engineering 7년+)*

- **AI 제품 UX** — BHSN 리걸 AI SaaS Business Agent(Allibee) 프론트엔드를 단독 담당. 실시간 챗·통합 검색·출처 검증·PDF/OCR 뷰어·워크플로우 UX를 1개월 PoC부터 유료 엔터프라이즈 제품까지 제품화
- **AI-assisted 개발** — Claude Code · Codex · Cursor · MCP로 설계·구현·리뷰·검증 단계를 분리한 개발 체계를 직접 구성·운영
- **Knowledge Ops** — 공개 가능한 요약과 민감 원문을 분리하고, 여러 기기·에이전트 작업에서도 검증 가능한 컨텍스트 운영 원칙을 적용.
- **현재** — SvelteKit 프로덕션 경험이 가장 깊고, 운영 제품의 React + Vite + Turborepo 전환을 진행 중

---

## 핵심 성과

- 리걸 AI 에이전트 **Business Agent**의 프론트엔드를 단독 담당해 LLM 챗 · RAG 검색 · 출처 검증 · 문서 뷰어 · 워크플로우 UX를 제품화 — **해당 Agent는 유료 구독 329개 워크스페이스 · 495개 라이선스 규모로 운영.** *(2026-05-20 기준)*
- Agent가 속한 **Allibee 플랫폼**(Business Agent + CLM)은 누적 가입 워크스페이스 **2,767** · 계정 **10,393** 규모로 운영되며 (Agent 유료 구독분은 위 숫자), 율촌·CJ 등 엔터프라이즈 고객사 납품 과정에서 얻은 **실사용 피드백을 SaaS 공통 제품 기능으로 반영**해 현장 요구를 제품 개선으로 연결
- SSE 기반 LLM 스트리밍과 사내 REF 링크 규격, Markdown tokenizer 확장으로 답변·출처·원문 조항을 연결하는 **출처 검증형 RAG UX** 구현
- Claude Code · Codex · Cursor · MCP 기반 **AI-assisted 개발 체계**를 구성해 설계·구현·리뷰·검증 단계를 분리 운영
- SvelteKit 제품의 React 19 + Vite + Turborepo 전환에 위 체계를 적용해 변경 영향도 분석·회귀 방지 검증 루틴 구축
- SvelteKit 모노레포의 Business Agent 기능 패키지(`packages/service`)에서 통합 검색·법령 딥링크·PDF/OCR 뷰어·워크플로우·export 플로우를 주도적으로 개발 *(1,300+ commits)*

---

## Skills

- **AX / AI-assisted Engineering:** Claude Code · Codex · Cursor · MCP · Hermes Agent · AI Code Review · Change Impact Analysis · Parity Verification
- **Knowledge Ops:** Session Search · Skills · Cron Automation · Public-safe KB Summarization · Contract-first QA · Filesystem Evidence · Task-size Routing
- **AI Product UX:** LLM Streaming(SSE) · RAG Result Rendering · Citation / Source UX · Multi-LLM Routing UX · Agentic Workflow UX
- **Frontend:** TypeScript · SvelteKit · React · Next.js · Vite · Turborepo · Tailwind CSS
- **Document UX:** PDF.js · OCR BBox Overlay · Markdown Parser Customization · DOCX / PDF Export
- **State / Infra:** Zustand · Pinia · Supabase · AWS S3 · GitHub Actions
- **Previous Experience:** Vue · Nuxt · PHP Migration · Embedded Firmware

---

## AX / AI-assisted Engineering

추가일: 2026-06-02 · 업데이트: 2026-07-14

- Claude Code · Codex · Cursor · MCP를 조합해 설계·구현·리뷰·검증 단계를 분리한 AI-assisted 개발 워크플로우 구성
- 포트폴리오 자동 업데이트는 읽기 전용 콘텐츠 검증을 먼저 실행하고, 실패하면 빌드·배포를 중단
- Hermes 세션 검색·스킬·크론·사용자 KB를 활용해 여러 기기와 에이전트 사이의 작업 컨텍스트를 이어가는 public-safe knowledge ops 운영
- OntologyHub를 단순 공유 메모가 아니라 한 기기에서 배운 실패를 다른 기기에서 반복하지 않게 만드는 guardrail/verification 루프로 설계
- MCP 기반 심볼 탐색과 변경 영향도 분석을 활용해 대규모 코드베이스에서 수정 범위·의존성·회귀 가능성을 사전 점검
- AI 도구별 규칙·컨텍스트·리뷰 기준을 동기화해 Claude Code · Codex · Cursor 간 작업 품질 편차 감소
- 상시 대화/가벼운 정리는 빠른 모델로 처리하고, 마우스 조작·스크린샷 분석처럼 화면 이해가 필요한 세션은 vision-capable 모델로 분리해 속도와 정확도를 함께 관리
- 반복되는 구현·검증 패턴을 템플릿·체크리스트·프롬프트 규칙으로 표준화해 재사용 가능한 개발 프로세스로 전환
- 외부 Claude Code 하네스 사례를 리서치해 auto-select, contract-first QA, filesystem-as-truth, usage gate 같은 운영 패턴을 내 워크플로우에 맞게 선별 흡수
- 작은 수정과 고위험 변경을 같은 깊이로 다루지 않도록 작업 크기·위험도별 컨텍스트 탐색량, 테스트 강도, 증거 수준을 먼저 정하는 Fast Path 운영 원칙을 추가

---

## Experience

### 주식회사 비에이치에스엔(BHSN) — Frontend Engineer · 2023.08 ~ 현재

리걸테크 스타트업에서 AI 법률 비서 제품군의 프론트엔드를 담당하고 있습니다.

#### Allibee(Business Agent) — 리걸 AI SaaS Frontend · 2024.07 ~ 현재

데모는 공개 URL https://demo.allibee.ai에서 이용할 수 있습니다.

- 1개월 PoC로 시작한 리걸 AI 제품의 프론트엔드를 단독 담당하며, 유료 엔터프라이즈 SaaS로 확장되는 과정의 핵심 AI UX 설계·구현
- 법률 업무의 리서치·문서 확인·출처 검증·문서 생성 과정을 LLM/RAG 기반 워크플로우로 전환하는 사용자 경험 제품화
- SSE 기반 LLM/RAG 챗 UX를 구현해 답변 생성·출처 표시·후속 탐색과 중단/에러/완료 상태를 하나의 대화 흐름으로 통합
- 통합 검색에 조건 단위 캐싱·in-flight Promise 병합·URL 상태 동기화를 적용해 중복 요청을 줄이고 탭 전환 응답성 개선
- 사내 REF 링크 규격과 Markdown tokenizer 확장으로 답변 내 법령·문서 출처에서 원문 조항으로 이동하는 Citation UX 구현
- PDF.js 기반 뷰어에서 가상 스크롤(페이지 단위 렌더링)·스크롤 위치 동기화·OCR BBox 오버레이로 다중 페이지·스캔 문서 탐색 UX 구현
- SSE 기반 워크플로우 상태 복구·Canvas 문서 생성/편집·DOCX/PDF export 플로우 구현
- 정규 릴리스 태깅·FE 배포·QA 사이클·핫픽스 대응으로 운영 제품의 릴리스 안정성 개선
- 사내 변호사(실사용자)·기획·AI/BE 팀과 긴밀히 협업해 법률 실무 요구를 제품 UX로 구체화하고, AI→BE→FE 순차 배포·QA 진행 상황을 정리·공유하며 직군 간 인식 차이를 줄임

#### Business Agent React 마이그레이션 · 2026.04 ~ 현재

추가일: 2026-06-02 · 업데이트: 2026-06-18

*전환 배경: 설치형(온프레미스) 엔터프라이즈 도입 가속 · 모바일 디자인 대응 · React 인력 확보 및 인수인계 용이성*

- SvelteKit 제품을 **React 19 + Vite + Turborepo 모노레포** 구조로 단계적 전환
- Claude Code · Codex · Cursor · MCP를 활용해 설계·구현·리뷰·검증 단계를 분리한 AI-assisted 마이그레이션 프로세스 운영
- 처음엔 "AI로 전환 속도 좀 올려보자"에 가까웠는데, 운영 제품을 옮기다 보니 AI가 맞는 말투로 틀릴 때가 제일 무섭다는 걸 배움
- 그래서 결과를 바로 믿지 않고 소스·테스트·브라우저를 같이 보게 만들었고, 자주 터지는 실수는 프롬프트 규칙과 체크리스트에 적어두는 방식으로 바꿔감
- 라우팅·페이지 셸·i18n·hosted mode를 분리하며 기존 기능을 신규 React 구조로 재구성
- 기존 SvelteKit 화면과 새 React 화면을 나란히 비교하며, "겉보기엔 비슷한데 실제로는 다른" 부분을 테스트와 화면 확인으로 잡아냄
- 반복되는 마이그레이션 작업은 다음에도 다시 써먹을 수 있게 프롬프트 규칙·체크리스트·검증 순서로 정리

#### CLM — 계약 관리 솔루션 Frontend · 2023.08 ~ 2024.07

- PDF 뷰어 렌더링 파이프라인과 계약 검토 멀티 패널 UI 구현으로 계약 검토 UX 개선
- 결재선 트리·드래그 서명, 업로드 검증·OTP·세션 타임아웃 등 CSAP 보안 요구사항 대응

### 코드레시피(CodeRecipe) — Frontend Developer · 2022.02 ~ 2023.04

- 물류 SaaS Logipasta Admin 실시간 미리보기 개편으로 **관련 기술지원 문의 50%+ 감소**
- 공통 UI 컴포넌트·Admin 화면 구조 설계로 반복 화면 개발 효율 개선
- 뉴스 플랫폼 QNN24를 PHP 구조에서 Vue3/Nuxt 프론트엔드로 전환, S3 Signed URL 업로드·I'mport 결제 연동 구현

### 세라에스이(주) — Embedded Developer · 2019.01 ~ 2022.02

- 산업용 오일 센서 모니터링 펌웨어·RFID 장비 개선 수행 (특허 출원 참여)
- RFID 인식거리 개선으로 현대엘리베이터 납품 제품 품질 개선

---

## Side Projects

아래 프로젝트들은 현재 지속 운영 중인 서비스라기보다, 아이디어와 구현 과정을 공개해 둔 실험이자 아카이브입니다.

**AI 가계부** — 자연어·이미지 입력 가계부 · Next.js · Supabase · Capacitor

추가일: 2026-06-02 · 업데이트: 2026-06-24

- 자연어·이미지 기반 소비 내역 입력과 입력 특성별 다중 LLM 라우팅 구현, Origin 검증·rate limit·AES-256-GCM 필드 암호화를 적용해 웹+모바일 단일 코드베이스(Capacitor)로 운영
- 데모는 공개 URL https://household-account-book-tawny.vercel.app에서 이용할 수 있습니다.

**Vapor UI Compliance Workbench** — 로컬 UI 컴플라이언스 감사 도구 · React · TypeScript · Vapor UI

추가일: 2026-05-27 · 업데이트: 2026-05-27

- 규칙 엔진의 결정론적 검사만으로 PASS/WARN/FAIL을 판정하며, 레이아웃·Vapor 컴포넌트·토큰/스타일·접근성·반응형/테마·코드 품질·문서 준비도의 7개 게이트를 측정
- GitHub: https://github.com/maj0rika/vapor-compliance-workbench

**dreamrealm** — AI persistent world prototype · TypeScript

추가일: 2026-06-09 · 업데이트: 2026-06-09

- AI 기반 영속적 세계 구축 아이디어를 TypeScript로 탐색한 공개 실험. 세계관·상태·사용자 상호작용을 제품 화면으로 옮기는 방향을 검토
- GitHub: https://github.com/maj0rika/dreamrealm

**ht-exercise-counter** — exercise tracking utility · Python

추가일: 2026-06-09 · 업데이트: 2026-06-09

- 운동 인증 카운팅을 자동화하기 위한 Python 기반 공개 유틸리티. 반복 기록을 사람이 검수 가능한 숫자와 로그로 바꾸는 작은 도구
- GitHub: https://github.com/maj0rika/ht-exercise-counter

**mac-ai-orphan-cleaner** — macOS AI helper cleanup · Shell · AI Tooling Ops

추가일: 2026-06-08 · 업데이트: 2026-07-15

- 고아 MCP·AI 툴체인 헬퍼와 유휴 렌더러 프로세스를 안전 기준을 통과한 경우에만 정리하는 macOS용 Shell 도구
- GitHub: https://github.com/maj0rika/mac-ai-orphan-cleaner

**agent-skills** — AI coding agent engineering playbook · Shell · Agent Workflow

추가일: 2026-06-08 · 업데이트: 2026-06-08

- AI coding agent가 재사용할 수 있는 production-grade engineering skill과 운영 규칙을 모아두는 공개 지식 자산
- GitHub: https://github.com/maj0rika/agent-skills

---

## Education

**호서대학교** 정보통신공학과 수석 졸업 (4.2/4.5) · 2013.03 ~ 2019.02
