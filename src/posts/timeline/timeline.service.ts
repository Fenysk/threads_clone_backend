import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post, User } from '@prisma/client';
import { PaginationRequest } from 'src/common/dto/pagination.request';

@Injectable()
export class TimelineService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async getForYouTimeline({
        user,
        pagination,
    }: {
        user: User
        pagination: PaginationRequest
    }): Promise<Post[]> {
        const { page, limit } = pagination;

        const skip = (page - 1) * limit;

        const posts = await this.prismaService.post.findMany({
            where: {
                OR: [
                    // Posts originaux (non réponses, non quotes)
                    {
                        replyToId: null,
                        quoteToId: null,
                    },
                    // Reposts des utilisateurs
                    {
                        Reposts: {
                            some: {} // Tous les reposts
                        }
                    }
                ],
            },
            orderBy: [
                // Algorithme de tri basique
                {
                    Likes: {
                        _count: 'desc'
                    }
                },
                { createdAt: 'desc' },
            ],
            include: {
                Author: {
                    include: {
                        Profile: true,
                    }
                },
                Likes: {
                    where: {
                        userId: user.id, // Pour savoir si l'utilisateur a liké
                    }
                },
                Reposts: {
                    where: {
                        userId: user.id, // Pour savoir si l'utilisateur a reposté
                    }
                },
                _count: {
                    select: {
                        Replies: true,
                        Quotes: true,
                        Likes: true,
                        Reposts: true,
                        Hashtags: true,
                        Mentions: true,
                    }
                }
            },
            skip,
            take: limit,
        });

        await this.prismaService.post.updateMany({
            where: {
                id: {
                    in: posts.map(post => post.id)
                },
                authorId: {
                    not: user.id
                }
            },
            data: {
                viewsCount: {
                    increment: 1
                }
            }
        });

        return posts;
    }

    async getFollowingTimeline({
        user,
        pagination
    }: {
        user: User,
        pagination: PaginationRequest
    }): Promise<Post[]> {
        const { page, limit } = pagination;

        const skip = (page - 1) * limit;

        const followings = await this.prismaService.follow.findMany({
            where: {
                followerId: user.id
            },
            select: {
                followingId: true
            }
        });

        const followingIds = followings.map(follow => follow.followingId);

        const posts = await this.prismaService.post.findMany({
            where: {
                AND: [
                    {
                        authorId: {
                            in: followingIds
                        }
                    },
                    {
                        replyToId: null
                    }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                Author: {
                    include: {
                        Profile: true,
                    }
                },
                Likes: {
                    where: {
                        userId: user.id,
                    }
                },
                Reposts: {
                    where: {
                        userId: user.id,
                    }
                },
                Replies: {
                    include: {
                        Author: {
                            include: {
                                Profile: true,
                            }
                        },
                        _count: {
                            select: {
                                Replies: true,
                                Quotes: true,
                                Likes: true,
                                Reposts: true,
                                Hashtags: true,
                                Mentions: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        Replies: true,
                        Quotes: true,
                        Likes: true,
                        Reposts: true,
                        Hashtags: true,
                        Mentions: true,
                    }
                }
            },
            skip,
            take: limit,
        });

        await this.prismaService.post.updateMany({
            where: {
                id: {
                    in: posts.map(post => post.id)
                },
                authorId: {
                    not: user.id
                }
            },
            data: {
                viewsCount: {
                    increment: 1
                }
            }
        });

        return posts;
    }

}
