import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { Post as PostModel, User } from '@prisma/client';
import { CreatePostRequest } from './dto/create-post.request';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationRequest } from 'src/common/dto/pagination.request';
import { TimelineService } from './services/timeline.service';
import { UpdatePostRequest } from './dto/update-post.request';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
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
    @Get('details')
    getPostById(
        @Query('id') id: string
    ): Promise<PostModel> {
        return this.postsService.getPostDetailsById(id);
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
}
