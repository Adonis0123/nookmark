import { useEffect, useState } from 'react';

export type WatchableStorageItem<T> = {
  fallback: T;
  getValue: () => Promise<T>;
  watch: (cb: (newValue: T) => void) => () => void;
};

export function useStorageItem<T>(item: WatchableStorageItem<T>): T {
  const [value, setValue] = useState<T>(item.fallback);

  useEffect(() => {
    let active = true;
    void item.getValue().then((next) => {
      if (active) setValue(next);
    });
    const unwatch = item.watch((next) => {
      if (active) setValue(next);
    });
    return () => {
      active = false;
      unwatch();
    };
  }, [item]);

  return value;
}
