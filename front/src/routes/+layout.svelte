<script lang="ts">
  import Nav from "../components/nav/nav.svelte";
  import AuthRouter from "$lib/utils/authRouter.svelte";
  import { onMount, type ComponentProps } from "svelte";
  import type NavButton from "../components/nav/navButton.svelte";
  import { user } from "$lib/stores";
  import { get } from "svelte/store";
  import SocialModal from "../components/nav/social/socialModal.svelte";
  import { ui, token, data } from "$lib/stores";
  import { socketIsConnected } from "$lib/stores/session";
  import { io } from "socket.io-client";
  import type { Socket } from "socket.io-client";
  import type { ChannelMsg, DiscussionMsg } from "$lib/models/prismaSchema";
  import Notifications from "$lib/utils/notifications.svelte";
  import type { channel } from "$lib/models/dtos";
  import { addAnnouncement } from "$lib/stores/session";

  onMount(() => {
    console.log($user);
  });

  let navItems: ComponentProps<NavButton>[];
  $: navItems = [
    {
      name: "profile",
      href: "/profile/" + $user?.id,
    },
    {
      name: "play",
      href: "/play",
    },
    {
      name: "store",
      href: "/store",
    },
    {
      name: "leaderboard",
      href: "/leaderboard",
    },
    {
      name: "inventory",
      href: "/inventory",
    },
    {
      name: "game",
      href: "/game",
    },
  ];
  let chatSocket: Socket | undefined = undefined;
  $: if (!$socketIsConnected && $token && !chatSocket) {
    chatSocket = io("http://localhost:5500/chat", {
      auth: {
        token: $token,
      },
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })
      .on("connect", () => {
        $socketIsConnected = true;
        console.log("connect ok");
      })
      .on("disconnect", () => {
        $socketIsConnected = false;
      })
      // A message has been received in a channel
      .on("message", (data: ChannelMsg) => {
        $data.myChannels.forEach((chanUsr, index) => {
          if (chanUsr.channel.id == Number(data.channelId)) {
            if ($data.myChannels[index].channel.channelMsgs)
              $data.myChannels[index].channel.channelMsgs = [
                ...$data.myChannels[index].channel.channelMsgs,
                data,
              ];
            else $data.myChannels[index].channel.channelMsgs = [data];
            return;
          }
        });
      })
      // A channel visibility / name has been updated
      .on("updated", (data: channel.ChannelLite) => {
        $data.myChannels.forEach((chanUsr, index) => {
          if (chanUsr.channel.id == data.id) {
            const channel = $data.myChannels[index].channel;
            const { id, ...rest } = data;
            $data.myChannels[index].channel = { ...channel, ...rest };
            return;
          }
        });
        console.log("!update ok !!!", data);
      })
      // User received a dm
      .on("dm", (data: DiscussionMsg) => {
        console.log("new dm !", data);
      });
  }
</script>

<AuthRouter>
  <span slot="nav">
    <button on:click={() => token.clear()}>logout</button>
    <Nav {navItems} />
  </span>
  <slot />
  {#if chatSocket}
    <SocialModal {chatSocket} />
  {/if}
  <div class="bottom-acion-section">
    <button
      class="chat-toggle"
      on:click={() => ($ui.chat.toggle = !$ui.chat.toggle)}
      >chat {(!$ui.chat.toggle && "+") || "-"}</button
    >
  </div></AuthRouter
>

<style lang="scss">
  .chat-toggle {
    position: absolute;
    bottom: 1em;
    right: 1em;
  }
</style>
