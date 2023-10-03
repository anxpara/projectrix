export type Projectrix = {
  fontSize?: string;
  position?: string;
  width?: string;
  height?: string;
  matrix3d?: string;
  transform?: string;
};

export type ProjectrixOptions = {
  destinationElement?: HTMLElement;
  useTransform?: boolean;
};

/**
 * projectrix() returns the projection of sourceElement ("SRC-E") onto destinationContainer ("DST-C")
 * in the form of a Projectrix object, which contains the fontSize, position, width, height, and
 * either matrix3d or transform needed to make any absolute (0, 0) destinationElement ("DST-E")
 * in DST-C perfectly align with SRC-E
 *
 * options.destinationElement allows projectrix to work with an existing DST-E's position, instead of
 * assuming an absolute position. projectrix will not modify the DST-E.
 *
 * options.useTransform requests that the matrix3d value be returned via 'transform: matrix3d()' instead,
 * in case you're working with an animation library that doesn't use matrix3d (e.g. Motion One)
 *
 * ---
 *
 * What is "DOM Projection?" imagine if the source element were actually in the destination
 * container, but looked exactly the same--such that both were visually aligned--this imaginary element
 * DST-E is the projection of SRC-E onto DST-C. The information needed to align a DST-E to a SRC-E is
 * defined by a Projectrix object.
 *
 * This projection can be used as a building block for complex animations. For example, projectrix() is
 * a direct replacement for the naive usage of getBoundingClientRect() by many FLIP implementations,
 * since a bounding rectangle, by definition, cannot be in perfect alignment with a SRC-E.
 */
export function projectrix(
  sourceElement: HTMLElement,
  destinationContainer: HTMLElement,
  options?: ProjectrixOptions
): Projectrix {
  throw new Error("projectrix not implemented yet");
}
