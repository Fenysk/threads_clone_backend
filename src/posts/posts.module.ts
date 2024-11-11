import { forwardRef, Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { LikesModule } from './likes/likes.module';
import { RepostsModule } from './reposts/reposts.module';
import { TimelineModule } from './timeline/timeline.module';

@Module({
  imports: [
    forwardRef(() => RepostsModule),
    forwardRef(() => LikesModule),
    TimelineModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule { }
