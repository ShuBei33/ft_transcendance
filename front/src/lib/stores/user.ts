import type { User, UserExtended } from "$lib/models/prismaSchema";
import { writable, type Writable } from "svelte/store";
import { writableHook } from "./hooks";

// export const user = writable<UserExtended | undefined>(undefined);
export const user = writableHook<UserExtended | undefined>({
  initialValue: undefined,
  onSet(value) {
    // console.log("👤", value);
  },
});
