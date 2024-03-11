import { allOptionNames, type OptionName } from './optionNames';

export type Options = {
  [key in OptionName]: boolean;
};

export function getUrlForOptions(options: Options, currentParams: URLSearchParams): string {
  const trialNames = currentParams.get('trialNames');
  const forPlaywright = currentParams.has('forPlaywright');

  const nextParams = new URLSearchParams();
  if (trialNames) nextParams.set('trailNames', trialNames);
  if (forPlaywright) nextParams.set('forPlaywright', '');

  allOptionNames.forEach((name) => {
    if (options[name]) nextParams.set(name, '');
  });

  return `?${nextParams.toString().replace(/=$|=(?=&)/g, '')}`;
}
