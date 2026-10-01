import { useCallback, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import IntroVideo from './components/intro';
import Header from './components/layout/Navigation';
import GalerieFooter from './components/galerie/GalerieFooter';
import HomePage from './pages/home';
import ShopPage from './pages/shop';
import BestSellerPage from './pages/shop/best-seller';
import NewSeasonPage from './pages/shop/new-season';
import SeasonRecommendPage from './pages/shop/new-season/season-recommend';
import LesRituelsDeSoinPage from './pages/shop/new-season/les-rituels-de-soin';
import GiftPage from './pages/shop/gift';
import GiftSetsPage from './pages/shop/gift/gift-sets';
import ProductLinePage from './pages/shop/product-line';
import ProductDetailPage from './pages/shop/product-detail';
import SearchPage from './pages/shop/search';
import CartPage from './pages/shop/cart';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import HistoryPage from './pages/about/history';
import FragrancesStoryPage from './pages/about/fragrances-story';
import ForThePlanetPage from './pages/about/for-the-planet';
import GaleriePage from './pages/galerie';
import NoticePage from './pages/contact/notice';
import MembershipPage from './pages/contact/membership';
import FaqPage from './pages/contact/faq';
import NotFoundPage from './pages/_system/NotFoundPage';
import AuthStatusPage from './pages/auth/AuthStatusPage';
import MyPage from './pages/mypage';
import MyPageHeader from './components/mypage/MyPageHeader/MyPageHeader';
import OrdersPage from './pages/mypage/orders';
import PaymentMethodsPage from './pages/mypage/orders/payment-methods';
import OrderHistoryPage from './pages/mypage/orders/order-history';
import ReturnsRefundsPage from './pages/mypage/orders/returns-refunds';
import TrackOrderPage from './pages/mypage/orders/track-order';
import ProfileEditPage from './pages/mypage/profile/information';
import InquiryListPage from './pages/contact/inquiry';
import InquiryWritePage from './pages/contact/inquiry/write';
import InquiryDetailPage from './pages/contact/inquiry/detail';
import BoardListPage from './pages/mypage/community';
import BoardDetailPage from './pages/mypage/community/detail';
import BoardFormPage from './pages/mypage/community/form';
import MyPageFaqPage from './pages/mypage/community/faq';
import MyPageInquiryPage from './pages/mypage/community/inquiry';
import './App.css';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);
    return null;
}

const protectedPage = (element) => <ProtectedRoute>{element}</ProtectedRoute>;
const protectedMyPage = (element, active) => protectedPage(
    <>
        <div className="container"><MyPageHeader active={active} /></div>
        {element}
    </>,
);

export default function App() {
    const { pathname } = useLocation();
    const isHistoryPage = pathname === '/history' || pathname === '/about/history';
    const handleIntroComplete = useCallback(() => {
        if (pathname !== '/') return;

        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        window.requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    }, [pathname]);

    return (
        <div className={`app${isHistoryPage ? ' app--history' : ''}`}>
            <IntroVideo onComplete={handleIntroComplete} />
            <ScrollToTop />
            <Header />
            <div className="app__main">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/shop/best-sellers" element={<BestSellerPage />} />
                    <Route path="/shop/new-season" element={<NewSeasonPage />} />
                    <Route
                        path="/shop/new-season/season-recommend"
                        element={<SeasonRecommendPage />}
                    />
                    <Route
                        path="/shop/new-season/les-rituels-de-soin"
                        element={<LesRituelsDeSoinPage />}
                    />
                    <Route path="/shop/gifts" element={<GiftPage />} />
                    <Route path="/shop/gifts/gift-sets" element={<GiftSetsPage />} />
                    <Route path="/shop/product-line" element={<ProductLinePage />} />
                    <Route path="/shop/fragrances" element={<Navigate to="/shop?category=fragrances" replace />} />
                    <Route path="/shop/fragrances/exclusive-perfumes" element={<Navigate to="/shop?category=exclusive" replace />} />
                    <Route path="/shop/candles-home" element={<Navigate to="/shop?category=candles-home" replace />} />
                    <Route path="/shop/bath-body" element={<Navigate to="/shop?category=bath-body" replace />} />
                    <Route path="/shop/home-decor" element={<Navigate to="/shop?category=home-decor" replace />} />
                    <Route path="/shop/:lineSlug" element={<Navigate to="/shop" replace />} />
                    <Route path="/shop/:lineSlug/:categorySlug" element={<Navigate to="/shop" replace />} />
                    <Route path="/collections" element={<Navigate to="/shop" replace />} />
                    <Route path="/products/:productId" element={<ProductDetailPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route
                        path="/auth/kakao/callback"
                        element={<AuthStatusPage mode="callback" />}
                    />
                    <Route path="/auth/error" element={<AuthStatusPage mode="error" />} />
                    <Route path="/about/history" element={<HistoryPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/about/fragrances-story" element={<FragrancesStoryPage />} />
                    <Route path="/about/for-the-planet" element={<ForThePlanetPage />} />
                    <Route path="/galerie" element={<GaleriePage />} />
                    <Route path="/contact/notices" element={<NoticePage />} />
                    <Route path="/contact/membership" element={<MembershipPage />} />
                    <Route path="/contact/faq" element={<FaqPage />} />
                    <Route path="/inquiries" element={protectedPage(<InquiryListPage />)} />
                    <Route path="/inquiries/write" element={protectedPage(<InquiryWritePage />)} />
                    <Route
                        path="/inquiries/:inquiryId/edit"
                        element={protectedPage(<InquiryWritePage />)}
                    />
                    <Route
                        path="/inquiries/:inquiryId"
                        element={protectedPage(<InquiryDetailPage />)}
                    />
                    <Route path="/mypage" element={protectedPage(<MyPage />)} />
                    <Route path="/mypage/orders" element={protectedMyPage(<OrdersPage />, 'orders')} />
                    <Route
                        path="/mypage/orders/payment-methods"
                        element={protectedMyPage(<PaymentMethodsPage />, 'orders')}
                    />
                    <Route
                        path="/mypage/orders/history"
                        element={protectedMyPage(<OrderHistoryPage />, 'orders')}
                    />
                    <Route
                        path="/mypage/orders/returns-refunds"
                        element={protectedMyPage(<ReturnsRefundsPage />, 'orders')}
                    />
                    <Route
                        path="/mypage/orders/track"
                        element={protectedMyPage(<TrackOrderPage />, 'orders')}
                    />
                    <Route path="/mypage/profile" element={protectedMyPage(<ProfileEditPage />, 'profile')} />
                    <Route
                        path="/mypage/community/faq"
                        element={protectedPage(<MyPageFaqPage />)}
                    />
                    <Route
                        path="/mypage/community/inquiry"
                        element={protectedPage(<MyPageInquiryPage />)}
                    />
                    <Route
                        path="/mypage/posts"
                        element={protectedMyPage(<BoardListPage onlyMine />, 'community')}
                    />
                    <Route path="/board" element={<BoardListPage />} />
                    <Route path="/board/write" element={protectedPage(<BoardFormPage />)} />
                    <Route path="/board/:postId/edit" element={protectedPage(<BoardFormPage />)} />
                    <Route path="/board/:postId" element={<BoardDetailPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
            <GalerieFooter />
            <div className="page-transition-overlay" aria-hidden="true" />
        </div>
    );
}
