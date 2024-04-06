import { ActualClientRect, getActualClientRect } from 'actual-client-rect';
import { mat4, vec3 } from 'gl-matrix';
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
 * subject's projection, or vice versa
 *
 * ---
 *
 * @member toSubject: Projection; // for aligning the target to the subject
 * @member toTargetOrigin: Projection; // for aligning the target to its original state
 * @member transformType: TransformType; // the type of transform that both projections contain
 * @member subject: HTMLElement | Measurement;
 * @member target: HTMLElement;
 */
export type ProjectionResults = {
  toSubject: Projection;
  toTargetOrigin: Projection;
  transformType: TransformType;
  subject: HTMLElement | Measurement;
  target: HTMLElement;
};
export type PartialProjectionResults = {
  toSubject: PartialProjection;
  toTargetOrigin: PartialProjection;
  transformType: TransformType;
  subject: HTMLElement | Measurement;
  target: HTMLElement;
};

/**
 * a Projection contains the set of styles that--when applied to a target element--will make the target
 * visually align with either a subject element, or the target's original state
 *
 * @member width: string; // 'Wpx'
 * @member height: string; // 'Hpx'
 * @member borderStyle: string; // '' | 'none' | 'solid' | 'dashed' | etc.
 * @member borderWidth: string; // 'Tpx Rpx Bpx Lpx'
 * @member borderRadius: string; // 'TLpx TRpx BRpx BLpx'
 * @member — transformOrigin: string; // 'X% Y% Zpx'
 *
 * contains exactly one of the following members, depending on the given transformType option:
 * @member transform: string; // (default) \`matrix3d(${matrix3d})\`
 * @member matrix3d: string;
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

const DEFAULT_TRANSFORM_TYPE: TransformType = 'transform';
const DEFAULT_BORDER_SOURCE: BorderSource = 'subject';

/**
 * @member transformType?: 'transform' | 'matrix3d' | 'transformMat4'; // (default = 'transform')
 * @member useBorder?: 'subject' | 'target' | 'zero'; // (default = 'subject'), designates which element's border width,
 *   radius, and style to match. projected width and height are auto-adjusted. zero means 0px border width and radius
 * @member log?: boolean; // (default = false)
 */
export type ProjectionOptions = {
  transformType?: TransformType;
  useBorder?: BorderSource;
  log?: boolean;
};

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
 * subject's projection, or vice versa
 *
 * ---
 *
 * Arguments
 * @argument subject: HTMLElement | Measurement; // the element or measurement that you plan to align the target to
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
 * @member subject: HTMLElement | Measurement;
 * @member target: HTMLElement;
 *
 */
export function getProjection(
  subject: HTMLElement | Measurement,
  target: HTMLElement,
  options?: ProjectionOptions,
): ProjectionResults {
  if (!subject) {
    throw new Error('Projectrix: null subject');
  }
  if (!target) {
    throw new Error('Projectrix: null target');
  }
  if (target === document.documentElement || target === document.body) {
    console.warn('Projectrix: behavior is undefined when target is root or body');
  }

  let targetAcr = getActualClientRect(target);
  const targetOrigin = convertComputedTransformOriginToVec3(targetAcr.transformOrigin);
  const originXPercent = (targetOrigin[0] / targetAcr.basis.width) * 100;
  const originYPercent = (targetOrigin[1] / targetAcr.basis.height) * 100;
  const sharedTransformOrigin = `${originXPercent}% ${originYPercent}% ${targetOrigin[2]}px`;

  const transformType = options?.transformType ?? DEFAULT_TRANSFORM_TYPE;

  const results = {
    toSubject: getProjectionToSubject(subject, target, sharedTransformOrigin, options),
    toTargetOrigin: getProjectionToTargetOrigin(target, targetAcr, sharedTransformOrigin, options),
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
 * a Measurement contains subject data useful for future projections
 */
export type Measurement = {
  acr: ActualClientRect;
  border: BorderMeasurement;
};
export type BorderMeasurement = {
  style: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
  radius: string;
};

/**
 * measures a subject for future projections. useful if the subject and target cannot coexist,
 * such as a flip animation where the subject is the target's past
 */
export function measureSubject(subject: HTMLElement): Measurement {
  return {
    acr: getActualClientRect(subject, {
      bakePositionIntoTransform: true,
      useTransformOrigin: 'center',
    }),
    border: measureElementBorder(subject),
  };
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
  subject: HTMLElement | Measurement,
  target: HTMLElement,
  sharedTransformOrigin: string,
  options?: ProjectionOptions,
): Projection {
  const subjectAcr = getSubjectAcr(subject, sharedTransformOrigin);
  const border = getBorderMeasurement(subject, target, options);
  const width = subjectAcr.basis.width - border.left - border.right;
  const height = subjectAcr.basis.height - border.top - border.bottom;
  const borderWidth = `${border.top}px ${border.right}px ${border.bottom}px ${border.left}px`;

  const savedInlineStyles: PartialProjection = {
    transform: target.style.transform,
    width: target.style.width,
    height: target.style.height,
    borderStyle: target.style.borderStyle,
    borderWidth: target.style.borderWidth,
  };

  target.style.transform = 'unset';
  target.style.width = `${width}px`;
  target.style.height = `${height}px`;
  target.style.borderStyle = 'solid';
  target.style.borderWidth = borderWidth;

  const targetRestingAcr = getActualClientRect(target, { bakePositionIntoTransform: true });

  setInlineStyles(target, savedInlineStyles);

  const Mvt = targetRestingAcr.transformMat4;
  const Mvs = subjectAcr.transformMat4;

  const Mtv = mat4.create();
  mat4.invert(Mtv, Mvt);

  const Mts = mat4.create();
  mat4.multiply(Mts, Mtv, Mvs);

  return {
    width: `${width}px`,
    height: `${height}px`,
    borderStyle: border.style,
    borderWidth,
    borderRadius: border.radius,
    transformOrigin: sharedTransformOrigin,
    ...getTransformAsRequestedType(Mts, options),
  };
}

function getSubjectAcr(
  subject: HTMLElement | Measurement,
  sharedTransformOrigin: string,
): ActualClientRect {
  return isMeasurement(subject)
    ? setAcrToSharedTransformOrigin(subject.acr, sharedTransformOrigin)
    : getActualClientRect(subject, {
        bakePositionIntoTransform: true,
        useTransformOrigin: sharedTransformOrigin,
      });
}

function setAcrToSharedTransformOrigin(
  acr: ActualClientRect,
  sharedTransformOrigin: string,
): ActualClientRect {
  const newAcr: ActualClientRect = {
    ...acr,
  };

  const Va = convertComputedTransformOriginToVec3(acr.transformOrigin);

  const Vx = convertComputedTransformOriginToVec3(sharedTransformOrigin);
  Vx[0] = acr.basis.width * (Vx[0] / 100);
  Vx[1] = acr.basis.height * (Vx[1] / 100);

  if (vec3.equals(Va, Vx)) {
    newAcr.transformOrigin = sharedTransformOrigin;
    return newAcr;
  }

  // have transform from current origin (Mab), want transform from shared origin (Mxy)
  const Mab = acr.transformMat4;

  // get difference in origins
  const Vax = vec3.create();
  vec3.subtract(Vax, Vx, Va);
  const Max = mat4.create();
  mat4.fromTranslation(Max, Vax);

  // difference in destinations is identical to difference in origins,
  // within respective frames of reference
  const Mby = Max;

  const Mxa = mat4.create();
  mat4.invert(Mxa, Max);

  const May = mat4.create();
  mat4.multiply(May, Mab, Mby);

  const Mxy = mat4.create();
  mat4.multiply(Mxy, Mxa, May);

  newAcr.transformMat4 = Mxy;
  newAcr.matrix3d = convertMat4ToCssMatrix3dSubstring(Mxy);
  newAcr.transform = `matrix3d(${newAcr.matrix3d})`;
  newAcr.transformOrigin = sharedTransformOrigin;
  return newAcr;
}

function getBorderMeasurement(
  subject: HTMLElement | Measurement,
  target: HTMLElement,
  options?: ProjectionOptions,
): BorderMeasurement {
  const borderSrc = options?.useBorder ?? DEFAULT_BORDER_SOURCE;

  if (borderSrc === 'zero') {
    return {
      style: '',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      radius: '0px 0px 0px 0px',
    };
  }

  if (borderSrc === 'subject' && isMeasurement(subject)) {
    return subject.border;
  }

  const borderSrcEl = borderSrc === 'subject' ? subject : target;
  return measureElementBorder(borderSrcEl as HTMLElement);
}

function measureElementBorder(element: HTMLElement): BorderMeasurement {
  const computedStyle = getComputedStyle(element);
  const radiusTopLeft = parseFloat(computedStyle.getPropertyValue('border-top-left-radius'));
  const radiusTopRight = parseFloat(computedStyle.getPropertyValue('border-top-right-radius'));
  const radiusBottomRight = parseFloat(
    computedStyle.getPropertyValue('border-bottom-right-radius'),
  );
  const radiusBottomLeft = parseFloat(computedStyle.getPropertyValue('border-bottom-left-radius'));

  return {
    style: computedStyle.getPropertyValue('border-style'),
    top: parseFloat(computedStyle.getPropertyValue('border-top-width')),
    right: parseFloat(computedStyle.getPropertyValue('border-right-width')),
    bottom: parseFloat(computedStyle.getPropertyValue('border-bottom-width')),
    left: parseFloat(computedStyle.getPropertyValue('border-left-width')),
    radius: `${radiusTopLeft}px ${radiusTopRight}px ${radiusBottomRight}px ${radiusBottomLeft}px`,
  };
}

function getProjectionToTargetOrigin(
  target: HTMLElement,
  acr: ActualClientRect,
  sharedTransformOrigin: string,
  options?: ProjectionOptions,
): Projection {
  const border = measureElementBorder(target);
  const width = acr.basis.width - border.left - border.right;
  const height = acr.basis.height - border.top - border.bottom;

  const transformMat4 = getElementTransformMat4(target);

  return {
    width: `${width}px`,
    height: `${height}px`,
    borderStyle: border.style,
    borderWidth: `${border.top}px ${border.right}px ${border.bottom}px ${border.left}px`,
    borderRadius: border.radius,
    transformOrigin: sharedTransformOrigin,
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

function isMeasurement(subject: HTMLElement | Measurement): subject is Measurement {
  return 'acr' in subject;
}

function propKeyToPropName(key: string): string {
  const frags = key.match(/[A-Z]*[a-z]+/g);
  if (!frags) return key;
  return frags?.join('-');
}
