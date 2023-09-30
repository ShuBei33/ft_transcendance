<script lang="ts">
  let className: string = "divider";
  export { className as class };
  const SLOTS = $$props.$$slots;
</script>

{#if SLOTS.title}
  <div class="divider-with-title">
    <span class={className} />
    <div class="title-mask">
      <slot name="title" />
    </div>
    <span class={className} />
  </div>
{:else}
  <span class={className} />
{/if}

<style>
  .divider-with-title {
    display: flex;
  }
  .divider {
    height: 1px;
    margin: 0.5em 0;
    width: 100%;
    background-color: grey;
  }
  .title-mask {
    height: auto;
    width: auto;
    padding: 0 0.5em;
    white-space: nowrap;
    /* position: relative; */
    /* overflow: hidden; */
  }
</style>
