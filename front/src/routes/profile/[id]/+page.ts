export const ssr = false;
export const csr = true;
import { axiosInstance, axiosConfig } from "$lib/stores/api.js";
import { user } from "$lib/stores/user.js";
import Cookies from "js-cookie";
import { get } from "svelte/store";
import { COOKIE_TOKEN_NAME } from "$lib/stores/session.js";
import { onMount } from "svelte";
import axios from "axios";
import type { User } from "$lib/models/prismaSchema.js";
import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import { Game } from "$lib/apiCalls";
import type { Game as GameType } from "$lib/models/prismaSchema.js";

export async function load({ params }) {
  const config = get(axiosConfig);
  const api = get(axiosInstance);
  const _Game = new Game();
  if (!config) return {};

  const user: User = await api
    .get(`user/${params.id}`)
    .then((res) => res.data.data)
    .catch(() => {
      browser && goto("/404");
    });
  const history: GameType[] = await _Game
    .getHistory(Number(params.id))
    .then(({ data }) => data.data)
    .catch((e) => {
      return [];
    });
  return {
    id: params.id,
    user,
    history,
  };
}
