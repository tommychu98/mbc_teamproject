import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import HomeNightRitual from './HomeNightRitual';
import '../../../styles/reset.css';
import '../../../styles/fonts.css';
import '../../../styles/variables.css';
import '../../../styles/global.css';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <HomeNightRitual />
        </BrowserRouter>
    </React.StrictMode>
);
