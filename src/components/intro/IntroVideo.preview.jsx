import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from '../../App';
import '../../styles/reset.css';
import '../../styles/fonts.css';
import '../../styles/variables.css';
import '../../styles/global.css';
import IntroVideo from './IntroVideo';

export function IntroSitePreview() {
  return (
    <HashRouter>
      <App />
      <IntroVideo />
    </HashRouter>
  );
}

createRoot(document.getElementById('intro-preview-root')).render(<IntroSitePreview />);
