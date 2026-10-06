// Detail-page titles. Keep the original Korean names for catalog and cart labels.
const SCENTS = {
  '베이': 'BAIES', '휘기에': 'FIGUIER', '피네드': 'PINÈDE',
  '앰버': 'AMBRE', '로즈': 'ROSES', '튜베루즈': 'TUBÉREUSE',
  '퍼드부아': 'FEU DE BOIS', '34번가생제르망': '34 BOULEVARD SAINT GERMAIN',
  '34번가': '34 BOULEVARD SAINT GERMAIN',
  '라발레듀떵': 'LA VALLÉE DU TEMPS', '넹페메르베이유': 'NYMPHÉES MERVEILLES',
  '라포레레브': 'LA FORÊT RÊVE', '떼르블롱드': 'TERRES BLONDES',
  '떵플르데무스': 'TEMPLE DES MOUSSES',
  '오우드': 'OUD', '시트로넬': 'CITRONNELLE', '오랑줴': 'ORANGER',
  '훼이으드라반드': 'FEUILLES DE LAVANDE', '자스민': 'JASMIN',
  '유칼립투스': 'EUCALYPTUS', '시프레': 'CYPRÈS', '나르길레': 'NARGUILÉ',
  '슈아지아': 'CHOISYA', '프리지아': 'FREESIA', '가드니아': 'GARDÉNIA',
  '쥬네브리에': 'GENÉVRIER', '리스': 'LYS', '미모사': 'MIMOSA',
  '뮤게': 'MUGUET', '머스크': 'MUSC', '누아제티에': 'NOISETIER',
  '파출리': 'PATCHOULI', '포맨더': 'POMANDER', '상탈': 'SANTAL',
  '바닐라': 'VANILLE', '베르베인느': 'VERVEINE', '베티버': 'VÉTIVER',
  '비올렛뜨': 'VIOLETTE', '제라늄로사': 'GÉRANIUM ROSA',
  '세잠느와': 'SÉSAME NOIR', '루바르브': 'RHUBARBE', '오흐티': 'ORTIE', '카페': 'CAFÉ',
  '진저': 'GINGEMBRE', '플레르도랑줴': 'FLEUR D’ORANGER',
  '플레르드뽀': 'FLEUR DE PEAU', '오데썽': 'EAU DES SENS',
  '도손': 'DO SON', '롬브르단로': 'L’OMBRE DANS L’EAU',
  '필로시코스': 'PHILOSYKOS', '오르페옹': 'ORPHÉON', '오로즈': 'EAU ROSE',
  '로파피에': 'L’EAU PAPIER', '오카피탈': 'EAU CAPITALE',
  '시트로넬&제라늄': 'CITRONNELLE & GERANIUM',
  '라줄리오': 'LAZULIO', '릴리피아': 'LILYPHÉA', '부아꼬르세': 'BOIS CORSÉ',
  '코라이오스쿠로': 'CORAIL OSCURO', '루나마리': 'LUNAMARIS', '로즈로슈': 'ROSE ROCHE',
};

const scentName = (name) => SCENTS[name.replace(/\s/g, '')];
const withoutSize = (name) => name.replace(/\s*\(?\d+(?:\.\d+)?\s*(?:ml|g)\)?\s*$/i, '').trim();

const BODY_NAMES = {
  '프레쉬 로션 포 더 바디': 'FRESH BODY LOTION',
  '소프트 로션 포 바디': 'SOFT BODY LOTION',
  '소프트닝 핸드워시 리필': 'SOFTENING HAND WASH REFILL',
  '소프트닝 핸드워시': 'SOFTENING HAND WASH',
  '벨벳 핸드 로션': 'VELVET HAND LOTION',
  '리필 벨벳 핸드로션': 'VELVET HAND LOTION REFILL',
  '엑스폴리에이팅 핸드워시 리필': 'EXFOLIATING HAND WASH REFILL',
  '엑스폴리에이팅 핸드워시': 'EXFOLIATING HAND WASH',
  '리치버터': 'RICH BODY BUTTER',
  '스무딩 바디 폴리쉬': 'SMOOTHING BODY POLISH',
  '새틴 오일 바디 앤 헤어': 'SATIN OIL FOR BODY AND HAIR',
  '럭셔리어스 핸드밤': 'LUXURIOUS HAND BALM',
  '리바이탈라이징 샤워젤': 'REVITALIZING SHOWER GEL',
};

const BODY_TYPES = [
  [/^바디 밤\s*/, 'BODY BALM'],
  [/^핸드크림\s*/, 'HAND CREAM'],
  [/^핸드앤\s*바디\s*로션\s*/, 'HAND AND BODY LOTION'],
  [/^핸드앤\s*바디\s*젤\s*/, 'HAND AND BODY GEL'],
  [/^바디미스트\s*/, 'BODY MIST'],
  [/^애프터 선 바디 밀키 젤\s*/, 'AFTER SUN MILKY BODY GEL'],
  [/^샤워오일\s*/, 'SHOWER OIL'],
  [/^퍼퓸드 솝\s*/, 'PERFUMED SOAP'],
  [/^샤워폼\s*/, 'SHOWER FOAM'],
];

const HOME_NAMES = {
  '리드 디퓨저 200ml 유리병': 'REED DIFFUSER GLASS VESSEL 200ML',
  '리드 디퓨저 100ml 유리병': 'REED DIFFUSER GLASS VESSEL 100ML',
  '리드 디퓨저 마개 – 100ml & 200ml 전용': 'REED DIFFUSER STOPPER',
  '울&델리케이트 소재용 세라믹 (시더우드)': 'CEDARWOOD CERAMIC FOR WOOL AND DELICATES',
  '탈취용 룸스프레이': 'ODOR REMOVING ROOM SPRAY',
};

const HOME_TYPES = [
  ['리드 디퓨저 리필 ', 'REED DIFFUSER REFILL'],
  ['아워글라스 디퓨저 리필 ', 'HOURGLASS DIFFUSER REFILL'],
  ['아워글라스 디퓨저 ', 'HOURGLASS DIFFUSER'],
  ['캡슐 ', 'DIFFUSER CAPSULE'],
  ['센티드 오발 ', 'SCENTED OVAL'],
  ['룸스프레이 ', 'ROOM SPRAY'],
];

export function getProductEnglishName(product) {
  const name = withoutSize(product.name);
  if (product.catalogCategory === 'exclusive') {
    return scentName(name.replace(/^오 드 퍼퓸\s*/, ''));
  }
  if (product.catalogCategory === 'candles-home' && name.includes('캔들')) {
    if (name.startsWith('미니캔들 세트')) return 'MINI CANDLE SET';
    if (name.startsWith('스몰캔들 세트')) return 'SMALL CANDLE SET';
    if (name.startsWith('라드로게리 캔들')) return 'LA DROGUERIE CANDLE';
    const scent = scentName(name.replace(/^(?:리필 |리미티드 )?(?:클래식|베리 라지|라지|미디움|프리미엄|스몰) 캔들\s*/, ''));
    if (scent) return `${scent}${name.startsWith('리필 ') ? ' CANDLE REFILL' : ''}`;
  }
  if (product.catalogCategory === 'bath-body') {
    if (BODY_NAMES[name]) return BODY_NAMES[name];
    const base = name.replace(/^리미티드\s*/, '');
    for (const [pattern, type] of BODY_TYPES) {
      if (!pattern.test(base)) continue;
      const scent = scentName(base.replace(pattern, ''));
      if (scent) return `${scent} ${type}`;
    }
  }
  if (['candles-home', 'home-decor'].includes(product.catalogCategory)) {
    if (HOME_NAMES[name]) return HOME_NAMES[name];
    if (/^차량용\s*방향제 세트/.test(name)) {
      const scent = scentName(name.match(/캡슐 (.+)\)$/)?.[1] ?? '');
      if (scent) return `${scent} CAR DIFFUSER SET`;
    }
    for (const [prefix, type] of HOME_TYPES) {
      if (!name.startsWith(prefix)) continue;
      const scent = scentName(name.slice(prefix.length));
      if (scent) return `${scent} ${type}`;
    }
  }
  return undefined;
}
