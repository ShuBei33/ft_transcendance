<script lang="ts">
  import type { DiscussionLite } from "$lib/models/discussion";
  import type { Discussion, DiscussionMsg } from "$lib/models/prismaSchema";
  import { data, ui, user } from "$lib/stores";
  import Button from "../../../Button.svelte";
  import Typography from "../../../Typography.svelte";
  import AvatarFrame from "../avatarFrame.svelte";

  $: discussions = $data.discussions.filter(
    (value) => value.discussionsMsgs?.length != 0
  );
  $: console.log("disc!!!!", $data.discussions);
  const getDiscussionUser = (discussion: DiscussionLite) => {
    const id = [discussion.userId1, discussion.userId2].filter(
      (id) => id != $user?.id
    )[0];
    return $data.friends.find((value) => value.id == id);
  };
  $: console.log($ui.chat.dm);
</script>

<div class="discussion-left">
  {#each discussions as discussion}
    <button
      class="discussion-label"
      on:click={() => ($ui.chat.dm.labelFocusId = discussion.id)}
    >
      <div class="lhs">
        <span class="avatar-frame-wrapper">
          <AvatarFrame
            userId={String(
              [discussion.userId1, discussion.userId2].filter(
                (id) => id != $user?.id
              )[0]
            )}
            inherit={true}
          />
        </span>
        <Typography class="... user-pseudo-link"
          >{getDiscussionUser(discussion)?.pseudo}</Typography
        >
      </div>
      <div class="rhs" />
    </button>
  {/each}
</div>

<style lang="scss">
  .discussion-label {
    display: flex;
    background-color: transparent;
    cursor: pointer;
    border: 0;
    flex-direction: row;
    width: 100%;
  }
  .lhs {
    display: flex;
    flex-direction: row;
  }
  .avatar-frame-wrapper {
    height: 3.2em;
    width: 3.2em;
    background-color: grey;
  }
</style>
