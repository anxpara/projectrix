import { areDeepEqual } from './areDeepEqual';

export type AreSnapshotsEqual<Value> = (
  newValue: $state.Snapshot<Value>,
  oldValue: $state.Snapshot<Value>,
) => boolean;

export function onStateChange<Value>(
  getState: () => Value,
  onChange: (newValue: Value, oldValue: Value) => void,
  areSnapshotsEqual: AreSnapshotsEqual<Value> = areDeepEqual,
): void {
  let previousSnapshot = $state.snapshot(getState());
  $effect(() => {
    const currentSnapshot = $state.snapshot(getState());
    if (!areSnapshotsEqual(currentSnapshot, previousSnapshot)) {
      onChange(currentSnapshot as Value, previousSnapshot as Value);
    }
    previousSnapshot = currentSnapshot;
  });
}
