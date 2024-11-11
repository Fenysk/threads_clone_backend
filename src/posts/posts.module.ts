import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TimelineService } from './timeline/timeline.service';
import { RepostsService } from './reposts/reposts.service';

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    TimelineService,
    RepostsService,
  ]
})
export class PostsModule { }
