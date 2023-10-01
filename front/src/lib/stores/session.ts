import { readable, writable } from "svelte/store";
import { writableHook } from "./hooks";
import Cookies from "js-cookie";
import type { ComponentProps } from "svelte";
import type Input from "../../components/Input.svelte";

export const COOKIE_TOKEN_NAME = "tr_auth_token";
const TOKEN_EXPIRATION = 7;

export const token = writableHook<string>({
  initialValue: "",
  onSet(value) {
    Cookies.set(COOKIE_TOKEN_NAME, value, { expires: TOKEN_EXPIRATION });
  },
  onUpdate(_, newValue) {
    Cookies.set(COOKIE_TOKEN_NAME, newValue, { expires: TOKEN_EXPIRATION });
  },
  onClear() {
    Cookies.remove(COOKIE_TOKEN_NAME);
  },
});

export type confirmBtn = {
  label: string;
  callback: (id: number) => void;
};

export type confirm = {
  yes: confirmBtn;
  no: confirmBtn;
  isInput?: ComponentProps<Input>;
};

export interface announcement {
  id: number;
  message: string;
  level: "error" | "success";
  confirm?: confirm;
  persist?: boolean;
}

export const announcements = writableHook<announcement[]>({
  initialValue: [],
});

export const removeAnnouncement = (id: number) => {
  announcements.update((arr) => arr.filter((value) => value.id != id));
};

export const addAnnouncement = (data: Omit<announcement, "id">) => {
  let timeOutId = -1;
  announcements.update((arr) => {
    const id = arr.length;
    timeOutId = Number(
      setTimeout(() => {
        removeAnnouncement(id);
      }, 3000)
    );
    return [...arr, { id, ...data }];
  });
  return timeOutId;
};

export const initialSocketState = new Map<string, boolean>([
  ["chat", false],
  ["lobby", false],
]);

export const socketState = writable<Map<string, boolean>>(initialSocketState);

export const gameInvite = writable<string | undefined>(undefined);

export const acceptGameInvite = writable<number | undefined>(undefined);
