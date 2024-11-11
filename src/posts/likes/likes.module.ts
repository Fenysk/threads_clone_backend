import { forwardRef, Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { PostsModule } from '../posts.module';

@Module({
  imports: [
    forwardRef(() => PostsModule),
  ],
  controllers: [LikesController],
  providers: [LikesService]
})
export class LikesModule { }
