import {
  UserStatusMSGs,
  type ChanUserExtended,
  type ChannelMsg,
  type User,
  type UserExtended,
  ChanUsrRole,
} from "$lib/models/prismaSchema";
import { data } from "$lib/stores";
import type { ComponentProps } from "svelte";
import { get } from "svelte/store";
import type ActionButton from "../../../actionButton.svelte";
import type { Action } from "svelte/action";
import { Channel } from "$lib/apiCalls";

export const exists = (data: any) =>
  data ? console.log("exist", data) : console.log("does not exist");

export const getChannelMessageWriter = (
  message: ChannelMsg
): ChanUserExtended | undefined => {
  let res: ChanUserExtended | undefined = undefined;

  const myChanUsr = get(data).myChannels.find(
    (chanUsr) => chanUsr.channel.id == message.channelId
  );
  const writterChanUsr = myChanUsr?.channel.channelUsers.find(
    (chanUsr) => chanUsr.user.id == message.userId
  );
  return writterChanUsr;
};

const isUserMute = (chanUsr: ChanUserExtended) =>
  chanUsr.status == UserStatusMSGs.MUTED;

const isUserBanned = (chanUsr: ChanUserExtended) =>
  chanUsr.status == UserStatusMSGs.BANNED;

const isUserOwner = (chanUsr: ChanUserExtended) =>
  chanUsr.role == ChanUsrRole.OWNER;

const isUserAdmin = (chanUsr: ChanUserExtended) =>
  chanUsr.role == ChanUsrRole.ADMIN;

type action = { label: string; callback: () => void };
type channelActions = ComponentProps<ActionButton>["actions"];

export const getChannelDropDownActions = (
  message: ChannelMsg
): channelActions => {
  const writer = getChannelMessageWriter(message);
  if (!writer) return;
  const _Channel = new Channel();

  return [
    {
      label: "ban",
      callback: async () => {
        await _Channel
          .setPrivileges(writer?.chanId, {
            id: writer.user.id,
            status: UserStatusMSGs.BANNED,
          })
          .then((data) => {
            console.log("ban result", data);
          });
      },
    },
    {
      label: "kick",
      callback: async () => {
        await _Channel.kick(writer.chanId, writer.user.id).then((data) => {
          console.log("kick result", data);
        });
      },
    },
    {
      label: isUserMute(writer) ? "unmute" : "mute",
      callback: async () => {
        await _Channel
          .setPrivileges(writer?.chanId, {
            id: writer.user.id,
            status: isUserMute(writer)
              ? UserStatusMSGs.NORMAL
              : UserStatusMSGs.MUTED,
          })
          .then((data) => {
            // (writer.status = UserStatusMSGs.MUTED),
            console.log("mute result", data);
          });
      },
    },
  ];
};
