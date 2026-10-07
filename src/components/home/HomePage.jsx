import HomeIntro from './HomeIntro';
import HomeFragranceStory from './HomeFragranceStory/HomeFragranceStory';
import HomePerfumeHistory from './HomePerfumeHistory';
import HomeScentMemory from './HomeScentMemory';
import HomeDayRitual from './HomeDayRitualIsolated';
import HomeMainFilm from './HomeMainFilm/HomeMainFilm';
import HomeNightRitual from './HomeNightRitual/HomeNightRitual';
import HomeNightJourney from './HomeNightJourney/HomeNightJourney';

import HomeScentSequence from './HomeScentSequence/HomeScentSequence';
import HomeFragranceWorld from './HomeFragranceWorld/HomeFragranceWorld';
import HomePreFooter from './HomePreFooter';
import Home3D from './3d';
import HomeTopButton from './HomeTopButton';
import { useRef } from 'react';
import useMobileHomePaging from './useMobileHomePaging';
import './MobileHomePaging.css';

export default function HomePage() {
    const homeRef = useRef(null);
    useMobileHomePaging(homeRef);
    return (
        <div className="home" ref={homeRef}>
            <HomeIntro />
            <HomeFragranceStory />
            <HomePerfumeHistory />
            <HomeScentMemory />
            <HomeDayRitual />
            <HomeMainFilm />
            <HomeNightRitual />
            <HomeNightJourney />
            <HomeScentSequence />
            <HomeFragranceWorld />
            <Home3D />
            <HomePreFooter />
            <HomeTopButton />
        </div>
    );
}
