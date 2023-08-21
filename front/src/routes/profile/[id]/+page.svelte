<script lang="ts">
  import type { PageData } from "../$types";
  import { axiosConfig, axiosInstance } from "$lib/stores/api";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import axios from "axios";
  export let data;
  console.log("profile");
  // onMount(async () => {
  //   const config = get(axiosConfig);
  //   console.log(config);
  //   const test = axios.create(config);
  //   const user = await get(axiosInstance).get(`/user/${id}`).then((res) => res.data);
  //   console.log(user);
  // });

  const { id, user } = data;
</script>

<main>
  {#if user}
    <h1>Profile page {user?.pseudo}</h1>
  {:else}
    <h1>{`User not found`}</h1>
  {/if}
</main>

<style lang="text/scss"></style>
