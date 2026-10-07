import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function CatalogPagination({ page, pageCount, onChange }) {
  const start = Math.floor((page - 1) / 5) * 5 + 1;
  return <nav className="shop-page__pagination" aria-label="상품 목록 페이지">
    <button className="shop-page__page-button" type="button" aria-label="처음 페이지" disabled={page === 1} onClick={() => onChange(1)}><ChevronsLeft aria-hidden="true" /></button>
    <button className="shop-page__page-button" type="button" aria-label="이전 페이지" disabled={page === 1} onClick={() => onChange(page - 1)}><ChevronLeft aria-hidden="true" /></button>
    {Array.from({ length: Math.min(5, pageCount - start + 1) }, (_, i) => start + i).map(number => <button key={number} className={`shop-page__page-button ${page === number ? 'shop-page__page-button--active' : ''}`} type="button" aria-label={`${number}페이지`} aria-current={page === number ? 'page' : undefined} onClick={() => onChange(number)}>{number}</button>)}
    <button className="shop-page__page-button" type="button" aria-label="다음 페이지" disabled={page === pageCount} onClick={() => onChange(page + 1)}><ChevronRight aria-hidden="true" /></button>
    <button className="shop-page__page-button" type="button" aria-label="마지막 페이지" disabled={page === pageCount} onClick={() => onChange(pageCount)}><ChevronsRight aria-hidden="true" /></button>
  </nav>;
}