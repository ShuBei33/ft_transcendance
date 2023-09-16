import type { DiscussionMsg } from "./prismaSchema";

export interface DiscussionLite {
    id: number;
    userId1: number;
    userId2: number;
	discussionsMsgs: DiscussionMsg[];
}