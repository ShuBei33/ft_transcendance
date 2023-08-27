import axios from "axios";
import type {
  ChannelExtended,
  ChanUserExtended,
  Channel as ChannelType,
} from "./models/prismaSchema";
import type { AxiosDefaults, AxiosInstance, CreateAxiosDefaults } from "axios";
import { axiosConfig, axiosInstance } from "./stores";
import { get } from "svelte/store";

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
      baseURL: `${get(axiosConfig)?.baseURL}/channel`,
    })
  ) {}

  async all() {
    return await this.instance.get<{ data: ChannelExtended[] }>("all");
  }

  async mine() {
    return await this.instance.get<{ data: ChanUserExtended[] }>("mine");
  }
}
