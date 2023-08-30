import axios from "axios";
import type {
  ChannelExtended,
  ChanUserExtended,
  Channel as ChannelType,
  ChannelMsg,
  User,
  UserExtended,
  Friendship,
} from "./models/prismaSchema";
import type { AxiosDefaults, AxiosInstance, CreateAxiosDefaults } from "axios";
import { axiosConfig, axiosInstance } from "./stores";
import { get } from "svelte/store";
import type { channel } from "./models/dtos";
import { user } from "./stores";

export class ApiTemplate {
  instance: AxiosInstance = axios.create();
  constructor(instance?: AxiosInstance) {
    if (instance) this.instance = instance;
  }
}

export class Game extends ApiTemplate {
  async join() {
    return await this.instance.get<string>("/game/joinQueue");
  }

  async leave() {
    return await this.instance.get<string>("/game/leaveQueue");
  }
}

export class Channel {
  constructor(
    private instance: AxiosInstance = axios.create({
      ...get(axiosConfig),
      baseURL: `${get(axiosConfig)?.baseURL}/chat/channel`,
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
}

export class Friend {
  constructor(
    private instance: AxiosInstance = axios.create({
      ...get(axiosConfig),
      baseURL: `${get(axiosConfig)?.baseURL}/friend`,
    })
  ) {}

  async getFriends() {
    return await this.instance.get<{ data: UserExtended[] }>("get");
  }

  async sendInvitation(receiverId: number) {
    return await this.instance.post<{ data: Friendship }>(`sendInvitation`, {
      data: {
        receiverId,
      },
    });
  }

  // async sendInvitation() {

  // }
}
