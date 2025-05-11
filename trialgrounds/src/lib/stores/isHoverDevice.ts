import { addChangeEmitsToReadable } from './addChangeEmitsToStore';
import { createMediaQueryStore } from './createMediaQueryStore';

export const isHoverDevice = addChangeEmitsToReadable<boolean | undefined>(
  createMediaQueryStore('(hover: hover)'),
);
