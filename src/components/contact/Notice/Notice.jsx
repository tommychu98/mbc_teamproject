import "./Notice.css";

const notices = [
  "추석 연휴 배송 일정 안내",
  "공식 온라인 스토어 이용 안내",
  "개인정보 처리방침 변경 안내",
  "배송 일정",
  "배송 일정",
  "배송 일정",
];

export default function Notice() {
  return (
    <main className="notice-page" aria-labelledby="notice-title">
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
      <header className="notice-page__heading">
        <p className="notice-page__eyebrow">Contact us</p>
        <h1 id="notice-title">공지사항</h1>
        <p className="notice-page__description">
          딥디크의 새로운 소식과 서비스 안내
        </p>
      </header>
      <table className="notice-page__table">
        <caption className="sr-only">공지사항 목록</caption>
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
          {notices.map((title, index) => (
            <tr key={index}>
              <td className="notice-page__number">
                {index === 0 ? (
                  <span className="notice-page__badge" aria-label="새 공지">
                    NEW
                  </span>
                ) : (
                  index + 1
                )}
              </td>
              <td className="notice-page__subject">{title}</td>
              <td className="notice-page__date">
                <time dateTime="2026-09-17">2026. 9. 17.</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
