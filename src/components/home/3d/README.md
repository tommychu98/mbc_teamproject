# Home 3D 모델 제출 안내

`assets/orpheon-custom.bin`은 경량화한 GLB의 gzip 파일입니다.
정적 서버의 자동 gzip 해제를 피하기 위해 `.bin` 확장자를 사용합니다.
브라우저에서 `DecompressionStream`으로 복원한 뒤 Three.js로 읽습니다.
동일 정점 병합, 미사용 데이터 제거, 무손실 Meshopt 압축과 무손실 WebP를
사용합니다. 정점 좌표·법선·UV, 삼각형 표면과 보이는 텍스처 픽셀을 원본과
비교해 동일함을 확인했습니다. 메시 단순화, 좌표 양자화, 텍스처 축소는
적용하지 않았습니다. 유리 재질과 기존 재생 인터랙션은 유지합니다.

- 원본: 109,756,404 bytes
- 이전 압축 파일: 75,390,827 bytes
- 경량 압축 파일: 35,611,735 bytes (약 53% 감소)
- 복원된 경량 GLB SHA256: `9e55a62ee9439eaaf5aa3b022e7dc086357a13891a62b14a806be673f1cecf3b`

The model and Three.js preload when this section is within 600px of the viewport.
셰이더 컴파일 및 첫 텍스처 업로드도 미리 수행하며, 등장 애니메이션 시간은
실제로 해당 구간이 보일 때부터 흐릅니다. Meshopt 디코더는 설치된 Three.js의
로컬 모듈을 사용하므로 외부 CDN과 추가 패키지 설정이 필요하지 않습니다.
화면 밖이나 숨겨진 탭에서는 렌더링 루프를 중지하며, 돌아오면 기존 등장
진행 시간을 유지해 이어서 재생합니다.

이 컴포넌트는 `public/models/orpheon-custom.glb`를 더 이상 참조하지 않습니다.
담당 범위 밖의 기존 원본 파일은 보존했으므로 제출에 포함하지 않습니다.
전체 파일을 일괄 추가하는 대신 제출할 경로를 선택해야 합니다.

팀 통합 시 홈 폴더와 함께 기존 `package.json` 및 `package-lock.json`의
`three: 0.186.1` 의존성 변경을 반영해야 합니다. 이 문서 작성 시에는
Git staging, commit, push를 실행하지 않았습니다.

새 체크아웃에서는 `npm ci` 후 `npm run build`로 확인할 수 있습니다.
브라우저에서는 홈의 마지막 3D 구간으로 스크롤해 모델 로딩과
`View Again` 재생을 확인합니다. gzip 파일은 정적 파일 그대로 제공하고,
별도의 `Content-Encoding: gzip` 헤더를 붙이지 않습니다.
