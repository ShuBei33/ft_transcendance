<script lang="ts">
  import type { PageData } from "../$types";
  // import { readonlyAxiosInstance } from "$lib/stores";
  import { axiosConfig } from "$lib/stores/api";
  import { onMount } from "svelte";
  export let data;
  const { id } = data;
  let config = undefined;
  axiosConfig.subscribe((value) => {
    console.log(value);
  });
  // $: console.log(config);
  onMount(() => {
    // readonlyAxiosInstance.subscribe((_axios) => {
    //   _axios.get("/user/1");
    // });
  });
  // $: console.log("res", res);
</script>

<main>
  <h1>Profile page {id}</h1>
</main>

<style lang="text/scss"></style>
