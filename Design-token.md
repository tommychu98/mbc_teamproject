# DIPTYQUE Renewal 디자인 토큰 가이드

## 1. 문서 목적과 기준

이 문서는 DIPTYQUE Renewal React 프로젝트의 디자인 토큰과 적용 기준을 정의한다.

색상과 타이포그래피는 Figma의 데스크톱 `style gudie` 노드(`1025:101`)와 모바일 `mobile text` 노드(`2540:6450`)를 기준으로 한다. 간격, 레이아웃, 크기, 테두리, 그림자, z-index, 모션은 Figma 스타일 가이드에 별도 정의가 없으므로 프로젝트 구현용 보조 토큰으로 관리한다.

- 기준 Figma 파일: `DIPTYQUE renewal project`
- 데스크톱 기준 노드: `1025:101`
- 모바일 기준 노드: `2540:6450`
- 확인일: 2026-09-21
- React + Vite + JavaScript
- CSS + BEM
- Mobile First
- 공통 디자인 토큰은 `src/styles/variables.css`에서 관리

> 모바일 원본값은 0–767px에서 우선 사용한다. 768–1023px 구간은 모바일과 데스크톱 토큰을 기준으로 `clamp()` 또는 컴포넌트별 미디어쿼리를 사용하고, 임의의 원시 값을 새로 만들지 않는다.

---

## 2. 토큰 관리 원칙

| 단계            | 역할                   | 예시                   |
| --------------- | ---------------------- | ---------------------- |
| Primitive Token | Figma의 실제 원시 값   | `--color-ink-black`    |
| Semantic Token  | 화면에서의 의미와 역할 | `--color-text-primary` |
| Component Token | 특정 컴포넌트 역할     | `--button-primary-bg`  |

컴포넌트 CSS에서는 가능한 한 Primitive Token을 직접 사용하지 않고 Semantic Token 또는 Component Token을 사용한다.

```css
/* 지양 */
.product-card__name {
    color: #222222;
}

/* 권장 */
.product-card__name {
    color: var(--color-text-primary);
}
```

### 토큰 파일 위치

```text
src/
└── styles/
    ├── reset.css
    ├── variables.css
    ├── fonts.css
    └── global.css
```

- `variables.css`: 색상, 타이포그래피, 간격 등 모든 디자인 토큰
- `fonts.css`: EB Garamond, KoPub Batang, KoPubWorldDotum Pro 연결
- `global.css`: body, 공통 컨테이너, 접근성 유틸리티
- 컴포넌트별 실제 스타일: 해당 컴포넌트 또는 페이지 폴더의 CSS

---

## 3. 컬러 토큰

### 3-1. Figma Primitive Color

| 토큰                  | Figma 이름                  | 값        | 용도                        |
| --------------------- | --------------------------- | --------- | --------------------------- |
| `--color-black`       | Greyscale / Black           | `#000000` | 순수 검정                   |
| `--color-ink-black`   | DIPTYQUE / Text / Ink Black | `#222222` | 기본 텍스트, 보조 배경      |
| `--color-gray-4b`     | 4B                          | `#4B4B4B` | 보조 텍스트                 |
| `--color-gray-8b`     | Greyscale / Grey 2          | `#8B8B8B` | 비활성·메타 텍스트          |
| `--color-ivory`       | Main Background / Ivory     | `#F7F6F4` | 기본 화면 배경              |
| `--color-paper-ivory` | Paper Ivory                 | `#F2E9DA` | 보조 표면·프레젠테이션 강조 |
| `--color-deep-sage`   | Deep Sage                   | `#5F6C58` | 브랜드 강조                 |
| `--color-scent-amber` | Scent Amber                 | `#B87B2E` | 브랜드 하이라이트           |
| `--color-white`       | White                       | `#FFFFFF` | 카드·모달 표면, 반전 텍스트 |

`#F7F7F7`, `#DFDFDF` 등 스타일 가이드 문서 자체의 카드 배경과 테두리는 제품 UI 브랜드 컬러가 아니므로 핵심 브랜드 토큰에 포함하지 않는다.

### 3-2. 상태 및 UI 보조 컬러

아래 값은 Figma 브랜드 팔레트가 아니라 폼 피드백과 고객문의 상태를 위한 프로젝트 보조 토큰이다.

| 토큰                                       | 값                    | 용도               |
| ------------------------------------------ | --------------------- | ------------------ |
| `--color-gray-100`                         | `#F5F5F5`             | 비활성 표면        |
| `--color-gray-200`                         | `#E5E5E5`             | 기본 테두리        |
| `--color-gray-300`                         | `#D4D4D4`             | 비활성 테두리·버튼 |
| `--color-red-50` / `--color-red-600`       | `#FEF2F2` / `#DC2626` | 오류               |
| `--color-green-50` / `--color-green-700`   | `#F0FDF4` / `#15803D` | 성공               |
| `--color-yellow-50` / `--color-yellow-700` | `#FEFCE8` / `#A16207` | 대기               |
| `--color-blue-50` / `--color-blue-700`     | `#EFF6FF` / `#1D4ED8` | 정보·확인 중       |

상태 컬러는 고객문의 상태, 폼 오류, 성공 알림에만 제한적으로 사용한다.

### 3-3. Semantic Color

| 토큰                           | 연결 값               | 역할                    |
| ------------------------------ | --------------------- | ----------------------- |
| `--color-bg-primary`           | `--color-ivory`       | 기본 화면 배경          |
| `--color-bg-secondary`         | `--color-ink-black`   | 어두운 보조 배경        |
| `--color-bg-accent`            | `--color-paper-ivory` | 밝은 강조 배경          |
| `--color-surface`              | `--color-white`       | 카드·모달 표면          |
| `--color-surface-muted`        | `--color-paper-ivory` | 보조 표면               |
| `--color-text-primary`         | `--color-ink-black`   | 제목·본문 기본색        |
| `--color-text-secondary`       | `--color-gray-4b`     | 설명·메타 정보          |
| `--color-text-muted`           | `--color-gray-8b`     | placeholder·비활성 정보 |
| `--color-text-inverse`         | `--color-ivory`       | 어두운 배경의 텍스트    |
| `--color-border-default`       | `--color-gray-200`    | 기본 테두리             |
| `--color-border-strong`        | `--color-ink-black`   | 선택·강조 테두리        |
| `--color-action-primary`       | `--color-ink-black`   | 기본 CTA                |
| `--color-action-primary-hover` | `--color-gray-4b`     | CTA hover               |
| `--color-action-disabled`      | `--color-gray-300`    | 비활성 버튼             |
| `--color-accent-primary`       | `--color-deep-sage`   | 브랜드 강조             |
| `--color-accent-highlight`     | `--color-scent-amber` | 제한적 하이라이트       |
| `--color-focus`                | `#2563EB`             | 키보드 포커스 링        |
| `--color-error`                | `--color-red-600`     | 오류·삭제               |
| `--color-success`              | `--color-green-700`   | 성공                    |
| `--color-warning`              | `--color-yellow-700`  | 접수·대기               |
| `--color-info`                 | `--color-blue-700`    | 정보·확인 중            |

### 접근성 기준

- 일반 텍스트와 배경의 명도 대비는 최소 4.5:1, 큰 글자는 최소 3:1을 목표로 한다.
- `Deep Sage`, `Scent Amber`는 장식과 강조에 우선 사용하며 작은 본문 텍스트에 사용할 때 대비를 별도로 확인한다.
- 상태는 색상만으로 표현하지 않고 텍스트 또는 아이콘을 함께 제공한다.

---

## 4. 타이포그래피 토큰

### 4-1. Font Family

| 토큰                     | 값                                                     | Figma 용도                |
| ------------------------ | ------------------------------------------------------ | ------------------------- |
| `--font-family-display`  | `"EB Garamond", Georgia, serif`                        | 메인 영문, 영문 제목·본문 |
| `--font-family-serif-kr` | `"KoPub Batang", "KoPub바탕체", serif`                 | 한글 제목·한글 serif 본문 |
| `--font-family-sans`     | `"KoPubWorldDotum Pro", "KoPubWorldDotum", sans-serif` | 한글·영문 sans 본문, 푸터 |

Figma 스타일 가이드의 실제 웹 텍스트에는 위 세 가족을 사용한다. 설명 라벨에 사용된 Noto Sans KR과 Lato는 제품 UI 폰트 토큰에 포함하지 않는다.

### 4-2. Font Weight

| 토큰                     |    값 | 용도                         |
| ------------------------ | ----: | ---------------------------- |
| `--font-weight-light`    | `300` | Light                        |
| `--font-weight-regular`  | `400` | Regular                      |
| `--font-weight-medium`   | `500` | Medium                       |
| `--font-weight-semibold` | `600` | EB Garamond SemiBold 사용 시 |
| `--font-weight-bold`     | `700` | Bold                         |

### 4-3. 영문 제목 스타일

| 토큰 이름        | Figma 스타일   | 폰트        |  크기 | 행간 | 자간 | 굵기 |
| ---------------- | -------------- | ----------- | ----: | ---: | ---: | ---: |
| `web-title-b1`   | W Title B1     | EB Garamond | 130px | 100% |    0 |  700 |
| `web-title-b2`   | W Title B2     | EB Garamond |  96px | 100% |    0 |  700 |
| `web-title-m1`   | W Title M1     | EB Garamond | 160px | 100% |   2% |  500 |
| `web-title-m2`   | W Title M2     | EB Garamond | 110px | 100% |    0 |  500 |
| `web-title-r1`   | W Title R1     | EB Garamond |  90px | 100% |    0 |  400 |
| `sub-title-m1`   | Sub title M1   | EB Garamond |  42px | 120% |    0 |  500 |
| `sub-title-r1`   | Sub title R1   | EB Garamond |  64px | 110% |    0 |  400 |
| `sub-title-r2`   | Sub title R2   | EB Garamond |  50px | 160% |    0 |  400 |
| `point-title-m1` | Point title M1 | EB Garamond |  42px | 150% |  21% |  500 |

`point-title-m1`의 21% 자간은 Figma 원본값이며 CSS에서는 `0.21em`으로 변환한다.

### 4-4. 한글 제목 스타일

| 토큰 이름         | Figma 스타일    | 폰트         | 크기 | 행간 | 자간 | 굵기 |
| ----------------- | --------------- | ------------ | ---: | ---: | ---: | ---: |
| `kr-sub-title-b1` | KR Sub title B1 | KoPub Batang | 70px | 130% |    0 |  700 |
| `kr-sub-title-r1` | KR Sub title R1 | KoPub Batang | 40px | 130% |    0 |  400 |

### 4-5. 본문 스타일

| 토큰 이름        | Figma 스타일 | 폰트                | 크기 | 행간 | 자간 | 굵기 |
| ---------------- | ------------ | ------------------- | ---: | ---: | ---: | ---: |
| `web-body-m1-eb` | Body M1 Eb   | EB Garamond         | 28px | 130% |    0 |  500 |
| `web-body-m1-do` | Body M1 Do   | KoPubWorldDotum Pro | 20px | 150% |   2% |  500 |
| `web-body-m2-do` | Body M2 Do   | KoPubWorldDotum Pro | 18px | 150% |   2% |  500 |
| `web-body-l1-do` | Body L1 Do   | KoPubWorldDotum Pro | 18px | 150% |   2% |  300 |
| `web-body-l2-do` | Body L2 Do   | KoPubWorldDotum Pro | 16px | 150% |   2% |  300 |
| `web-kr-body-r1` | KR Body R1   | KoPub Batang        | 22px | 130% |   6% |  400 |

### 4-6. 푸터 스타일

| 토큰 이름          | Figma 스타일 | 폰트                | 크기 | 행간 | 자간 | 굵기 |
| ------------------ | ------------ | ------------------- | ---: | ---: | ---: | ---: |
| `web-footer-b1-do` | Footer B1 Do | KoPubWorldDotum Pro | 18px | 160% |   2% |  700 |
| `web-footer-m1-do` | Footer M1 Do | KoPubWorldDotum Pro | 16px | 160% |   2% |  500 |
| `web-footer-m2-do` | Footer M2 Do | KoPubWorldDotum Pro | 14px | 160% |   2% |  500 |

### 4-7. 모바일 제목 스타일

| 토큰 이름                | Figma 스타일    | 폰트         | 크기 | 행간 | 자간 | 굵기 |
| ------------------------ | --------------- | ------------ | ---: | ---: | ---: | ---: |
| `mobile-title-b1`        | MB Title B1     | EB Garamond  | 64px | 130% |    0 |  700 |
| `mobile-title-m1`        | MB Title M1     | EB Garamond  | 58px | 110% |    0 |  500 |
| `mobile-title-r1`        | MB Title R1     | EB Garamond  | 50px | 110% |    0 |  400 |
| `mobile-title-r2`        | MB Title R2     | EB Garamond  | 40px | 110% |    0 |  400 |
| `mobile-sub-title-r1`    | Sub title R1    | EB Garamond  | 32px | 110% |    0 |  400 |
| `mobile-sub-title-r2`    | Sub title R2    | EB Garamond  | 26px | 130% |    0 |  400 |
| `mobile-kr-sub-title-b1` | KR Sub title B1 | KoPub Batang | 36px | 130% |    0 |  700 |
| `mobile-kr-sub-title-r1` | KR Sub title R1 | KoPub Batang | 26px | 130% |    0 |  400 |

### 4-8. 모바일 본문 스타일

| 토큰 이름           | Figma 스타일 | 폰트                | 크기 | 행간 | 자간 | 굵기 |
| ------------------- | ------------ | ------------------- | ---: | ---: | ---: | ---: |
| `mobile-body-r1-eb` | Body 1       | EB Garamond         | 16px | 140% |    0 |  400 |
| `mobile-body-b1-do` | Body B1      | KoPubWorldDotum Pro | 13px | 140% |   2% |  700 |
| `mobile-body-m1-do` | Body M1      | KoPubWorldDotum Pro | 16px | 140% |   6% |  500 |
| `mobile-body-r1-do` | Body R1      | KoPubWorldDotum Pro | 16px | 140% |   6% |  300 |
| `mobile-body-r2-do` | Body R2      | KoPubWorldDotum Pro | 14px | 140% |   2% |  300 |
| `mobile-body-l1-do` | Body L1      | KoPubWorldDotum Pro | 12px | 140% |   2% |  300 |

#### Figma 라벨과 연결 스타일의 차이

- `MB Title M1` 설명 라벨에는 자간 2%가 적혀 있지만 연결된 Figma 텍스트 스타일의 실제 자간은 0이다. 토큰은 실제 스타일 값인 `0`을 사용한다.
- `Body R1` 설명 라벨에는 Regular가 적혀 있지만 연결된 Figma 텍스트 스타일은 Light 300이다. 토큰은 실제 스타일 값인 `300`을 사용한다.

### 4-9. CSS 속성 토큰 규칙

각 Figma 텍스트 스타일은 `size`, `line-height`, `letter-spacing`, `weight`를 한 세트로 사용한다. 같은 크기라도 굵기나 행간이 다른 경우 스타일 이름을 생략하지 않는다.

```css
.hero__title {
    font-family: var(--font-family-display);
    font-size: var(--text-web-title-m1-size);
    font-weight: var(--text-web-title-m1-weight);
    line-height: var(--text-web-title-m1-line-height);
    letter-spacing: var(--text-web-title-m1-letter-spacing);
}
```

모바일 스타일도 같은 방식으로 네 속성을 한 세트로 적용한다.

```css
.hero__title {
    font-family: var(--font-family-display);
    font-size: var(--text-mobile-title-b1-size);
    font-weight: var(--text-mobile-title-b1-weight);
    line-height: var(--text-mobile-title-b1-line-height);
    letter-spacing: var(--text-mobile-title-b1-letter-spacing);
}
```

---

## 5. 프로젝트 보조 토큰

아래 토큰은 Figma 스타일 가이드에서 추출한 값이 아니라 기존 프로젝트의 일관성과 접근성을 위한 구현 기준이다.

### 5-1. Spacing

4px을 기본 단위로 사용한다.

| 토큰         |        값 |  픽셀 |
| ------------ | --------: | ----: |
| `--space-0`  |       `0` |   0px |
| `--space-1`  | `0.25rem` |   4px |
| `--space-2`  |  `0.5rem` |   8px |
| `--space-3`  | `0.75rem` |  12px |
| `--space-4`  |    `1rem` |  16px |
| `--space-5`  | `1.25rem` |  20px |
| `--space-6`  |  `1.5rem` |  24px |
| `--space-8`  |    `2rem` |  32px |
| `--space-10` |  `2.5rem` |  40px |
| `--space-12` |    `3rem` |  48px |
| `--space-16` |    `4rem` |  64px |
| `--space-20` |    `5rem` |  80px |
| `--space-24` |    `6rem` |  96px |
| `--space-32` |    `8rem` | 128px |

### 5-2. Layout 및 반응형

| 토큰                          |                       값 | 역할               |
| ----------------------------- | -----------------------: | ------------------ |
| `--container-sm`              |                  `640px` | 폼·인증 화면       |
| `--container-md`              |                  `960px` | 게시판·고객문의    |
| `--container-lg`              |                 `1200px` | 일반 콘텐츠        |
| `--container-xl`              |                 `1440px` | 컬렉션·메인 화면   |
| `--page-padding-mobile`       |                   `16px` | 모바일 좌우 여백   |
| `--page-padding-tablet`       |                   `24px` | 태블릿 좌우 여백   |
| `--page-padding-desktop`      |                   `40px` | 데스크톱 좌우 여백 |
| `--grid-gap-sm` / `md` / `lg` | `12px` / `20px` / `32px` | 그리드 간격        |

| 구분    |             기준 |
| ------- | ---------------: |
| Mobile  | 기본값, 0px 이상 |
| Tablet  |     `768px` 이상 |
| Desktop |    `1024px` 이상 |
| Wide    |    `1440px` 이상 |

### 5-3. Size, Border, Shadow

| 그룹          | 토큰과 값                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Touch·Control | `--size-touch-min: 44px`, `--size-button-sm: 40px`, `--size-button-md: 48px`, `--size-button-lg: 56px`, `--size-input: 48px`                                 |
| Icon          | `--size-icon-sm: 16px`, `--size-icon-md: 20px`, `--size-icon-lg: 24px`                                                                                       |
| Border        | `--border-width-thin: 1px`, `--border-width-medium: 2px`                                                                                                     |
| Radius        | `--radius-none: 0`, `--radius-sm: 2px`, `--radius-md: 4px`, `--radius-lg: 8px`, `--radius-full: 9999px`                                                      |
| Shadow        | `--shadow-none: none`, `--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.08)`, `--shadow-md: 0 8px 24px rgb(0 0 0 / 0.12)`, `--shadow-lg: 0 20px 48px rgb(0 0 0 / 0.18)` |

### 5-4. Z-index, Motion, Opacity

| 그룹     | 토큰과 값                                                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Z-index  | `--z-base: 0`, `--z-sticky: 100`, `--z-header: 200`, `--z-dropdown: 300`, `--z-overlay: 400`, `--z-modal: 500`, `--z-toast: 600`             |
| Duration | `--duration-fast: 120ms`, `--duration-normal: 240ms`, `--duration-slow: 480ms`, `--duration-section: 800ms`                                  |
| Easing   | `--ease-standard: cubic-bezier(0.2, 0, 0, 1)`, `--ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-exit: cubic-bezier(0.4, 0, 1, 1)` |
| Opacity  | `--opacity-disabled: 0.4`, `--opacity-muted: 0.64`, `--opacity-overlay: 0.56`, `--opacity-hover: 0.8`                                        |

---

## 6. 컴포넌트 토큰

| 토큰                                            | 연결 값                                                        |
| ----------------------------------------------- | -------------------------------------------------------------- |
| `--button-primary-bg`                           | `--color-action-primary`                                       |
| `--button-primary-text`                         | `--color-text-inverse`                                         |
| `--button-primary-hover`                        | `--color-action-primary-hover`                                 |
| `--button-secondary-bg`                         | `--color-surface`                                              |
| `--button-secondary-text`                       | `--color-text-primary`                                         |
| `--button-secondary-border`                     | `--color-border-strong`                                        |
| `--button-disabled-bg`                          | `--color-action-disabled`                                      |
| `--button-height` / `--button-radius`           | `--size-button-md` / `--radius-md`                             |
| `--input-bg` / `--input-text`                   | `--color-surface` / `--color-text-primary`                     |
| `--input-placeholder`                           | `--color-text-muted`                                           |
| `--input-border` / `--input-border-focus`       | `--color-border-default` / `--color-border-strong`             |
| `--input-border-error`                          | `--color-error`                                                |
| `--input-height` / `--input-radius`             | `--size-input` / `--radius-md`                                 |
| `--card-bg` / `--card-border` / `--card-radius` | `--color-surface` / `--color-border-default` / `--radius-none` |
| `--modal-bg` / `--modal-radius`                 | `--color-surface` / `--radius-lg`                              |
| `--modal-shadow` / `--modal-z-index`            | `--shadow-lg` / `--z-modal`                                    |

### 고객문의 상태

| 상태                 | 배경                | 텍스트            |
| -------------------- | ------------------- | ----------------- |
| 접수 완료 `PENDING`  | `--color-yellow-50` | `--color-warning` |
| 확인 중 `IN_REVIEW`  | `--color-blue-50`   | `--color-info`    |
| 답변 완료 `ANSWERED` | `--color-green-50`  | `--color-success` |

---

## 7. `variables.css` 핵심 예시

아래 코드를 `src/styles/variables.css`의 기준으로 사용한다. 프로젝트 보조 토큰은 5절의 값을 같은 `:root`에 이어 선언한다.

```css
:root {
    /* Figma primitive colors */
    --color-black: #000000;
    --color-ink-black: #222222;
    --color-gray-4b: #4b4b4b;
    --color-gray-8b: #8b8b8b;
    --color-ivory: #f7f6f4;
    --color-paper-ivory: #f2e9da;
    --color-deep-sage: #5f6c58;
    --color-scent-amber: #b87b2e;
    --color-white: #ffffff;

    /* Semantic colors */
    --color-bg-primary: var(--color-ivory);
    --color-bg-secondary: var(--color-ink-black);
    --color-bg-accent: var(--color-paper-ivory);
    --color-surface: var(--color-white);
    --color-surface-muted: var(--color-paper-ivory);
    --color-text-primary: var(--color-ink-black);
    --color-text-secondary: var(--color-gray-4b);
    --color-text-muted: var(--color-gray-8b);
    --color-text-inverse: var(--color-ivory);
    --color-border-strong: var(--color-ink-black);
    --color-action-primary: var(--color-ink-black);
    --color-action-primary-hover: var(--color-gray-4b);
    --color-accent-primary: var(--color-deep-sage);
    --color-accent-highlight: var(--color-scent-amber);

    /* Font families and weights */
    --font-family-display: 'EB Garamond', Georgia, serif;
    --font-family-serif-kr: 'KoPub Batang', 'KoPub바탕체', serif;
    --font-family-sans: 'KoPubWorldDotum Pro', 'KoPubWorldDotum', sans-serif;
    --font-weight-light: 300;
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    /* English title styles */
    --text-web-title-b1-size: 130px;
    --text-web-title-b1-line-height: 1;
    --text-web-title-b1-letter-spacing: 0;
    --text-web-title-b1-weight: var(--font-weight-bold);
    --text-web-title-b2-size: 96px;
    --text-web-title-b2-line-height: 1;
    --text-web-title-b2-letter-spacing: 0;
    --text-web-title-b2-weight: var(--font-weight-bold);
    --text-web-title-m1-size: 160px;
    --text-web-title-m1-line-height: 1;
    --text-web-title-m1-letter-spacing: 0.02em;
    --text-web-title-m1-weight: var(--font-weight-medium);
    --text-web-title-m2-size: 110px;
    --text-web-title-m2-line-height: 1;
    --text-web-title-m2-letter-spacing: 0;
    --text-web-title-m2-weight: var(--font-weight-medium);
    --text-web-title-r1-size: 90px;
    --text-web-title-r1-line-height: 1;
    --text-web-title-r1-letter-spacing: 0;
    --text-web-title-r1-weight: var(--font-weight-regular);

    /* Subtitle and point title styles */
    --text-sub-title-m1-size: 42px;
    --text-sub-title-m1-line-height: 1.2;
    --text-sub-title-m1-letter-spacing: 0;
    --text-sub-title-m1-weight: var(--font-weight-medium);
    --text-sub-title-r1-size: 64px;
    --text-sub-title-r1-line-height: 1.1;
    --text-sub-title-r1-letter-spacing: 0;
    --text-sub-title-r1-weight: var(--font-weight-regular);
    --text-sub-title-r2-size: 50px;
    --text-sub-title-r2-line-height: 1.6;
    --text-sub-title-r2-letter-spacing: 0;
    --text-sub-title-r2-weight: var(--font-weight-regular);
    --text-point-title-m1-size: 42px;
    --text-point-title-m1-line-height: 1.5;
    --text-point-title-m1-letter-spacing: 0.21em;
    --text-point-title-m1-weight: var(--font-weight-medium);
    --text-kr-sub-title-b1-size: 70px;
    --text-kr-sub-title-b1-line-height: 1.3;
    --text-kr-sub-title-b1-letter-spacing: 0;
    --text-kr-sub-title-b1-weight: var(--font-weight-bold);
    --text-kr-sub-title-r1-size: 40px;
    --text-kr-sub-title-r1-line-height: 1.3;
    --text-kr-sub-title-r1-letter-spacing: 0;
    --text-kr-sub-title-r1-weight: var(--font-weight-regular);

    /* Body styles */
    --text-web-body-m1-eb-size: 28px;
    --text-web-body-m1-eb-line-height: 1.3;
    --text-web-body-m1-eb-letter-spacing: 0;
    --text-web-body-m1-eb-weight: var(--font-weight-medium);
    --text-web-body-m1-do-size: 20px;
    --text-web-body-m1-do-line-height: 1.5;
    --text-web-body-m1-do-letter-spacing: 0.02em;
    --text-web-body-m1-do-weight: var(--font-weight-medium);
    --text-web-body-m2-do-size: 18px;
    --text-web-body-m2-do-line-height: 1.5;
    --text-web-body-m2-do-letter-spacing: 0.02em;
    --text-web-body-m2-do-weight: var(--font-weight-medium);
    --text-web-body-l1-do-size: 18px;
    --text-web-body-l1-do-line-height: 1.5;
    --text-web-body-l1-do-letter-spacing: 0.02em;
    --text-web-body-l1-do-weight: var(--font-weight-light);
    --text-web-body-l2-do-size: 16px;
    --text-web-body-l2-do-line-height: 1.5;
    --text-web-body-l2-do-letter-spacing: 0.02em;
    --text-web-body-l2-do-weight: var(--font-weight-light);
    --text-web-kr-body-r1-size: 22px;
    --text-web-kr-body-r1-line-height: 1.3;
    --text-web-kr-body-r1-letter-spacing: 0.06em;
    --text-web-kr-body-r1-weight: var(--font-weight-regular);

    /* Footer styles */
    --text-web-footer-b1-do-size: 18px;
    --text-web-footer-b1-do-line-height: 1.6;
    --text-web-footer-b1-do-letter-spacing: 0.02em;
    --text-web-footer-b1-do-weight: var(--font-weight-bold);
    --text-web-footer-m1-do-size: 16px;
    --text-web-footer-m1-do-line-height: 1.6;
    --text-web-footer-m1-do-letter-spacing: 0.02em;
    --text-web-footer-m1-do-weight: var(--font-weight-medium);
    --text-web-footer-m2-do-size: 14px;
    --text-web-footer-m2-do-line-height: 1.6;
    --text-web-footer-m2-do-letter-spacing: 0.02em;
    --text-web-footer-m2-do-weight: var(--font-weight-medium);

    /* Mobile title styles */
    --text-mobile-title-b1-size: 64px;
    --text-mobile-title-b1-line-height: 1.3;
    --text-mobile-title-b1-letter-spacing: 0;
    --text-mobile-title-b1-weight: var(--font-weight-bold);
    --text-mobile-title-m1-size: 58px;
    --text-mobile-title-m1-line-height: 1.1;
    --text-mobile-title-m1-letter-spacing: 0;
    --text-mobile-title-m1-weight: var(--font-weight-medium);
    --text-mobile-title-r1-size: 50px;
    --text-mobile-title-r1-line-height: 1.1;
    --text-mobile-title-r1-letter-spacing: 0;
    --text-mobile-title-r1-weight: var(--font-weight-regular);
    --text-mobile-title-r2-size: 40px;
    --text-mobile-title-r2-line-height: 1.1;
    --text-mobile-title-r2-letter-spacing: 0;
    --text-mobile-title-r2-weight: var(--font-weight-regular);
    --text-mobile-sub-title-r1-size: 32px;
    --text-mobile-sub-title-r1-line-height: 1.1;
    --text-mobile-sub-title-r1-letter-spacing: 0;
    --text-mobile-sub-title-r1-weight: var(--font-weight-regular);
    --text-mobile-sub-title-r2-size: 26px;
    --text-mobile-sub-title-r2-line-height: 1.3;
    --text-mobile-sub-title-r2-letter-spacing: 0;
    --text-mobile-sub-title-r2-weight: var(--font-weight-regular);
    --text-mobile-kr-sub-title-b1-size: 36px;
    --text-mobile-kr-sub-title-b1-line-height: 1.3;
    --text-mobile-kr-sub-title-b1-letter-spacing: 0;
    --text-mobile-kr-sub-title-b1-weight: var(--font-weight-bold);
    --text-mobile-kr-sub-title-r1-size: 26px;
    --text-mobile-kr-sub-title-r1-line-height: 1.3;
    --text-mobile-kr-sub-title-r1-letter-spacing: 0;
    --text-mobile-kr-sub-title-r1-weight: var(--font-weight-regular);

    /* Mobile body styles */
    --text-mobile-body-r1-eb-size: 16px;
    --text-mobile-body-r1-eb-line-height: 1.4;
    --text-mobile-body-r1-eb-letter-spacing: 0;
    --text-mobile-body-r1-eb-weight: var(--font-weight-regular);
    --text-mobile-body-b1-do-size: 13px;
    --text-mobile-body-b1-do-line-height: 1.4;
    --text-mobile-body-b1-do-letter-spacing: 0.02em;
    --text-mobile-body-b1-do-weight: var(--font-weight-bold);
    --text-mobile-body-m1-do-size: 16px;
    --text-mobile-body-m1-do-line-height: 1.4;
    --text-mobile-body-m1-do-letter-spacing: 0.06em;
    --text-mobile-body-m1-do-weight: var(--font-weight-medium);
    --text-mobile-body-r1-do-size: 16px;
    --text-mobile-body-r1-do-line-height: 1.4;
    --text-mobile-body-r1-do-letter-spacing: 0.06em;
    --text-mobile-body-r1-do-weight: var(--font-weight-light);
    --text-mobile-body-r2-do-size: 14px;
    --text-mobile-body-r2-do-line-height: 1.4;
    --text-mobile-body-r2-do-letter-spacing: 0.02em;
    --text-mobile-body-r2-do-weight: var(--font-weight-light);
    --text-mobile-body-l1-do-size: 12px;
    --text-mobile-body-l1-do-line-height: 1.4;
    --text-mobile-body-l1-do-letter-spacing: 0.02em;
    --text-mobile-body-l1-do-weight: var(--font-weight-light);
}
```

---

## 8. 폰트 연결과 적용

`fonts.css`에서 적법하게 확보한 웹폰트 파일을 연결한다. 실제 파일명과 경로에 맞게 `src`를 수정한다.

```css
@font-face {
    font-family: 'EB Garamond';
    src: url('/fonts/eb-garamond-regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
```

EB Garamond, KoPub Batang, KoPubWorldDotum Pro를 사용하는 굵기(300, 400, 500, 600, 700)에 맞춰 선언한다. 라이선스와 배포 권한을 확인하지 않은 폰트 파일은 저장소에 커밋하지 않는다.

`main.jsx`에서 공통 CSS를 한 번만 불러온다.

```jsx
import './styles/reset.css';
import './styles/fonts.css';
import './styles/variables.css';
import './styles/global.css';
```

---

## 9. 접근성과 모션

```css
.product-card__like-button:focus-visible {
    outline: var(--border-width-medium) solid var(--color-focus);
    outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

GSAP 애니메이션도 `prefers-reduced-motion`을 확인해 축소하거나 비활성화한다.

---

## 10. 토큰 사용 금지 기준

- 컴포넌트 CSS에 Figma 원시 HEX 값을 반복해서 작성하지 않는다.
- Figma 텍스트 스타일의 크기만 가져오고 폰트, 굵기, 행간, 자간을 누락하지 않는다.
- 정의되지 않은 글자 크기와 유사 간격을 임의로 추가하지 않는다.
- `z-index: 9999`를 사용하지 않는다.
- 색상만으로 성공, 실패, 선택 상태를 표시하지 않는다.
- `Deep Sage`와 `Scent Amber`를 주요 본문색처럼 과도하게 사용하지 않는다.
- 그림자와 radius를 패션 브랜드의 미니멀한 방향과 맞지 않게 과도하게 사용하지 않는다.
- 새로운 토큰이 필요하면 용도와 중복 여부를 확인하고 `variables.css`와 이 문서를 함께 수정한다.

---

## 11. 완료 체크리스트

- [ ] Figma의 핵심 컬러가 `variables.css`에 선언되었다.
- [ ] 기본 배경은 Ivory `#F7F6F4`, 기본 텍스트는 Ink Black `#222222`이다.
- [ ] EB Garamond, KoPub Batang, KoPubWorldDotum Pro가 필요한 굵기로 연결되었다.
- [ ] Figma의 데스크톱 제목 11종, 본문 6종, 푸터 3종 속성이 토큰과 일치한다.
- [ ] Figma의 모바일 제목 8종과 본문 6종 속성이 토큰과 일치한다.
- [ ] 모바일 토큰은 0–767px에서 우선 사용하고 태블릿 전환값은 기존 토큰을 기준으로 계산한다.
- [ ] 퍼센트 자간은 CSS `em` 단위로 정확히 변환했다.
- [ ] 컴포넌트는 Semantic Token 또는 Component Token을 우선 사용한다.
- [ ] 최소 터치 영역이 44px 이상이다.
- [ ] 모바일 퍼스트와 768px, 1024px, 1440px 기준을 사용한다.
- [ ] 포커스 표시와 텍스트 명도 대비를 확인했다.
- [ ] 상태를 색상만으로 구분하지 않는다.
- [ ] `prefers-reduced-motion`을 지원한다.
- [ ] 새 토큰 추가 시 문서와 `variables.css`를 함께 수정한다.
