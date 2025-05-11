import type { Readable, Writable } from 'svelte/store';
import { Event as Eventery } from 'eventery';

export interface ChangeEmittingReadable<T> extends Readable<T> {
  changes: Eventery<[newValue: T, oldValue?: T]>;
}

export interface ChangeEmittingWritable<T> extends Writable<T> {
  changes: Eventery<[newValue: T, oldValue?: T]>;
}

export type AreEqual<T> = (newValue: T, oldValue?: T) => boolean;

function addChangeEmitsToStore<T>(
  store: Readable<T> | Writable<T>,
  ignoreInitialValue = true,
  ignoreSameValue = true,
  areEqual: AreEqual<T> | undefined = undefined,
): ChangeEmittingReadable<T> | ChangeEmittingWritable<T> {
  const changes = new Eventery<[newValue: T, oldValue?: T]>();

  let init = false;
  let currentV: T | undefined = undefined;
  store.subscribe((v: T) => {
    if (ignoreInitialValue && !init) {
      currentV = v;
      init = true;
      return;
    }
    if (ignoreSameValue && (areEqual ? areEqual(v, currentV) : v === currentV)) {
      return;
    }

    changes.emit(v, currentV);

    currentV = v;
  });

  return {
    ...store,
    changes,
  };
}

export function addChangeEmitsToReadable<T>(
  store: Readable<T>,
  ignoreInitialValue = true,
  ignoreSameValue = true,
  areEqual: AreEqual<T> | undefined = undefined,
): ChangeEmittingReadable<T> {
  return addChangeEmitsToStore(
    store,
    ignoreInitialValue,
    ignoreSameValue,
    areEqual,
  ) as ChangeEmittingReadable<T>;
}

export function addChangeEmitsToWritable<T>(
  store: Writable<T>,
  ignoreInitialValue = true,
  ignoreSameValue = true,
  areEqual: AreEqual<T> | undefined = undefined,
): ChangeEmittingWritable<T> {
  return addChangeEmitsToStore(
    store,
    ignoreInitialValue,
    ignoreSameValue,
    areEqual,
  ) as ChangeEmittingWritable<T>;
}
