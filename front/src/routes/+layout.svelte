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
  import type {
    ChanUserExtended,
    ChanUsr,
    ChannelMsg,
    DiscussionMsg,
  } from "$lib/models/prismaSchema";
  import Notifications from "$lib/utils/notifications.svelte";
  import type { channel } from "$lib/models/dtos";
  import { addAnnouncement } from "$lib/stores/session";
  import UserWidget from "../components/userWidget/userWidget.svelte";

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
      name: "lobby",
      href: "/lobby",
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
      })
      // Channel user status change
      .on("channelUserEdited", (data: ChanUsr) => {
        $data.myChannels.forEach((myChanUsr, index) => {
          if (myChanUsr.channel.id == data.chanId) {
            const prevChanUsr = $data.myChannels[
              index
            ].channel.channelUsers.find((chanUsr) => chanUsr.id == data.id);

            if (!prevChanUsr) return;
            const newChanUsr: ChanUserExtended = {
              user: prevChanUsr?.user,
              channel: prevChanUsr.channel,
              ...data,
            };

            $data.myChannels[index].channel.channelUsers = $data.myChannels[
              index
            ].channel.channelUsers.filter((chanUsr) => chanUsr.id != data.id);

            $data.myChannels[index].channel.channelUsers.push(newChanUsr);
            return;
          }
        });
      })
      // User received a dm
      .on("dm", (data: DiscussionMsg) => {
        console.log("new dm !", data);
      })
      .on(String($user?.id!), (data: { expect: string; data: any }) => {
        switch (data.expect) {
          case "GAME_ID":
            $ui.game.id = Number(data.data);
            break;
          default:
            break;
        }
      });
  }
</script>

<AuthRouter>
  <UserWidget />
  <span slot="nav">
    <!-- <button on:click={() => token.clear()}>logout</button> -->
    <Nav {navItems} />
  </span>
  <slot />
  {#if chatSocket}
    <SocialModal {chatSocket} />
    <div class="bottom-acion-section">
      <button
        class="chat-toggle"
        on:click={() => ($ui.chat.toggle = !$ui.chat.toggle)}
        >chat {(!$ui.chat.toggle && "+") || "-"}</button
      >
    </div>
  {/if}
</AuthRouter>

<style lang="scss">
  .chat-toggle {
    position: absolute;
    bottom: 1em;
    right: 1em;
  }
</style>
