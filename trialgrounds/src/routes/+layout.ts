import { SharedOptionName, TrialOptionName } from '$lib/optionNames.js';

/** @type {import('./$types').LayoutLoad} */
export async function load({ params, url }) {
  const trialNames = url.searchParams.get('trialNames')?.split(',') ?? [];
  const toTargetOrigin = url.searchParams.has(TrialOptionName.ToTargetOrigin);
  const forPlaywright = url.searchParams.has('forPlaywright');
  const projectOnce = url.searchParams.has(TrialOptionName.ProjectOnce) || forPlaywright;
  const skipAnimation = url.searchParams.has(TrialOptionName.SkipAnimation) || forPlaywright;
  const hideMenu = url.searchParams.has(SharedOptionName.HideMenu) || forPlaywright;
  const log = url.searchParams.has(SharedOptionName.Log);

  return {
    trialNames,
    projectOnce,
    forPlaywright,
    skipAnimation,
    toTargetOrigin,
    hideMenu,
    log,
  };
}
