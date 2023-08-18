import type { User } from "$lib/models/prismaSchema";
import { writable, type Writable } from "svelte/store";

export const user = writable<User | undefined>(undefined);
