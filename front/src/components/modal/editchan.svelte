<script lang="ts">
  import { ui } from "$lib/stores";
  import { data } from "$lib/stores";
  import TestInput from "../../routes/login/testInput.svelte";
  import { form, field } from "svelte-forms";
  import { required } from "svelte-forms/validators";

  let chanName = "";

  const getChannelContext = () => {
    const chanUsr = $data.myChannels.find(
      (chanUsr) => chanUsr.channel.id == $ui.chat.room.labelFocusId
    );
    chanName = chanUsr?.channel.name || "";
    return chanUsr;
  };
  $: chanUsr = getChannelContext();
  $: channel = chanUsr?.channel;
  $: console.log(channel);
</script>

<div class="editchan">
  <h1>{channel?.name}</h1>
  <input type="text" name="channelName" id="chanName" bind:value={chanName} />
</div>

<style lang="scss">
  .editchan {
    height: 40vh;
    width: 60vw;
    z-index: 30;
  }
</style>
