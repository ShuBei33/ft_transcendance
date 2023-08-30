<script lang="ts">
  import { announcements, removeAnnouncement } from "$lib/stores/session";
  import { fly } from "svelte/transition";
</script>

<div class="notificationFlex">
  {#each $announcements as notification}
    <div
      role="button"
      tabindex="0"
      on:keyup|preventDefault
      on:click={() => removeAnnouncement(notification.id)}
      class={`overlayNotification ${notification.level}`}
      in:fly={{ y: 10, x: -10, duration: 350 }}
      out:fly={{ y: -10, x: 10, duration: 350 }}
    >
      {notification.message}
    </div>
  {/each}
</div>

<style lang="scss">
  .error {
    border: 1px solid red;
  }
  .success {
    border: 1px solid green;
  }
  .overlayNotification {
    height: 2em;
    width: 14em;
    padding: 1em;
    background-color: whitesmoke;
    transform: translateX(calc(50vw - 8em));
    cursor: pointer;
    pointer-events: all;
  }
  .notificationFlex {
    display: flex;
    flex-direction: column;
    position: absolute;
    justify-content: center;
    gap: 1em;
    margin-top: 1em;
    pointer-events: none;
  }
</style>
