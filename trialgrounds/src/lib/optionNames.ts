export const OptionName = {
  Log: 'log',
  HideMenu: 'hideMenu',
  ToTargetOrigin: 'toTargetOrigin',
  SkipAnimation: 'skipAnimation',
  ProjectOnce: 'projectOnce',
};
export type OptionName = (typeof OptionName)[keyof typeof OptionName];
export const allOptionNames: string[] = Object.values(OptionName);

export const sharedOptionNames = [OptionName.Log, OptionName.HideMenu];
export const trialOptionNames = [
  OptionName.ToTargetOrigin,
  OptionName.SkipAnimation,
  OptionName.ProjectOnce,
];
export const forPlaywrightOptionNames = [
  OptionName.HideMenu,
  OptionName.SkipAnimation,
  OptionName.ProjectOnce,
];
