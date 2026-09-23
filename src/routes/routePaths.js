export const ROUTES = Object.freeze({
  home: '/', shop: '/shop', search: '/search', cart: '/cart', login: '/login', signup: '/signup',
  about: '/about/history', galerie: '/galerie', notices: '/contact/notices', inquiries: '/inquiries',
  myPage: '/mypage', orders: '/mypage/orders', profile: '/mypage/profile', board: '/board',
});

export const productPath = (productId) => `/products/${productId}`;
