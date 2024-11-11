import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostsService } from '../posts.service';

@Injectable()
export class RepostsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly postsService: PostsService,
    ) { }

    async getMyReposts({
        userId,
    }: {
        userId: string;
    }): Promise<Post[]> {
        const repostedPosts = await this.prismaService.repost.findMany({
            where: { userId },
            include: { Post: true },
        });

        const posts = await this.postsService.getPostsSummary({ postIds: repostedPosts.map(repost => repost.Post.id) });

        return posts;
    }

    async repostPost({
        userId,
        postId,
    }: {
        userId: string;
        postId: string;
    }): Promise<string> {
        const post = await this.prismaService.post.findUnique({
            where: { id: postId },
        });

        if (!post)
            throw new NotFoundException('Post not found');

        await this.prismaService.repost.upsert({
            where: {
                userId_postId: {
                    userId,
                    postId,
                }
            },
            create: {
                userId,
                postId,
            },
            update: {},
            include: {
                Post: {
                    include: {
                        Author: {
                            include: {
                                Profile: true,
                            }
                        }
                    }
                }
            }
        });

        return `You reposted ${post.id}`;
    }

    async unrepostPost({
        userId,
        postId,
    }: {
        userId: string;
        postId: string;
    }): Promise<string> {
        const post = await this.prismaService.post.findUnique({
            where: {
                id: postId
            }
        });

        if (!post)
            throw new NotFoundException('Post not found');

        try {
            await this.prismaService.repost.delete({
                where: {
                    userId_postId: { userId, postId }
                }
            });
        } catch { }

        return `You unreposted ${post.id}`;
    }
}
