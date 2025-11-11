# Test Plan: Phase 2 - Brand Identity Application

## Test Strategy

This document outlines the manual testing strategy for validating the Sparta brand identity application.

## Test Environment

- **Browser**: Chrome, Firefox, Safari, Edge
- **Viewports**: Mobile (375px), Tablet (768px), Desktop (1440px)
- **Color Schemes**: Light mode, Dark mode

---

## Test Cases

### TC-1: Color System

#### TC-1.1: Tailwind Config Colors
- [ ] Sparta colors are defined in tailwind.config.ts
- [ ] Colors are accessible via Tailwind classes (e.g., `bg-sparta-red`)
- [ ] Dark mode variants are defined

#### TC-1.2: CSS Custom Properties
- [ ] Sparta colors are defined in globals.css
- [ ] CSS variables are applied correctly
- [ ] Dark mode CSS variables override light mode appropriately

#### TC-1.3: Visual Color Application
- [ ] Primary CTA buttons use Sparta Red (#E8344E)
- [ ] Text colors match brand guidelines
- [ ] Background colors are consistent with brand
- [ ] Dark mode colors are visually distinct and readable

### TC-2: Typography

#### TC-2.1: Font Loading
- [ ] Pretendard font loads successfully
- [ ] Fallback fonts work when Pretendard fails
- [ ] No FOIT (Flash of Invisible Text)

#### TC-2.2: Typography Scale
- [ ] H1 size and weight match brand guidelines (48-56px, Bold)
- [ ] H2-H5 sizes and weights match guidelines
- [ ] Body text is 16px with line-height 1.7
- [ ] Small text is 14px with line-height 1.5

#### TC-2.3: Korean Text Rendering
- [ ] Korean characters render correctly
- [ ] `word-break: keep-all` prevents mid-word breaks
- [ ] Line height is appropriate for Korean (1.7)
- [ ] No text overflow or truncation

### TC-3: Main Page Branding

#### TC-3.1: Metadata
- [ ] Page title is "스파르타 강의 검색"
- [ ] Meta description mentions Sparta and Korean

#### TC-3.2: Hero Section
- [ ] Title is "스파르타 강의 검색" (or similar Sparta branding)
- [ ] Subtitle is in Korean
- [ ] Sparta brand colors are applied
- [ ] Text is readable in both light and dark modes

#### TC-3.3: Example Buttons
- [ ] 4 scenario buttons are displayed
- [ ] Button 1: "💰 무료로 시작하는 강의" (or similar)
- [ ] Button 2: "🤖 AI·GPT 강의" (or similar)
- [ ] Button 3: "🎓 국비지원 강의" (or similar)
- [ ] Button 4: "💼 취업·이직 준비" (or similar)
- [ ] Buttons use Sparta brand styling
- [ ] Hover states work correctly
- [ ] Click handlers trigger appropriate prompts

### TC-4: Agent Chat Component

#### TC-4.1: UI Text Localization
- [ ] Input placeholder is in Korean
- [ ] Processing status messages are in Korean
- [ ] Error messages are in Korean (if any)
- [ ] All UI labels are in Korean

#### TC-4.2: Styling
- [ ] Chat bubbles use Sparta colors
- [ ] Input field styling matches brand
- [ ] Button styling (send, stop) uses brand colors
- [ ] Borders and dividers use brand colors

#### TC-4.3: Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1 for normal text)
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works
- [ ] Screen reader labels are appropriate

### TC-5: System Prompt & Agent Behavior

#### TC-5.1: Agent Identity
- [ ] Agent introduces itself as Sparta assistant
- [ ] Tone is friendly and encouraging (친근하고 격려하는)
- [ ] Uses Korean polite form (존댓말)
- [ ] Emphasizes free and government-supported courses

#### TC-5.2: Response Quality
- [ ] Responses are in Korean
- [ ] Responses use appropriate emojis (1-2 per message)
- [ ] Tone matches brand guidelines
- [ ] Information is accurate and helpful

#### TC-5.3: Tool Usage
- [ ] Agent can use existing tools (Read, Write, Bash, etc.)
- [ ] Custom tools (hello-world) still work
- [ ] Tool usage messages are in Korean (if applicable)

### TC-6: Responsive Design

#### TC-6.1: Mobile (375px)
- [ ] Layout adapts correctly
- [ ] Buttons are tappable (min 44x44px)
- [ ] Text is readable
- [ ] No horizontal scroll
- [ ] Example buttons stack vertically

#### TC-6.2: Tablet (768px)
- [ ] Layout uses available space effectively
- [ ] Example buttons display in grid (2 columns)
- [ ] Typography scales appropriately

#### TC-6.3: Desktop (1440px)
- [ ] Layout is centered and not too wide
- [ ] Example buttons display in grid (2 columns)
- [ ] No excessive white space

### TC-7: Cross-Browser Compatibility

#### TC-7.1: Chrome
- [ ] All features work correctly
- [ ] Pretendard font renders correctly
- [ ] Colors display accurately

#### TC-7.2: Firefox
- [ ] All features work correctly
- [ ] Pretendard font renders correctly
- [ ] Colors display accurately

#### TC-7.3: Safari
- [ ] All features work correctly
- [ ] Pretendard font renders correctly
- [ ] Colors display accurately
- [ ] Korean text renders correctly

#### TC-7.4: Edge
- [ ] All features work correctly
- [ ] Pretendard font renders correctly
- [ ] Colors display accurately

### TC-8: Dark Mode

#### TC-8.1: Color Contrast
- [ ] Dark mode background is appropriate
- [ ] Text is readable on dark background
- [ ] Contrast ratios meet WCAG AA
- [ ] Sparta Red is adjusted for dark mode if needed

#### TC-8.2: Visual Consistency
- [ ] Dark mode maintains brand identity
- [ ] All elements are visible
- [ ] No jarring color combinations

### TC-9: Accessibility

#### TC-9.1: Color Contrast
- [ ] All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] Interactive elements meet contrast requirements
- [ ] Focus indicators are clearly visible

#### TC-9.2: Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Enter/Space keys trigger buttons
- [ ] ESC key cancels agent response (if implemented)

#### TC-9.3: Screen Reader
- [ ] Page structure is logical (headings, landmarks)
- [ ] Interactive elements have appropriate labels
- [ ] Dynamic content updates are announced (if applicable)

### TC-10: Performance

#### TC-10.1: Font Loading
- [ ] Fonts load within 3 seconds on 3G connection
- [ ] Font display: swap prevents FOIT
- [ ] Font files are optimized (subset for Korean)

#### TC-10.2: Build & Runtime
- [ ] `pnpm build` completes without errors
- [ ] `pnpm dev` starts without errors
- [ ] No TypeScript errors
- [ ] No console errors in browser

---

## Test Execution Checklist

### Pre-Implementation
- [ ] Review BRAND.md guidelines
- [ ] Review TEST_PLAN.md

### During Implementation
- [ ] Test each component change in dev mode
- [ ] Verify TypeScript compilation
- [ ] Check console for errors

### Post-Implementation
- [ ] Run full manual test suite
- [ ] Test all 4 browsers
- [ ] Test mobile, tablet, desktop viewports
- [ ] Test light and dark modes
- [ ] Verify accessibility with Lighthouse
- [ ] Build production bundle and test

---

## Success Criteria

All test cases must pass before considering Phase 2 complete.

**Critical Tests (Must Pass)**:
- TC-1.3: Visual Color Application
- TC-2.3: Korean Text Rendering
- TC-3.2: Hero Section
- TC-3.3: Example Buttons (all 4)
- TC-4.1: UI Text Localization
- TC-5.1: Agent Identity
- TC-9.1: Color Contrast (WCAG AA)

**High Priority (Should Pass)**:
- TC-2.1: Font Loading
- TC-4.2: Styling
- TC-6.1-6.3: Responsive Design
- TC-7.1-7.4: Cross-Browser
- TC-8.1-8.2: Dark Mode

**Medium Priority (Nice to Have)**:
- TC-5.2: Response Quality
- TC-9.2-9.3: Keyboard Navigation & Screen Reader
- TC-10.1-10.2: Performance

---

## Bug Reporting Template

If any test fails, document using this template:

```
**Test Case ID**: TC-X.Y
**Title**: [Brief description]
**Severity**: Critical | High | Medium | Low
**Browser**: Chrome/Firefox/Safari/Edge
**Viewport**: Mobile/Tablet/Desktop
**Color Scheme**: Light/Dark

**Steps to Reproduce**:
1. ...
2. ...
3. ...

**Expected Result**:
...

**Actual Result**:
...

**Screenshots**:
[Attach if applicable]

**Fix Applied**:
...
```

---

## Notes

- This is a manual test plan; automated E2E tests with Playwright can be added in the future
- Focus on visual regression and functional testing
- Korean language testing requires native speaker review (optional)
- Accessibility testing can be enhanced with automated tools (axe, Lighthouse)

---

**Document Version**: 1.0
**Created**: 2025-11-11
**Last Updated**: 2025-11-11
