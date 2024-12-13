import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { Post as PostModel, User } from '@prisma/client';
import { CreatePostRequest } from './dto/create-post.request';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdatePostRequest } from './dto/update-post.request';
import { EnrichedPost } from './timeline/models/enriched-post.model';

@ApiCookieAuth('accessToken')
@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) { }

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
    ): Promise<EnrichedPost> {
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
