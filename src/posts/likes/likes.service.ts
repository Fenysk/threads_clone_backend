import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikesService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

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
