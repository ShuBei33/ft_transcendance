<script lang="ts">
  import { ui } from "$lib/stores";
  import Editchan from "./editchan.svelte";
</script>

{#if $ui.modal != "NONE"}
  <div
    class="modal-overlay"
    role="button"
    on:keypress|preventDefault
    on:click={() => ($ui.modal = "NONE")}
  >
    <div
      class="modal-content-wrapper"
      role="button"
      on:keypress|preventDefault
      on:click={(e) => e.stopPropagation()}
    >
      {#if $ui.modal == "EDITCHAN"}
        <svelte:component this={Editchan} />
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  .modal-overlay {
    position: absolute;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 20;
    display: flex;
    justify-content: center;
  }
  .modal-content-wrapper {
    padding: 1em;
    background-color: whitesmoke;
    height: max-content;
    align-self: center;
    z-index: inherit;
  }
</style>
