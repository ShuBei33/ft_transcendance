import axios from "axios";
import type {
  ChannelExtended,
  ChanUserExtended,
  Channel as ChannelType,
  ChannelMsg,
  User,
  UserExtended,
  Friendship,
  StatusInv,
  Game as GameType,
  Chroma,
} from "./models/prismaSchema";
import type { AxiosDefaults, AxiosInstance, CreateAxiosDefaults } from "axios";
import { axiosConfig, axiosInstance } from "./stores";
import { get } from "svelte/store";
import type { channel } from "./models/dtos";
import { user } from "./stores";
import type { DiscussionLite } from "./models/discussion";

// export class ApiTemplate {
//   instance: AxiosInstance = axios.create();
//   constructor(instance?: AxiosInstance) {
//     if (instance) this.instance = instance;
//   }
// }

export class Game {
  constructor(
    baseUrl?: string,
    private instance: AxiosInstance = axios.create({
      ...get(axiosConfig),
      baseURL: baseUrl || `${get(axiosConfig)?.baseURL}/game`,
    })
  ) {}
  async joinQueue() {
    return await this.instance.get<string>("joinQueue");
  }

  async leaveQueue() {
    return await this.instance.get<string>("leaveQueue");
  }

  async getHistory(userId: number) {
    return await this.instance.get<{ data: GameType[] }>(`/getHistory/${userId}`);
  }

  async listChroma() {
    console.log("!uri", this.instance.getUri());
    return await this.instance.get<{ data: Chroma[] }>("/shop/list/chroma");
  }

  async buyChroma(id: string) {
    return await this.instance.post<{ data: Chroma }>(`/shop/buy/chroma/${id}`);
  }
}

export class Discussion {
  constructor(
    baseUrl?: string,
    private instance: AxiosInstance = axios.create({
      ...get(axiosConfig),
      baseURL: baseUrl || `${get(axiosConfig)?.baseURL}/discussion`,
    })
  ) {}

    async all() {
      return await this.instance.get<{data: DiscussionLite[]}>('all');
    }

}

export class Channel {
  constructor(
    baseUrl?: string,
    private instance: AxiosInstance = axios.create({
      ...get(axiosConfig),
      baseURL: baseUrl || `${get(axiosConfig)?.baseURL}/channel`,
    })
  ) {}

  async all() {
    return await this.instance.get<{ data: ChannelExtended[] }>("all");
  }

  async mine() {
    return await this.instance.get<{ data: ChanUserExtended[] }>("mine");
  }

  async msgs(chanId: number) {
    return await this.instance.get<{ data: ChannelMsg[] }>(`msgs/${chanId}`);
  }

  async setPrivileges(chanId: number, data: channel.DTOUpdateChanUsr) {
    return await this.instance.patch<{ data: channel.DTOUpdateChanUsr }>(
      `admin/${chanId}/usr`,
      data
    );
  }

  async kick(chanId: number, userId: number) {
    return await this.instance.delete(`kick/${chanId}/${userId}`);
  }

  async updateChannelSetting(chanId: number, channelModified: Partial<channel.DTOUpdateChan>) {
    return await this.instance.patch(`admin/${chanId}/settings`, channelModified);
  }

  async create(
    data: Pick<channel.DTOUpdateChan, "name" | "visibility"> & {
      hash?: string;
    }
  ) {
    return await this.instance.post("create", data);
  }

  async updateChannelUser(chanId: number, data: channel.DTOUpdateChanUsr) {
    return await this.instance.patch(`admin/${chanId}/user`, data);
  }
}

export class Friend {
  constructor(
    baseUrl?: string,
    private instance: AxiosInstance = axios.create({
      ...get(axiosConfig),
      baseURL: baseUrl || `${get(axiosConfig)?.baseURL}/friend`,
    })
  ) {}

  async getFriends(status: StatusInv, filterUser: boolean = true) {
    return await this.instance.get<{ data: UserExtended[] | Friendship[] }>(
      `get/${status}/${filterUser}`
    );
  }

  async sendInvitation(receiverId: number) {
    return await this.instance.post<{ data: Friendship }>(`sendInvitation`, {
      data: {
        receiverId,
      },
    });
  }

  async resolveInvitation(data: { accept: boolean; friendShipId: number }) {
    return await this.instance.post("resolveInvitation", data);
  }

  async deleteFriend(friendId: number) {
    return await this.instance.delete<{data: Friendship}>(`remove/${friendId}`);
  }
}
