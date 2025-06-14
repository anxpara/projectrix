import type { Component } from 'svelte';
import type { ProjectionOptions, Projection } from 'projectrix';
import type { JSAnimation } from 'animejs';
import type { Options } from '../options';
import { TrialName as TrialName } from './trialNames';
import type OriginMarker from '../../components/trials/ui/OriginMarker.svelte';
import Control from '../../components/trials/Control.svelte';
import TargetInPadded from '../../components/trials/TargetInPadded.svelte';
import TargetMargined from '../../components/trials/TargetMargined.svelte';
import Target2ndChild from '../../components/trials/Target2ndChild.svelte';
import TargetRelative from '../../components/trials/TargetRelative.svelte';
import TargetAbsolute from '../../components/trials/TargetAbsolute.svelte';
import TargetSmaller from '../../components/trials/TargetSmaller.svelte';
import TargetBigger from '../../components/trials/TargetBigger.svelte';
import TargetDeepAbsolute from '../../components/trials/TargetDeepAbsolute.svelte';
import TargetFixed from '../../components/trials/TargetFixed.svelte';
import TargetRotated from '../../components/trials/TargetRotated.svelte';
import TargetInRotated from '../../components/trials/TargetInRotated.svelte';
import TargetInScroll from '../../components/trials/TargetInScroll.svelte';
import TargetSticky from '../../components/trials/TargetSticky.svelte';
import TargetOrigin0 from '../../components/trials/TargetOrigin0.svelte';
import SubjectOrigin0 from '../../components/trials/SubjectOrigin0.svelte';
import TargetInOrigin0 from '../../components/trials/TargetInOrigin0.svelte';
import UseSubjectBorder from '../../components/trials/UseSubjectBorder.svelte';
import UseTargetBorder from '../../components/trials/UseTargetBorder.svelte';
import UseZeroBorder from '../../components/trials/UseZeroBorder.svelte';
import TargetRotatedBigger from '../../components/trials/TargetRotatedBigger.svelte';
import SubjectOrigin0Bigger from '../../components/trials/SubjectOrigin0Bigger.svelte';
import TargetOrigin0Bigger from '../../components/trials/TargetOrigin0Bigger.svelte';
import TargetInOrigin0Bigger from '../../components/trials/TargetInOrigin0Bigger.svelte';
import TargetInRotatedBigger from '../../components/trials/TargetInRotatedBigger.svelte';
import UseMatrix3dType from '../../components/trials/UseMatrix3dType.svelte';
import UseMat4Type from '../../components/trials/UseMat4Type.svelte';
import TargetAbsoluteInTransform from '../../components/trials/TargetAbsoluteInTransform.svelte';
import TargetFixedInTransform from '../../components/trials/TargetFixedInTransform.svelte';
import TargetFixedInFilter from '../../components/trials/TargetFixedInFilter.svelte';
import SetWithMatrix3 from '../../components/trials/SetWithMatrix3.svelte';
import SetWithMat4 from '../../components/trials/SetWithMat4.svelte';
import ClearWithMat4 from '../../components/trials/ClearWithMat4.svelte';
import ClearWithMatrix3d from '../../components/trials/ClearWithMatrix3d.svelte';
import MeasureSubject from '../../components/trials/MeasureSubject.svelte';
import MeasureSubjectOrigin0 from '../../components/trials/MeasureSubjectOrigin0.svelte';
import MeasureSubjectOriginOdd from '../../components/trials/MeasureSubjectOriginOdd.svelte';
import MeasureSubjectSmaller from '../../components/trials/MeasureSubjectSmaller.svelte';
import TargetInPreserve3d from '../../components/trials/TargetInPreserve3d.svelte';
import TwoContainersPreserve3d from '../../components/trials/TwoContainersPreserve3d.svelte';
import OuterContainerPreserve3d from '../../components/trials/OuterContainerPreserve3d.svelte';
import SubjectPerspective from '../../components/trials/SubjectPerspective.svelte';
import TargetPerspective from '../../components/trials/TargetPerspective.svelte';
import BothPerspective from '../../components/trials/BothPerspective.svelte';
import PerspectiveOrigin from '../../components/trials/PerspectiveOrigin.svelte';
import PerspectivePreserve3d from '../../components/trials/PerspectivePreserve3d.svelte';
import TargetPadded from '../../components/trials/TargetPadded.svelte';
import TargetBorderBox from '../../components/trials/TargetBorderBox.svelte';

export type TrialAnimationOptions = {
  duration?: number;
  complete?: (trialOptions: Options) => void;
};

export interface TrialProps {
  trial: Trial;
  hideSubject?: boolean;
}

export interface TrialControls {
  getTargetElement: () => HTMLElement;
  getSubjectElement?: () => HTMLElement;
  getProjectionOptions?: () => ProjectionOptions;
  getTrialOptionOverrides?: () => Options;
  playCustomAnimation?: (
    defaultSubject: HTMLElement,
    trialOptions: Options,
    animationOptions?: TrialAnimationOptions,
  ) => void;
}

export type TrialComponent = Component<TrialProps, TrialControls>;

export type Trial = {
  name: TrialName;
  Component: TrialComponent;
  instance?: ReturnType<TrialComponent>;
  originMarker?: OriginMarker;
  toTargetOrigin?: Projection;
  animation?: JSAnimation;
};

export const allTrials: Trial[] = $state([
  { name: TrialName.Control, Component: Control },
  { name: TrialName.UseSubjectBorder, Component: UseSubjectBorder },
  { name: TrialName.UseTargetBorder, Component: UseTargetBorder },
  { name: TrialName.UseZeroBorder, Component: UseZeroBorder },
  { name: TrialName.TargetSmaller, Component: TargetSmaller },
  { name: TrialName.TargetBigger, Component: TargetBigger },
  { name: TrialName.TargetPadded, Component: TargetPadded },
  { name: TrialName.TargetBorderBox, Component: TargetBorderBox },
  { name: TrialName.TargetInPadded, Component: TargetInPadded },
  { name: TrialName.TargetMargined, Component: TargetMargined },
  { name: TrialName.Target2ndChild, Component: Target2ndChild },
  { name: TrialName.TargetRelative, Component: TargetRelative },
  { name: TrialName.TargetAbsolute, Component: TargetAbsolute },
  { name: TrialName.TargetAbsoluteInTransform, Component: TargetAbsoluteInTransform },
  { name: TrialName.TargetDeepAbsolute, Component: TargetDeepAbsolute },
  { name: TrialName.TargetFixed, Component: TargetFixed },
  { name: TrialName.TargetFixedInTransform, Component: TargetFixedInTransform },
  { name: TrialName.TargetFixedInFilter, Component: TargetFixedInFilter },
  { name: TrialName.TargetRotated, Component: TargetRotated },
  { name: TrialName.TargetRotatedBigger, Component: TargetRotatedBigger },
  { name: TrialName.TargetInRotated, Component: TargetInRotated },
  { name: TrialName.TargetInRotatedBigger, Component: TargetInRotatedBigger },
  { name: TrialName.TargetInScroll, Component: TargetInScroll },
  { name: TrialName.TargetSticky, Component: TargetSticky },
  { name: TrialName.SubjectOrigin0, Component: SubjectOrigin0 },
  { name: TrialName.SubjectOrigin0Bigger, Component: SubjectOrigin0Bigger },
  { name: TrialName.TargetOrigin0, Component: TargetOrigin0 },
  { name: TrialName.TargetOrigin0Bigger, Component: TargetOrigin0Bigger },
  { name: TrialName.TargetInOrigin0, Component: TargetInOrigin0 },
  { name: TrialName.TargetInOrigin0Bigger, Component: TargetInOrigin0Bigger },
  { name: TrialName.TargetInPreserve3d, Component: TargetInPreserve3d },
  { name: TrialName.TwoContainersPreserve3d, Component: TwoContainersPreserve3d },
  { name: TrialName.OuterContainerPreserve3d, Component: OuterContainerPreserve3d },
  { name: TrialName.SubjectPerspective, Component: SubjectPerspective },
  { name: TrialName.TargetPerspective, Component: TargetPerspective },
  { name: TrialName.BothPerspective, Component: BothPerspective },
  { name: TrialName.PerspectiveOrigin, Component: PerspectiveOrigin },
  { name: TrialName.PerspectivePreserve3d, Component: PerspectivePreserve3d },
  { name: TrialName.UseMatrix3dType, Component: UseMatrix3dType },
  { name: TrialName.UseMat4Type, Component: UseMat4Type },
  { name: TrialName.SetWithMatrix3d, Component: SetWithMatrix3 },
  { name: TrialName.SetWithMat4, Component: SetWithMat4 },
  { name: TrialName.ClearWithMatrix3d, Component: ClearWithMatrix3d },
  { name: TrialName.ClearWithMat4, Component: ClearWithMat4 },
  { name: TrialName.MeasureSubject, Component: MeasureSubject },
  { name: TrialName.MeasureSubjectOrigin0, Component: MeasureSubjectOrigin0 },
  { name: TrialName.MeasureSubjectOriginOdd, Component: MeasureSubjectOriginOdd },
  { name: TrialName.MeasureSubjectSmaller, Component: MeasureSubjectSmaller },
]);
export const trialsByName = new Map<TrialName, Trial>(
  allTrials.map((trial) => [trial.name, trial]),
);

export function getTrials(trialNames: string[]): Trial[] {
  return trialNames
    .map((name) => trialsByName.get(name as TrialName))
    .filter((trial) => !!trial) as Trial[];
}
