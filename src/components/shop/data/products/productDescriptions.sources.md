# 제품 상세 소개 문구

작성일: 2026-10-02

`productDescriptions.js`는 짧은 한국어 편집 문구입니다. 공식 한국어 원문이나 전체 상품의 공식 설명을 그대로 옮긴 데이터가 아닙니다. 아래에서 확인한 향의 특징과 컬렉션 이야기, 기존 상품명의 향·제품 종류를 토대로 소개 문장을 작성했습니다. 확인하지 않은 성분 함량, 지속 시간, 피부 효능은 추가하지 않았습니다.

같은 향의 용량별 상품은 설명을 공유합니다. 바디제품과 홈 프래그런스는 향 소개에 제품 형태별 설명을 붙이며, 리필·유리 용기·마개는 별도로 설명합니다.

## 참고 자료

- [Figma 설명 영역](https://www.figma.com/design/DwbaDAovYNR7jMSBg62PQs/?node-id=4194-7467): 짧은 한글 소개 문단, 16px / 300 / 행간 150% / 자간 2%.
- [Eau de Minthé](https://diptyqueparis.com/en-eu/products/eau-de-parfum-eau-de-minthe-mintp75cv2): 민트, 제라늄, 파촐리.
- [Fleur de Peau 컬렉션](https://ams.diptyqueparis.com/en-ca/pages/fragrance-fleur-de-peau-collection): 머스크 중심의 향과 퍼퓸드 바디 케어.
- [Eau Capitale](https://us.diptyqueparis.com/en-us/products/eau-de-parfum-eau-capitale-capitap75cv1): 베르가모트, 장미, 파촐리, 핑크 페퍼와 파리의 이미지.
- [Ilio](https://us.diptyqueparis.com/en-us/products/eau-de-toilette-ilio-ilio100v4): 지중해, 선인장 열매, 베르가모트, 자스민, 아이리스.
- [Eau Mohéli](https://diptyqueparis.com/en-wf/products/eau-de-toilette-eau-moheli-mohe100v2): 일랑일랑, 핑크 페퍼, 생강, 베티버.
- [Eau Duelle](https://www.diptyqueparis.com/en_eu/p/fragrances/olfactory-families/ambre/eau-duelle-eau-de-parfum-75ml-1.html): 바닐라와 스파이시한 인상.
- [향수 컬렉션](https://diptyqueparis.com/en-gf/pages/fragrances-collection): 오르페옹의 공간과 향에 관한 이야기.
- [Les Mondes de Diptyque](https://diptyqueparis.com/en-nc/collections/les-mondes-de-diptyque): 프리미엄 캔들의 풍경과 모티프.
- [Lazulio](https://diptyqueparis.com/fr-fr/products/eau-de-parfum-lazulio-prem06100): 공작 깃털 모티프.
- [Lunamaris 컬렉션](https://diptyqueparis.com/it-it/pages/lunamaris-le-essenze-di-diptyque): 자개, 나무껍질, 수련 모티프.
- [Corail Oscuro](https://us.diptyqueparis.com/en-us/products/eau-de-parfum-corail-oscuro-corail100): 산호 모티프.
- [Candles & Home](https://us.diptyqueparis.com/en-us/pages/candles-and-home-collections): 홈 프래그런스의 향별 컬렉션.
- [Velvet Lotion](https://diptyqueparis.com/en-eu/products/for-the-hands-velvet-lotion-handlotiong1): 손을 위한 로션.

새 상품 추가 시 `getProductDescription`이 비어 있지 않은지 확인하고, 개별 상품에 `description`이 있으면 해당 문구를 우선합니다.
