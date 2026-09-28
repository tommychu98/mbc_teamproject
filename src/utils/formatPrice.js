export const formatPrice = (price, currency = 'USD') => {
  if (typeof price !== 'number') return price;
  if (currency === 'KRW') return `${price.toLocaleString('ko-KR')}원`;
  return `US $${price.toLocaleString('en-US')}`;
};
