<!-- prettier-ignore-start -->

<div align="center">
    <img width="300px" src="https://raw.githubusercontent.com/anxpara/projectrix/main/assets/logo/projectrix-logo-temp.png?token=GHSAT0AAAAAACLAVS4PT3YKMJNN3RVVPUGEZPFWKHQ"/>
    <h1>Projectrix</h1>
    <h3 align="center">minimalist dom projection library in js/ts | v0.1.0 alpha</h3>
</div>

```bash
$ npm install projectrix --save
```
###### Dom Projection (noun): The calculation of an element's position, size, and shape on a web page in relation to an element elsewhere in the DOM hierarchy.
###### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Projection (noun): The set of styles that will make a target element align with a subject. "Animate the target to the projection of the subject onto the target."

# Summary

Dom projection has many uses, such as view transitions, FLIP animations, UI walkthroughs, css-oriented puzzle games, and art. However, the best implementations of this tricky math technique are hidden behind apis that are specific to a given use-case, or technology.

Projectrix provides a pure function that returns the styles needed to align a target element to a subject, as well as the styles needed to align it to its original state. Use the projected styles however you want; if animation is your goal, the projection can be spread directly into Anime.js, Motion One, or your preferred animation engine.

# Usage

## Animating from subject to target with FLIP technique using Motion One

```ts
import { getProjection } from 'projectrix';
import { animate } from 'motion';

const { toSubject, toTargetOrigin } = getProjection(subject, target);

// set to subject
animate(target, { ...toSubject }, { duration: 0 });

// FLIP back to origin
const flipAnimation = animate(
  target,
  {
    ...toTargetOrigin,
  },
  {
    duration: 1,
    easing: 'ease-out',
  },
);

// clear inline styles when FLIP is done, if you care to
flipAnimation.finished.then(() => {
  target.style.transform = '';
  // etc...
});
```

## Animating target directly to subject using Motion One

```ts
import { getProjection } from 'projectrix';
import { animate, type AnimationControls } from 'motion';

let currentAnim: AnimationControls | undefined;

function animateDirect(subject: HTMLElement, target: HTMLElement): void {
  // stop current animation; motion one will update target's inline styles to mid-animation values
  if (currentAnim?.currentTime && currentAnim.currentTime < 1) {
    currentAnim.stop();
  }

  currentAnim = animate(
    target,
    {
      // preserve all of target's border properties
      ...getProjection(subject, target, { useBorder: 'target' }).toSubject,

      // could preserve just the border style like so
      // borderStyle: 'solid'
    },
    {
      duration: 0.4,
      easing: 'ease-out',
    },
  );
}
```
###### (This usage was originally written with Anime.js v3, but v3 has bugs when animating between different shorthands. Will update to Anime.js v4 when it's released, shoutout to the [early access beta](https://github.com/sponsors/juliangarnier))

## Matching target to subject by directly setting inline styles

```ts
  import { getProjection } from 'projectrix';

  const { toSubject } = getProjection(subjectElement, targetElement);

  targetElement.style.width = toSubject.width;
  targetElement.style.height = toSubject.height;
  targetElement.style.borderStyle = toSubject.borderStyle;
  targetElement.style.borderWidth = toSubject.borderWidth;
  targetElement.style.borderRadius = toSubject.borderRadius;
  targetElement.style.transformOrigin = toSubject.transformOrigin;
  targetElement.style.transform = toSubject.transform;
```

# Types & Documentation

```ts
export function getProjection(
  subject: HTMLElement, // the element that you plan to align the target to
  target: HTMLElement, // the element that you plan to modify
  options?: ProjectionOptions,
): ProjectionResults;

export type TransformType = 'transform' | 'matrix3d' | 'transformMat4';
export type BorderSource = 'subject' | 'target' | 'zero';

export type ProjectionOptions = {
  // (default = transform)
  transformType?: TransformType;

  // (default = subject), designates which element's border style, width, and radius to match.
  // projected width and height are auto-adjusted. zero means 0px border width. 
  useBorder?: BorderSource; 
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
  subject: HTMLElement;
  target: HTMLElement;
};

export type Projection = {
  width: string; // 'Wpx'
  height: string; // 'Hpx'
  borderStyle: string; // '' | 'none' | 'solid' | 'dashed' | etc.
  borderWidth: string; // 'Tpx Rpx Bpx Lpx'
  borderRadius: string; // 'TLpx TRpx BRpx BLpx'
  transformOrigin: string; // 'X% Y% Zpx'

  [TransformType: string]: string | mat4 | any; // any is only necessary to allow spreading into anime.js, motion one, etc.
  /**
   * contains exactly one of the following members, depending on the given transformType option:
   * @member transform: string; // `matrix3d(${matrix3d})`
   * @member matrix3d: string;
   * @member transformMat4: mat4; // row-major array from gl-matrix
   */
};
```

## Limitations

- Projectrix will not attempt to match or emulate bugs in rendering engines
- preserve3d property is probably not yet supported
- perspective properties are not yet supported
- fixed elements within a **non-viewport** containing block are not yet supported (i.e. a fixed element's ancestor has a transform, perspective, or filter)

# Contribute

All contributions are greatly appreciated!

- Feedback & feature requests can be posted to the [Projectrix Discord](https://discord.gg/YxVAUFqW4e)
- If you find a bug, please [file an issue](https://github.com/anxpara/projectrix/issues)
- [Join my Patreon](https://www.patreon.com/anxpara)


<3 anxpara

<!-- prettier-ignore-end -->
