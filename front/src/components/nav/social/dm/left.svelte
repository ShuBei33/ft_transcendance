<script lang="ts">
  import type { DiscussionLite } from "$lib/models/discussion";
  import type { Discussion, DiscussionMsg } from "$lib/models/prismaSchema";
  import { data, ui, user } from "$lib/stores";
  import Button from "../../../Button.svelte";
  import Typography from "../../../Typography.svelte";
  import AvatarFrame from "../avatarFrame.svelte";
  import { classNames, classNames as cn } from "$lib/utils/classNames";
  import type { ClassNamesObject } from "$lib/utils/classNames";

  $: discussions = $data.discussions.filter((value) => {
    const isToggle = $data.discToggleMap.get(value.id);
    if (isToggle == undefined) console.warn("disc index error");
    return isToggle;
  });

  $: labelCn = (discussion: DiscussionLite): ClassNamesObject => {
    return {
      "discussion-label": true,
      active: {
        subClass: $ui.chat.dm.labelFocusId == discussion.id
      }
    }
  }

  const getDiscussionUser = (discussion: DiscussionLite) => {
    const id = [discussion.userId1, discussion.userId2].filter(
      (id) => id != $user?.id
    )[0];
    return $data.friends.find((value) => value.id == id);
  };
</script>

<div class="discussion-left">
  {#each discussions as discussion}
    <button
      class={classNames(labelCn(discussion))}
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
  .discussion-label, .discussion-label-active {
    display: flex;
    background-color: transparent;
    cursor: pointer;
    border: 0;
    flex-direction: row;
    width: 100%;
    padding: 0.5em;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    &-active {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
  .lhs {
    display: flex;
    flex-direction: row;
    column-gap: 0.5em;
  }
  .avatar-frame-wrapper {
    height: 3.2em;
    width: 3.2em;
    background-color: grey;
  }
</style>
