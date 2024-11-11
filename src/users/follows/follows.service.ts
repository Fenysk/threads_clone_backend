import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class FollowsService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async getMyFollowings({ userId }: { userId: string }): Promise<User[]> {
        const follows = await this.prisma.follow.findMany({
            where: {
                followerId: userId
            },
            include: {
                Following: {
                    include: {
                        Profile: true
                    }
                }
            }
        });

        const users = follows.map(follow => follow.Following);

        return users;
    }

    async getMyFollowers({ userId }: { userId: string }): Promise<User[]> {
        const follows = await this.prisma.follow.findMany({
            where: {
                followingId: userId
            },
            include: {
                Follower: {
                    include: {
                        Profile: true
                    }
                }
            }
        });

        const users = follows.map(follow => follow.Follower);

        return users;
    }

    async followUser({ followerId, followingId }: { followerId: string, followingId: string }): Promise<string> {
        if (followerId === followingId)
            throw new BadRequestException('You cannot follow yourself');

        const userToFollow = await this.prisma.user.findUnique({
            where: {
                id: followingId
            }
        });

        if (!userToFollow)
            throw new NotFoundException('User to follow not found');

        await this.prisma.follow.upsert({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            },
            create: {
                followerId,
                followingId
            },
            update: {}
        });

        return `User ${userToFollow.id} followed successfully`;
    }

    async unfollowUser({ followerId, followingId }: { followerId: string, followingId: string }): Promise<string> {
        if (followerId === followingId)
            throw new BadRequestException('You cannot unfollow yourself');

        const userToUnfollow = await this.prisma.user.findUnique({
            where: {
                id: followingId
            }
        });

        if (!userToUnfollow)
            throw new NotFoundException('User to unfollow not found');

        try {
            await this.prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId
                    }
                }
            });
        } catch (error) { }

        return `User ${userToUnfollow.id} unfollowed successfully`;
    }
}
