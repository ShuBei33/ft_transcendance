<script lang="ts">
  import { ui } from "$lib/stores";
  import GenericButton from "../genericButton.svelte";
  import type { modalTab } from "./tabModal";
  export let tabs: modalTab[] = [];
  let toggleIndex = 0;
</script>

<div class="tab-header">
  {#each tabs as tab, index}
    <GenericButton on:click={() => (toggleIndex = index)}>
      {tab.title}
    </GenericButton>
  {/each}
  <svelte:component this={tabs[toggleIndex].component} />
</div>

<style>
</style>
