import type { User, UserExtended } from "$lib/models/prismaSchema";
import { writable, type Writable } from "svelte/store";

export const user = writable<UserExtended | undefined>(undefined);
