<script lang="ts">
  import Slider from "../slider.svelte";
  import { axiosConfig, data, ui, user } from "$lib/stores";
  import GenericButton from "../genericButton.svelte";
  import {
    ChanUsrRole,
    type ChanUserExtended,
    UserStatusMSGs,
  } from "$lib/models/prismaSchema";
  import { Channel } from "$lib/apiCalls";
  import type { channel as dto } from "$lib/models/dtos";
  import { get } from "svelte/store";
  import Button from "../Button.svelte";

  const levels = ["ADMIN", "NORMAL", "ALL"];
  let selectedLevel = "ALL";
  const handleLevelChange = (value: string) => {
    selectedLevel = value;
  };

  const handleAdminAction = (
    _chanUsr: ChanUserExtended,
    action: "BAN" | "KICK" | "PROMOTE" | "DEMOTE"
  ) => {
    if (!channel) return;
    const _Channel = new Channel(`${get(axiosConfig)?.baseURL}/chat/channel`);
    let payload: dto.DTOUpdateChanUsr = {
      id: _chanUsr.user.id,
    };
    if (action != "KICK") {
      switch (action) {
        case "PROMOTE":
          payload.role = ChanUsrRole.ADMIN;
          break;
        case "DEMOTE":
          payload.role = ChanUsrRole.NORMAL;
          break;
        case "BAN":
          payload.status = UserStatusMSGs.BANNED;
          break;
        default:
          break;
      }
      _Channel
        .updateChannelUser(channel?.id, payload)
        .then((res) => {
          console.log("update user ok", res);
        })
        .catch((e) => {
          console.log("error happened", e);
        });
    }
    console.log(action, chanUsr);
  };
  $: chanUsr = $data.myChannels.find(
    (chanUsr) => chanUsr.channel.id == $ui.chat.room.labelFocusId
  );

  $: channel = chanUsr?.channel;
</script>

<div class="members">
  <div class="members-top">
    <h1>{"members"}</h1>
    <Slider
      {levels}
      initialValue={"ALL"}
      onChange={(value) => handleLevelChange(value)}
    />
  </div>
  <div class="members-contaiener">
    {#if channel}
      {#if selectedLevel == "ADMIN" || selectedLevel == "ALL"}
        <h2 class="roleDescription">{"--- Admins ---"}</h2>
        {#if channel.channelUsers.find((chanUsr) => chanUsr.role == "ADMIN")}
          {#each channel.channelUsers as member}
            {#if member.user.id != $user?.id && member.role == "ADMIN"}
              <div class="oneUserFlex">
                {member.user.pseudo}
                <div class="oneUserActions">
                  <GenericButton
                    on:click={() => handleAdminAction(member, "DEMOTE")}
                    >Demote</GenericButton
                  >
                  <GenericButton
                    on:click={() => handleAdminAction(member, "BAN")}
                    >Ban</GenericButton
                  >
                  <GenericButton
                    on:click={() => handleAdminAction(member, "KICK")}
                    >Kick</GenericButton
                  >
                </div>
              </div>
            {/if}
          {/each}
        {:else}
          <p>{"Nothing to show."}</p>
        {/if}
      {/if}
      {#if selectedLevel == "NORMAL" || selectedLevel == "ALL"}
        <h2 class="roleDescription">{"--- Normal ---"}</h2>
        {#if channel.channelUsers.find((chanUsr) => chanUsr.role == "NORMAL")}
          {#each channel.channelUsers as member}
            {#if member.user.id != $user?.id && member.role == "NORMAL"}
              <div class="oneUserFlex">
                {member.user.pseudo}
                <div class="oneUserActions">
                  <GenericButton
                    on:click={() => handleAdminAction(member, "PROMOTE")}
                    >Promote</GenericButton
                  >
                  <GenericButton
                    on:click={() => handleAdminAction(member, "BAN")}
                    >Ban</GenericButton
                  >
                  <GenericButton
                    on:click={() => handleAdminAction(member, "KICK")}
                    >Kick</GenericButton
                  >
                </div>
              </div>
            {/if}
          {/each}
        {:else}
          <p>{"Nothing to show."}</p>
        {/if}
      {/if}
    {/if}
  </div>
</div>

<style lang="scss">
  .members {
    height: 70vh;
    width: auto;
  }

  .members-top {
    display: flex;
    flex-direction: row;
  }
  .oneUserFlex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .roleDescription {
  }
</style>
