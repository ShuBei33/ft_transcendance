// Returns a user without sensible data

import { UserLite } from "src/user/dto";
export const userLite: { [k: string]: boolean } = {
    login: true,
    pseudo: true,
    id: true,
    status: true,
}