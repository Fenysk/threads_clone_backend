import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { Post as PostModel, User } from '@prisma/client';
import { CreatePostRequest } from './dto/create-post.request';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationRequest } from 'src/common/dto/pagination.request';
import { TimelineService } from './timeline/timeline.service';
import { UpdatePostRequest } from './dto/update-post.request';
import { RepostsService } from './reposts/reposts.service';
import { LikesService } from './likes/likes.service';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly repostsService: RepostsService,
        private readonly likesService: LikesService,
        private readonly timelineService: TimelineService,
    ) { }

    @ApiOperation({ summary: 'Get my "for you" timeline' })
    @ApiResponse({ status: 200, description: 'The timeline has been successfully retrieved.' })
    @Get('for-you')
    getForYouTimeline(
        @GetUser() user: User,
        @Query() pagination: PaginationRequest
    ): Promise<PostModel[]> {
        return this.timelineService.getForYouTimeline({ user, pagination });
    }

    @ApiOperation({ summary: 'Get post details by id' })
    @ApiResponse({ status: 200, description: 'The post has been successfully retrieved.' })
    @Get('details/:postId')
    getPostById(
        @Param('postId') postId: string
    ): Promise<PostModel> {
        return this.postsService.getPostDetailsById({ postId });
    }

    @ApiOperation({ summary: 'Create a post' })
    @ApiResponse({ status: 201, description: 'The post has been successfully created.' })
    @Post()
    createPost(
        @GetUser() user: User,
        @Body() createPostRequest: CreatePostRequest
    ): Promise<PostModel> {
        return this.postsService.createPost({
            user,
            createPostRequest,
        });
    }

    @ApiOperation({ summary: 'Update a post' })
    @ApiResponse({ status: 200, description: 'The post has been successfully updated.' })
    @Put(':postId')
    updatePost(
        @Param('postId') postId: string,
        @Body() updatePostRequest: UpdatePostRequest
    ): Promise<PostModel> {
        return this.postsService.updatePost({ postId, updatePostRequest });
    }

    @ApiOperation({ summary: 'Delete a post' })
    @ApiResponse({ status: 200, description: 'The post has been successfully deleted.' })
    @Delete(':postId')
    deletePost(
        @Param('postId') postId: string
    ): Promise<string> {
        return this.postsService.deletePost(postId);
    }

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
