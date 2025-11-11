# 스파르타코딩클럽 브랜드 가이드라인

> 이 문서는 스파르타코딩클럽의 브랜드 아이덴티티를 정의하고, 일관된 브랜드 경험을 제공하기 위한 가이드라인입니다.

## 📋 목차

1. [브랜드 개요](#브랜드-개요)
2. [컬러 팔레트](#컬러-팔레트)
3. [타이포그래피](#타이포그래피)
4. [톤앤매너](#톤앤매너)
5. [UI 컴포넌트 가이드](#ui-컴포넌트-가이드)

---

## 브랜드 개요

### 브랜드 미션
**"도전하는 누구나 잠재력을 깨울 수 있도록"**

### 브랜드 비전
**"AI 시대, 미래를 돌파하는 힘"**

### 핵심 가치
- 🎯 **도전 정신**: 누구나 새로운 도전을 시작할 수 있다
- 📈 **성장 중심**: 실질적인 성장과 성과를 추구한다
- 🤝 **포용성**: 진입장벽을 낮추고 누구나 환영한다
- 💡 **실용성**: 실전에서 바로 활용할 수 있는 교육

---

## 컬러 팔레트

### Primary Colors

```css
/* Sparta Red - 메인 브랜드 컬러 */
--sparta-red: #E8344E;
--sparta-red-hover: #D12342;
--sparta-red-light: #FF5A73;

/* Dark - 텍스트와 배경 */
--sparta-dark: #1E1E1E;
--sparta-dark-gray: #2D2D2D;

/* White */
--sparta-white: #FFFFFF;
```

### Secondary Colors

```css
/* AI/Tech 카테고리 */
--sparta-cyan: #00BCD4;
--sparta-purple: #9C27B0;

/* 배경 및 강조 */
--sparta-pink: #FFE5ED;
--sparta-light-blue: #E3F2FD;
```

### Neutral Colors

```css
/* 배경 */
--sparta-gray-50: #F5F5F5;
--sparta-gray-100: #E0E0E0;
--sparta-gray-200: #CCCCCC;

/* 텍스트 */
--sparta-gray-600: #666666;
--sparta-gray-700: #444444;
--sparta-gray-900: #1E1E1E;
```

### Color Usage

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `#FFFFFF` | `#1E1E1E` |
| Text | `#1E1E1E` | `#FFFFFF` |
| Primary CTA | `#E8344E` | `#FF5A73` |
| Secondary Text | `#666666` | `#CCCCCC` |
| Border | `#E0E0E0` | `#444444` |

### Accessibility Standards

✅ **WCAG AA Compliant**

| Combination | Contrast Ratio | Status |
|-------------|----------------|--------|
| Black on White | 18:1 | ✅ AAA |
| Red on White | 3.8:1 | ⚠️ Large text only |
| White on Red | 3.8:1 | ⚠️ Large text only |
| Gray-600 on White | 7:1 | ✅ AAA |

---

## 타이포그래피

### Font Family

**Primary Font: Pretendard**
- Korean web font optimized for readability
- Multiple weights available (400, 700)
- Clean, modern, professional

```css
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui,
             'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
```

### Typography Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| H1 | 48-56px | 700 | 1.2 | Hero headlines |
| H2 | 36-40px | 700 | 1.3 | Section titles |
| H3 | 24-28px | 700 | 1.4 | Subsection titles |
| H4 | 20-24px | 700 | 1.5 | Card titles |
| H5 | 18-20px | 700 | 1.5 | Small headings |
| Body | 16px | 400 | 1.7 | Paragraph text |
| Small | 14px | 400 | 1.5 | Captions, labels |

### Korean-Specific Settings

```css
/* Prevent word breaks mid-character */
word-break: keep-all;

/* Generous line height for readability */
line-height: 1.7;

/* Slight negative letter spacing for headings */
letter-spacing: -0.02em; /* headings only */
```

---

## 톤앤매너

### Communication Style

#### ✅ DO (해야 할 것)

- **존댓말 사용**: "~하세요", "~합니다"
- **격려하는 톤**: "괜찮아요", "할 수 있어요"
- **구체적 정보**: 명확하고 실용적인 안내
- **무료/국비 강조**: 진입장벽 낮추기
- **성과 중심**: 실제 결과와 후기 공유
- **이모지 적절히 사용**: 1-2개로 친근감 표현

#### ❌ DON'T (하지 말아야 할 것)

- **반말 사용**
- **부정적/비판적 표현**
- **과도한 전문 용어**
- **불확실한 정보**
- **판매 압박**
- **차갑거나 기계적인 응답**

### Message Patterns

#### 진입장벽 낮추기
- "누구나 쉽게 시작할 수 있어요"
- "코딩이 처음이어도 괜찮아요"
- "AI가 생소하시다면 기초부터 차근차근"

#### 무료/국비 강조
- "무료로 먼저 체험해보세요"
- "국비지원으로 부담 없이 시작하세요"
- "무제한 취업 지원을 받으실 수 있어요"

#### 격려와 지지
- "많은 분들이 성공하셨어요"
- "끝까지 함께 하겠습니다"
- "잠재력을 발휘할 수 있도록 돕겠습니다"

### Emoji Usage Guide

| Emoji | Meaning | Usage |
|-------|---------|-------|
| 💡 | Tip, Idea | 유용한 정보 제공 시 |
| 🎓 | Education | 학습, 강의 관련 |
| 💼 | Career | 취업, 이직 관련 |
| 🤖 | AI | AI 강의 언급 시 |
| 💰 | Free/Discount | 무료, 국비 안내 시 |
| ✅ | Success | 완료, 확인 표시 |
| 😊 | Friendly | 환영, 친근함 표현 |

**사용 빈도**: 메시지당 1-2개 적절히

---

## UI 컴포넌트 가이드

### Buttons

#### Primary Button (CTA)
```css
background: #E8344E;
color: #FFFFFF;
padding: 12px 24px;
border-radius: 8px;
font-weight: 700;
font-size: 16px;

hover: background: #D12342;
```

#### Secondary Button
```css
background: transparent;
border: 2px solid #E8344E;
color: #E8344E;
padding: 12px 24px;
border-radius: 8px;
font-weight: 700;
font-size: 16px;

hover: background: #FFE5ED;
```

### Cards

```css
background: #FFFFFF;
border: 1px solid #E0E0E0;
border-radius: 12px;
padding: 24px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

hover: box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
```

### Input Fields

```css
background: #FFFFFF;
border: 1px solid #E0E0E0;
border-radius: 8px;
padding: 12px 16px;
font-size: 16px;
color: #1E1E1E;

focus: border-color: #E8344E;
placeholder-color: #CCCCCC;
```

### Badge/Tag

```css
/* Free Course Badge */
background: #E8344E;
color: #FFFFFF;
padding: 4px 12px;
border-radius: 16px;
font-size: 14px;
font-weight: 700;

/* Category Tag */
background: #F5F5F5;
color: #666666;
padding: 4px 12px;
border-radius: 16px;
font-size: 14px;
```

---

## 구현 체크리스트

### Phase 1: 컬러 시스템
- [ ] Tailwind config에 Sparta 컬러 추가
- [ ] CSS 변수로 컬러 정의
- [ ] Dark mode 컬러 설정
- [ ] 접근성 테스트 (WCAG AA)

### Phase 2: 타이포그래피
- [ ] Pretendard 폰트 로드 (next/font)
- [ ] Typography scale 적용
- [ ] 한글 최적화 설정 (word-break, line-height)
- [ ] Fallback 폰트 설정

### Phase 3: UI 컴포넌트
- [ ] Primary/Secondary 버튼 스타일링
- [ ] Input field 스타일링
- [ ] Card 컴포넌트 스타일링
- [ ] Badge/Tag 스타일링

### Phase 4: 콘텐츠
- [ ] 모든 텍스트 한글로 변환
- [ ] 톤앤매너 가이드라인 적용
- [ ] 이모지 적절히 사용
- [ ] 시스템 프롬프트 업데이트

---

## 참고 자료

- **공식 웹사이트**: https://spartaclub.kr
- **브랜드 분석 자료**: `/public/brand-analysis/`
- **컬러 팔레트**: `/public/brand-analysis/colors.md`
- **타이포그래피**: `/public/brand-analysis/typography.md`
- **톤앤매너**: `/public/brand-analysis/tone.md`

---

## 업데이트 이력

- **2025-11-11**: 초기 브랜드 가이드라인 작성
  - spartaclub.kr 웹사이트 분석
  - 컬러, 타이포그래피, 톤앤매너 추출
  - UI 컴포넌트 가이드 작성

---

**© 2025 팀스파르타(주). All rights reserved.**
