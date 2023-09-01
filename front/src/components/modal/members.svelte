<script lang="ts">
  import Slider from "../slider.svelte";
  import { data, ui, user } from "$lib/stores";
  import GenericButton from "../genericButton.svelte";
  import type { ChanUserExtended } from "$lib/models/prismaSchema";

  const levels = ["ADMIN", "NORMAL", "ALL"];
  let selectedLevel = "ALL";
  const handleLevelChange = (value: string) => {
    selectedLevel = value;
  };
  const getChannelContext = () => {
    const chanUsr = $data.myChannels.find(
      (chanUsr) => chanUsr.channel.id == $ui.chat.room.labelFocusId
    );
    return chanUsr;
  };

  const handleAdminAction = (
    _chanUsr: ChanUserExtended,
    action: "BAN" | "KICK" | "PROMOTE" | "DEMOTE"
  ) => {
    console.log(action, chanUsr);
  };
  $: chanUsr = getChannelContext();
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
                    >Ban</GenericButton
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
