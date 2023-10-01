<script lang="ts">
  import Slider from "../slider.svelte";
  import { axiosConfig, data, ui, user } from "$lib/stores";
  import { ChanUsrRole, type ChanUserExtended, UserStatusMSGs } from "$lib/models/prismaSchema";
  import { Channel } from "$lib/apiCalls";
  import type { channel as dto } from "$lib/models/dtos";
  import { get } from "svelte/store";
  import Button from "../Button.svelte";
  import AvatarFrame from "../nav/social/avatarFrame.svelte";
  import Typography from "../Typography.svelte";
  import MemberLabelTemplate from "./memberLabelTemplate.svelte";

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
//          console.log("update user ok", res);
        })
        .catch((e) => {
//          console.log("error happened", e);
        });
    } else {
      _Channel.kick(_chanUsr.chanId, _chanUsr.user.id);
    }
//    console.log(action, chanUsr);
  };
  $: chanUsr = $data.myChannels.find((chanUsr) => chanUsr.channel.id == $ui.chat.room.labelFocusId);

  $: channel = chanUsr?.channel;
</script>

<div class="members">
  <div class="members-top">
    <Slider {levels} initialValue={"ALL"} onChange={(value) => handleLevelChange(value)} />
  </div>
  <div class="members-container">
    {#if channel}
      {#if selectedLevel == "ADMIN" || selectedLevel == "ALL"}
        <h2 class="roleDescription">{"--- Admins ---"}</h2>
        {#if channel.channelUsers.find((chanUsr) => chanUsr.role == "ADMIN")}
          {#each channel.channelUsers as member}
            {#if member.user.id != $user?.id && member.role == "ADMIN"}
              <MemberLabelTemplate>
                <span slot="lhs">
                  <span class="avatar-frame-wrapper">
                    <AvatarFrame userId={String(member.user.id)} inherit={true} />
                  </span>
                  <Typography class="... user-pseudo-link">{member.user.pseudo}</Typography>
                </span>
                <span slot="rhs">
                  <Button on:click={() => handleAdminAction(member, "DEMOTE")}>Demote</Button>
                  <Button on:click={() => handleAdminAction(member, "BAN")}>Ban</Button>
                  <Button on:click={() => handleAdminAction(member, "KICK")}>Kick</Button>
                </span>
              </MemberLabelTemplate>
              <!-- <div class="oneUserFlex">
                <div class="user-label">
                  <span class="avatar-frame-wrapper">
                    <AvatarFrame userId={String(member.id)} inherit={true} />
                  </span>
                  <Typography class="... user-pseudo-link">{$user?.pseudo}</Typography>
                </div>
                <div class="oneUserActions">
                  <Button on:click={() => handleAdminAction(member, "DEMOTE")}>Demote</Button>
                  <Button on:click={() => handleAdminAction(member, "BAN")}>Ban</Button>
                  <Button on:click={() => handleAdminAction(member, "KICK")}>Kick</Button>
                </div>
              </div> -->
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
                <div class="user-label">
                  <span class="avatar-frame-wrapper">
                    <AvatarFrame userId={String(member.user.id)} inherit={true} />
                  </span>
                  <Typography class="... user-pseudo-link">{$user?.pseudo}</Typography>
                </div>

                <div class="oneUserActions">
                  <Button on:click={() => handleAdminAction(member, "PROMOTE")}>Promote</Button>
                  <Button on:click={() => handleAdminAction(member, "BAN")}>Ban</Button>
                  <Button on:click={() => handleAdminAction(member, "KICK")}>Kick</Button>
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
    min-width: 50vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .members-container {
    width: 100%;
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
  .avatar-frame-wrapper {
    height: 3.2em;
    width: 3.2em;
    background-color: grey;
  }
</style>
