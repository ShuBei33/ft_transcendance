import { Friend as FriendApi } from "$lib/apiCalls";
import type { Friendship } from "$lib/models/prismaSchema";

export class handle {
  constructor(private Friend = new FriendApi()) {}
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
}
