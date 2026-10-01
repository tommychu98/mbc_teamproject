import './HomeFragranceStory.css';

export default function HomeFragranceStory() {
    return (
        <section className="home-fragrance-story" aria-labelledby="home-fragrance-story-title">
            <div className="home-fragrance-story__content">
                <h2 id="home-fragrance-story-title" className="home-fragrance-story__title">
                    The story continues through fragrance.
                    <br />
                    Each scent, a chapter of Diptyque.
                </h2>
                <p className="home-fragrance-story__description" lang="ko">
                    “향기로 이어지는 딥디크의 이야기, 각각의 향에 담긴 영감과 기억의 순간”
                </p>
            </div>
        </section>
    );
}
