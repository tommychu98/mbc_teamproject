const CATEGORY_SLUGS = Object.freeze({
  '오 드 퍼퓸': 'eaux-de-parfum',
  '오 드 뚜왈렛': 'eaux-de-toilette',
});

const SOURCE_PRODUCTS = [
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 플레르 드 뽀 75ml",
        "price":  311600,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/144/260624168612144.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/141/260624168612141.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 오르페옹 75ml",
        "price":  311600,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/092/260624168612092.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/089/260624168612089.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 롬브르 단 로 75ml",
        "price":  311600,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/301/260624168613301.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/298/260624168613298.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 오 드 민떼 75ml",
        "price":  311600,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/721/260624168613721.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/718/260624168613718.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 탐 다오 75ml",
        "price":  311600,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/197/260624168612197.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/194/260624168612194.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 오 듀엘르 75ml",
        "price":  311600,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/352/260624168612352.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/349/260624168612349.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 필로시코스 75ml",
        "price":  311600,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/186/260624168612186.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/183/260624168612183.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 오 카피탈 75ml",
        "price":  311600,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/170/260624168612170.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/167/260624168612167.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 라줄리오 100ml",
        "price":  488300,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/720/260626168963720.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/717/260626168963717.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "프리미엄 오 드 퍼퓸 10ml 5종 세트",
        "price":  311600,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/810/250522083981810.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/807/250522083981807.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 로즈 로슈 100mL",
        "price":  488300,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/736/260626168963736.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/733/260626168963733.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 루나마리 100mL",
        "price":  488300,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/738/260626168963738.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/735/260626168963735.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 릴리피아 100mL",
        "price":  488300,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/718/260626168963718.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/715/260626168963715.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 부아 꼬르세 100mL",
        "price":  488300,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/730/260626168963730.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/727/260626168963727.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 코라이 오스쿠로 100mL",
        "price":  488300,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/741/260626168963741.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/738/260626168963738.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 베티베리오 75ml",
        "price":  311600,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/208/260624168612208.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/205/260624168612205.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 34번가 생제르망 75ml",
        "price":  342950,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/664/260714171605664.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/661/260714171605661.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 뗌 포 75ml",
        "price":  311600,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/148/260624168612148.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/145/260624168612145.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 도손 75ml",
        "price":  311600,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/125/260624168612125.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/122/260624168612122.jpg"
    },
    {
        "category":  "오 드 퍼퓸",
        "name":  "오 드 퍼퓸 오 로즈 75ml",
        "price":  311600,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/106/260624168612106.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/103/260624168612103.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "리미티드 오 드 뚜왈렛 오 데 썽 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/919/260527163288919.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/916/260527163288916.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 오 데 썽 50ml",
        "price":  192850,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/684/260624168610684.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/681/260624168610681.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 필로시코스 50ml",
        "price":  192850,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/758/260624168610758.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/755/260624168610755.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 베티베리오 50ml",
        "price":  192850,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/038/260624168611038.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/035/260624168611035.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 플레르 드 뽀 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/610/260624168611610.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/607/260624168611607.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 롬브르 단 로 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/871/260624168611871.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/868/260624168611868.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 로 파피에 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/014/260624168611014.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/011/260624168611011.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 플레르 드 뽀 50ml",
        "price":  192850,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/651/260624168611651.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/648/260624168611648.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 로데헤스페리데스 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/184/260624168611184.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/181/260624168611181.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 오르페옹 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/794/260624168611794.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/791/260624168611791.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 일리오 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/531/260624168611531.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/528/260624168611528.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 도 손 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/000/260624168611000.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/000/260624168611000.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 오 드 리에 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/917/260624168610917.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/914/260624168610914.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 탐 다오 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/679/260714171605679.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/676/260714171605676.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 오 모헬리 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/053/260624168611053.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/050/260624168611050.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 제라늄 오도라타 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/224/260624168611224.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/221/260624168611221.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 오 듀엘르 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/165/260624168611165.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/162/260624168611162.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 로 드 네롤리 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/117/260624168611117.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/114/260624168611114.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 오에도 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/718/260624168610718.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/715/260624168610715.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 올렌느 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/705/260714171605705.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/702/260714171605702.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 오 로즈 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/913/260624168610913.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/910/260624168610910.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 오프레지아 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/685/260714171605685.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/682/260714171605682.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 필로시코스 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/941/260624168610941.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/938/260624168610938.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 베티베리오 100ml",
        "price":  267900,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/312/260624168611312.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/309/260624168611309.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 롬브르 단 로 50ml",
        "price":  192850,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/942/260624168611942.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/939/260624168611939.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 디스커버리 세트 5종",
        "price":  199500,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/166/260325149625166.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/163/260325149625163.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 로 파피에 50ml",
        "price":  192850,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/034/260624168611034.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/031/260624168611031.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 탐 다오 50ml",
        "price":  192850,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/954/260624168610954.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/951/260624168610951.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 도 손 50ml",
        "price":  192850,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/872/260624168610872.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/869/260624168610869.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 오에도 50ml",
        "price":  192850,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/748/260624168610748.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/745/260624168610745.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 오 로즈 50ml",
        "price":  192850,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/570/260624168610570.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/567/260624168610567.jpg"
    },
    {
        "category":  "오 드 뚜왈렛",
        "name":  "오 드 뚜왈렛 올렌느 50ml",
        "price":  192850,
        "image":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/928/260624168610928.jpg",
        "hoverImage":  "https://image.shinsegaev.com/upload/C00001/s3/goods/org/925/260624168610925.jpg"
    }
];

const createStableId = (image, index) => {
  const fileName = image.match(/\/([^/?]+)\.jpg(?:\?|$)/)?.[1];
  return `shinsegae-fragrance-${fileName || String(index + 1).padStart(3, '0')}`;
};

export const FRAGRANCE_PRODUCTS = SOURCE_PRODUCTS.map((product, index) => ({
  id: createStableId(product.image, index),
  ...product,
  line: 'fragrances',
  categorySlug: CATEGORY_SLUGS[product.category],
  catalogCategory: 'fragrances',
  subtitle: product.category,
  currency: 'KRW',
  badge: '',
  color: '',
}));
