import { Game } from "$lib/apiCalls";
import type { Chroma } from "$lib/models/prismaSchema";
import type { PageLoad } from "./$types";
import { browser } from "$app/environment";

export const load = (async () => {
  const _Game = new Game();
  const chromas: Chroma[] = await _Game
    .listChroma()
    .then(({ data }) => data.data)
    .catch((e) => {
      // TODO handle chroma error
      return [];
    });
  return {
    chromas,
  };
}) satisfies PageLoad;
