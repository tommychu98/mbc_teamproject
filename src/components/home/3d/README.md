# Home 3D 모델 제출 안내

`assets/orpheon-custom.bin`은 원본 GLB의 무손실 gzip 파일입니다.
정적 서버의 자동 gzip 해제를 피하기 위해 `.bin` 확장자를 사용합니다.
브라우저에서 `DecompressionStream`으로 복원한 뒤 Three.js로 읽습니다.
메시, 유리 재질, 텍스처와 기존 재생 인터랙션은 그대로 유지합니다.

- 원본: 109,756,404 bytes
- 압축 파일: 75,390,827 bytes (GitHub 일반 파일 제한 100 MiB 미만)
- 복원된 GLB SHA256: `d4352b6ac3418f23fdbb6f8083439dd60fa0262707ed0ba1e9fc9c099b082d16`

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
