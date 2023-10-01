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
      active: {
        subClass: $ui.chat.room.labelFocusId == id,
      },
    };
  };

  onMount(() => {
    if ($ui.chat.room.labelFocusId == -1 && $data.myChannels.length)
      $ui.chat.room.labelFocusId = $data.myChannels[0].channel.id;
  });

  $: channels = $data.myChannels.map((chanUsr) => chanUsr.channel);
</script>

<div class="room-left">
  <div class="top">
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
  </div>
  <div class="bottom">
    <Button on:click={() => ($ui.modal = "BROWSECHAN")}>
      <Typography>+</Typography>
    </Button>

    <Button on:click={() => ($ui.modal = "EDITCHAN")}>
      <Typography>{"members 👥"}</Typography>
    </Button>
  </div>
</div>

<style lang="scss">
  .top {
    display: flex;
    flex-direction: column;
    row-gap: 0.5em;
  }
  .room-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: inherit;
  }
</style>
