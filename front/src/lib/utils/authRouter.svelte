<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { token, user, axiosConfig } from "$lib/stores";
  import Cookies from "js-cookie";
  import { COOKIE_TOKEN_NAME } from "$lib/stores/session";
  import RetrieveUserData from "./retrieveUserData.svelte";
  import Notifications from "./notifications.svelte";
  import SimpleModal from "../../components/modal/simpleModal.svelte";
  import Editchan from "../../components/modal/editchan.svelte";
  import { ui } from "$lib/stores";
  import Createchan from "../../components/modal/createchan.svelte";
  import TabModal from "../../components/modal/tabModal.svelte";
  import Members from "../../components/modal/members.svelte";
  import Join from "../../components/modal/join.svelte";
  import Security from "../../components/modal/Security.svelte";

  let allowSlot = false;

  /**
   * This script manages page navigation and slot permission based on user authentication
   * and the current page in the SvelteKit application. It checks authentication status,
   * retrieves tokens from cookies, and redirects users as necessary, setting slot permissions
   * accordingly.
   */

  $: currentPage = $page.url.pathname.split("/")[1];
  const monitorPage = (page: string) => {
    if (!browser) return;

    let isAuthenticated = $token.length && $user && $axiosConfig;

    const retrivedToken = Cookies.get(COOKIE_TOKEN_NAME);
    switch (page) {
      case "login":
        if (isAuthenticated) {
          goto(`/profile/${$user?.id}`);
        } else if (retrivedToken) {
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
          if (retrivedToken) {
            goto(`/callback?token=${retrivedToken}&redirect=${$page.url.pathname}`)
              .then(() => (allowSlot = true))
              .catch(() => (allowSlot = false));
          } else
            goto("/login")
              .then(() => (allowSlot = true))
              .catch(() => (allowSlot = false));
        } else {
          if ($user && $user.twoFA && !$user.is2FAAuthenticated)
            goto(`/twoFA?token=${retrivedToken}`)
              .then(() => (allowSlot = true))
              .catch(() => (allowSlot = false));
          allowSlot = true;
        }
    }
  };
  $: monitorPage(currentPage);

  $: getModalTitle = () => {
    switch ($ui.modal) {
      case "BROWSECHAN":
        return "Join a channel";
      case "EDITCHAN":
        return "Edit channel";
      case "CREATECHAN":
        return "Create a channel";
      default:
        return "";
    }
  };
</script>

{#if $ui.modal == "CREATECHAN"}
  <SimpleModal title={"Create a channel"} isOpen={true}>
    <svelte:component this={Createchan} />
  </SimpleModal>
{:else if $ui.modal == "EDITCHAN"}
  <SimpleModal raw title={""} isOpen={true}>
    <svelte:component
      this={TabModal}
      tabs={[
        {
          title: "Edit",
          component: Editchan,
        },
        {
          title: "Members",
          component: Members,
        },
      ]}
    />
  </SimpleModal>
{:else if $ui.modal == "BROWSECHAN"}
  <SimpleModal raw title={""} isOpen={true}>
    <svelte:component
      this={TabModal}
      tabs={[
        {
          title: "Create",
          component: Createchan,
        },
        {
          title: "Join",
          component: Join,
        },
      ]}
    />
  </SimpleModal>
{:else if $ui.modal == "SETTINGS"}
  <SimpleModal raw title={""} isOpen={true}>
    <svelte:component
      this={TabModal}
      tabs={[
        {
          title: "Security",
          component: Security,
        },
      ]}
    />
  </SimpleModal>
{/if}
<main>
  <Notifications />
  <div class="app-container">
    {#if allowSlot}
      {#if $user && $axiosConfig}
        <RetrieveUserData />
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
    padding: 1em;
  }
  /* your styles go here */
</style>
