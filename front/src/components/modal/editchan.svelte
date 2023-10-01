<script lang="ts">
  import { axiosConfig, ui } from "$lib/stores";
  import { data } from "$lib/stores";
  import TestInput from "../../routes/login/testInput.svelte";
  import GenericButton from "../genericButton.svelte";
  import Slider from "../slider.svelte";
  import { Channel, Channel as ChannelApi } from "$lib/apiCalls";
  import { get } from "svelte/store";
  import type { channel as dto } from "$lib/models/dtos";
  import { ChanVisibility } from "$lib/models/prismaSchema";
  import Input from "../Input.svelte";
  import Typography from "../Typography.svelte";
  import Button from "../Button.svelte";

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
//    console.log("!payload", payload);
    if (!channel) return;
//    console.log("!payload", payload);
    const _Channel = new ChannelApi(`${get(axiosConfig)?.baseURL}/chat/channel`);
    _Channel
      .updateChannelSetting(channel.id, payload)
      .then((res) => {
//        console.log("update res", res);
      })
      .catch((e) => {
//        console.log("error happened");
      });
    payload.name = "test";
  };
//  // $: console.log(channel);
</script>

<div class="editchan">
  <Slider
    {levels}
    initialValue={channel?.visibility}
    onChange={(value) => {
      if (value != channel?.visibility) payload["visibility"] = value;
      else delete payload.visibility;
//      console.log("slider change", value);
    }}
  />
  <Typography class="... title"
    ><h1>
      {channel?.name}
    </h1></Typography
  >
  <div class="input-section">
    <Input
      attributes={{
        id: "name",
        type: "text",
        placeholder: "name",
        name: "name",
      }}
      onChange={(value) => (payload["name"] = value)}
    />
    {#if (payload.visibility && payload.visibility == "PROTECTED") || channel?.visibility == "PROTECTED"}
      <Input
        attributes={{
          id: "password",
          type: "password",
          placeholder: "password",
          name: "password",
        }}
        onChange={(value) => (payload["hash"] = value)}
      />
    {/if}
  </div>
  <div class="actions">
    <Button variant="success" on:click={() => handleFormSubmit()}
      ><Typography>{"Update"}</Typography></Button
    >
    <Button variant="error"><Typography>{"Cancel"}</Typography></Button>
    <Button
      variant="warning"
      on:click={async () => {
        if (!channel) return;
        new Channel(`${get(axiosConfig)?.baseURL}/chat/channel`).leave(channel.id);
      }}><Typography>{"Leave channel"}</Typography></Button
    >
  </div>
</div>

<style lang="scss">
  .input-section {
    background-color: transparent;
    display: flex;
    flex-direction: column;
    row-gap: 0.5em;
  }
  .editchan {
    height: auto;
    width: 20em;
    display: flex;
    flex-direction: column;
    row-gap: 0.5em;
  }
  .modal-input {
    z-index: 99999;
  }
  :global(.title) {
    display: flex;
    justify-content: center;
  }
  .actions {
    display: flex;
    justify-content: center;
    column-gap: 0.5em;
  }
</style>
