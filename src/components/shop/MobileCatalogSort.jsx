export default function MobileCatalogSort({ value, options, onChange }) {
  return <label className="shop-page__mobile-sort">
    <span className="shop-page__visually-hidden">상품 정렬</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
    </select>
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 7L10 13L16 7" stroke="currentColor" strokeWidth="1.5" /></svg>
  </label>;
}
