import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RepostsService } from './reposts.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { Post as PostModel, User } from '@prisma/client';

@Controller('reposts')
export class RepostsController {
    constructor(
        private readonly repostsService: RepostsService,
    ) { }

    @ApiOperation({ summary: 'Get posts reposted by user' })
    @ApiResponse({ status: 200, description: 'The posts have been successfully retrieved.' })
    @Get('my-reposts')
    getMyReposts(
        @GetUser() user: User,
    ): Promise<PostModel[]> {
        return this.repostsService.getMyReposts({ userId: user.id });
    }

    @ApiOperation({ summary: 'Repost a post' })
    @ApiResponse({ status: 200, description: 'The post has been successfully reposted.' })
    @Post('repost/:postId')
    @HttpCode(HttpStatus.CREATED)
    repostPost(
        @GetUser() user: User,
        @Param('postId') postId: string
    ): Promise<string> {
        return this.repostsService.repostPost({ userId: user.id, postId });
    }

    @ApiOperation({ summary: 'Unrepost a post' })
    @ApiResponse({ status: 200, description: 'The post has been successfully unreposted.' })
    @Delete('unrepost/:postId')
    unrepostPost(
        @GetUser() user: User,
        @Param('postId') postId: string
    ): Promise<string> {
        return this.repostsService.unrepostPost({ userId: user.id, postId });
    }
}
