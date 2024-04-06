export const OptionName = {
  Log: 'log',
  HideUI: 'hideUI',
  ToTargetOrigin: 'toTargetOrigin',
  SkipAnimation: 'skipAnimation',
  ProjectOnce: 'projectOnce',
  AlwaysMeasure: 'alwaysMeasure',
};
export type OptionName = (typeof OptionName)[keyof typeof OptionName];
export const allOptionNames: string[] = Object.values(OptionName);

export const sharedOptionNames = [OptionName.Log, OptionName.HideUI];
export const trialOptionNames = [
  OptionName.ToTargetOrigin,
  OptionName.SkipAnimation,
  OptionName.ProjectOnce,
  OptionName.AlwaysMeasure,
];
export const forPlaywrightOptionNames = [
  OptionName.HideUI,
  OptionName.SkipAnimation,
  OptionName.ProjectOnce,
];
