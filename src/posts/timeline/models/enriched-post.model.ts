import { Post } from "@prisma/client";

export type enrichedPost = Post & {
    _enriched: {
        isLiked: boolean;
        isReposted: boolean;
        isReplied: boolean;
    };
};
