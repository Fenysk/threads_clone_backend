import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TimelineService } from './timeline.service';
import { Post, User } from '@prisma/client';
import { PaginationRequest } from 'src/common/dto/pagination.request';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { enrichedPost } from './models/enriched-post.model';

@Controller('timeline')
export class TimelineController {
    constructor(
        private readonly timelineService: TimelineService,
    ) { }

    @ApiOperation({ summary: 'Get my "for you" timeline' })
    @ApiResponse({ status: 200, description: 'The timeline has been successfully retrieved.' })
    @Get('for-you')
    getForYouTimeline(
        @GetUser() user: User,
        @Query() pagination: PaginationRequest
    ): Promise<enrichedPost[]> {
        return this.timelineService.getForYouTimeline({ user, pagination });
    }

    @ApiOperation({ summary: 'Get my following timeline' })
    @ApiResponse({ status: 200, description: 'The timeline has been successfully retrieved.' })
    @Get('following')
    getFollowingTimeline(
        @GetUser() user: User,
        @Query() pagination: PaginationRequest
    ): Promise<Post[]> {
        return this.timelineService.getFollowingTimeline({ user, pagination });
    }
}
