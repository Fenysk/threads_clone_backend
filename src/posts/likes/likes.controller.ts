import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User, Post as PostModel } from '@prisma/client';

@Controller('likes')
export class LikesController {
    constructor(
        private readonly likesService: LikesService,
    ) { }

    @ApiOperation({ summary: 'Get posts liked by user' })
    @ApiResponse({ status: 200, description: 'The posts have been successfully retrieved.' })
    @Get('my-likes')
    getMyLikes(
        @GetUser() user: User,
    ): Promise<PostModel[]> {
        return this.likesService.getMyLikes({ userId: user.id });
    }

    @ApiOperation({ summary: 'Like a post' })
    @ApiResponse({ status: 200, description: 'The post has been successfully liked.' })
    @Post('like/:postId')
    likePost(
        @GetUser() user: User,
        @Param('postId') postId: string
    ): Promise<string> {
        return this.likesService.likePost({ userId: user.id, postId });
    }

    @ApiOperation({ summary: 'Unlike a post' })
    @ApiResponse({ status: 200, description: 'The post has been successfully unliked.' })
    @Delete('unlike/:postId')
    unlikePost(
        @GetUser() user: User,
        @Param('postId') postId: string
    ): Promise<string> {
        return this.likesService.unlikePost({ userId: user.id, postId });
    }

}
