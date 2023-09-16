<script lang="ts">
  import { data, user } from "$lib/stores";
  import AvatarFrame from "../avatarFrame.svelte";

  $: discussions = $data.discussions.filter((value) => value.discussionsMsgs?.length != 0);
  $: console.log("disc!!!!", $data.discussions);
</script>

<div class="discussion-left">
  {#each discussions as discussion}
    <div class="discussion-label">
      <div class="lhs">
        <span class="avatar-frame-wrapper">
          <AvatarFrame
            userId={String(
              [discussion.userId1, discussion.userId2].filter((id) => id != $user?.id)[0]
            )}
            inherit
          />
        </span>
      </div>
      <div class="rhs" />
    </div>
  {/each}
</div>

<style lang="scss">
  .avatar-frame-wrapper {
    height: 3.2em;
    width: 3.2em;
  }
</style>
