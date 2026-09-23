import { useRef, useState } from 'react';
import { openKakaoPostcode } from '../../services/kakaoPostcode';

export default function AddressSearch({ value, onChange }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const detailRef = useRef(null);
  const search = async () => {
    setLoading(true); setError('');
    try {
      await openKakaoPostcode((address) => { onChange({ ...value, ...address }); requestAnimationFrame(() => detailRef.current?.focus()); });
    } catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  };
  return <div className="address-search">
    <label className="field"><span className="field__label">우편번호</span><div className="address-search__row"><input className="field__input" value={value.zonecode || ''} readOnly /><button className="button button--secondary" type="button" onClick={search} disabled={loading}>{loading ? '불러오는 중' : '주소 검색'}</button></div></label>
    <label className="field"><span className="field__label">기본 주소</span><input className="field__input" value={value.roadAddress || ''} readOnly /></label>
    <label className="field"><span className="field__label">상세 주소</span><input ref={detailRef} className="field__input" value={value.detailAddress || ''} onChange={(event) => onChange({ ...value, detailAddress: event.target.value })} /></label>
    {error && <p className="field__error" role="alert">{error}</p>}
  </div>;
}
