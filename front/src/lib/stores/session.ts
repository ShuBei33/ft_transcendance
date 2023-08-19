import { readable, writable } from "svelte/store";
import { writableHook } from "./hooks";
import Cookies from "js-cookie";

export const COOKIE_TOKEN_NAME = "tr_auth_token";
const TOKEN_EXPIRATION = 7;

export const token = writableHook<string>({
  initialValue: "",
  onSet(value) {
    Cookies.set(COOKIE_TOKEN_NAME, value, { expires: TOKEN_EXPIRATION });
  },
  onUpdate(value) {
    Cookies.set(COOKIE_TOKEN_NAME, value, { expires: TOKEN_EXPIRATION });
  },
  onClear() {
    Cookies.remove(COOKIE_TOKEN_NAME);
  },
});
