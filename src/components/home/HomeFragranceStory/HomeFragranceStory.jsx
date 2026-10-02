import { Fragment, useRef } from 'react';
import useStoryInk from './useStoryInk';
import useStoryDescriptionReveal from './useStoryDescriptionReveal';
import './HomeFragranceStory.css';

const STORY_LINES = [
    'The story continues through fragrance.',
    'Each scent, a chapter of Diptyque.',
];

function StoryLines() {
    let characterIndex = 0;

    return STORY_LINES.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {Array.from(line, (character) => {
                if (character === ' ') return character;

                const index = characterIndex++;
                return <span className="home-fragrance-story__character" data-character-index={index} key={index}>{character}</span>;
            })}
        </Fragment>
    ));
}

export default function HomeFragranceStory() {
    const sectionRef = useRef(null);
    const stageRef = useRef(null);
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    useStoryInk(sectionRef, stageRef, titleRef);
    useStoryDescriptionReveal(sectionRef, descriptionRef);

    return (
        <section className="home-fragrance-story" ref={sectionRef} aria-labelledby="home-fragrance-story-title" data-scroll-progress="0">
            <div className="home-fragrance-story__stage" ref={stageRef}>
                <div className="home-fragrance-story__content">
                    <h2 id="home-fragrance-story-title" className="home-fragrance-story__title" ref={titleRef}>
                        <StoryLines />
                    </h2>
                    <p className="home-fragrance-story__description" lang="ko" ref={descriptionRef}>
                        “향기로 이어지는 딥디크의 이야기, 각각의 향에 담긴 영감과 기억의 순간”
                    </p>
                </div>
            </div>
        </section>
    );
}
