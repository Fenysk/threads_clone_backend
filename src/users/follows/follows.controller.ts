import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { FollowsService } from './follows.service';

@Controller('follows')
@ApiCookieAuth('accessToken')
export class FollowsController {
    constructor(
        private readonly followsService: FollowsService
    ) { }

    @ApiOperation({ summary: 'Get my following' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of users I follow'
    })
    @Get('my-followings')
    getMyFollowings(
        @GetUser() user: User
    ): Promise<User[]> {
        return this.followsService.getMyFollowings({ userId: user.id });
    }

    @ApiOperation({ summary: 'Get my followers' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of users following me'
    })
    @Get('my-followers')
    getMyFollowers(
        @GetUser() user: User
    ): Promise<User[]> {
        return this.followsService.getMyFollowers({ userId: user.id });
    }

    @ApiOperation({ summary: 'Follow a user' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The user has been successfully followed'
    })
    @Post('follow/:userId')
    @HttpCode(HttpStatus.CREATED)
    followUser(
        @GetUser() user: User,
        @Param('userId') userIdToFollow: string
    ): Promise<string> {
        return this.followsService.followUser({
            followerId: user.id,
            followingId: userIdToFollow
        });
    }

    @ApiOperation({ summary: 'Unfollow a user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The user has been successfully unfollowed'
    })
    @Delete('unfollow/:userId')
    unfollowUser(
        @GetUser() user: User,
        @Param('userId') userIdToUnfollow: string
    ): Promise<string> {
        return this.followsService.unfollowUser({
            followerId: user.id,
            followingId: userIdToUnfollow
        });
    }
}