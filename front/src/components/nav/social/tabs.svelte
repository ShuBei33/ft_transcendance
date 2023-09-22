<script lang="ts">
  import { ui } from "$lib/stores";
  import { classNames, type ClassNamesObject } from "$lib/utils/classNames";
  import Button from "../../Button.svelte";
  import Typography from "../../Typography.svelte";
  const tabsName = ["DM", "ROOM", "FRIEND"] as const;

  $: tabClassNameObject = (name: string): ClassNamesObject => {
    return {
      "generic-button": true,
      active: $ui.chat.selected == name,
    };
  };
</script>

{#each tabsName as tab}
  <Button on:click={() => ($ui.chat.selected = tab)}>
    <Typography>{tab}</Typography>
  </Button>
{/each}
