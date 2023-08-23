<script lang="ts">
  import { ui } from "$lib/stores/ui";
</script>

<main>
  {#if $ui.chat.toggle}
    <div class="social-modal" />
  {/if}
</main>

<style lang="scss">
  .social-modal {
    height: 744px;
    width: 875px;
    background-color: red;
    position: absolute;
    bottom: 3em;
    right: 1em;
  }
</style>
