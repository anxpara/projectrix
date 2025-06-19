import { areDeepEqual } from './areDeepEqual';
import type { Store } from './Store';

export type AreSnapshotsEqual<Value> = (
  newValue: $state.Snapshot<Value>,
  oldValue: $state.Snapshot<Value>,
) => boolean;

export function onStoreChange<Value>(
  getStore: () => Store<Value>,
  onChange: (newValue: Value, oldValue: Value) => void,
  areValueSnapshotsEqual: AreSnapshotsEqual<Value> = areDeepEqual,
): void {
  let previousSnapshot = $state.snapshot(getStore());
  $effect(() => {
    const currentSnapshot = $state.snapshot(getStore());
    if (!areValueSnapshotsEqual(currentSnapshot.value, previousSnapshot.value)) {
      onChange(currentSnapshot.value as Value, previousSnapshot.value as Value);
    }
    previousSnapshot = currentSnapshot;
  });
}
