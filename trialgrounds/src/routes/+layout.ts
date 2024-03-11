import { allOptionNames, forPlaywrightOptionNames } from '$lib/optionNames.js';
import type { Options } from '$lib/options';

/** @type {import('./$types').LayoutLoad} */
export async function load({ params, url }) {
  const trialNames = url.searchParams.get('trialNames')?.split(',') ?? [];
  const forPlaywright = url.searchParams.has('forPlaywright');

  const options: Options = {};
  allOptionNames.forEach((name) => {
    options[name] = url.searchParams.has(name);
  });

  if (forPlaywright) {
    forPlaywrightOptionNames.forEach((name) => {
      options[name] = true;
    });
  }

  return {
    trialNames,
    forPlaywright,
    options,
  };
}
