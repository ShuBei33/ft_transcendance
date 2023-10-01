import { Game as GameApi } from "$lib/apiCalls";
import type { Chroma } from "$lib/models/prismaSchema";
import { user } from "$lib/stores";
import { addAnnouncement } from "$lib/stores/session";
import { get } from "svelte/store";

export class handle {
  constructor(private Game = new GameApi()) {}

  async ChromaBuy(id: string) {
    await this.Game.buyChroma(id)
      .then(({ data }) => {
        const chroma: Chroma = data.data;
        user.update((prev) => {
          if (!prev) return;
          const newChroma = prev?.chromas.concat(chroma);
          prev.chromas = newChroma;
          return prev;
        });
        // Chroma received
        addAnnouncement({
          level: "success",
          message: "New chroma " + chroma.id,
        });
      })
      .catch((e) => {
        addAnnouncement({
          level: "error",
          message: "Purchase Failed",
        });
      });
  }
}
