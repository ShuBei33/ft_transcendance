import axios from "axios";
import type { Channel as ChannelType } from "./models/prismaSchema";
import type { ChannelExtended } from "./models/prismaSchema";
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
  ) {
    console.log(this.instance.getUri());
    // this.instance = axios.create({ ...get(axiosConfig) });
  }

  async all() {
    console.log(this.instance.getUri(), get(axiosConfig));
    return await this.instance.get<ChannelExtended[]>("all");
  }
}
