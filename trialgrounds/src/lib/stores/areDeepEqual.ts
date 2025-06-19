function isObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object';
}

export function areDeepEqual(obj1: any, obj2: any): boolean {
  if (!isObject(obj1) && !isObject(obj2)) return Object.is(obj1, obj2);
  if (isObject(obj1) !== isObject(obj2)) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!areDeepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
}
