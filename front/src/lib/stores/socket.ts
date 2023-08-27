import type { Socket } from "socket.io-client";
import { writable } from "svelte/store";
import { writableHook } from "./hooks";

export const events = writableHook<Socket | undefined>({
  initialValue: undefined,
});
