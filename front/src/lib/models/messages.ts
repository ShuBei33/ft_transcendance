import type { ChannelMsg, DiscussionMsg } from "./prismaSchema";

export interface feed {
  userId: number;
  messages: DiscussionMsg[] | ChannelMsg[];
}
