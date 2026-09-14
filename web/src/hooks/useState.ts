let state: unknown;
let hasState = false;

export function useState<T>(
  initial: T,
  rerender: () => void,
): [T, (value: T) => void] {
  if (!hasState) {
    state = initial;
    hasState = true;
  }
  const setState = (value: T) => {
    state = value;
    rerender();
  };
  return [state as T, setState];
}
