<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { token, user } from "$lib/stores";
  import type { CreateAxiosDefaults } from "axios";
  import { axiosInstance, axiosConfig } from "$lib/stores/api";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";

  onMount(async () => {
    if (!browser) return;
    const retrivedToken = $page.url.searchParams.get("token");
    const redirect = $page.url.searchParams.get("redirect");

    if (!retrivedToken) goto("/login");

    const config: CreateAxiosDefaults = {
      baseURL: "http://localhost:5500",
      withCredentials: true,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${retrivedToken}`,
      },
    };
    axiosConfig.set(config);
    axiosInstance.subscribe((_axios) => {
      // console.log("!toke for callback", retrivedToken);
      _axios
        .get("/auth/checkJWT")
        .then((res) => {
          user.set(res.data.user);
          token.set(retrivedToken!);
          goto((redirect && redirect) || `/profile/${res.data.user.id}`);
        })
        .catch(() => {
          goto("/login");
        });
    });
  });
</script>

<main>
  <h1>callback page after 42 login</h1>
</main>

<style lang="text/scss"></style>
