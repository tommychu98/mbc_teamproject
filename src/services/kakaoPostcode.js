const SCRIPT_ID = 'daum-postcode-script';
const SCRIPT_URL = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export function loadKakaoPostcode() {
  if (window.daum?.Postcode) return Promise.resolve(window.daum.Postcode);
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    const onLoad = () => window.daum?.Postcode ? resolve(window.daum.Postcode) : reject(new Error('주소검색 모듈을 초기화할 수 없습니다.'));
    if (existing) { existing.addEventListener('load', onLoad, { once: true }); existing.addEventListener('error', () => reject(new Error('주소검색 스크립트를 불러오지 못했습니다.')), { once: true }); return; }
    const script = document.createElement('script');
    script.id = SCRIPT_ID; script.src = SCRIPT_URL; script.async = true;
    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', () => reject(new Error('네트워크 연결을 확인해 주세요.')), { once: true });
    document.head.appendChild(script);
  });
}

export async function openKakaoPostcode(onComplete) {
  const Postcode = await loadKakaoPostcode();
  new Postcode({ oncomplete: (data) => onComplete({ zonecode: data.zonecode, roadAddress: data.roadAddress, jibunAddress: data.jibunAddress, extraAddress: data.bname || '' }) }).open();
}
