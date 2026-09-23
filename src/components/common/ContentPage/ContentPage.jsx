import { Link, useLocation } from 'react-router-dom';
import './ContentPage.css';

const content = {
    '/about/history': {
        eyebrow: 'The Maison',
        title: 'Diptyque History',
        lead: '세 명의 예술가가 만든 파리의 상상력.',
        body: '1961년, 크리스티안 고트로와 데스몬드 녹스-릿, 이브 쿠에랑은 생제르맹 데 프레 34번지에 독특한 바자르를 열었습니다. 여행에서 발견한 오브제와 패브릭, 향이 하나의 세계를 이루며 메종의 시작이 되었습니다.',
    },
    '/about/fragrances-story': {
        eyebrow: 'Olfactory creation',
        title: 'Fragrances Story',
        lead: '향은 보이지 않는 풍경이자 살아 있는 기억입니다.',
        body: '딥티크의 향은 익숙한 원료를 예상 밖의 조합으로 바라봅니다. 자연, 문학, 여행에서 출발한 이야기는 피부 위에서 각자의 기억으로 완성됩니다.',
    },
    '/about/for-the-planet': {
        eyebrow: 'For the planet',
        title: 'Beauty with purpose',
        lead: '오래 남는 아름다움을 위한 책임 있는 선택.',
        body: '원료의 추적 가능성, 리필 가능한 오브제, 패키지 절감을 통해 메종은 창작과 책임의 균형을 이어갑니다.',
    },
    '/galerie': {
        eyebrow: 'Galerie Diptyque',
        title: 'Art in every gesture',
        lead: '향과 예술이 만나는 메종의 전시 공간.',
        body: '아티스트와 장인의 시선으로 재해석한 향의 풍경을 소개합니다. 계절마다 변화하는 설치와 오브제를 감상해 보세요.',
    },
    '/contact/notices': {
        eyebrow: 'Contact us',
        title: '공지사항',
        lead: '메종의 새로운 소식과 서비스 안내.',
        body: '배송 일정 변경 안내 · 신규 컬렉션 출시 · 부티크 운영 시간 안내',
        links: [
            ['1:1 문의', '/inquiries'],
            ['FAQ', '/contact/faq'],
        ],
    },
    '/contact/membership': {
        eyebrow: 'Contact us',
        title: 'Membership',
        lead: '메종과 더 가까워지는 개인화된 경험.',
        body: '회원은 주문 내역, 관심 상품, 최근 본 상품을 한곳에서 관리하고 새로운 컬렉션 소식을 먼저 만나볼 수 있습니다.',
        links: [
            ['회원가입', '/signup'],
            ['마이페이지', '/mypage'],
        ],
    },
    '/contact/faq': {
        eyebrow: 'Contact us',
        title: 'Frequently asked questions',
        lead: '자주 묻는 질문을 확인해 보세요.',
        body: '배송은 영업일 기준 2–5일 소요됩니다. 미개봉 상품은 수령 후 14일 이내 반품할 수 있으며, 향수와 캔들의 사용 방법은 각 상품 상세에서 확인할 수 있습니다.',
        links: [
            ['1:1 문의', '/inquiries'],
            ['배송 조회', '/mypage/orders/track'],
        ],
    },
};

export default function ContentPage() {
    const { pathname } = useLocation();
    const item = content[pathname] || content['/about/history'];
    return (
        <main className={`content-page ${pathname === '/galerie' ? 'content-page--gallery' : ''}`}>
            <div className="content-page__hero">
                <p className="eyebrow">{item.eyebrow}</p>
                <h1>{item.title}</h1>
                <p>{item.lead}</p>
            </div>
            <div className="content-page__body container">
                <span className="content-page__index">01</span>
                <p>{item.body}</p>
                {item.links && (
                    <div className="content-page__links">
                        {item.links.map(([label, to]) => (
                            <Link className="button button--secondary" key={to} to={to}>
                                {label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
