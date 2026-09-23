# DIPTYQUE Renewal

Figma 정보구조도와 `Design-token.md`, `DIPTYQUE_BUILD_GUIDE.md`를 기준으로 제작한 React + Vite 반응형 쇼핑 경험입니다. 교육 목적의 비공식 리뉴얼 프로젝트이며 DIPTYQUE 공식 서비스가 아닙니다.

## 실행

```bash
npm install
npm run dev
```

검증 명령은 `npm run lint`, `npm run build`입니다.

테스트 로그인은 로그인 화면의 **테스트 계정으로 로그인** 버튼을 사용하거나 `demo` / `DIPTYQUE-demo-1234`를 입력합니다.

## 구현 범위

- IA 기반 HOME, SHOP, ABOUT, GALERIE, CONTACT US, MY PAGE
- 검색, 상품 상세, 장바구니, 로그인·회원가입, 프로필 캐릭터 변경
- 사용자별 좋아요와 최근 본 상품, 주문 관련 화면
- 고객문의 CRUD, 상태·권한 정책, 검색·필터·페이지네이션
- 확장 커뮤니티 게시판 CRUD, 검색·필터·정렬·페이지네이션·좋아요
- 반응형 레이아웃과 Zustand + localStorage 기반 데모 상태 관리

## 디자인 토큰

색상, 타이포그래피, 간격, 반응형 기준은 `src/styles/variables.css`에서 관리합니다. 표시 서체는 EB Garamond와 KoPub 계열 스택을 사용하며, KoPub 폰트가 설치되지 않은 환경에서는 Noto Sans KR/시스템 서체로 대체됩니다.

## 이미지 출처 및 사용 위치

상품 이미지는 DIPTYQUE 공식 미국 사이트에서 교육용 시안에 한해 참조했습니다.

| 공식 원본 페이지 | 로컬 파일 | 사용 위치 |
|---|---|---|
| https://us.diptyqueparis.com/en-us/collections/all-fragrances | `orpheon.jpg`, `fleur-de-peau.webp`, `leau-papier.webp`, `tam-dao.webp` | 홈 히어로, 향수 상품 카드·상세 |
| https://us.diptyqueparis.com/en-us/collections/baies-berries | `baies.webp` | 홈 에디토리얼, 캔들 상품 카드·상세 |
| https://us.diptyqueparis.com/en-us/products/room-spray-baies-berries-vbv2 | `room-spray.webp` | 룸 스프레이 상품 카드·상세 |
| https://us.diptyqueparis.com/en-us/collections/body-care | `hand-wash.webp`, `body-lotion.jpg` | 바디·핸드 케어 상품 카드·상세 |

운영 배포 전에는 브랜드 이미지 사용 권한과 KoPub 폰트 라이선스를 별도로 확인해야 합니다.

## 구조

페이지와 컴포넌트의 CSS는 해당 JSX 옆에 배치했습니다. 정적 상품 데이터는 `src/data`, 조회 인터페이스는 `src/services`, 사용자 상태와 CRUD는 `src/store`에서 분리했습니다.
