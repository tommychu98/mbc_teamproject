import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import NoticeDetail from "./NoticeDetail";
import { notices, noticesPerPage } from "./noticeData";
import "./Notice.css";

export default function Notice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageCount = Math.ceil(notices.length / noticesPerPage);
  const requestedPage = Number(searchParams.get("page"));
  const selectedNotice = notices.find((notice) => notice.id === Number(searchParams.get("notice")));
  const currentPage = Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= pageCount
    ? requestedPage
    : selectedNotice ? Math.ceil(selectedNotice.id / noticesPerPage) : 1;
  const visibleNotices = notices.slice((currentPage - 1) * noticesPerPage, currentPage * noticesPerPage);
  const previousSelectionRef = useRef(selectedNotice?.id);
  const listTitleRef = useRef(null);

  useEffect(() => {
    if (previousSelectionRef.current && !selectedNotice) {
      listTitleRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    previousSelectionRef.current = selectedNotice?.id;
  }, [selectedNotice]);

  return (
    <main className={`notice-page${selectedNotice ? " notice-page--detail" : ""}`} aria-labelledby="notice-title">
      {!selectedNotice && <>
      <img
        className="notice-page__botanical"
        src="/images/contact/notice/botanical.png"
        alt=""
        aria-hidden="true"
      />
      <img
        className="notice-page__landscape"
        src="/images/contact/notice/landscape.png"
        alt=""
        aria-hidden="true"
      />
      </>}
      <header className="notice-page__heading">
        <p className="notice-page__eyebrow">Contact us</p>
        <h1 id="notice-title" ref={listTitleRef} tabIndex={-1}>공지사항</h1>
        <p className="notice-page__description">
          딥디크의 새로운 소식과 서비스 안내
        </p>
      </header>
      {selectedNotice ? (
        <NoticeDetail
          notice={selectedNotice}
          previousNotice={notices[selectedNotice.id - 2]}
          nextNotice={notices[selectedNotice.id]}
          listPage={currentPage}
        />
      ) : <>
      <table id="notice-list" className="notice-page__table">
        <caption className="sr-only">공지사항 목록 — {currentPage}페이지</caption>
        <colgroup>
          <col className="notice-page__number-column" />
          <col />
          <col className="notice-page__date-column" />
        </colgroup>
        <thead className="sr-only">
          <tr>
            <th scope="col">번호</th>
            <th scope="col">제목</th>
            <th scope="col">등록일</th>
          </tr>
        </thead>
        <tbody>
          {visibleNotices.map((notice) => (
            <tr key={notice.id}>
              <td className="notice-page__number">
                {notice.isNew ? (
                  <span className="notice-page__badge" aria-label="새 공지">
                    NEW
                  </span>
                ) : (
                  notice.id
                )}
              </td>
              <td className="notice-page__subject"><Link className="notice-page__subject-link" to={`?page=${currentPage}&notice=${notice.id}`}>{notice.title}</Link></td>
              <td className="notice-page__date">
                <time dateTime={notice.date}>{notice.displayDate}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav className="notice-page__pagination" aria-label="공지사항 페이지">
        <button className="notice-page__page-button" type="button" aria-label="첫 페이지" aria-controls="notice-list" disabled={currentPage === 1} onClick={() => setSearchParams({ page: "1" })}><ChevronsLeft size={20} strokeWidth={1} aria-hidden="true" /></button>
        <button className="notice-page__page-button" type="button" aria-label="이전 페이지" aria-controls="notice-list" disabled={currentPage === 1} onClick={() => setSearchParams({ page: String(currentPage - 1) })}><ChevronLeft size={20} strokeWidth={1} aria-hidden="true" /></button>
        {Array.from({ length: pageCount }, (_, index) => (
          <button
            key={index}
            type="button"
            className="notice-page__page-button"
            aria-label={`${index + 1}페이지`}
            aria-current={currentPage === index + 1 ? "page" : undefined}
            aria-controls="notice-list"
            onClick={() => setSearchParams({ page: String(index + 1) })}
          >
            {index + 1}
          </button>
        ))}
        <button className="notice-page__page-button" type="button" aria-label="다음 페이지" aria-controls="notice-list" disabled={currentPage === pageCount} onClick={() => setSearchParams({ page: String(currentPage + 1) })}><ChevronRight size={20} strokeWidth={1} aria-hidden="true" /></button>
        <button className="notice-page__page-button" type="button" aria-label="마지막 페이지" aria-controls="notice-list" disabled={currentPage === pageCount} onClick={() => setSearchParams({ page: String(pageCount) })}><ChevronsRight size={20} strokeWidth={1} aria-hidden="true" /></button>
      </nav>
      <p className="sr-only" role="status">{currentPage}페이지, 공지사항 {visibleNotices.length}개</p>
      </>}
    </main>
  );
}
