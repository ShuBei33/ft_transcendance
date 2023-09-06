<script lang="ts">
  import { data } from "$lib/stores/data";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { ui } from "$lib/stores/ui";
  import Button from "../../../Button.svelte";
  import { classNames, type ClassNamesObject } from "$lib/utils/classNames/";
  import Typography from "../../../Typography.svelte";

  $: labelClassNameObject = (id: number): ClassNamesObject => {
    return {
      channelLabel: true,
      // active: $ui.chat.room.labelFocusId == id,
    };
  };

  onMount(() => {
    if ($ui.chat.room.labelFocusId == -1 && $data.myChannels.length)
      $ui.chat.room.labelFocusId = $data.myChannels[0].channel.id;
  });

  $: channels = $data.myChannels.map((chanUsr) => chanUsr.channel);
</script>

{#each channels as channel}
  <Button
    class={classNames(labelClassNameObject(channel.id))}
    on:click={() => ($ui.chat.room.labelFocusId = channel.id)}
  >
    <Typography big>
      {channel.name}
    </Typography>
  </Button>
{/each}

<style lang="scss">
  // @use "../../../../lib/style/mixins";
  // @use "../../../../lib/style/variables.scss";
</style>
