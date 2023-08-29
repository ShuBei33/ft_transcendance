import type { ChanUsr, ChanUsrRole, UserStatusMSGs } from "./prismaSchema";
export namespace channel {
  export interface DTOUpdateChanUsr {
    id: ChanUsr["id"];

    role?: ChanUsrRole;
    status?: UserStatusMSGs;
    statusDuration?: Date;
  }
}
