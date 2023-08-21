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

export async function load({ params }) {
  const config = get(axiosConfig);
  const api = get(axiosInstance);
  if (!config) return {};

  const user: User = await api
    .get(`user/${params.id}`)
    .then((res) => res.data.data)
    .catch(() => {
      browser && goto("/404");
    });
  return {
    id: "test",
    user,
  };
}
