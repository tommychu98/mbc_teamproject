# HOME 인수인계

검증일: 2026-10-04 · 작업 브랜치: `fix-main`

팀 저장소: https://github.com/tommychu98/mbc_teamproject.git

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

기존 변경을 초기화하거나 덮어쓰지 않았고, 이번 작업에서 브랜치 전환,
pull, add, commit, push를 실행하지 않았습니다. 전체 작업 트리를 일괄
추가하지 말고 HOME 변경과 위 별도 통합 파일을 구분해 검토해야 합니다.
