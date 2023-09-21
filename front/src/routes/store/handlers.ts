import { Game as GameApi } from "$lib/apiCalls";
import type { Chroma } from "$lib/models/prismaSchema";
import { user } from "$lib/stores";
import { get } from "svelte/store";


export class handle {
    constructor(private Game = new GameApi()) { }

    async ChromaBuy(id: string) {
        await this.Game.buyChroma(id)
            .then(({ data }) => {
                const chroma: Chroma = data.data;
                user.update(prev => {
                    if (!prev)
                        return;
                    const newChroma = prev?.chromas.concat(chroma)
                    prev.chromas = newChroma;
                    return prev;
                });
                // Chroma received
                alert("Achat effectue" + chroma.id);
            }).catch(e => {
                alert("Erreur achat");
                // Error handling
            })
    }
}