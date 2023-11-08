import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsResolver } from './comment.resolver';
import { CommentsService } from './comment.service';
import { Comments } from './entites/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comments])],
  providers: [
    CommentsResolver, //
    CommentsService,
  ],
})
export class CommentsModule {}
