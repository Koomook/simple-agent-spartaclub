# 스파르타코딩클럽 강의 검색 봇 - 구현 계획

## 프로젝트 개요
스파르타코딩클럽 강의를 자연어로 검색하고 추천하는 AI 에이전트

**데이터베이스 스키마 (총 48개 강의):**
- 필드: `id`, `title`, `description`, `price`, `url`, `category`, `is_free`, `is_government_supported`, `created_at`
- 카테고리: AI·GPT (17개), 개발 (11개), 기타 (8개), 취업·자격증 (6개), 데이터 (5개), 디자인 (1개)
- 무료 강의 21개, 국비 지원 강의 24개

---

## Issue 1: 데이터베이스 연동 (백엔드)

> **스코프:** 데이터 레이어만 (UI 파일 건드리지 않음)

### 수정 파일
- ✅ `lib/mcp-tools/search-courses.ts` (신규)
- ✅ `lib/mcp-tools.ts` (툴 추가)
- ✅ `app/api/agent/route.ts` (allowedTools + 툴 설명만)
- ✅ `package.json` (Prisma 의존성)

### 필수 단계
```bash
pnpm add @prisma/client prisma
npx prisma generate  # 필수!
pnpm dev
```

### ⚠️ 주의사항
- **`prisma.config.ts` 생성 금지** (Next.js가 `.env` 자동 로드)
- `app/api/agent/route.ts`에서 **allowedTools와 툴 설명만** 수정 (톤&매너 건드리지 말 것)

### 트러블슈팅
```bash
# "Module not found: @prisma/client" 에러
npx prisma generate

# "Cannot find module 'dotenv/config'" 에러
rm prisma.config.ts  # 이 파일 있으면 삭제
```

---

## Issue 2: 브랜드 아이덴티티 적용 (프론트엔드)

> **스코프:** UI/UX 레이어만 (`lib/mcp-tools` 건드리지 않음)

### 수정 파일
- ✅ `app/page.tsx` (히어로 섹션 + 버튼 4개)
- ✅ `components/agent-chat.tsx` (브랜드 컬러)
- ✅ `app/globals.css` (테마 컬러)
- ✅ `app/api/agent/route.ts` (systemPrompt 톤&매너만)

### 추천 버튼 4개
1. 💰 무료로 시작하는 강의
2. 🤖 AI·GPT 강의
3. 🎓 국비지원 강의
4. 💼 취업·이직 준비

### ⚠️ 주의사항
- `app/api/agent/route.ts`에서 **systemPrompt 톤&매너만** 수정 (allowedTools 건드리지 말 것)

---

## 🔀 머지 가이드

### 충돌 예방 포인트
`app/api/agent/route.ts`를 두 브랜치에서 수정:
- **Issue 1**: `allowedTools` + "사용 가능한 도구" 섹션
- **Issue 2**: `systemPrompt`의 "역할/톤&매너" 섹션

→ 다른 섹션이므로 자동 머지됨 (충돌 시 둘 다 유지)

### 머지 순서
```bash
git checkout main
git merge <issue-1-branch>  # 백엔드 먼저
git merge <issue-2-branch>  # 프론트엔드
```

---

## 완료 기준
- [x] 자연어 강의 검색 작동
- [x] 4개 시나리오 버튼 작동
- [x] 스파르타 브랜드 스타일 적용
- [x] 한글 UI 지원
- [x] 무료/국비 지원 강의 필터링
- [x] 친근하고 격려하는 톤
