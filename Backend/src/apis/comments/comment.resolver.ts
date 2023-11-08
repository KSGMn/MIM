import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comment.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { Comments } from './entites/comment.entity';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query(() => [Comments])
  fetchComments(): Promise<Comments[]> {
    return this.commentsService.findAll();
  }

  @Mutation(() => Comments)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ): Promise<Comments> {
    return this.commentsService.createComment({ createCommentInput });
  }
}
