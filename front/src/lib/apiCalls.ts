import axios from "axios";
import type { AxiosInstance } from "axios";

export class Game {
  instance: AxiosInstance = axios.create();
  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }
  async join() {
    return await this.instance.get<string>("/game/joinQueue");
  }

  async leave() {
    return await this.instance.get<string>("/game/leaveQueue");
  }
}
