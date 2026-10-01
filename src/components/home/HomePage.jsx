import HomeIntro from './HomeIntro';
import HomeFragranceStory from './HomeFragranceStory/HomeFragranceStory';
import HomePerfumeHistory from './HomePerfumeHistory';
import HomeScentMemory from './HomeScentMemory';
import HomeDayRitual from './HomeDayRitualIsolated';
import HomeMainFilm from './HomeMainFilm/HomeMainFilm';
import HomeNightRitual from './HomeNightRitual/HomeNightRitual';
import HomeNightJourney from './HomeNightJourney/HomeNightJourney';

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
        </div>
    );
}
