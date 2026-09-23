import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ProductGrid from '../shop/product-line/fragrances/ProductGrid';
import { getProducts } from '../../services/productService';
import './HomePage.css';

export default function HomePage() {
    const root = useRef(null);
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        const context = gsap.context(
            () =>
                gsap.from('.home-hero__content > *', {
                    y: 24,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                }),
            root
        );
        return () => context.revert();
    }, []);
    return (
        <div className="home" ref={root}>
            <section className="home-hero">
                <div className="home-hero__content">
                    <p className="eyebrow">A fragrance, a memory</p>
                    <h1 className="display-title">
                        The art of
                        <br />
                        the invisible
                    </h1>
                    <p>
                        보이지 않는 향이 공간과 기억을 바꾸는 순간. 메종의 아이코닉한 향을 새로운
                        시선으로 만나보세요.
                    </p>
                    <Link className="button" to="/shop/fragrances">
                        Fragrances
                    </Link>
                </div>
                <div className="home-hero__visual">
                    <img src="/images/products/orpheon.jpg" alt="오르페옹 오 드 퍼퓸" />
                </div>
            </section>
            <section className="home-editorial section container">
                <div>
                    <p className="eyebrow">Maison since 1961</p>
                    <h2>
                        Objects to live with,
                        <br />
                        scents to remember.
                    </h2>
                </div>
                <p>
                    파리 생제르맹 데 프레에서 시작된 딥티크는 향과 장식 예술, 여행의 기억을 하나의
                    오브제로 엮어냅니다.
                </p>
            </section>
            <section className="section container">
                <div className="home__section-head">
                    <div>
                        <p className="eyebrow">Curated selection</p>
                        <h2>Maison favorites</h2>
                    </div>
                    <Link to="/shop/best-sellers">View all</Link>
                </div>
                <ProductGrid products={getProducts().slice(0, 4)} />
            </section>
            <section className="home-story">
                <div className="home-story__image">
                    <img src="/images/products/baies.webp" alt="베이 클래식 캔들" />
                </div>
                <div className="home-story__copy">
                    <p className="eyebrow">The classic candle</p>
                    <h2>
                        A flame.
                        <br />A scent.
                        <br />
                        An atmosphere.
                    </h2>
                    <p>
                        1963년부터 이어진 캔들 메이킹의 전문성과 시적인 향의 세계를 경험해 보세요.
                    </p>
                    <Link className="button button--secondary" to="/shop/candles-home">
                        Discover
                    </Link>
                </div>
            </section>
        </div>
    );
}
