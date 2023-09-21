<script lang="ts">
  import Nav from "../components/nav/nav.svelte";
  import AuthRouter from "$lib/utils/authRouter.svelte";
  import { onMount, type ComponentProps } from "svelte";
  import type NavButton from "../components/nav/navButton.svelte";
  import { user } from "$lib/stores";
  import { get } from "svelte/store";
  import SocialModal from "../components/nav/social/socialModal.svelte";
  import { ui, token, data } from "$lib/stores";
  import { socketState } from "$lib/stores/session";
  import { io } from "socket.io-client";
  import type { Socket } from "socket.io-client";
  import {
    UserStatus,
    type ChanUserExtended,
    type ChanUsr,
    type ChannelMsg,
    type DiscussionMsg,
    type Friendship,
    StatusInv,
    type User,
  } from "$lib/models/prismaSchema";
  import Notifications from "$lib/utils/notifications.svelte";
  import type { channel } from "$lib/models/dtos";
  import { addAnnouncement } from "$lib/stores/session";
  // console.log("new dm !", data);
  import UserWidget from "../components/userWidget/userWidget.svelte";

  onMount(() => {
    // console.log($user);
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
  ];

  $: chatState = $socketState.get("chat");
  $: lobbyState = $socketState.get("lobby");
  $: isAuthenticated = $user && $token;
  let lobbySocket: Socket | undefined = undefined;
  let chatSocket: Socket | undefined = undefined;
  $: if (isAuthenticated) {
    if (!chatSocket && !chatState)
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
          $socketState.set("chat", true);
        })
        .on("disconnect", () => {
          $socketState.set("chat", false);
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
          $data.discussions.forEach((disc, index) => {
            if (disc.id == data.discussionId) {
              $data.discussions[index].discussionsMsgs = [
                ...$data.discussions[index].discussionsMsgs,
                data,
              ];
              return;
            }
          });
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
    if (!lobbyState && !lobbySocket) {
      lobbySocket = io("http://localhost:5500/lobby", {
        auth: {
          token: $token,
        },
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      })
        .on("connect", () => {
          $socketState.set("lobby", true);
        })
        .on("disconnect", () => {
          $socketState.set("lobby", false);
        })
        .on("friendShipChange", (data: Friendship) => {
          switch (data.inviteStatus) {
            case StatusInv.ACCEPTED:
              const newFriendUser =
                data.senderId == $user?.id ? data.receiver : data.sender;
              $data.friendShips = $data.friendShips.filter(
                (friendship) => friendship.id != data.id
              );
              $data.friends = [...$data.friends, newFriendUser];
              break;
            // case StatusInv.PENDING:
            // case StatusInv.REJECT:
            case StatusInv.BLOCKED:
              $data.friendShips = $data.friendShips.filter(
                (friendship) => friendship.id != data.id
              );
              $data.friendShips = [...$data.friendShips, data];
              break;
            default:
              break;
          }
        }).on("friendStatus", (data: Pick<User, "id" | "status">) => {
          let userToUpdate = $data.friends.find(user => user.id == data.id);
          if (!userToUpdate)
            return ;
          let newFriends = $data.friends.filter(user => user.id != data.id);
          userToUpdate.status = data.status;
          newFriends.push(userToUpdate);
          $data.friends = newFriends;
          alert("ok status ouais" + JSON.stringify(data));
        });
      lobbySocket.emit("userStatus", UserStatus.ONLINE);
    }
  }
</script>

<AuthRouter>
  <!-- <UserWidget /> -->
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
