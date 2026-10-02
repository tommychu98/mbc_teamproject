import { useLayoutEffect } from 'react';

export default function useStoryDescriptionReveal(sectionRef, descriptionRef) {
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const description = descriptionRef.current;
        const update = () => {
            // Use the English painter's shared scroll timeline, not a timed
            // CSS transition that could continue after the stage releases.
            const progress = Number(section.dataset.descriptionProgress || 0);
            description.style.setProperty('--story-description-opacity', String(progress));
            description.style.setProperty('--story-description-y', `${(20 * (1 - progress)).toFixed(4)}px`);
            description.dataset.revealed = String(progress === 1);
        };

        const observer = new MutationObserver(update);
        observer.observe(section, {
            attributes: true,
            attributeFilter: ['data-description-progress'],
        });
        update();

        return () => {
            observer.disconnect();
            delete description.dataset.revealed;
            description.style.removeProperty('--story-description-opacity');
            description.style.removeProperty('--story-description-y');
        };
    }, [sectionRef, descriptionRef]);
}
