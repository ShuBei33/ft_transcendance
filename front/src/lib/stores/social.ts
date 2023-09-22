import type { User } from "$lib/models/prismaSchema";
import { writableHook } from "./hooks";

const friends = writableHook<User[]>({
  initialValue: [],
});
