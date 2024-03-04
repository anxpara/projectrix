import { mat4, vec3 } from 'gl-matrix';

export function getRectPositionVec3(rect: DOMRect): vec3 {
  return vec3.fromValues(rect.left, rect.top, 0);
}

export function getRectCenterVec3(rect: DOMRect): vec3 {
  return vec3.fromValues(rect.width / 2, rect.height / 2, 0);
}

export function getElementTransformOriginVec3(element: HTMLElement): vec3 {
  const origin = window.getComputedStyle(element).transformOrigin;
  return convertCssTransformOriginToVec3(origin);
}

export function convertCssTransformOriginToVec3(transformOrigin: string): vec3 {
  const originValues = transformOrigin.split(' ').map((str) => Number.parseFloat(str));
  return vec3.fromValues(
    originValues[0],
    originValues[1],
    originValues.length > 2 ? originValues[2] : 0,
  );
}

// prettier-ignore
const identityTransformArray4x4 = [
  '1', '0', '0', '0',
  '0', '1', '0', '0',
  '0', '0', '1', '0',
  '0', '0', '0', '1',
] as const;

export function getElementTransformMat4(element: HTMLElement): mat4 {
  let cssTransformArray = convertCssTransformToArray(window.getComputedStyle(element).transform);

  // default to identity matrix if none
  if (!cssTransformArray) {
    const transformMat4 = mat4.create();
    mat4.identity(transformMat4);
    return transformMat4;
  }

  if (cssTransformArray.length === 6) {
    cssTransformArray = convert3x2TransformArrayTo4x4(cssTransformArray);
  }

  return convertCssTransformArrayToMat4(cssTransformArray);
}

function convertCssTransformToArray(transform: string): string[] | null {
  if (transform === 'none') return null;

  let values = transform.split('(')[1];
  values = values.split(')')[0];
  return values.split(', ');
}

function convert3x2TransformArrayTo4x4(cssTransformArray: string[]): string[] {
  const transformArray3x2 = [...cssTransformArray];
  cssTransformArray = [...identityTransformArray4x4];
  cssTransformArray[0] = transformArray3x2[0];
  cssTransformArray[1] = transformArray3x2[1];
  cssTransformArray[4] = transformArray3x2[2];
  cssTransformArray[5] = transformArray3x2[3];
  cssTransformArray[12] = transformArray3x2[4];
  cssTransformArray[13] = transformArray3x2[5];
  return cssTransformArray;
}

export function convertCssTransformArrayToMat4(cssMatrix: string[]): mat4 {
  const floats = cssMatrix.map((str) => parseFloat(str));

  // prettier-ignore
  return mat4.fromValues(
    floats[0],  floats[1],  floats[2],  floats[3],
    floats[4],  floats[5],  floats[6],  floats[7],
    floats[8],  floats[9],  floats[10], floats[11],
    floats[12], floats[13], floats[14], floats[15]
  );
}

export function convertMat4ToCssMatrix3dSubstring(mat: mat4): string {
  let str = mat4.str(mat);
  str = str.split('(')[1];
  str = str.split(')')[0];
  return str;
}
