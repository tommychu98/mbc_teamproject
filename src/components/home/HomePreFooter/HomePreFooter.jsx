import freeShipping from './assets/9e30c.png';
import giftWrapping from './assets/ee73c.png';
import fragranceSample from './assets/d6fa6.png';
import chooseSample from './assets/9112c.png';
import returns from './assets/913f5.png';
import birthday from './assets/043a3.png';
import './HomePreFooter.css';

const services = [
    {
        id: '2863:8132',
        imageId: '2863:8133',
        image: freeShipping,
        title: 'FREE SHIPPING',
        description: <>13만원 이상 구매 시 무료 배송<br />토 일 공휴일 제외 익일 발송</>,
    },
    {
        id: '2863:8139',
        imageId: '2863:8140',
        image: giftWrapping,
        title: 'GIFT WRAPPING',
        description: <>선물 포장 서비스를 제공합니다.</>,
    },
    {
        id: '2863:8145',
        imageId: '2863:8146',
        image: fragranceSample,
        title: 'FRAGRANCE SAMPLE',
        description: <>프레그런스 구매 시<br />시향 샘플 증정</>,
    },
    {
        id: '2863:8152',
        imageId: '2863:8153',
        image: chooseSample,
        title: 'CHOOSE YOUR SAMPLE',
        description: <>구매 시 원하는 샘플을<br />선택할 수 있습니다.</>,
    },
    {
        id: '2863:8159',
        imageId: '2863:8160',
        image: returns,
        title: '14-DAY RETURNS',
        description: <>구매 후 14일 이내<br />반품 가능합니다.</>,
    },
    {
        id: '2863:8166',
        imageId: '2863:8167',
        image: birthday,
        title: 'BIRTHDAY SURPRISE',
        description: <>회원 특전으로 생일에<br />향기로운 서프라이즈를 제공</>,
    },
];

export default function HomePreFooter() {
    return (
        <section className="home-pre-footer" data-node-id="2863:8129" aria-labelledby="home-pre-footer-title">
            <h2 id="home-pre-footer-title" className="home-pre-footer__title" data-node-id="2863:8130">
                DIPTYQUE SERVICE
            </h2>
            <div className="home-pre-footer__services" data-node-id="2863:8131">
                {services.map(service => (
                    <article className="home-pre-footer__service" data-node-id={service.id} key={service.title}>
                        <div className="home-pre-footer__image" data-node-id={service.imageId}>
                            <img src={service.image} alt="" loading="lazy" draggable="false" />
                        </div>
                        <div className="home-pre-footer__copy">
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
