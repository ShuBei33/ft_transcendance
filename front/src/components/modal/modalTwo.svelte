<script>
  import { ui } from "$lib/stores";
  export let title = "";
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

{#if $ui.modal != "NONE"}
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

<style>
  .modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
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
