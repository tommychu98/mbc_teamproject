import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from '../../App';
import '../../styles/reset.css';
import '../../styles/fonts.css';
import '../../styles/variables.css';
import '../../styles/global.css';
import IntroVideo from './IntroVideo';
import { INTRO_KEY } from './useIntroSession';

const reviewUrl = new URL(window.location.href);

if (reviewUrl.searchParams.get('replay') === '1') {
  window.sessionStorage.removeItem(INTRO_KEY);
  reviewUrl.searchParams.delete('replay');
  window.history.replaceState(null, '', `${reviewUrl.pathname}${reviewUrl.search}${reviewUrl.hash || '#/'}`);
}

export function IntroSitePreview() {
  return (
    <HashRouter>
      <App />
      <IntroVideo />
    </HashRouter>
  );
}

createRoot(document.getElementById('intro-preview-root')).render(<IntroSitePreview />);
