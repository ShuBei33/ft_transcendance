<script lang="ts">
  import { axiosConfig, ui } from "$lib/stores";
  import { data } from "$lib/stores";
  import TestInput from "../../routes/login/testInput.svelte";
  import GenericButton from "../genericButton.svelte";
  import Slider from "../slider.svelte";
  import { Channel as ChannelApi } from "$lib/apiCalls";
  import { get } from "svelte/store";
  import type { channel as dto } from "$lib/models/dtos";
  import { ChanVisibility } from "$lib/models/prismaSchema";

  const getChannelContext = () => {
    const chanUsr = $data.myChannels.find(
      (chanUsr) => chanUsr.channel.id == $ui.chat.room.labelFocusId
    );
    return chanUsr;
  };
  const levels = ["PRIVATE", "PUBLIC", "PROTECTED"];

  $: chanUsr = getChannelContext();
  $: channel = chanUsr?.channel;

  let payload: Partial<dto.DTOUpdateChan> = {};
  const handleFormSubmit = () => {
    console.log("!payload", payload);
    if (!channel) return;
    console.log("!payload", payload);
    const _Channel = new ChannelApi(
      `${get(axiosConfig)?.baseURL}/chat/channel`
    );
    _Channel
      .updateChannelSetting(channel.id, payload)
      .then((res) => {
        console.log("update res", res);
      })
      .catch((e) => {
        console.log("error happened");
      });
    payload.name = "test";
  };
  // $: console.log(channel);
</script>

<div class="editchan">
  <h1>{channel?.name}</h1>
  <TestInput
    attributes={{
      id: "name",
      type: "text",
      placeholder: "name",
      name: "name",
    }}
    onChange={(value) => (payload["name"] = value)}
  />
  <Slider
    {levels}
    initialValue={channel?.visibility}
    onChange={(value) => {
      if (value != channel?.visibility) payload["visibility"] = value;
      else delete payload.visibility;
      console.log("slider change", value);
    }}
  />
  {#if (payload.visibility && payload.visibility == "PROTECTED") || channel?.visibility == "PROTECTED"}
    <TestInput
      attributes={{
        id: "password",
        type: "password",
        placeholder: "password",
        name: "password",
      }}
      onChange={(value) => (payload["hash"] = value)}
    />
  {/if}
  <!-- <label for="checkbox">Check me:</label> -->
  <!-- <input type="checkbox" id="checkbox" name="myCheckbox" value="checked" /> -->
  <GenericButton on:click={() => handleFormSubmit()}>Confirm</GenericButton>
</div>

<style lang="scss">
  .editchan {
    height: 40vh;
    width: 60vw;
  }
  .modal-input {
    z-index: 99999;
  }
</style>
