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
  import type { ChannelMsg } from "$lib/models/prismaSchema";

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
  $: if (!$socketIsConnected && $token) {
    chatSocket = io("http://localhost:5500/chat", {
      auth: {
        token: $token,
      },
    })
      .on("connect", () => {
        $socketIsConnected = true;
        console.log("connect ok");
      })
      .on("disconnect", () => {
        $socketIsConnected = false;
      })
      .on("message", (data: ChannelMsg) => {
        $data.myChannels.forEach((chanUsr, index) => {
          if (chanUsr.channel.id == Number(data.channelId)) {
            $data.myChannels[index].channel.channelMsgs = [
              ...$data.myChannels[index].channel.channelMsgs,
              data,
            ];
            return;
          }
        });
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
    <div />
  </div></AuthRouter
>

<style lang="scss">
  .chat-toggle {
    position: absolute;
    bottom: 1em;
    right: 1em;
  }
</style>
