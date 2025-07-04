export const TrialName = {
  Control: 'control',
  UseSubjectBorder: 'use-subject-border',
  UseTargetBorder: 'use-target-border',
  UseZeroBorder: 'use-zero-border',
  TargetSmaller: 'target-smaller',
  TargetBigger: 'target-bigger',
  TargetPadded: 'target-padded',
  TargetBorderBox: 'target-border-box',
  TargetInPadded: 'target-in-padded',
  TargetMargined: 'target-margined',
  Target2ndChild: 'target-2nd-child',
  TargetRelative: 'target-relative',
  TargetAbsolute: 'target-absolute',
  TargetAbsoluteInTransform: 'target-absolute-in-transform',
  TargetDeepAbsolute: 'target-deep-absolute',
  TargetFixed: 'target-fixed',
  TargetFixedInTransform: 'target-fixed-in-transform',
  TargetFixedInFilter: 'target-fixed-in-filter',
  TargetRotated: 'target-rotated',
  TargetRotatedBigger: 'target-rotated-bigger',
  TargetInRotated: 'target-in-rotated',
  TargetInRotatedBigger: 'target-in-rotated-bigger',
  TargetInScroll: 'target-in-scroll',
  TargetSticky: 'target-sticky',
  SubjectOrigin0: 'subject-origin-0',
  SubjectOrigin0Bigger: 'subject-origin-0-bigger',
  TargetOrigin0: 'target-origin-0',
  TargetOrigin0Bigger: 'target-origin-0-bigger',
  TargetInOrigin0: 'target-in-origin-0',
  TargetInOrigin0Bigger: 'target-in-origin-0-bigger',
  TargetInPreserve3d: 'target-in-preserve-3d',
  TwoContainersPreserve3d: 'two-containers-preserve-3d',
  OuterContainerPreserve3d: 'outer-container-preserve-3d',
  SubjectPerspective: 'subject-perspective',
  TargetPerspective: 'target-perspective',
  BothPerspective: 'both-perspective',
  PerspectiveOrigin: 'perspective-origin',
  PerspectivePreserve3d: 'perspective-preserve-3d',
  UseMatrix3dType: 'use-matrix3d-type',
  UseMat4Type: 'use-mat4-type',
  SetWithMatrix3d: 'set-with-matrix3d',
  SetWithMat4: 'set-with-mat4',
  ClearWithMatrix3d: 'clear-with-matrix3d',
  ClearWithMat4: 'clear-with-mat4',
  MeasureSubject: 'measure-subject',
  MeasureSubjectOrigin0: 'measure-subject-origin-0',
  MeasureSubjectOriginOdd: 'measure-subject-origin-odd',
  MeasureSubjectSmaller: 'measure-subject-smaller',
} as const;
export type TrialName = (typeof TrialName)[keyof typeof TrialName];
export const trialNames: TrialName[] = Object.values(TrialName);
