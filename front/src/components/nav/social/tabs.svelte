<script lang="ts">
  import { ui } from "$lib/stores";
  import { classNames, type ClassNamesObject } from "$lib/utils/classNames";
  const tabsName = ["DM", "ROOM", "FRIEND"] as const;

  $: tabClassNameObject = (name: string): ClassNamesObject => {
    return {
      "tab-toggle": true,
      active: $ui.chat.selected == name,
    };
  };
</script>

{#each tabsName as tab}
  <button
    class={classNames(tabClassNameObject(tab))}
    on:click={() => ($ui.chat.selected = tab)}
  >
    {tab}
  </button>
{/each}
