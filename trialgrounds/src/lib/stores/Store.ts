export type Store<Value> = {
  value: Value;
};

export function store<Value>(): Store<Value | undefined>;
export function store<Value>(value: Value): Store<Value>;
export function store<Value>(value?: Value): Store<Value | undefined> {
  return { value };
}
