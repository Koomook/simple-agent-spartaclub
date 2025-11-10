# 스파르타코딩클럽 강의 검색 봇 - 구현 계획

## 프로젝트 개요
스파르타코딩클럽 강의를 자연어로 검색하고 추천하는 AI 에이전트

**데이터베이스 스키마 (총 48개 강의):**
- 필드: `id`, `title`, `description`, `price`, `url`, `category`, `is_free`, `is_government_supported`, `created_at`
- 카테고리: AI·GPT (17개), 개발 (11개), 기타 (8개), 취업·자격증 (6개), 데이터 (5개), 디자인 (1개)
- 무료 강의 21개, 국비 지원 강의 24개

## Phase 1: 데이터베이스 연동

### 1.1 Prisma 설정
```bash
pnpm add @prisma/client prisma
npx prisma init
npx prisma db pull
npx prisma generate
```
- `.env`의 `DATABASE_URL` 사용 (읽기 전용)
- `courses` 테이블 스키마 자동 생성

### 1.2 검색 툴 개발
**파일:** `lib/mcp-tools/search-courses.ts`

**파라미터:**
- `query` (string?): 자연어 검색 쿼리
- `category` (string?): 카테고리 필터
- `is_free` (boolean?): 무료 강의만
- `is_government_supported` (boolean?): 국비 지원만
- `limit` (number?): 최대 결과 수 (기본값: 10)

**구현:**
- Prisma로 title, description 필드 검색
- 결과 포맷: 강의명, 설명, 가격, URL, 카테고리, 무료/국비 여부

### 1.3 메인 UI 버튼 (app/page.tsx)
1. 💰 **무료로 시작하는 강의** → `is_free = true`
2. 🤖 **AI·GPT 강의** → `category = "AI ∙ GPT"`
3. 🎓 **국비지원 강의** → `is_government_supported = true`
4. 💼 **취업·이직 준비** → `category = "취업 ∙ 자격증"`

### 1.4 툴 등록
`lib/mcp-tools.ts`에 `search-courses` 추가

## Phase 2: 브랜드 아이덴티티 적용

### 2.1 브랜드 추출 (Playwright MCP)
- https://spartaclub.kr 접속 및 스크린샷
- 컬러 스킴, 타이포그래피, 톤앤매너 분석

### 2.2 UI 업데이트
**파일:**
- `app/page.tsx` - 히어로 섹션 카피 변경
- `components/agent-chat.tsx` - 브랜드 컬러 적용
- `app/globals.css` - Tailwind 테마 컬러 추가

**적용 요소:**
- 스파르타 컬러 스킴
- 한글 UI 라벨
- 친근하고 격려하는 톤

### 2.3 시스템 프롬프트 (app/api/agent/route.ts)
- 역할: 스파르타 강의 추천 어시스턴트
- 톤: 친근하고 격려하는 스타일
- 무료/국비 지원 여부 강조
- `search-courses` 툴 사용 가이드 포함

## 기술 요구사항
- 읽기 전용 DB 연결 (SSL 필수)
- Prisma Client 캐싱
- 빈 검색 결과 시 대안 제시
- SSE 스트리밍

## 완료 기준
- [ ] 자연어 강의 검색 작동
- [ ] 4개 시나리오 버튼 작동
- [ ] 스파르타 브랜드 스타일 적용
- [ ] 한글 UI 지원
