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
  const levels = ["PRIVATE", "PUBLIC", "PROTECTED"];

  let payload: Pick<dto.DTOUpdateChan, "name" | "visibility"> & {
    hash?: string;
  } = {
    name: "",
    visibility: "PUBLIC",
  };
  const handleFormSubmit = () => {
    let finalPayload = { ...payload };
    if (payload.visibility != "PROTECTED") delete finalPayload.hash;
    console.log("create channel payload is: ", finalPayload);
    const _Channel = new ChannelApi();
    _Channel
      .create(finalPayload)
      .then((data) => {
        console.log("created channel data: ", data);
      })
      .catch((e) => {
        console.log("error happened create channel", e);
      });
    // _Channel
    //   .updateChannelSetting(channel.id, payload)
    //   .then((res) => {
    //     console.log("update res", res);
    //   })
    //   .catch((e) => {
    //     console.log("error happened");
    //   });
    // payload.name = "test";
  };
  // $: console.log(channel);
</script>

<div class="editchan">
  <h1>{payload["name"]}</h1>
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
    initialValue={payload.visibility}
    onChange={(value) => {
      payload["visibility"] = value;
      console.log("slider change", value);
    }}
  />
  {#if (payload.visibility && payload.visibility == "PROTECTED") || payload["visibility"] == "PROTECTED"}
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
