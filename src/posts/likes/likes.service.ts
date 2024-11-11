import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostsService } from '../posts.service';

@Injectable()
export class LikesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly postsService: PostsService,
    ) { }

    async getMyLikes({
        userId,
    }: {
        userId: string;
    }): Promise<Post[]> {
        const likedPosts = await this.prismaService.like.findMany({
            where: { userId },
            include: { Post: true },
        });

        const posts = await this.postsService.getPostsSummary({ postIds: likedPosts.map(like => like.Post.id) });

        return posts;
    }

    async likePost({
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

        await this.prismaService.like.upsert({
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

        return `You liked ${post.id}`;
    }

    async unlikePost({
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
            await this.prismaService.like.delete({
                where: {
                    userId_postId: { userId, postId }
                }
            });
        } catch { }

        return `You unliked ${post.id}`;
    }
}
