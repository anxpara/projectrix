<!-- prettier-ignore-start -->

<div align="center">
    <img width="300px" src="https://raw.githubusercontent.com/anxpara/projectrix/main/assets/logo/projectrix-logo-temp.png?token=GHSAT0AAAAAACLAVS4PT3YKMJNN3RVVPUGEZPFWKHQ"/>
    <h1>Projectrix</h1>
    <h3 align="center">minimalist dom projection library in js/ts | alpha</h3>
</div>

```bash
$ npm install projectrix --save
```
###### Dom Projection (noun): The calculation of an element's position, size, and shape on a web page in relation to an element elsewhere in the DOM hierarchy.
###### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Projection (noun): The set of styles that will make a target element align with a subject. "Animate the target to the projection of the subject onto the target."

# Summary

Dom projection has many uses, such as view transitions, FLIP animations, UI walkthroughs, css-oriented puzzle games, and art. However, implementations of this tricky math technique are usually hidden behind apis that prescribe a specific use-case or technology.

Projectrix provides **getProjection()**, a pure function that returns the styles needed to align a target element to a subject, as well as the styles needed to align it to its original state. Use the projected styles however you want; if animation is your goal, the projection can be spread directly into Anime.js, Motion One, or your preferred animation engine.

Also provided: 
* **measureSubject()**, a pure function that records a subject's position and shape in case the subject and target cannot coexist (e.g. a FLIP animation where the subject is the target's past)
* **setInlineStyles()**, a convenient function that sets a target to match a projection
* **clearInlineStyles()**, a function that clears the styles from setInlineStyles

# Usage examples
###### See all demos here: https://tg.projectrix.dev/demos
## FLIP target between parents using Motion One

```ts
import { getProjection, measureSubject, setInlineStyles, clearInlineStyles } from 'projectrix';
import { animate } from 'motion';

function flip(target: HTMLElement, nextParent: HTMLElement): void {
  const subject = measureSubject(target);

  nextParent.append(target);

  requestAnimationFrame(() => {
    const { toSubject, toTargetOrigin } = getProjection(subject, target);

    // set target to subject's projection
    setInlineStyles(target, toSubject);

    // FLIP back to origin
    const flipAnimation = animate(
      target,
      { ...toTargetOrigin },
      {
        duration: 1,
        easing: 'ease-out',
      },
    );

    // clear inline styles once they're redundant
    flipAnimation.finished.then(() => clearInlineStyles(target, toTargetOrigin));
  });
}
```

https://github.com/anxpara/projectrix/assets/90604943/ccbe959b-1fe4-43bd-b4fd-8b24cc55b0d4

## Animate target directly to subject using Motion One

```ts
import { getProjection, type PartialProjection } from 'projectrix';
import { animate, type AnimationControls } from 'motion';

let currentAnim: AnimationControls | undefined;

function animateDirect(subject: HTMLElement, target: HTMLElement): void {
  // stop current animation; motion one will update target's inline
  // styles to mid-animation values
  if (currentAnim?.currentTime && currentAnim.currentTime < 1) {
    currentAnim.stop();
  }

  const toSubject = getProjection(subject, target).toSubject as PartialProjection;
  delete toSubject.borderStyle; // preserve target border style

  currentAnim = animate(
    target,
    { ...toSubject },
    {
      duration: 0.4,
      easing: 'ease-out',
    },
  );
}
```

https://github.com/anxpara/projectrix/assets/90604943/37132aed-57eb-43ee-8bec-18fcb1a9d0f7

## Match target to subject

```ts
import { getProjection, setInlineStyles, type PartialProjectionResults } from 'projectrix';

function match(subject: HTMLElement, target: HTMLElement): void {
  const { toSubject } = getProjection(subject, target) as PartialProjectionResults;
  delete toSubject.borderStyle; // preserve target border style
  
  setInlineStyles(target, toSubject);
}
```

https://github.com/anxpara/projectrix/assets/90604943/36f594b9-303e-4fae-ba5c-84ed3a6b3290

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
  // projected width and height are auto-adjusted. zero means 0px border width and radius. 
  useBorder?: BorderSource; // (default = 'subject')

  log?: boolean; // (default = false)
};

/**
 * when a subject is projected onto a target, you get two Projections. 'toSubject' contains the set of styles that--when applied
 * to the target element--will make the target visually align to the subject. the styles in 'toTargetOrigin' will make
 * the target align to its original state
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
  acr: ActualClientRect; // from getActualClientRect
  border: BorderMeasurement;
};
export type BorderMeasurement = { /* style, top, right, bottom, left, radius */ };
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
- performance has not yet been profiled
- SVGs are not yet officially supported, but might happen to work in certain scenarios

# Contribute

All contributions are greatly appreciated!

- Feedback, feature requests, and help requests can be posted to the [Projectrix Discord](https://discord.gg/YxVAUFqW4e)
- If you find a bug, please [file an issue](https://github.com/anxpara/projectrix/issues)
- [Join my Patreon](https://www.patreon.com/anxpara)


<3 anxpara

<!-- prettier-ignore-end -->
