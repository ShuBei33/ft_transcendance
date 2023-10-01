<script lang="ts">
  import { navigateToProfile } from "$lib/stores/session";
  export let userId: number;
  export let pseudo: string;
  import Input from "./Input.svelte";
  import Typography from "./Typography.svelte";
</script>

<button on:click={() => navigateToProfile(userId)}>
  <Typography class="... user-pseudo-link">{pseudo}</Typography>
</button>

<style lang="scss">
  button {
    all: unset;
    background-color: transparent;
    height: fit-content;
  }
</style>
