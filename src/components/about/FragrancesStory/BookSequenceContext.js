import { createContext } from 'react';

export const BookSequenceContext = createContext(null);

export function bookSceneTrigger(sequence, start = 'left 80%') {
  if (!sequence) return {};
  // DOM-based string positions assume linear container motion. This sequence
  // has holds and eased transitions, so resolve them to the actual scroll time.
  return {
    containerAnimation: sequence.animation,
    start: self => start === 'left right'
      ? sequence.scrollPosition(self.trigger, false, 1)
      : sequence.holdPosition(self.trigger),
    end: self => sequence.scrollPosition(self.trigger, true, 0),
  };
}
