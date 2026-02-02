# 🔧 Enrollment Coach 설치 가이드

## 📋 사전 요구사항

### 필수
- **Node.js**: 18.0 이상
- **PostgreSQL**: 14 이상
- **OpenAI API Key**: GPT-4 접근 권한

### 권장
- **Git**: 버전 관리
- **VS Code**: 추천 에디터 (Prisma 확장 포함)

---

## 🚀 단계별 설치

### 1️⃣ 프로젝트 클론/다운로드

```bash
# Git 클론 (GitHub 사용 시)
git clone https://github.com/your-org/enrollment-coach.git
cd enrollment-coach

# 또는 ZIP 다운로드 후 압축 해제
cd enrollment-coach
```

### 2️⃣ 의존성 설치

```bash
npm install
```

### 3️⃣ 환경 변수 설정

`.env.local` 파일 생성:

```bash
cp .env.local.example .env.local
```

`.env.local` 파일 편집:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/enrollment_coach?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-min-32-characters"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# App Config
NEXT_PUBLIC_APP_NAME="Enrollment Coach"
NEXT_PUBLIC_APP_DESCRIPTION="Awaken Training Sales Pipeline & AI Coach"
```

**중요**:
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `NEXTAUTH_SECRET`: `openssl rand -base64 32` 명령으로 생성
- `OPENAI_API_KEY`: OpenAI 대시보드에서 발급

### 4️⃣ PostgreSQL 데이터베이스 설정

#### 로컬 PostgreSQL 사용

```bash
# PostgreSQL 설치 (Mac)
brew install postgresql@14
brew services start postgresql@14

# 데이터베이스 생성
createdb enrollment_coach

# 유저 생성 (선택사항)
psql postgres
CREATE USER enrollment_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE enrollment_coach TO enrollment_user;
\q
```

#### 클라우드 PostgreSQL 사용 (추천)

**Supabase (무료)**:
1. https://supabase.com/ 접속
2. 새 프로젝트 생성
3. Settings → Database → Connection string 복사
4. `.env.local`의 `DATABASE_URL`에 붙여넣기

**Railway (무료)**:
1. https://railway.app/ 접속
2. New Project → PostgreSQL
3. Connection URL 복사
4. `.env.local`에 설정

### 5️⃣ Prisma Migration

```bash
# Migration 실행 (DB 테이블 생성)
npx prisma migrate dev --name init

# Prisma Client 생성
npx prisma generate
```

**트러블슈팅**:
- 에러 발생 시: `DATABASE_URL` 확인
- PostgreSQL이 실행 중인지 확인: `pg_isready`

### 6️⃣ 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 열기 ✅

---

## 🔍 테스트

### 1. 회원가입
1. http://localhost:3000/signup 접속
2. 이름, 이메일, 비밀번호 입력
3. 회원가입 완료

### 2. 로그인
1. http://localhost:3000/login 접속
2. 이메일, 비밀번호 입력
3. 로그인 → 대시보드로 이동

### 3. Prospect 추가
1. 대시보드에서 "Prospect 추가" 클릭
2. 이름, 연락처 입력
3. Prospect 카드 클릭 → 상세 페이지

### 4. 대화 및 AI 분석
1. Prospect 상세 페이지에서 대화 추가
2. "AI 분석" 버튼 클릭
3. AI가 Phase, 친밀도, 준비도 자동 판단

---

## 🎨 Prisma Studio (DB 관리)

```bash
npx prisma studio
```

http://localhost:5555 에서 DB 관리 가능

---

## 🚀 프로덕션 배포

### Vercel 배포

1. **GitHub에 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Vercel 설정**
   - https://vercel.com/ 접속
   - Import Project → GitHub 레포지토리 선택
   - Framework: Next.js (자동 감지)

3. **환경 변수 설정**
   - Settings → Environment Variables
   - `.env.local`의 모든 변수 추가
   - **중요**: `NEXTAUTH_URL`을 실제 도메인으로 변경 (예: `https://your-app.vercel.app`)

4. **Deploy**
   - Deploy 버튼 클릭
   - 배포 완료! 🎉

### 데이터베이스 연결

**프로덕션에서는 클라우드 DB 필수**:
- Supabase (무료, 500MB)
- Railway ($5/월부터)
- Heroku Postgres ($9/월부터)

---

## 🔧 일반적인 문제 해결

### 1. Prisma Client 에러

```bash
# Prisma Client 재생성
npx prisma generate
```

### 2. NextAuth 세션 에러

- `NEXTAUTH_SECRET`이 설정되어 있는지 확인
- 32자 이상인지 확인

### 3. OpenAI API 에러

- API Key가 올바른지 확인
- GPT-4 접근 권한이 있는지 확인
- 요금 잔액이 있는지 확인

### 4. Database Connection 에러

```bash
# PostgreSQL 실행 확인
brew services list | grep postgres

# 재시작
brew services restart postgresql@14
```

### 5. Port 3000 already in use

```bash
# 프로세스 찾기
lsof -i :3000

# 종료
kill -9 <PID>
```

---

## 📚 추가 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [Prisma 가이드](https://www.prisma.io/docs/)
- [NextAuth.js 문서](https://next-auth.js.org/)
- [OpenAI API 레퍼런스](https://platform.openai.com/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

---

## 🤝 도움 요청

문제 발생 시:
1. 에러 메시지 전체 복사
2. 실행 환경 (OS, Node 버전 등) 정보
3. Awaken Training 팀에 문의

---

설치 완료! 이제 Enrollment Coach를 사용할 준비가 되었습니다 🚀
