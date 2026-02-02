# 🎯 Enrollment Coach

Awaken Training 등록을 위한 AI 코칭 + Sales Pipeline 관리 도구

## ✨ 주요 기능

- 👥 **Prospect 관리**: Phase(1-5), 친밀도, 준비도 자동 추적
- 🤖 **AI 조언**: GPT-4 기반 CBT + MI 코칭 기법 적용
- 💡 **인사이트 발견**: 핵심 신념, 상처, 패턴 자동 추출
- 📊 **대시보드**: 전체 Pipeline 상태 한눈에 파악
- 💬 **대화 히스토리**: 모든 대화 기록 및 AI 분석 보관

## 🚀 시작하기

### 1. 환경 설정

필요한 것들:
- Node.js 18+
- PostgreSQL
- OpenAI API Key

### 2. 설치

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일 편집 (DATABASE_URL, OPENAI_API_KEY 등)
```

### 3. 데이터베이스 설정

```bash
# Prisma migration 실행
npx prisma migrate dev --name init

# Prisma Client 생성
npx prisma generate
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 열기

## 🎨 디자인

**컬러 팔레트**:
- Primary: #FF8B7B (Warm Coral) - 따뜻함, 행동
- Secondary: #71C9CE (Soft Teal) - 신뢰, 안정감
- Background: #FAF7F2 (Warm White) - 편안함, 자연

**폰트**:
- Heading: Montserrat
- Body: Inter

**컨셉**: 따뜻하고 사람 냄새 나는 디자인 (Calm, Headspace 스타일)

## 📱 주요 페이지

1. **홈 (/)**: 랜딩 페이지
2. **로그인 (/login)**: 팀원 로그인
3. **회원가입 (/signup)**: 신규 팀원 가입
4. **대시보드 (/dashboard)**: Prospect 목록 및 통계
5. **Prospect 상세 (/prospects/[id])**: 대화 히스토리 + AI 인사이트

## 🤖 AI 엔진

### Phase 판단 (1-5)
1. **Phase 1**: 초기 접촉, 관계 형성
2. **Phase 2**: 신뢰 구축, 고민 탐색
3. **Phase 3**: 핵심 신념/상처 발견
4. **Phase 4**: 프로그램 소개, 가치 전달
5. **Phase 5**: 등록 결정 단계

### 인사이트 타입
- **core_belief**: 핵심 신념
- **wound**: 상처
- **pattern**: 반복 패턴
- **readiness_signal**: 준비도 신호

### 코칭 기법
- **CBT (인지행동치료)**: 신념과 사고 패턴 탐색
- **MI (동기면담)**: 변화 동기 강화

## 🗂️ 프로젝트 구조

```
enrollment-coach/
├── app/
│   ├── api/
│   │   ├── auth/           # NextAuth 인증
│   │   ├── prospects/      # Prospect CRUD
│   │   ├── conversations/  # 대화 관리
│   │   └── ai/             # AI 분석 엔진
│   ├── dashboard/          # 대시보드 페이지
│   ├── prospects/[id]/     # Prospect 상세
│   ├── login/              # 로그인
│   └── signup/             # 회원가입
├── prisma/
│   └── schema.prisma       # DB 스키마
├── lib/
│   └── prisma.ts           # Prisma Client
└── types/
    └── next-auth.d.ts      # NextAuth 타입 정의
```

## 🔐 보안

- 비밀번호: bcrypt 해싱
- 인증: NextAuth.js (JWT 기반)
- API: 세션 검증 필수

## 📊 데이터 모델

### User (TeamMember)
- 팀원 계정
- email, name, passwordHash

### Prospect
- 관리 대상
- phase, intimacyScore, readinessScore, status

### Conversation
- 대화 기록
- message, sender (sdr/prospect), aiAdvice

### Insight
- AI가 발견한 인사이트
- type, content

## 🚀 배포

### Vercel 배포

1. GitHub 레포지토리에 푸시
2. Vercel에서 프로젝트 import
3. 환경 변수 설정:
   - DATABASE_URL
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET
   - OPENAI_API_KEY
4. Deploy!

### 데이터베이스

추천: [Supabase](https://supabase.com/) 또는 [Railway](https://railway.app/)

## 📝 TODO (MVP 이후)

- [ ] 이메일/SMS 알림 (Phase 변경 시)
- [ ] 팀 대시보드 (관리자용)
- [ ] 대화 템플릿 (Phase별 추천 질문)
- [ ] Export 기능 (PDF/Excel)
- [ ] 모바일 앱 (React Native)
- [ ] 음성 메모 (대화 녹음)

## 🤝 기여

이 프로젝트는 Awaken Training 팀 내부용입니다.

## 📄 라이선스

Internal Use Only - Awaken Training

## 📞 문의

Awaken Training Sales Team

---

Made with ❤️ for Awaken Training

