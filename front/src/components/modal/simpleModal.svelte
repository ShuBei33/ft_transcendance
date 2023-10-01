<script>
  import { ui } from "$lib/stores";
  import Button from "../Button.svelte";
  import Typography from "../Typography.svelte";
  export let title = "";
  export let isOpen = false;
  export let raw = false;
  //   let showModal = false;

  function openModal() {
    // showModal = true;
  }

  function closeModal() {
    $ui.modal = "NONE";
    // showModal = false;
  }
</script>

<!-- <button on:click={openModal}>Open Modal</button> -->

{#if isOpen}
  {#if raw}
    <div class="modal">
      <Button on:click={closeModal} class="... closeBtn" variant="error">
        <Typography>{"X"}</Typography>
      </Button>
      <div class="modal-raw">
        <slot />
      </div>
    </div>
  {:else}
    <div class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{title}</h2>
          <button on:click={closeModal}>Close</button>
        </div>
        <slot />
      </div>
    </div>
  {/if}
{/if}

<style lang="scss">
  @import "../../lib/style/colors.scss";
  .modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $shipsOfficer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  :global(.closeBtn) {
    position: absolute !important;
    margin: 1em;
    top: 0;
    right: 0;
  }

  .modal-raw {
    position: relative;
    z-index: 1001;
  }

  .modal-content {
    background-color: white;
    padding: 1em;
    position: relative;
    z-index: 1001;
  }

  .modal-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
