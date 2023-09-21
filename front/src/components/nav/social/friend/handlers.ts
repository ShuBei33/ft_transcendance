import { Friend as FriendApi } from "$lib/apiCalls";
import type { Friendship } from "$lib/models/prismaSchema";
import { data as dataStore, user } from "$lib/stores";
import type { ComponentProps } from "svelte";
import { get } from "svelte/store";
// export class dropDown {
//   friend(): ComponentProps<ActionB {

//   }
// }

export class handle {
  constructor(private Friend = new FriendApi()) {}
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

  // Accpepted
  async FriendshipRemove(friendId: number) {
    // (() => {
    //   dataStore.update(prev => {
    //     const newFriendships = prev.friendShips.filter(friendship => friendship.id != 11);
    //     console.log("!!!!!!!!!!!prev", prev);
    //     console.log(
    //       "should be",
    //       newFriendships
    //     );
    //     prev.friendShips = newFriendships;
    //     alert("newwww" + JSON.stringify(prev.friendShips))
    //     return prev;
    //   })
    // })();
    await this.Friend.deleteFriend(friendId).then(({data}) => {
      const friendshipRemove = data.data;
      const userIdToRemove = friendshipRemove.senderId == get(user)?.id ? friendshipRemove.receiverId : friendshipRemove.senderId;
      dataStore.update(prev => {
        prev.friends = prev.friends.filter(user => user.id != userIdToRemove);
        return prev;
      });
    }).catch(e => {
      alert("error happened delete friend");
    })
  }
}
