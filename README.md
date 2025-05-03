<!-- prettier-ignore-start -->

<div align="center">
    <img width="300px" src="https://raw.githubusercontent.com/anxpara/projectrix/main/assets/logo/projectrix-logo-temp.png"/>
    <h1>Projectrix</h1>
    <h3 align="center">minimalist dom projection library in js/ts | alpha</h3>
</div>

```bash
$ npm install projectrix --save
```

###### Dom Projection (noun): The calculation of an element's position, size, and transform on a web page in relation to an element elsewhere in the DOM hierarchy.
###### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Projection (noun): The set of styles that will make a target element align with a subject. "Animate the target to the subject's projection."

# Summary

Dom projection has many uses, such as view transitions, FLIP animations, css puzzle games, and art. However, implementations of this tricky math technique are usually hidden behind apis that prescribe a specific use-case or technology.

Projectrix provides **getProjection()**, which returns the styles needed to align a target element with a subject, as well as the styles needed to align it with its original state. Use the projected styles however you want; if animation is your goal, the projections can be spread directly into Anime.js, Motion, or your preferred animation engine.

Also provided...
* **measureSubject()**: calculates a subject's position in case the subject and target cannot coexist (e.g. a FLIP animation where the subject is the target's past)
* **setInlineStyles()**: sets a target to match a projection
* **clearInlineStyles()**: clears the projection styles from setInlineStyles

# Usage examples
###### See all demos here: https://tg.projectrix.dev/demos
## Animate target directly to subject using Anime.js

```ts
import { getProjection, type PartialProjectionResults } from 'projectrix';
import { animate } from 'animejs';

function animateTargetToSubject(target: HTMLElement, subject: HTMLElement): void {
  const { toSubject } = getProjection(subject, target) as PartialProjectionResults;
  delete toSubject.borderStyle; // preserve target's border style

  animate(target, {
    ...toSubject,

    duration: 400,
    ease: 'outQuad',
  });
}
```

https://github.com/anxpara/projectrix/assets/90604943/37132aed-57eb-43ee-8bec-18fcb1a9d0f7

## FLIP target between parents using Anime.js

```ts
// don't combine projectrix's setInlineStyles with animejs' animate; use utils.set
import { measureSubject, getProjection, clearInlineStyles } from 'projectrix';
import { animate, utils } from 'animejs';

// the F.L.I.P. technique inverts a direct animation: measure the element's first position,
// apply a dom change to it, then play the animation from its first position to its last
function flipTargetToNextParent(target: HTMLElement, nextParent: HTMLElement): void {
  const firstPosition = measureSubject(target);

  nextParent.append(target);

  // RAF waits for pending dom changes to be rendered
  requestAnimationFrame(() => {
    // set target to the projection of its first position
    const { toSubject, toTargetOrigin } = getProjection(firstPosition, target);
    utils.set(target, toSubject);

    // animate target to its last position, i.e. its current origin
    animate(target, {
      ...toTargetOrigin,
      
      duration: 1000,
      ease: 'outQuad',

      // clear inline styles from the projection once they're redundant
      onComplete: () => clearInlineStyles(target),
    });
  });
}
```

https://github.com/anxpara/projectrix/assets/90604943/ccbe959b-1fe4-43bd-b4fd-8b24cc55b0d4

# API / Types / Documentation

#### Projection
```ts
export type Projection = {
  width: string;           // 'Wpx'
  height: string;          // 'Hpx'
  borderStyle: string;     // '' | 'none' | 'solid' | 'dashed' | etc.
  borderWidth: string;     // 'Tpx Rpx Bpx Lpx'
  borderRadius: string;    // 'TLpx TRpx BRpx BLpx'
  transformOrigin: string; // 'X% Y% Zpx'

  /**
   * contains exactly one of the following members, depending on the given transformType option:
   * @member transform: string;   // (default) `matrix3d(${matrix3d})`
   * @member matrix3d: string;
   * @member transformMat4: mat4; // row-major array from gl-matrix
   */
  [TransformType: string]: string | mat4 | any; // any is only necessary to allow spreading into anime.js, motion one, etc.
};
export type PartialProjection = Partial<Projection>;
```
#### getProjection(), ProjectionOptions, ProjectionResults
```ts
export function getProjection(
  subject: HTMLElement | Measurement, // the element or measurement that you plan to align the target to
  target: HTMLElement,                // the element that you plan to modify
  options?: ProjectionOptions,
): ProjectionResults;

export type TransformType = 'transform' | 'matrix3d' | 'transformMat4';
export type BorderSource = 'subject' | 'target' | 'zero';

export type ProjectionOptions = {
  transformType?: TransformType; // (default = 'transform')

  // designates which element's border width, radius, and style to match.
  // projected width and height are auto-adjusted if the target has content-box sizing.
  // zero means override with 0px border width and radius
  useBorder?: BorderSource; // (default = 'subject')

  log?: boolean; // (default = false)
};

/**
 * when a subject is projected onto a target, you get two Projections. 'toSubject' contains the set of styles that--when applied
 * to the target element--will make the target align with the subject. the styles in 'toTargetOrigin' will make
 * the target align with its original state
 */
export type ProjectionResults = {
  toSubject: Projection;
  toTargetOrigin: Projection;
  transformType: TransformType; // the type of transform that both projections contain
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
```
#### measureSubject(), Measurement
```ts
/**
 * measures a subject for future projections. useful if the subject and target cannot coexist,
 * such as a flip animation where the subject is the target's past
 */
export function measureSubject(subject: HTMLElement): Measurement;

export type Measurement = {
  acr: ActualClientRect; // from https://github.com/anxpara/getActualClientRect
  border: BorderMeasurement;
};
export type BorderMeasurement = { /* style, top, right, bottom, left, and radius properties */ };
```
#### setInlineStyles(), clearInlineStyles()
```ts
/**
 * sets the inline style on the target for each style in the given partial projection.
 * converts any matrix3d or transformMat4 value to a transform style
 */
export function setInlineStyles(target: HTMLElement, partialProjection: PartialProjection): void;

/**
 * clears the inline style on the target for each style in the given partial projection.
 * if no partial projection is given, assumes target's inline styles were set to a full projection.
 * if the projection contains matrix3d or transformMat4, then the transform style is cleared
 */
export function clearInlineStyles(target: HTMLElement, partialProjection?: PartialProjection): void;
```

## Limitations

- Projectrix will not attempt to match, emulate, or mitigate bugs in rendering engines
  - [Stackoverflow: -webkit-transform-style: preserve-3d not working](https://stackoverflow.com/questions/11664255/webkit-transform-style-preserve-3d-not-working)
  - some engines don't follow the [preserve-3d _used_ value specs](https://www.w3.org/TR/css-transforms-2/#grouping-property-values), and still use preserve-3d even when combined with certain grouping properties:
    - Chrome v123 / Blink -- contain: strict | content | paint, content-visibility: auto
    - Firefox v124 / Gecko -- will-change: filter
    - Safari v17.4 / Webkit -- will-change: filter | opacity
    - (Properties not yet supported by particular browsers omitted from their respective lists)
- Projectrix is not an animation engine, and will not attempt to mitigate bugs in animation engines
  - https://github.com/motiondivision/motionone/issues/249
  - some engines might animate perspective incorrectly in particular scenarios
- Targeting an element with an ["internal" display value](https://developer.mozilla.org/en-US/docs/Web/CSS/display#internal), or any value that causes the element to control its own size, will lead to undefined behavior, since the projected width and height will be ignored:
  - display: inline | table | inline-table | table-row | table-column | table-cell | table-row-group | table-column-group | table-header-group | table-footer-group | ruby-base | ruby-text | ruby-base-container | ruby-text-container | run-in
- Performance (e.g. as dom depth increases) has not yet been optimized; will focus on that next, but probably not very soon
- SVGs are not yet officially supported, but might happen to work in certain scenarios

# Contribute

All contributions are greatly appreciated!

- If you find a bug, please [file an issue](https://github.com/anxpara/projectrix/issues)
- Feedback and help requests can be posted in the [Projectrix Discord](https://discord.gg/YxVAUFqW4e)

<3 anxpara

<!-- prettier-ignore-end -->
