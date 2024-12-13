import { Post } from "@prisma/client";

export type EnrichedPost = Post & {
    _enriched: {
        isLiked: boolean;
        isReposted: boolean;
        isReplied: boolean;
    };
};
