<script lang="ts">
  import { ui } from "$lib/stores";
  import GenericButton from "../genericButton.svelte";
  import type { modalTab } from "./tabModal";
  import Button from "../Button.svelte";
  import Typography from "../Typography.svelte";
  import { classNames, type ClassNamesObject } from "$lib/utils/classNames";

  export let tabs: modalTab[] = [];
  let toggleIndex = 0;

  $: tabClassNameObject = (index: number): ClassNamesObject => {
    return {
      "tab-window-toggle": true,
      active: {
        subClass: index == toggleIndex,
      },
    };
  };
</script>

<div class="tab">
  <div class="tab-header">
    {#each tabs as tab, index}
      <div class="tab-window">
        <Button
          class={classNames(tabClassNameObject(index))}
          on:click={() => (toggleIndex = index)}
        >
          <Typography>
            {tab.title}
          </Typography>
        </Button>
      </div>
    {/each}
  </div>
  <div class="tab-content">
    <svelte:component this={tabs[toggleIndex].component} />
  </div>
</div>

<style lang="scss">
  @import "../../lib/style/colors.scss";
  .tab {
    background-color: $shipsOfficer;
    border: 2px solid black;
    border-radius: 0.5em;
    display: flex;
    flex-direction: column;
  }

  .tab-content {
    padding: 1em;
  }
  .tab-header {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .tab-window {
    flex: 1;
  }
</style>
