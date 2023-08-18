import { readable, writable } from "svelte/store";

export const token = writable<string | undefined>(undefined);
