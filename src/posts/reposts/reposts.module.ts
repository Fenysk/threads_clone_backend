import { forwardRef, Module } from '@nestjs/common';
import { RepostsService } from './reposts.service';
import { RepostsController } from './reposts.controller';
import { PostsModule } from '../posts.module';

@Module({
    imports: [
        forwardRef(() => PostsModule),
    ],
    controllers: [RepostsController],
    providers: [RepostsService],
})
export class RepostsModule { }
