<script lang="ts">
  import GenericButton from "../../../genericButton.svelte";
  import { ui } from "$lib/stores";
</script>

<GenericButton
  on:click={() => {
    $ui.modal = "EDITCHAN";
  }}
>
  edit
</GenericButton>

<GenericButton
  on:click={() => {
    $ui.modal = "CREATECHAN";
  }}
>
  create
</GenericButton>

<style lang="scss">
</style>
