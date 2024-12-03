import { forwardRef, Module } from '@nestjs/common';
import { TimelineController } from './timeline.controller';
import { TimelineService } from './timeline.service';
import { PostsModule } from '../posts.module';

@Module({
  imports: [
    forwardRef(() => PostsModule)
  ],
  controllers: [TimelineController],
  providers: [TimelineService],
})
export class TimelineModule { }
