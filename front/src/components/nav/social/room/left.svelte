<script lang="ts">
  import { data } from "$lib/stores/data";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { ui } from "$lib/stores/ui";
  import { classNames, type ClassNamesObject } from "$lib/utils/classNames/";

  $: labelClassNameObject = (id: number): ClassNamesObject => {
    return {
      "channel-label": true,
      active: $ui.chat.room.labelFocusId == id,
    };
  };

  $: channels = $data.myChannels.map((chanUsr) => chanUsr.channel);

  onMount(() => {
    if ($ui.chat.room.labelFocusId == -1 && $data.myChannels.length)
      $ui.chat.room.labelFocusId = $data.myChannels[0].channel.id;
  });
</script>

{#each channels as channel}
  <button
    class={classNames(labelClassNameObject(channel.id))}
    on:click={() => ($ui.chat.room.labelFocusId = channel.id)}
  >
    <p>
      {channel.name}
    </p>
  </button>
{/each}

<style lang="scss">
  .channel-label {
    cursor: pointer;
    padding: 0.5em;
    &:hover {
      background-color: grey;
    }
  }

  .active {
    background-color: grey;
  }
</style>
