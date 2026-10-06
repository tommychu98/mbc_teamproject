import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import backToListArrow from "./assets/back-to-list.svg";

export default function NoticeDetail({ notice, previousNotice, nextNotice, listPage }) {
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [notice.id]);

  return (
    <>
      <article className="notice-detail" aria-labelledby="notice-detail-title">
        <header className="notice-detail__header">
          {notice.isNew && <span className="notice-page__badge" aria-label="새 공지">NEW</span>}
          <h2 id="notice-detail-title" ref={titleRef} tabIndex={-1}>{notice.title}</h2>
          <time dateTime={notice.date}>{notice.displayDate}</time>
        </header>
        <div className="notice-detail__content">
          <div className="notice-detail__intro">
            <p>안녕하세요. 딥디크 온라인 스토어입니다.</p>
            <p>{notice.intro}</p>
          </div>
          {notice.sections.map(([heading, text]) => (
            <section key={heading}>
              <h3>{heading}</h3>
              <p>{text}</p>
            </section>
          ))}
          <p className="notice-detail__closing">감사합니다.</p>
        </div>
        <nav className="notice-detail__adjacent" aria-label="이전글 및 다음글">
          {[
            { label: "이전글", notice: previousNotice, direction: "previous" },
            { label: "다음글", notice: nextNotice, direction: "next" },
          ].map(({ label, notice: adjacentNotice, direction }) => (
            adjacentNotice ? (
              <Link key={direction} className="notice-detail__adjacent-row" to={`?page=${listPage}&notice=${adjacentNotice.id}`}>
                <span className="notice-detail__adjacent-label"><span className={`notice-detail__chevron notice-detail__chevron--${direction}`} aria-hidden="true" />{label}</span>
                <span className="notice-detail__adjacent-title">{adjacentNotice.title}</span>
                <time dateTime={adjacentNotice.date}>{adjacentNotice.displayDate}</time>
              </Link>
            ) : (
              <div key={direction} className="notice-detail__adjacent-row notice-detail__adjacent-row--empty">
                <span className="notice-detail__adjacent-label">{label}</span>
                <span>{label}이 없습니다.</span>
              </div>
            )
          ))}
        </nav>
      </article>
      <Link className="notice-detail__back" to={`?page=${listPage}`} aria-label="공지사항 목록으로 돌아가기">
        <span>Back to List</span>
        <img src={backToListArrow} alt="" aria-hidden="true" />
      </Link>
    </>
  );
}
