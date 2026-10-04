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

export default function HomePage() {
    return (
        <div className="home">
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
        </div>
    );
}
