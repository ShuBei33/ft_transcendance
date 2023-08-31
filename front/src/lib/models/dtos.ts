import type {
  ChanUsr,
  ChanUsrRole,
  UserStatusMSGs,
  Channel,
  ChanVisibility,
} from "./prismaSchema";
export namespace channel {
  export interface DTOUpdateChanUsr {
    id: ChanUsr["id"];

    role?: ChanUsrRole;
    status?: UserStatusMSGs;
    statusDuration?: Date;
  }

  export interface DTOUpdateChan {
    name: string;
    visibility: string;
    hash: string;
  }
}
