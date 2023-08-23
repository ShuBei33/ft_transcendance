<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { token, user, axiosConfig } from "$lib/stores";
  import Cookies from "js-cookie";
  import { COOKIE_TOKEN_NAME } from "$lib/stores/session";
  /**
   * This script manages page navigation and slot permission based on user authentication
   * and the current page in the SvelteKit application. It checks authentication status,
   * retrieves tokens from cookies, and redirects users as necessary, setting slot permissions
   * accordingly.
   */
  const currentPage = $page.url.pathname.split("/")[1];

  let isAuthenticated = $token.length && $user && $axiosConfig;
  let allowSlot = false;

  const retrivedToken = Cookies.get(COOKIE_TOKEN_NAME);
  switch (currentPage) {
    case "login":
      if (isAuthenticated) goto(`/profile/${$user?.id}`);
      else if (retrivedToken) {
        goto(`/callback?token=${retrivedToken}`)
          .then(() => (allowSlot = true))
          .catch(() => (allowSlot = false));
      } else allowSlot = true;
      break;
    case "callback":
      if (!isAuthenticated && retrivedToken)
        goto(`/callback?token=${retrivedToken}`)
          .then(() => (allowSlot = true))
          .catch(() => (allowSlot = false));
      else allowSlot = true;
      break;
    default:
      if (!isAuthenticated) {
        if (retrivedToken)
          goto(
            `/callback?token=${retrivedToken}&redirect=${$page.url.pathname}`
          )
            .then(() => (allowSlot = true))
            .catch(() => (allowSlot = false));
        else
          goto("/login")
            .then(() => (allowSlot = true))
            .catch(() => (allowSlot = false));
      } else allowSlot = true;
  }
</script>

<main>
  <div class="app-container">
    {#if allowSlot}
      {#if $user && $axiosConfig}
        <slot name="nav" />
      {/if}
      <slot />
    {:else}
      <h1>not connected</h1>
      <!-- content here -->
    {/if}
  </div>
</main>

<style lang="scss">
  .app-container {
    height: calc(100vh - 2em);
    padding: 1em;
  }
  /* your styles go here */
</style>
