<script lang="ts">
  import type { User } from "$lib/models/prismaSchema";
  import { onMount } from "svelte";
  import { axiosInstance } from "$lib/stores";
  import { browser } from "$app/environment";
  import { UserStatus } from "$lib/models/prismaSchema";
  import axios from "axios";
  export let userId: string = "";
  export let width = "10em";
  export let height = "10em";
  export let status:
    | { state: UserStatus; width: string; height: string }
    | undefined = {
    state: UserStatus.OFFLINE,
    height: "2em",
    width: "2em",
  };

  let url = `http://localhost:5170/avatar/download/${userId}`;
  let imageIsValid = false;
  onMount(async () => {
    await $axiosInstance
      .get(url)
      .then((data) => {
        if (data.data) imageIsValid = true;
      })
      .catch((e) => {});
  });
</script>

{#if imageIsValid}
  <div class="avatar-frame">
    {#if false}
      <div
        style={`width: ${status.width}; height: ${status.height}`}
        class="user-status-indicator"
      />
    {/if}
    <img
      style={`width: ${width}; height: ${height}`}
      src={url}
      alt="user avatar"
    />
  </div>
{/if}

<style lang="scss">
  .user-status-indicator {
    background-color: green;
  }
  .avatar-frame {
    width: auto;
  }
</style>
