import { readable, type Readable } from 'svelte/store';

export interface MediaQueryStore extends Readable<boolean | undefined> {}

export function createMediaQueryStore(query: string): MediaQueryStore {
  if (typeof window === 'undefined') {
    return readable<boolean | undefined>(undefined);
  }

  const mediaQueryList = window.matchMedia(query);

  return readable<boolean | undefined>(mediaQueryList.matches, (set) => {
    const handleChange = () => set(mediaQueryList.matches);

    mediaQueryList.addEventListener('change', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  });
}
