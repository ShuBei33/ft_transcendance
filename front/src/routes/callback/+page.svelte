<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { token, ui, user } from "$lib/stores";
  import type { CreateAxiosDefaults } from "axios";
  import { axiosInstance, axiosConfig } from "$lib/stores/api";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import type { UserExtended } from "$lib/models/prismaSchema";

  onMount(async () => {
    if (!browser) return;
    const retrievedToken = $page.url.searchParams.get("token");
    const redirect = $page.url.searchParams.get("redirect");

    if (!retrievedToken) goto("/login");

    const config: CreateAxiosDefaults = {
      baseURL: "http://localhost:5500",
      withCredentials: true,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${retrievedToken}`,
      },
    };
    axiosConfig.set(config);
    axiosInstance.subscribe((_axios) => {
      _axios
        .get("/auth/checkJWT")
        .then(async (res) => {
          token.set(retrievedToken!);
          const retrieveUserProfile = async () => {
            await _axios
              .get(`/user/${res.data.user.id}`)
              .then(({ data }) => {
                const _user: UserExtended = data.data;

                if (!_user.is2FAAuthenticated && _user.twoFA) {
                  $ui.modal = "SETTINGS";
                } else {
                  user.set(_user);
                  goto((redirect && redirect) || `/profile/${res.data.user.id}`);
                }
              })
              .catch(() => {
                goto("/login");
              });
          };
          await retrieveUserProfile();
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
