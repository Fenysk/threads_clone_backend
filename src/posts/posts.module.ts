import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TimelineService } from './services/timeline.service';

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    TimelineService,
  ]
})
export class PostsModule { }
