// source of truth for TDSource, TDSequenceName, client fetch interval, log level, etc.
/** @type {import('./$types').LayoutLoad} */
export async function load({ params, url }) {
  const trialNames = url.searchParams.get('trialNames')?.split(',') ?? [];
  const toTargetOrigin = url.searchParams.has('toTargetOrigin');
  const forPlaywright = url.searchParams.has('forPlaywright');
  const projectOnce = url.searchParams.has('projectOnce') || forPlaywright;
  const skipAnimation = url.searchParams.has('skipAnimation') || forPlaywright;
  const log = url.searchParams.has('log');

  return {
    trialNames,
    projectOnce,
    forPlaywright,
    skipAnimation,
    toTargetOrigin,
    log,
  };
}
