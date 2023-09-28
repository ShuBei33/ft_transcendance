<script lang="ts">
  import { announcements, removeAnnouncement } from "$lib/stores/session";
  import { fly } from "svelte/transition";
  import Typography from "../../components/Typography.svelte";
  import Divider from "../../components/divider.svelte";
  import Button from "../../components/Button.svelte";
<<<<<<< HEAD
    import { not } from "svelte-forms/validators";
=======
>>>>>>> master
</script>

<div class="notificationFlex">
  {#each $announcements as notification}
    <div
      role="button"
      tabindex="0"
      on:keyup|preventDefault
      on:click={() => removeAnnouncement(notification.id)}
      class={`overlayNotification-${notification.level}`}
      in:fly={{ y: 10, x: -10, duration: 350 }}
      out:fly={{ y: -10, x: 10, duration: 350 }}
    >
      <Typography>
        {notification.message}
      </Typography>
      {#if notification.confirm}
<<<<<<< HEAD
      <Divider>
        {""}
      </Divider>
=======
        <Divider>
          {""}
        </Divider>
>>>>>>> master
        <div class="notificationActions">
          <Button variant="success" on:click={() => notification.confirm?.yes.callback()}>
            <Typography>{notification.confirm.yes.label}</Typography>
          </Button>
          <Button variant="error" on:click={() => notification.confirm?.no.callback()}>
            <Typography>{notification.confirm.no.label}</Typography>
          </Button>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  @import "../style/colors.scss";
  .overlayNotification,
  .overlayNotification-error,
  .overlayNotification-success {
    display: flex;
    flex-direction: column;
    height: auto;
    width: 14em;
    padding: 1em;
    background-color: $shipsOfficer;
    border-radius: 0.3em;
    transform: translateX(calc(50vw - 8em));
    cursor: pointer;
    pointer-events: all;
    z-index: 100;

    &-error {
      border: 1px solid red;
    }
    &-success {
      border: 1px solid green;
    }
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
