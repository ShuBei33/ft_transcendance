<script lang="ts">
  import { data } from "$lib/stores/data";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  onMount(() => {
    console.log("ttttttttttttttttttt", get(data)['channels'])
  })
</script>

{#each get(data)['channels'] as channel}
  <h1>{channel.name}</h1>
{/each}

<style lang="scss">
</style>
