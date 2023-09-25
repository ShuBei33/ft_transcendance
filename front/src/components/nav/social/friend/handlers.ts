import { Friend as FriendApi } from "$lib/apiCalls";
import type { Friendship } from "$lib/models/prismaSchema";
import { data as dataStore, user } from "$lib/stores";
import { addAnnouncement } from "$lib/stores/session";
import type { ComponentProps } from "svelte";
import { get } from "svelte/store";

// TODO handle catch errors

export class handle {
  constructor(private Friend = new FriendApi()) { }

  async AddFriend(receiverId: number) {
    await this.Friend
      .sendInvitation(receiverId)
      .then(({ data }) => {
        dataStore.update(prev => {
          prev.friendShips = [...prev.friendShips, data.data];
          addAnnouncement({
            message: "Friend request sent",
            level: "success",
          });
          return prev;
        });
      })
      .catch((e) => {
        addAnnouncement({
          message: "Failed to send friend request",
          level: "error",
        });
      });
  };
  // Pending
  async FriendshipAccept(friendShip: Friendship) {
    await this.Friend.resolveInvitation({
      accept: true,
      friendShipId: friendShip.id,
    })
      .then(({ data }) => {
        console.log("accept ok !", data);
      })
      .catch((e) => {
        console.log("error accept");
      });
  };

  async FriendshipDecline(friendShip: Friendship) {
    await this.Friend.resolveInvitation({
      accept: false,
      friendShipId: friendShip.id,
    })
      .then(({ data }) => {
        console.log("decline ok !", data);
      })
      .catch((e) => {
        console.log("error decline");
      });
  };

  // Accepted
  async FriendshipRemove(friendId: number) {
    await this.Friend.deleteFriend(friendId).then(({ data }) => {
      const friendshipRemove = data.data;
      const userIdToRemove = friendshipRemove.senderId == get(user)?.id ? friendshipRemove.receiverId : friendshipRemove.senderId;
      dataStore.update(prev => {
        prev.friends = prev.friends.filter(user => user.id != userIdToRemove);
        return prev;
      });
    }).catch(e => {
    })
  }

  async FriendShipBlock(receiverId: number) {
    await this.Friend.blockUser(receiverId).then(({ data }) => {
    }).catch(e => {
    })
  }

  async FriendShipUnBlock(friendship: Friendship) {
    const receiverId = friendship.receiverId == get(user)?.id ? friendship.senderId : friendship.receiverId;
    await this.Friend.unBlockUser(receiverId).then(({ data }) => {
      alert("unblock ok" + JSON.stringify(data));
    }).catch(e => {
      alert("error");
    })
  }
}
