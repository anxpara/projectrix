export const SharedOptionName = {
  Log: 'log',
  HideMenu: 'hideMenu',
};
export type SharedOptionName = (typeof SharedOptionName)[keyof typeof SharedOptionName];
export const sharedOptionNames: string[] = Object.values(SharedOptionName);

export const TrialOptionName = {
  ToTargetOrigin: 'toTargetOrigin',
  ProjectOnce: 'projectOnce',
  SkipAnimation: 'skipAnimation',
};
export type TrialOptionName = (typeof TrialOptionName)[keyof typeof TrialOptionName];
export const trialOptionNames: string[] = Object.values(TrialOptionName);