import type { ComponentType, SvelteComponent } from 'svelte';
import type { ProjectionOptions, Projection } from 'projectrix';
import type { AnimationControls } from 'motion';
import type { Options } from './options';
import { TrialName as TrialName } from './trialNames';
import type OriginMarker from '../components/OriginMarker.svelte';
import Control from '../components/trials/Control.svelte';
import TargetInPadded from '../components/trials/TargetInPadded.svelte';
import TargetMargined from '../components/trials/TargetMargined.svelte';
import Target2ndChild from '../components/trials/Target2ndChild.svelte';
import TargetRelative from '../components/trials/TargetRelative.svelte';
import TargetAbsolute from '../components/trials/TargetAbsolute.svelte';
import TargetSmaller from '../components/trials/TargetSmaller.svelte';
import TargetBigger from '../components/trials/TargetBigger.svelte';
import TargetDeepAbsolute from '../components/trials/TargetDeepAbsolute.svelte';
import TargetFixed from '../components/trials/TargetFixed.svelte';
import TargetRotated from '../components/trials/TargetRotated.svelte';
import TargetInRotated from '../components/trials/TargetInRotated.svelte';
import TargetInScroll from '../components/trials/TargetInScroll.svelte';
import TargetSticky from '../components/trials/TargetSticky.svelte';
import TargetOrigin0 from '../components/trials/TargetOrigin0.svelte';
import SubjectOrigin0 from '../components/trials/SubjectOrigin0.svelte';
import TargetInOrigin0 from '../components/trials/TargetInOrigin0.svelte';
import UseSubjectBorder from '../components/trials/UseSubjectBorder.svelte';
import UseTargetBorder from '../components/trials/UseTargetBorder.svelte';
import UseZeroBorder from '../components/trials/UseZeroBorder.svelte';
import TargetRotatedBigger from '../components/trials/TargetRotatedBigger.svelte';
import SubjectOrigin0Bigger from '../components/trials/SubjectOrigin0Bigger.svelte';
import TargetOrigin0Bigger from '../components/trials/TargetOrigin0Bigger.svelte';
import TargetInOrigin0Bigger from '../components/trials/TargetInOrigin0Bigger.svelte';
import TargetInRotatedBigger from '../components/trials/TargetInRotatedBigger.svelte';
import UseMatrix3dType from '../components/trials/UseMatrix3dType.svelte';
import UseMat4Type from '../components/trials/UseMat4Type.svelte';
import TargetAbsoluteInTransform from '../components/trials/TargetAbsoluteInTransform.svelte';
import TargetFixedInTransform from '../components/trials/TargetFixedInTransform.svelte';
import TargetFixedInFilter from '../components/trials/TargetFixedInFilter.svelte';
import SetWithMatrix3 from '../components/trials/SetWithMatrix3.svelte';
import SetWithMat4 from '../components/trials/SetWithMat4.svelte';
import ClearWithMat4 from '../components/trials/ClearWithMat4.svelte';
import ClearWithMatrix3d from '../components/trials/ClearWithMatrix3d.svelte';
import MeasureSubject from '../components/trials/MeasureSubject.svelte';
import MeasureSubjectOrigin0 from '../components/trials/MeasureSubjectOrigin0.svelte';
import MeasureSubjectOriginOdd from '../components/trials/MeasureSubjectOriginOdd.svelte';
import MeasureSubjectSmaller from '../components/trials/MeasureSubjectSmaller.svelte';
import TargetInPreserve3d from '../components/trials/TargetInPreserve3d.svelte';
import TwoContainersPreserve3d from '../components/trials/TwoContainersPreserve3d.svelte';
import OuterContainerPreserve3d from '../components/trials/OuterContainerPreserve3d.svelte';
import SubjectPerspective from '../components/trials/SubjectPerspective.svelte';
import TargetPerspective from '../components/trials/TargetPerspective.svelte';
import BothPerspective from '../components/trials/BothPerspective.svelte';
import PerspectiveOrigin from '../components/trials/PerspectiveOrigin.svelte';
import PerspectivePreserve3d from '../components/trials/PerspectivePreserve3d.svelte';

export type TrialAnimationOptions = {
  duration?: number;
  complete?: (trialOptions: Options) => void;
};

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

export interface GetTrialControls {
  getTrialControls: () => TrialControls;
}

export type TrialComponent = SvelteComponent & GetTrialControls;

export type Trial = {
  name: TrialName;
  trialType: ComponentType<TrialComponent>;
  trialComponent?: TrialComponent;
  originMarker?: OriginMarker;
  toTargetOrigin?: Projection;
  animation?: AnimationControls;
};

export const allTrials: Trial[] = [
  { name: TrialName.Control, trialType: Control },
  { name: TrialName.UseSubjectBorder, trialType: UseSubjectBorder },
  { name: TrialName.UseTargetBorder, trialType: UseTargetBorder },
  { name: TrialName.UseZeroBorder, trialType: UseZeroBorder },
  { name: TrialName.TargetSmaller, trialType: TargetSmaller },
  { name: TrialName.TargetBigger, trialType: TargetBigger },
  { name: TrialName.TargetInPadded, trialType: TargetInPadded },
  { name: TrialName.TargetMargined, trialType: TargetMargined },
  { name: TrialName.Target2ndChild, trialType: Target2ndChild },
  { name: TrialName.TargetRelative, trialType: TargetRelative },
  { name: TrialName.TargetAbsolute, trialType: TargetAbsolute },
  { name: TrialName.TargetAbsoluteInTransform, trialType: TargetAbsoluteInTransform },
  { name: TrialName.TargetDeepAbsolute, trialType: TargetDeepAbsolute },
  { name: TrialName.TargetFixed, trialType: TargetFixed },
  { name: TrialName.TargetFixedInTransform, trialType: TargetFixedInTransform },
  { name: TrialName.TargetFixedInFilter, trialType: TargetFixedInFilter },
  { name: TrialName.TargetRotated, trialType: TargetRotated },
  { name: TrialName.TargetRotatedBigger, trialType: TargetRotatedBigger },
  { name: TrialName.TargetInRotated, trialType: TargetInRotated },
  { name: TrialName.TargetInRotatedBigger, trialType: TargetInRotatedBigger },
  { name: TrialName.TargetInScroll, trialType: TargetInScroll },
  { name: TrialName.TargetSticky, trialType: TargetSticky },
  { name: TrialName.SubjectOrigin0, trialType: SubjectOrigin0 },
  { name: TrialName.SubjectOrigin0Bigger, trialType: SubjectOrigin0Bigger },
  { name: TrialName.TargetOrigin0, trialType: TargetOrigin0 },
  { name: TrialName.TargetOrigin0Bigger, trialType: TargetOrigin0Bigger },
  { name: TrialName.TargetInOrigin0, trialType: TargetInOrigin0 },
  { name: TrialName.TargetInOrigin0Bigger, trialType: TargetInOrigin0Bigger },
  { name: TrialName.TargetInPreserve3d, trialType: TargetInPreserve3d },
  { name: TrialName.TwoContainersPreserve3d, trialType: TwoContainersPreserve3d },
  { name: TrialName.OuterContainerPreserve3d, trialType: OuterContainerPreserve3d },
  { name: TrialName.SubjectPerspective, trialType: SubjectPerspective },
  { name: TrialName.TargetPerspective, trialType: TargetPerspective },
  { name: TrialName.BothPerspective, trialType: BothPerspective },
  { name: TrialName.PerspectiveOrigin, trialType: PerspectiveOrigin },
  { name: TrialName.PerspectivePreserve3d, trialType: PerspectivePreserve3d },
  { name: TrialName.UseMatrix3dType, trialType: UseMatrix3dType },
  { name: TrialName.UseMat4Type, trialType: UseMat4Type },
  { name: TrialName.SetWithMatrix3d, trialType: SetWithMatrix3 },
  { name: TrialName.SetWithMat4, trialType: SetWithMat4 },
  { name: TrialName.ClearWithMatrix3d, trialType: ClearWithMatrix3d },
  { name: TrialName.ClearWithMat4, trialType: ClearWithMat4 },
  { name: TrialName.MeasureSubject, trialType: MeasureSubject },
  { name: TrialName.MeasureSubjectOrigin0, trialType: MeasureSubjectOrigin0 },
  { name: TrialName.MeasureSubjectOriginOdd, trialType: MeasureSubjectOriginOdd },
  { name: TrialName.MeasureSubjectSmaller, trialType: MeasureSubjectSmaller },
];
export const trialsByName = new Map<TrialName, Trial>(
  allTrials.map((trial) => [trial.name, trial]),
);

export function getTrials(trialNames: string[]): Trial[] {
  return trialNames
    .map((name) => trialsByName.get(name as TrialName))
    .filter((trial) => !!trial) as Trial[];
}
