import { ActualClientRect, getActualClientRect } from 'actual-client-rect';
import { mat4 } from 'gl-matrix';
import {
  convertComputedTransformOriginToVec3,
  convertMat4ToCssMatrix3dSubstring,
  getElementTransformMat4,
} from './utils/transform-utils';

/**
 * DOM projection is the calculation of how two elements across the DOM hierarchy spatially (or visually) relate to each other
 * on the page
 *
 * when a subject is projected onto a target, you get two Projections. 'toSubject' contains the set of styles that--when applied
 * to the target element--will make the target visually align to the subject. the styles in 'toTargetOrigin' will make
 * the target align to its original state
 *
 * ---
 *
 * note if using an animation engine: some engines behave better when animating between values of the
 * same format, so it may be necessary to set the target to its origin projection before animating to the
 * subject's projection.
 *
 * the origin projection is also useful for easy, robust FLIP animations
 *
 * ---
 *
 * @member toSubject: Projection; // for aligning the target to the subject
 * @member toTargetOrigin: Projection; // for aligning the target to its original state
 * @member transformType: TransformType; // the type of transform that both projections contain
 * @member subject: HTMLElement;
 * @member target: HTMLElement;
 */
export type ProjectionResults = {
  toSubject: Projection;
  toTargetOrigin: Projection;
  transformType: TransformType;
  subject: HTMLElement;
  target: HTMLElement;
};
export type PartialProjectionResults = {
  toSubject: PartialProjection;
  toTargetOrigin: PartialProjection;
  transformType: TransformType;
  subject: HTMLElement;
  target: HTMLElement;
};

/**
 * a Projection contains the set of styles that--when applied to a target element--will make the target
 * visually align and match either the given subject element, or the target's original state
 *
 * @member width: string; // 'Wpx'
 * @member height: string; // 'Hpx'
 * @member borderStyle: string; // '' | 'none' | 'solid' | 'dashed' | etc.
 * @member borderWidth: string; // 'Tpx Rpx Bpx Lpx'
 * @member borderRadius: string; // 'TLpx TRpx BRpx BLpx'
 * @member — transformOrigin: string; // 'X% Y% Zpx'
 *
 * contains exactly one of the following members, depending on the given transformType option:
 * @member matrix3d: string; // (default)
 * @member transform: string; // \`matrix3d(${matrix3d})\`
 * @member transformMat4: mat4; // (row-major array from gl-matrix)
 */
export type Projection = {
  width: string;
  height: string;
  borderStyle: string;
  borderWidth: string;
  borderRadius: string;
  transformOrigin: string;
  [TransformType: string]: string | mat4 | any; // any is only necessary to allow spreading into anime.js, motion one, etc.
};
export type PartialProjection = Partial<Projection>;

export type TransformType = 'transform' | 'matrix3d' | 'transformMat4';
export type BorderSource = 'subject' | 'target' | 'zero';

/**
 * @member transformType?: 'transform' | 'matrix3d' | 'transformMat4'; // (default = transform)
 * @member useBorder?: 'subject' | 'target' | 'zero'; // (default = subject), designates which element's border style,
 *   width, and radius to match. zero means 0px border width. target's width and height are auto-adjusted
 * @member log?: boolean; // (default = false)
 */
export type ProjectionOptions = {
  transformType?: TransformType;
  useBorder?: BorderSource;
  log?: boolean;
};

const DEFAULT_TRANSFORM_TYPE: TransformType = 'transform';
const DEFAULT_BORDER_SOURCE: BorderSource = 'subject';
const BORDER_WIDTH_ZERO = '0px 0px 0px 0px';
const BORDER_RADIUS_ZERO = '0px 0px 0px 0px';

/**
 * DOM projection is the calculation of how two elements across the DOM hierarchy spatially (or visually) relate to each other
 * on the page
 *
 * when a subject is projected onto a target, you get two Projections. 'toSubject' contains the set of styles that--when applied
 * to the target element--will make the target visually align to the subject. the styles in 'toTargetOrigin' will make
 * the target align to its original state
 *
 * ---
 *
 * note if using an animation engine: some engines behave better when animating between values of the
 * same format, so it may be necessary to set the target to its origin projection before animating to the
 * subject's projection
 *
 * the origin projection is also useful for easy, robust FLIP animations
 *
 * ---
 *
 * Arguments
 * @argument subject: HTMLElement; // the element that you plan to align the target to
 * @argument target: HTMLElement; // the element that you plan to modify
 * @argument — options?: ProjectionOptions;
 *
 * ---
 *
 * ProjectionOptions
 * @member transformType?: 'transform' | 'matrix3d' | 'transformMat4'; // (default = transform)
 * @member — useBorder?: 'subject' | 'target' | 'zero'; // (default = subject), designates which element's border style,
 *   width, and radius to match. zero means 0px border width. width and height are auto-adjusted
 *
 * ---
 *
 * @returns ProjectionResults:
 *
 * @member toSubject: Projection; // for aligning the target to the subject
 * @member toTargetOrigin: Projection; // for aligning the target to its original state
 * @member transformType: TransformType; // the type of transform that both projections contain
 * @member subject: HTMLElement;
 * @member target: HTMLElement;
 *
 */
export function getProjection(
  subject: HTMLElement,
  target: HTMLElement,
  options?: ProjectionOptions,
): ProjectionResults {
  if (target === document.documentElement || target === document.body) {
    console.warn('Projectrix: behavior is undefined when target is root or body');
  }

  let targetAcr = getActualClientRect(target);
  const targetOrigin = convertComputedTransformOriginToVec3(targetAcr.transformOrigin);
  const originXPercent = (targetOrigin[0] / targetAcr.basis.width) * 100;
  const originYPercent = (targetOrigin[1] / targetAcr.basis.height) * 100;
  const normalizedTransformOrigin = `${originXPercent}% ${originYPercent}% ${targetOrigin[2]}px`;

  const transformType = options?.transformType ?? DEFAULT_TRANSFORM_TYPE;

  const results = {
    toSubject: getProjectionToSubject(subject, target, normalizedTransformOrigin, options),
    toTargetOrigin: getProjectionToTargetOrigin(
      target,
      targetAcr,
      normalizedTransformOrigin,
      options,
    ),
    transformType,
    subject,
    target,
  };
  if (options?.log) {
    console.log(results);
  }
  return results;
}

/**
 * sets the inline style on the target for each style in the given partial projection.
 * converts any matrix3d or transformMat4 value to a transform style
 */
export function setInlineStyles(target: HTMLElement, partialProjection: PartialProjection): void {
  for (const key in partialProjection) {
    if (key === 'matrix3d') {
      target.style.transform = `matrix3d(${partialProjection.matrix3d})`;
      continue;
    }
    if (key === 'transformMat4') {
      const transform = getTransformAsRequestedType(partialProjection.transformMat4).transform;
      target.style.transform = <string>transform;
      continue;
    }

    const propName = propKeyToPropName(key);
    target.style.setProperty(propName, partialProjection[key]);
  }
}

/**
 * clears the inline style on the target for each style in the given partial projection.
 * if no partial projection is given, assumes target's inline styles were set to a full projection.
 * if the projection contains matrix3d or transformMat4, then the transform style is cleared
 */
export function clearInlineStyles(
  target: HTMLElement,
  partialProjection?: PartialProjection,
): void {
  if (!partialProjection) {
    partialProjection = {
      width: '',
      height: '',
      borderWidth: '',
      borderStyle: '',
      borderRadius: '',
      transformOrigin: '',
      transform: '',
    };
  }

  for (const key in partialProjection) {
    if (['matrix3d', 'transformMat4'].includes(key)) {
      target.style.transform = '';
      continue;
    }

    const propName = propKeyToPropName(key);
    target.style.setProperty(propName, '');
  }
}

function getProjectionToSubject(
  subject: HTMLElement,
  target: HTMLElement,
  normalizedTransformOrigin: string,
  options?: ProjectionOptions,
): Projection {
  const subjectAcr = getActualClientRect(subject, {
    bakePositionIntoTransform: true,
    useTransformOrigin: normalizedTransformOrigin,
  });

  let destWidth = subjectAcr.basis.width;
  let destHeight = subjectAcr.basis.height;
  let destBorderStyle = '';
  let destBorderWidth = BORDER_WIDTH_ZERO;
  let destBorderRadius = BORDER_RADIUS_ZERO;

  const borderSrc = options?.useBorder ?? DEFAULT_BORDER_SOURCE;

  if (['subject', 'target'].includes(borderSrc)) {
    const borderSrcEl = borderSrc === 'subject' ? subject : target;
    const computedBorderSrc = getComputedStyle(borderSrcEl);
    const borderTop = parseFloat(computedBorderSrc.getPropertyValue('border-top-width'));
    const borderRight = parseFloat(computedBorderSrc.getPropertyValue('border-right-width'));
    const borderBottom = parseFloat(computedBorderSrc.getPropertyValue('border-bottom-width'));
    const borderLeft = parseFloat(computedBorderSrc.getPropertyValue('border-left-width'));
    const radiusTopLeft = parseFloat(computedBorderSrc.getPropertyValue('border-top-left-radius'));
    const radiusTopRight = parseFloat(
      computedBorderSrc.getPropertyValue('border-top-right-radius'),
    );
    const radiusBottomRight = parseFloat(
      computedBorderSrc.getPropertyValue('border-bottom-right-radius'),
    );
    const radiusBottomLeft = parseFloat(
      computedBorderSrc.getPropertyValue('border-bottom-left-radius'),
    );

    destWidth -= borderLeft + borderRight;
    destHeight -= borderTop + borderBottom;
    destBorderStyle = computedBorderSrc.getPropertyValue('border-style');
    destBorderWidth = `${borderTop}px ${borderRight}px ${borderBottom}px ${borderLeft}px`;
    destBorderRadius = `${radiusTopLeft}px ${radiusTopRight}px ${radiusBottomRight}px ${radiusBottomLeft}px`;
  }

  const targetInlineTransform = target.style.transform;
  const targetInlineWidth = target.style.width;
  const targetInlineHeight = target.style.height;
  const targetInlineBorderStyle = target.style.borderStyle;
  const targetInlineBorderWidth = target.style.borderWidth;

  target.style.transform = 'unset';
  target.style.width = `${destWidth}px`;
  target.style.height = `${destHeight}px`;
  target.style.borderStyle = 'solid';
  target.style.borderWidth = destBorderWidth;

  const targetRestingAcr = getActualClientRect(target, { bakePositionIntoTransform: true });

  target.style.transform = targetInlineTransform;
  target.style.width = targetInlineWidth;
  target.style.height = targetInlineHeight;
  target.style.borderStyle = targetInlineBorderStyle;
  target.style.borderWidth = targetInlineBorderWidth;

  const Mvt = targetRestingAcr.transformMat4;
  const Mvs = subjectAcr.transformMat4;

  const Mtv = mat4.create();
  mat4.invert(Mtv, Mvt);

  const Mts = mat4.create();
  mat4.multiply(Mts, Mtv, Mvs);

  return {
    width: `${destWidth}px`,
    height: `${destHeight}px`,
    borderStyle: destBorderStyle,
    borderWidth: destBorderWidth,
    borderRadius: destBorderRadius,
    transformOrigin: normalizedTransformOrigin,
    ...getTransformAsRequestedType(Mts, options),
  };
}

function getProjectionToTargetOrigin(
  target: HTMLElement,
  acr: ActualClientRect,
  normalizedTransformOrigin: string,
  options?: ProjectionOptions,
): Projection {
  let width = acr.basis.width;
  let height = acr.basis.height;

  const computed = getComputedStyle(target);
  const borderTop = parseFloat(computed.getPropertyValue('border-top-width'));
  const borderRight = parseFloat(computed.getPropertyValue('border-right-width'));
  const borderBottom = parseFloat(computed.getPropertyValue('border-bottom-width'));
  const borderLeft = parseFloat(computed.getPropertyValue('border-left-width'));
  const radiusTopLeft = parseFloat(computed.getPropertyValue('border-top-left-radius'));
  const radiusTopRight = parseFloat(computed.getPropertyValue('border-top-right-radius'));
  const radiusBottomRight = parseFloat(computed.getPropertyValue('border-bottom-right-radius'));
  const radiusBottomLeft = parseFloat(computed.getPropertyValue('border-bottom-left-radius'));

  width -= borderLeft + borderRight;
  height -= borderTop + borderBottom;

  const transformMat4 = getElementTransformMat4(target);

  return {
    width: `${width}px`,
    height: `${height}px`,
    borderStyle: computed.getPropertyValue('border-style'),
    borderWidth: `${borderTop}px ${borderRight}px ${borderBottom}px ${borderLeft}px`,
    borderRadius: `${radiusTopLeft}px ${radiusTopRight}px ${radiusBottomRight}px ${radiusBottomLeft}px`,
    transformOrigin: normalizedTransformOrigin,
    ...getTransformAsRequestedType(transformMat4, options),
  };
}

type Transforms = {
  [TransformType: string]: string | mat4;
};

function getTransformAsRequestedType(transformMat4: mat4, options?: ProjectionOptions): Transforms {
  const transformType = options?.transformType ?? DEFAULT_TRANSFORM_TYPE;
  const matrix3d = convertMat4ToCssMatrix3dSubstring(transformMat4);

  switch (transformType) {
    case 'transform':
      return {
        transform: `matrix3d(${matrix3d})`,
      };
    case 'matrix3d':
      return {
        matrix3d,
      };
    case 'transformMat4':
      return {
        transformMat4,
      };
  }
}

function propKeyToPropName(key: string): string {
  const frags = key.match(/[A-Z]*[a-z]+/g);
  if (!frags) return key;
  return frags?.join('-');
}
