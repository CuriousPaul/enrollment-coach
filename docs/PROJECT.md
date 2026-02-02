# Enrollment Coach - 프로젝트 문서

## 🎯 프로젝트 개요
- **이름**: Enrollment Coach
- **목적**: Awaken Training 등록 Sales Pipeline + AI 코칭 조언
- **타겟**: 팀원(SDR) 10명 → 각자 2-20명 Prospects 관리

## 📱 기술 스택
- Frontend: Next.js 14 (App Router) + Tailwind CSS
- Backend: Next.js API Routes
- Database: PostgreSQL + Prisma
- AI: OpenAI GPT-4 (CBT + MI 프롬프트)
- Auth: NextAuth.js
- Hosting: Vercel

## 🎨 디자인
**Option A (부드러운 자연)**:
- Primary: #FF8B7B (Warm Coral), #71C9CE (Soft Teal)
- Background: #FAF7F2 (Warm White)
- 폰트: Montserrat (heading), Inter (body)
- 스타일: 따뜻하고 사람 냥새 나는 디자인
- 레퍼런스: Calm, Headspace, BetterHelp

## 🗄️ 데이터 모델
1. team_members (id, email, name, password_hash)
2. prospects (id, owner_id, name, contact, phase, intimacy_score, readiness_score, status)
3. insights (id, prospect_id, type, content)
4. conversations (id, prospect_id, message, sender, ai_advice, timestamp)

## ✨ MVP 기능 (우선순위)
1. 팀원 로그인/회원가입
2. Prospect 추가/관리 (CRUD)
3. 대화 히스토리 기록
4. AI 조언 엔진:
   - Phase 자동 판단 (1-5)
   - 친밀도/준비도 점수 (0-10)
   - 다음 질문 추천 (CBT/MI)
   - 핵심 신념/상처 발견
5. 팀원 대시보드 (진행 상황)
6. Prospect 상세 페이지 (AI 인사이트)

## 🤖 AI 엔진 구조
- `/api/ai/analyze-conversation`: 대화 분석 + 조언 생성
- CBT + MI + Awaken Training 프롬프트
- 200만원 프로그램 고려한 신중한 접근

## 📋 개발 순서
1. ✅ 프로젝트 셋업 (Next.js + Tailwind)
2. ⬜ DB 스키마 + Prisma
3. ⬜ 인증 (NextAuth.js)
4. ⬜ Prospect 관리 페이지
5. ⬜ 대화 히스토리 UI
6. ⬜ AI 조언 엔진
7. ⬜ 대시보드 통계
8. ⬜ 모바일 최적화

## 🎯 완료 기준
- 모바일 웹에서 작동하는 MVP
- 팀원이 Prospect 추가하고 대화 기록 가능
- AI가 다음 질문 추천 + Phase 판단
- 디자인 구현 (따뜻하고 인간적인 느낌)

## 📚 참고 문서
- Awaken 프로그램: https://awakenkr.oopy.io/
- 디자인 리서치 결과 포함
- CBT + MI 코칭 기법 적용

## 📝 개발 로그
### 2026-02-03
- 프로젝트 시작
- 프로젝트 문서 생성
