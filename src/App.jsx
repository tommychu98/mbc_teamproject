import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/home/HomePage';
import ShopPage from './pages/product/ShopPage';
import ProductDetailPage from './pages/product/ProductDetailPage';
import SearchPage from './pages/product/SearchPage';
import CartPage from './pages/product/CartPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import ContentPage from './pages/content/ContentPage';
import NotFoundPage from './pages/content/NotFoundPage';
import AuthStatusPage from './pages/auth/AuthStatusPage';
import MyPage from './pages/mypage/MyPage';
import OrdersPage from './pages/mypage/OrdersPage';
import ProfileEditPage from './pages/mypage/ProfileEditPage';
import InquiryListPage from './pages/inquiry/InquiryListPage';
import InquiryWritePage from './pages/inquiry/InquiryWritePage';
import InquiryDetailPage from './pages/inquiry/InquiryDetailPage';
import BoardListPage from './pages/board/BoardListPage';
import BoardDetailPage from './pages/board/BoardDetailPage';
import BoardFormPage from './pages/board/BoardFormPage';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

const protectedPage = (element) => <ProtectedRoute>{element}</ProtectedRoute>;

export default function App() {
  const { pathname } = useLocation();
  const isShopPage = pathname === '/shop';

  return <div className="app"><ScrollToTop /><Header /><div className="app__main"><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/shop" element={<ShopPage />} />
    <Route path="/shop/best-sellers" element={<ShopPage />} />
    <Route path="/shop/new-season" element={<ShopPage />} />
    <Route path="/shop/new-season/season-recommend" element={<ShopPage />} />
    <Route path="/shop/new-season/les-rituels-de-soin" element={<ShopPage />} />
    <Route path="/shop/gifts" element={<ShopPage />} />
    <Route path="/shop/gifts/gift-sets" element={<ShopPage />} />
    <Route path="/shop/:lineSlug" element={<ShopPage />} />
    <Route path="/shop/:lineSlug/:categorySlug" element={<ShopPage />} />
    <Route path="/collections" element={<Navigate to="/shop" replace />} />
    <Route path="/products/:productId" element={<ProductDetailPage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/auth/kakao/callback" element={<AuthStatusPage mode="callback" />} />
    <Route path="/auth/error" element={<AuthStatusPage mode="error" />} />
    <Route path="/about/history" element={<ContentPage />} />
    <Route path="/about/fragrances-story" element={<ContentPage />} />
    <Route path="/about/for-the-planet" element={<ContentPage />} />
    <Route path="/galerie" element={<ContentPage />} />
    <Route path="/contact/notices" element={<ContentPage />} />
    <Route path="/contact/membership" element={<ContentPage />} />
    <Route path="/contact/faq" element={<ContentPage />} />
    <Route path="/inquiries" element={protectedPage(<InquiryListPage />)} />
    <Route path="/inquiries/write" element={protectedPage(<InquiryWritePage />)} />
    <Route path="/inquiries/:inquiryId/edit" element={protectedPage(<InquiryWritePage />)} />
    <Route path="/inquiries/:inquiryId" element={protectedPage(<InquiryDetailPage />)} />
    <Route path="/mypage" element={protectedPage(<MyPage />)} />
    <Route path="/mypage/orders" element={protectedPage(<OrdersPage />)} />
    <Route path="/mypage/orders/payment-methods" element={protectedPage(<OrdersPage />)} />
    <Route path="/mypage/orders/history" element={protectedPage(<OrdersPage />)} />
    <Route path="/mypage/orders/returns-refunds" element={protectedPage(<OrdersPage />)} />
    <Route path="/mypage/orders/track" element={protectedPage(<OrdersPage />)} />
    <Route path="/mypage/profile" element={protectedPage(<ProfileEditPage />)} />
    <Route path="/mypage/posts" element={protectedPage(<BoardListPage onlyMine />)} />
    <Route path="/board" element={<BoardListPage />} />
    <Route path="/board/write" element={protectedPage(<BoardFormPage />)} />
    <Route path="/board/:postId/edit" element={protectedPage(<BoardFormPage />)} />
    <Route path="/board/:postId" element={<BoardDetailPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></div>{!isShopPage && <Footer />}</div>;
}
