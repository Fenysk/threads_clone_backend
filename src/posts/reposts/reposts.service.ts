import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RepostsService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

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
