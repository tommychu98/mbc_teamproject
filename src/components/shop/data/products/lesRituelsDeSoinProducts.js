import sourceProducts from './lesRituelsDeSoin.source.json';

// US source prices remain unchanged in the snapshot; storefront prices are KRW.
// Domestic sale prices: https://www.galleria.co.kr/shop/initPlanShopDtl.action?disp_ctg_no=2002029461
const DOMESTIC_PRICES = { matinset: 110000, baisatinoil: 108300, bainlipwax: 91200 };
// https://open.er-api.com/v6/latest/USD — 2026-10-02 00:02:31 UTC.
const USD_TO_KRW = 1360.202164;
export const LES_RITUELS_DE_SOIN_SOURCE = 'https://us.diptyqueparis.com/en-us/collections/les-rituels-de-soin';

const DETAILS = {
  bainblot: ['너처링 클렌징 젤 350ml', '스위트 아몬드를 더한 바디 앤 헤어 클렌징 젤입니다. 크리미한 거품으로 매일의 세정 시간을 부드러운 케어 리추얼로 바꿉니다.'],
  bainmilk: ['컴포팅 모이스처라이징 로션 350ml', '아마씨 오일을 더한 바디 로션입니다. 가볍고 산뜻한 텍스처로 몸을 감싸며 일상의 보습 시간을 완성합니다.'],
  matin190: ['르 마탱 클래식 캔들 190g', '싱그러운 허브 부케에 산뜻하고 스파이시한 향이 어우러집니다. 아침의 시작에 생기 있는 분위기를 더하는 캔들입니다.'],
  soir190: ['르 수아 클래식 캔들 190g', '하루의 끝을 편안하게 감싸는 향의 조화를 담았습니다. 저녁의 케어 리추얼에 차분한 분위기를 더하는 캔들입니다.'],
  baisatinoil: ['퍼펙팅 새틴 오일 100ml', '참깨 오일을 더한 바디 앤 헤어 드라이 오일입니다. 가볍게 발리며 피부와 모발에 윤기를 더합니다.'],
  bainoilin: ['릴랙싱 오일 인 오일 100ml', '스위트 아몬드를 담은 리치한 바디 오일입니다. 몸을 부드럽게 돌보며 하루를 느긋하게 마무리하는 케어 시간을 선사합니다.'],
  matinset: ['에너자이징 모닝 리추얼 디스커버리 세트', '아침의 바디 케어를 경험하는 디스커버리 세트입니다. 하루를 시작하는 여러 케어 단계를 하나의 향기로운 리추얼로 만나보세요.'],
  nuitset: ['수딩 이브닝 리추얼 디스커버리 세트', '편안한 텍스처와 향을 담은 저녁 리추얼 세트입니다. 하루의 끝에 몸을 돌보는 여유로운 시간을 즐겨보세요.'],
  bainlipwax: ['리필러블 립 왁스 7g', '선인장 열매 엘릭서를 더한 립 왁스입니다. 손끝으로 입술에 펴 바르며, 리필로 케어를 이어갈 수 있습니다.'],
  bainscrub: ['인비고레이팅 바디 스크럽 200ml', '소금과 헤이즐넛 껍질을 더한 바디 스크럽입니다. 각질을 정돈하며 매끄러운 피부 결을 위한 케어 시간을 선사합니다.'],
  bainbbalm: ['리치 수딩 바디 밤 200ml', '로즈 오일을 더한 리치한 바디 밤입니다. 피부를 부드럽게 감싸는 텍스처로 편안한 바디 케어를 완성합니다.'],
  rbainmilk: ['컴포팅 모이스처라이징 로션 리필 350ml', '아마씨 오일을 담은 바디 로션 리필입니다. 기존 용기에 채워 일상의 보습 리추얼을 이어갑니다.'],
  rbainlipwax: ['립 왁스 리필 7g', '리필러블 립 왁스 용기에 채워 사용하는 리필입니다. 입술에 부드럽게 녹아드는 텍스처로 케어를 이어갑니다.'],
  baintool: ['바디 괄사', '유약을 입힌 포슬린 소재의 바디 마사지 도구입니다. 몸의 곡선을 따라 사용하는 케어 동작에 여유를 더합니다.'],
  bainsponge: ['내추럴 소프트 바디 스펀지', '목욕 시간을 위한 천연 스펀지입니다. 부드러운 세정과 각질 케어로 일상의 목욕을 감각적인 리추얼로 바꾸어 보세요.'],
  bainbrush: ['바디 드라이 브러시', '목욕 전 사용하는 바디 드라이 브러시입니다. 브러싱으로 피부를 정돈하며 케어 리추얼을 시작해 보세요.'],
  deco01583: ['쉘 포켓 미러 블랙', '딥티크의 오벌 형태에 조개껍데기 조각을 담은 블랙 포켓 미러입니다. 대비를 이루는 무늬가 작은 거울에 개성을 더합니다.'],
  deco01698: ['쉘 포켓 미러 화이트', '재활용 마린 테라조로 만든 화이트 포켓 미러입니다. 조개껍데기 조각의 고유한 무늬를 담아 일상의 케어에 아름다움을 더합니다.'],
  deco01677: ['오벌 토일레트리 백', '블랙과 아이보리 캔버스로 오벌 모티프를 표현한 세면용품 가방입니다. 집에서 걸어 두거나 여행에 함께하며 케어 제품을 담습니다.'],
  deco01669: ['아포테커리 자 스몰', '매트한 비스킷 포슬린으로 약병의 형태를 재해석한 작은 용기입니다. 케어 공간에 간결하고 차분한 분위기를 더합니다.'],
  deco01670: ['아포테커리 자 미디움', '전통적인 약병을 현대적인 실루엣으로 풀어낸 미디움 용기입니다. 리추얼을 위한 공간을 정돈하는 오브제로 만나보세요.'],
  deco01676: ['오벌 미러 박스', '오벌과 피라미드 모티프를 담은 박스 안에 세워 쓰는 거울이 자리합니다. 수납과 거울을 함께 활용하는 케어 오브제입니다.'],
  deco01675: ['메디터레이니언 에센스 티슈 박스', '지중해 식물의 이미지를 담은 티슈 박스입니다. 일상의 케어 공간에 딥티크의 식물 도감 같은 풍경을 더합니다.'],
  deco01673: ['메디터레이니언 에센스 오벌 트레이', '지중해 식물을 그린 래커 트레이입니다. 딥티크의 오벌 형태 위에 케어 제품을 놓아 나만의 리추얼 공간을 꾸며보세요.'],
  rbainblot: ['너처링 클렌징 젤 리필 350ml', '너처링 클렌징 젤의 유리 용기를 다시 채우는 리필입니다. 부드러운 거품으로 몸과 모발을 씻는 케어 시간을 이어갑니다.'],
};

export const LES_RITUELS_DE_SOIN_PRODUCTS = sourceProducts.map((product) => {
  const [name, description] = DETAILS[product.sku];
  const isCandle = product.handle.startsWith('scented-candles-');
  const isDecor = product.handle.startsWith('home-decor-');
  const catalogCategory = isCandle ? 'candles-home' : isDecor ? 'home-decor' : 'bath-body';
  return {
    id: `rituels-${product.sku}`,
    name,
    englishName: product.title.toUpperCase(),
    description,
    price: DOMESTIC_PRICES[product.sku] ?? Math.round(product.price * USD_TO_KRW / 100) * 100,
    currency: 'KRW',
    priceBasis: DOMESTIC_PRICES[product.sku] ? 'domestic' : 'converted',
    image: product.image,
    hoverImage: product.hoverImage,
    line: catalogCategory,
    category: isCandle ? 'CANDLES & HOME' : isDecor ? 'HOME DECOR' : 'BODY CARE',
    categorySlug: catalogCategory,
    catalogCategory,
    collection: 'les-rituels-de-soin',
    subtitle: 'Les Rituels de Soin',
    badge: 'NEW',
    color: '',
    productUrl: `https://us.diptyqueparis.com/en-us/products/${product.handle}`,
  };
});
