import type { ChannelMsg, DiscussionMsg } from "$lib/models/prismaSchema";
import { DateTime } from "luxon";

export const getMessageTimeStamp = (
  message: ChannelMsg | DiscussionMsg
): DateTime => {
  const now = DateTime.now();
  return DateTime.fromISO(String(message.createdAt)).setZone(now.zone);
};

export const getFollowupTimeStampString = (
  message: ChannelMsg | DiscussionMsg
) => {
  const timeStamp = getMessageTimeStamp(message);
  return `${timeStamp.hour}:${timeStamp.minute}`;
};
