<script lang="ts">
  import AvatarFrame from "../../../components/nav/social/avatarFrame.svelte";
  import { user as myUser } from "$lib/stores";
  import { Friend } from "$lib/apiCalls";
  import { data as dataStore } from "$lib/stores";
  import { addAnnouncement } from "$lib/stores/session";
  import GenericButton from "../../../components/genericButton.svelte";
  import Typography from "../../../components/Typography.svelte";
  import MatchHistory from "./matchHistory.svelte";

  export let data;
  const _Friend = new Friend();
  console.log("profile");

  const handleAddFriend = async (receiverId: number) => {
    await _Friend
      .sendInvitation(receiverId)
      .then(({ data }) => {
        $dataStore.friendShips = [...$dataStore.friendShips, data.data];
        addAnnouncement({
          message: "Friend request sent",
          level: "success",
        });
      })
      .catch((e) => {
        addAnnouncement({
          message: "Failed to send friend request",
          level: "error",
        });
      });
  };
  const { id, user, history } = data;
  console.log("history", history);
</script>

<main>
  {#if id}
    <section class="profile">
      <Typography big class="... title"><h1>{`${user.pseudo}`}</h1></Typography>
      <AvatarFrame userId={id} />
    </section>
    <section class="match-history">
      <Typography big class="... title"><h1>{"Match history"}</h1></Typography>
      <MatchHistory {history} profileOfUserId={id} />
    </section>
  {/if}
</main>

<style lang="text/scss">
  .match-history {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .profile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  main {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  :global(.title) {
    align-self: center;
  }
</style>
