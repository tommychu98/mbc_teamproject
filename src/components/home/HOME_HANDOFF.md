# HOME 인수인계

## 2026-10-05 현재 작업 검토

- 저장소: `https://github.com/tommychu98/mbc_teamproject.git`, 제출 브랜치 `feature/home` (검토 당시 `main`).
- 기존 미완료 변경 때문에 처음 중단했으며, 사용자의 계속 진행 지시 후 `main`에서 검토했습니다. 검토 시점에는 브랜치 전환·생성, pull, add, commit, push를 실행하지 않았습니다.
- 이후 사용자 요청으로 기존 변경을 유지한 채 `feature/home`을 생성했습니다. HOME 변경 8개 파일의 커밋 메시지는 `day-night영상 그라데이션/커서`이며 push는 수행하지 않습니다.
- 담당 폴더 전체 242개 파일을 읽어 확인했습니다. 텍스트 116개는 코드·문서·SVG·기존 검증 스크립트와 JSON을 포함합니다. 바이너리 126개는 자산 참조·파일 데이터와 PNG/압축 모델 무결성을 점검했습니다. 모든 이미지의 디자인을 Figma와 대조한 것은 아닙니다.
- 기존 수정 7개 파일 전체 diff를 검토했습니다. 담당 범위 밖 변경, staged 변경, 추가·삭제·이름 변경은 없었습니다. 이 문서에 현재 검토 결과를 추가했습니다.
- 향수 히스토리: 68px EXPLORE 원형 커서, 어두운 반투명 배경·블러, Fragrances Story 연결, Prev/Next 호버. 모바일에서는 TOP 버튼과 겹치지 않게 원을 위로 이동했습니다.
- Day/영상/Night: 영상 중앙 핀 고정, 진입·이탈 그라데이션, 화면 밖/숨긴 탭에서 일시정지, Night 연결 여백 축소. 실제 콘텐츠 폭으로 높이를 계산해 스크롤바로 인한 중앙 위치 오차를 수정했습니다.
- 3D: PC에서 한 화면 높이만큼 스크롤하는 동안 고정. 모델 로딩과 View Again 동작을 확인했습니다.
- 기존 공개 export·props·이벤트 규칙 유지. 페이지·라우트·공통 스타일·다른 components·store·data·패키지 설정은 수정하지 않았습니다.
- 필수 설치 의존성 버전과 package/lock 내용 일치: `npm ci` 불필요. 다른 운영체제용 optional 의존성이 없는 것은 정상입니다.
- 담당 폴더 전체 ESLint 및 `npm run build` 통과. 최종 diff와 `git diff --check` 확인. 기존 큰 JS 청크 경고는 남아 있습니다.
- 실제 숨김 Chrome에서 1920×1080 PC, 430×932·320px 모바일, 767/768px 전환을 확인했습니다. 영상 입장·고정·퇴장 캡처, 커서·Prev/Next 실제 클릭과 호버, Fragrances Story 이동, 모바일 카테고리·서비스 터치 스와이프, TOP, 모션 감소 시 정지 포스터를 확인했습니다. 점검 중 런타임 예외·가로 넘침·로드 완료된 이미지 누락은 없었습니다.
- 미확인: 실제 휴대폰/Safari, 배포 환경 성능, Figma 정밀 대조, 전체 외부 페이지/상품 필터. 기존 `.verification`의 Playwright 스크립트는 설치된 Playwright가 없어 실행하지 않았으며 과거 결과는 이번 검증 결과로 간주하지 않았습니다.
- 개발 서버: `npm.cmd run dev -- --host 127.0.0.1`, 확인 주소 `http://127.0.0.1:5173/`.

아래 내용은 이전 작업의 기록입니다. 현재 Git 상태·검증 결과는 위 항목을 기준으로 확인하세요.

검증일: 2026-10-04 · 작업 브랜치: `fix-main`

팀 저장소: https://github.com/tommychu98/mbc_teamproject.git

## TOP 버튼 추가 검토

기존 모바일·3D 변경은 `22fa512` (`fix-main/mb수정/3d수정`)로 커밋·푸시
완료했습니다. 아래 TOP 추가 변경은 별도 작업이며 아직 제출하지 않았습니다.

- `HomePage.jsx`에 `HomeTopButton.jsx`와 전용 CSS 연결.
- 웹·모바일 화면 오른쪽 아래 고정. 클릭 시 맨 위 이동.
- `mix-blend-mode: difference`로 실제 배경에 따른 화살표·글씨 대비 반전.
- 기존 히어로 안의 모바일 TOP은 숨겨 중복을 방지.
- 모바일 safe-area 여백과 모션 감소 설정에 따른 즉시 이동 적용.
- 1920px·430px Chrome에서 위치 고정과 클릭 후 scrollY=0 확인.
- 밝은 STORY·어두운 NIGHT에서 실제 버튼 색상 캡처 대조 완료.
- HOME 전체 파일·참조 경로·공백·린트와 프로젝트 빌드 재검사 통과.
- 설치된 의존성과 lock 파일 일치. `npm ci` 재실행 불필요.

Figma `4461:19602`의 디자인 정보에 접근하지 못해 크기·위치는 기존 HOME
스타일을 기준으로 구현했습니다. 해당 디자인과의 정밀 대조, 실제 iPhone·Safari
검증은 남아 있습니다. TOP 변경에 대해 add·commit·push는 실행하지 않았습니다.

## 변경 내용

- 모바일 히어로: 터치 또는 자동 시작, 세로 영상 재생, 종료 후 다음 CON 이동.
- 모바일 STORY, 향수 히스토리, DAY·NIGHT, 카테고리, 텍스트 시퀀스,
  향 이미지, 3D, 프리푸터에 대응 레이아웃과 인터랙션 적용.
- DAY 레몬·가지 연결, NIGHT 꽃 흐름, 카테고리 4개와 서비스 6개 좌우 스와이프.
- 프리푸터 기프트 이미지·텍스트 높이 정렬.
- 고정 헤더 높이에 맞춘 글씨 전환 시작점 보정.
- 모바일에서 웹으로 돌아올 때 NIGHT 가지의 연결된 흔들림 재설정.
- 3D 모델 75,390,827 → 35,611,735 bytes. 유리 재질과 표면·텍스처 유지.
  사전 다운로드·셰이더 준비, 비가시 구간 렌더링 중지 및 복귀 시 이어 재생.

기존 공개 export·props와 연결 URL을 유지했습니다. 이번 검토에서 라우트,
페이지, 공통 스타일, store, data, 패키지 설정은 변경하지 않았습니다.

## 검증

- `npm run build`: 통과. 큰 JS 청크 경고는 남아 있습니다.
- `npx eslint src/components/home`: 통과.
- 담당 파일의 diff·공백, 새 파일 공백·문자 인코딩, 자산 참조 경로 확인.
- 설치된 의존성과 lock 파일 일치 확인. `npm ci` 재실행 불필요.
- 로컬 Chrome에서 1920px 웹 및 430px·320px 모바일 구간별 점검.
- 767px·768px 경계와 웹↔모바일 전환 점검.
- 모바일 영상 종료 후 이동, 카테고리·서비스 실제 터치 스와이프,
  기프트 정렬, 향수 히스토리 전환, `/galerie` 버튼 이동 확인.
- 3D 사전 준비, 등장·재생 버튼·모션 감소 설정 확인.
- 점검한 화면에서 콘솔 예외, 실패한 HTTP 요청, 이미지 누락,
  가로 페이지 넘침 없음.
- 경량 3D의 삼각형 좌표·법선·UV 및 보이는 텍스처 픽셀 원본 대조 완료.

확인 주소: 개발 서버 실행 후 `http://localhost:5173/`.
포트가 사용 중이면 Vite가 출력하는 실제 주소를 사용합니다.

미확인: 실제 iPhone·Safari 및 노치·홈 인디케이터, 배포 환경의 최초
다운로드 속도. 모바일 3D·프리푸터의 최신 Figma와 정밀 대조는 미완료입니다.

## 담당 범위 밖의 기존 변경

아래 변경은 이번 HOME 검토에서 보존했으며 별도 팀장 통합 대상입니다.

- `src/components/layout/Navigation/Navigation.jsx`
- `src/components/layout/Navigation/Navigation.css`
- `src/components/layout/Navigation/assets/mobile-logo.png`
- `src/components/layout/Navigation/assets/mobile-menu.svg`
- `src/components/layout/Navigation/assets/mobile-search.svg`

모바일 HOME은 이 Navigation의 52px + safe-area 높이와 `header--home`
스타일을 함께 사용합니다. HOME만 합칠 경우 기존 헤더와의 높이·색상
연동을 팀장이 확인해야 합니다. 외부 페이지 연결은 기존 팀 라우트를 사용합니다.

`public/models/orpheon-custom.glb`는 기존 대용량 원본이며 현재 HOME 3D가
참조하지 않습니다. HOME 제출에 포함하지 않습니다. 해당 파일이 로컬
`public`에 남아 있으면 Vite 빌드 결과로 복사될 수 있으므로 배포 구성은
팀장이 별도로 확인해야 합니다.

## Git 상태

기존 변경을 초기화하거나 덮어쓰지 않았고, TOP 검토에서 브랜치 전환,
pull, add, commit, push를 실행하지 않았습니다. 전체 작업 트리를 일괄
추가하지 말고 HOME 변경과 위 별도 통합 파일을 구분해 검토해야 합니다.
