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
  import Input from "../Input.svelte";
  import Typography from "../Typography.svelte";
  import Button from "../Button.svelte";
  import { addAnnouncement } from "$lib/stores/session";

  const levels = ["PRIVATE", "PUBLIC", "PROTECTED"];

  let payload: Pick<dto.DTOUpdateChan, "name" | "visibility"> & {
    password?: string;
  } = {
    name: "",
    visibility: "PUBLIC",
  };
  const handleFormSubmit = () => {
    let finalPayload = { ...payload };
    if (payload.visibility != "PROTECTED") delete finalPayload.password;
    console.log("create channel payload is: ", finalPayload);
    const _Channel = new ChannelApi();
    _Channel
      .create(finalPayload)
      .then((data) => {
        addAnnouncement({
          message: `Channel ${payload.name} created`,
          level: "success",
        });
        $ui.modal = "NONE";
        console.log("created channel data: ", data);
      })
      .catch((e) => {
        console.log("error happened create channel", e);
      });
  };
</script>

<div class="editchan">
  <div class="editchan-top">
    <Slider
      {levels}
      initialValue={payload.visibility}
      onChange={(value) => {
        payload["visibility"] = value;
        console.log("slider change", value);
      }}
    />
  </div>
  <div class="editchan-inputSection">
    <Input
      attributes={{
        id: "name",
        type: "text",
        placeholder: "name",
        name: "name",
      }}
      onChange={(value) => (payload["name"] = value)}
    />
    {#if (payload.visibility && payload.visibility == "PROTECTED") || payload["visibility"] == "PROTECTED"}
      <Input
        attributes={{
          id: "password",
          type: "password",
          placeholder: "password",
          name: "password",
        }}
        onChange={(value) => (payload["password"] = value)}
      />
    {/if}
  </div>
  <div class="actions">
    <Button variant="success" on:click={() => handleFormSubmit()}
      ><Typography>Confirm</Typography></Button
    >
    <Button variant="error" on:click={() => ($ui.modal = "NONE")}
      ><Typography>Cancel</Typography></Button
    >
  </div>
</div>

<style lang="scss">
  .editchan {
    height: 30vh;
    width: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &-inputSection {
      display: flex;
      flex-direction: column;
      row-gap: 0.5em;
    }
  }
  .actions {
    display: flex;
    justify-content: center;
    column-gap: 0.5em;
  }
  .modal-input {
    z-index: 99999;
  }
</style>
