import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostRequest } from './dto/create-post.request';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post, User } from '@prisma/client';
import { UpdatePostRequest } from './dto/update-post.request';
import { EnrichedPost } from './timeline/models/enriched-post.model';

@Injectable()
export class PostsService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async getPostDetailsById({
        postId,
    }: {
        postId: string;
    }): Promise<Post> {
        const post = await this.prismaService.post.findUnique({
            where: { id: postId },
            include: {
                Author: {
                    include: {
                        Profile: true,
                    }
                },
                Likes: true,
                Reposts: true,
                QuoteTo: true,
                ReplyTo: true,
                Hashtags: true,
                Mentions: true,
                Quotes: true,
                Replies: {
                    include: {
                        Author: {
                            include: { Profile: true },
                        },
                    },
                },
                _count: true,
            }
        });

        if (!post)
            throw new NotFoundException('Post not found');

        return post;
    }

    async getPostsSummary({
        postIds,
    }: {
        postIds: string[];
    }): Promise<Post[]> {
        const posts = await this.prismaService.post.findMany({
            where: { id: { in: postIds } },
            include: {
                Author: {
                    include: { Profile: true },
                },
                _count: true,
            },
        });

        return posts;
    }

    async getPostsDetails({
        postIds,
    }: {
        postIds: string[];
    }): Promise<Post[]> {
        const posts = await this.prismaService.post.findMany({
            where: { id: { in: postIds } },
            include: {
                Author: {
                    include: { Profile: true },
                },
                Likes: true,
                Reposts: true,
                QuoteTo: true,
                ReplyTo: true,
                Hashtags: true,
                Mentions: true,
                Quotes: true,
                Replies: true,
                _count: true,
            },
        });

        return posts;
    }

    async createPost({
        user,
        createPostRequest,
    }: {
        user: User;
        createPostRequest: CreatePostRequest;
    }): Promise<EnrichedPost> {
        console.log(user);
        console.log(createPostRequest);
        const hashtagRegex = /#([a-zA-Z]+)/g;
        const foundHashtags = [...createPostRequest.textContent.matchAll(hashtagRegex)]
            .map(match => match[1]);

        const mentionRegex = /@([a-zA-Z0-9\-_]+)/g;
        const foundMentions = [...createPostRequest.textContent.matchAll(mentionRegex)]
            .map(match => match[1]);
        const foundUsers = await this.prismaService.user.findMany({
            where: {
                Profile: {
                    pseudo: { in: foundMentions }
                }
            }
        });

        const newPost = await this.prismaService.post.create({
            data: {
                textContent: createPostRequest.textContent,
                mediaUrls: createPostRequest.mediaUrls,
                authorId: user.id,
                replyToId: createPostRequest.replyToId,
                quoteToId: createPostRequest.quoteToId,
                visibility: createPostRequest.visibility,

                Hashtags: {
                    create: foundHashtags.map(hashtag => ({
                        Hashtag: {
                            connectOrCreate: {
                                where: { name: hashtag },
                                create: { name: hashtag }
                            }
                        }
                    }))
                },

                Mentions: {
                    create: foundUsers.map(user => ({
                        User: { connect: { id: user.id } }
                    }))
                },

            },
        });

        const post = await this.getPostDetailsById({ postId: newPost.id });

        const enrichedPost = this.transformPostToEnriched(post, user.id);

        return enrichedPost;
    }

    async updatePost({
        postId,
        updatePostRequest,
    }: {
        postId: string;
        updatePostRequest: UpdatePostRequest;
    }): Promise<Post> {
        const postExists = await this.prismaService.post.count({
            where: { id: postId },
        });

        if (!postExists)
            throw new NotFoundException(`Post with id ${postId} not found`);

        const hashtagRegex = /#([a-zA-Z]+)/g;
        const foundHashtags = updatePostRequest.textContent
            ? [...updatePostRequest.textContent.matchAll(hashtagRegex)]
                .map(match => match[1])
            : [];

        const mentionRegex = /@([a-zA-Z0-9\-_]+)/g;
        const foundMentions = updatePostRequest.textContent
            ? [...updatePostRequest.textContent.matchAll(mentionRegex)]
                .map(match => match[1])
            : [];
        const foundUsers = await this.prismaService.user.findMany({
            where: {
                Profile: {
                    pseudo: { in: foundMentions }
                }
            }
        });

        await this.prismaService.post.update({
            where: { id: postId },
            data: {
                textContent: updatePostRequest.textContent,
                mediaUrls: updatePostRequest.mediaUrls,
                editedAt: new Date(),

                Hashtags: {
                    deleteMany: {},
                    create: foundHashtags.map(hashtag => ({
                        Hashtag: {
                            connectOrCreate: {
                                where: { name: hashtag },
                                create: { name: hashtag }
                            }
                        }
                    }))
                },

                Mentions: {
                    deleteMany: {},
                    create: foundUsers.map(user => ({
                        User: { connect: { id: user.id } }
                    }))
                }
            },
        });

        const updatedPost = await this.getPostDetailsById({ postId });

        return updatedPost;
    }

    async deletePost(postId: string): Promise<string> {
        const postExists = await this.prismaService.post.count({
            where: { id: postId },
        });

        if (!postExists)
            throw new NotFoundException(`Post with id ${postId} not found`);

        await this.prismaService.post.delete({
            where: { id: postId },
        });

        return `Post ${postId} deleted`;
    }

    transformPostToEnriched(
        originalPost: Post & {
            Likes?: { userId: string }[];
            Reposts?: { userId: string }[];
            Replies?: { userId: string }[];
        },
        userId: string,
    ): EnrichedPost {
        return {
            ...originalPost,
            _enriched: {
                isLiked: originalPost.Likes?.some(like => like.userId === userId) || false,
                isReposted: originalPost.Reposts?.some(repost => repost.userId === userId) || false,
                isReplied: originalPost.Replies?.some(reply => reply.userId === userId) || false,
            },
        };
    }

}
