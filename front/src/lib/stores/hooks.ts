// writableHook.ts
import { writable, type Writable } from "svelte/store";

type OnSetCallback<T> = (value: T) => void;
type OnUpdateCallback<T> = (previousValue: T, newValue: T) => void;
type OnClearCallback = () => void;

export interface WritableHookOptions<T> {
  initialValue: T;
  onSet?: OnSetCallback<T>;
  onUpdate?: OnUpdateCallback<T>;
  onClear?: OnClearCallback;
}

export type WritableHook<T> = Writable<T> & {
  clear: OnClearCallback;
};

/**
 * Creates a custom Svelte writable store with optional callback hooks for store actions.
 *
 * @template T - The type of value stored in the writable store.
 * @param {WritableHookOptions<T>} options - Configuration options for the writable store.
 * @returns {WritableHook<T>} - Custom writable store with added callback capabilities.
 */

export function writableHook<T>({
  initialValue,
  onSet,
  onUpdate,
  onClear,
}: WritableHookOptions<T>): WritableHook<T> {
  const { subscribe, set, update } = writable<T>(initialValue);

  const customSet = (value: T) => {
    if (onSet) {
      onSet(value);
    }
    set(value);
  };

  const customUpdate = (updater: (value: T) => T) => {
    update((currentValue) => {
      const updatedValue = updater(currentValue);
      if (onUpdate) {
        // currentValue is previousValue in this context
        onUpdate(currentValue, updatedValue);
      }
      return updatedValue;
    });
  };

  const customClear = () => {
    if (onClear) {
      onClear();
    }
    set(undefined as any);
  };

  return {
    subscribe,
    set: customSet,
    update: customUpdate,
    clear: customClear,
  };
}
