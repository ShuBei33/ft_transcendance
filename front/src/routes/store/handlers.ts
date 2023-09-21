import { Game as GameApi } from "$lib/apiCalls";
import type { Chroma } from "$lib/models/prismaSchema";
import { user } from "$lib/stores";


export class handle {
    constructor(private Game = new GameApi()) { }

    async ChromaBuy(id: string) {
        await this.Game.buyChroma(id)
        .then(({data}) => {
            const chroma: Chroma = data.data;
            $user
            // Chroma received
            alert("Achat effectue" + chroma.id);
        }).catch(e => {
            alert("Erreur achat");
            // Error handling
        })
    }
}