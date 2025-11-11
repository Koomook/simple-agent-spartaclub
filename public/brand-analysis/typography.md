# 스파르타코딩클럽 타이포그래피

## 추출 날짜
2025-11-11

## Font Families

### Primary Font (Korean)
- **Name**: Pretendard
- **Weights Used**:
  - Bold (700) - Headlines
  - Regular (400) - Body text
- **Source**: Web font (likely from CDN or custom hosted)
- **Fallback**: sans-serif, -apple-system, BlinkMacSystemFont

### System Fallback Stack
```css
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
```

## Typography Scale

### Headings
- **H1**:
  - Font size: ~48-56px
  - Font weight: Bold (700)
  - Line height: 1.2-1.3
  - Letter spacing: -0.02em

- **H2**:
  - Font size: ~36-40px
  - Font weight: Bold (700)
  - Line height: 1.3

- **H3**:
  - Font size: ~24-28px
  - Font weight: Bold (700)
  - Line height: 1.4

- **H4/H5**:
  - Font size: ~18-20px
  - Font weight: Bold (700)
  - Line height: 1.5

### Body Text
- **Regular**:
  - Font size: 16px
  - Font weight: Regular (400)
  - Line height: 1.6-1.7
  - Letter spacing: normal

- **Small**:
  - Font size: 14px
  - Line height: 1.5

## Korean-Specific Considerations
- Line height: 1.6-1.8 (more generous for Korean characters)
- Word break: keep-all (prevents breaking Korean words mid-character)
- Letter spacing: slight negative for headings, normal for body

## Implementation Notes
- Use next/font for optimization if available
- Subset font to Korean characters only to reduce file size
- Use font-display: swap to prevent FOIT (Flash of Invisible Text)
