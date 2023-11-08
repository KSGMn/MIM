import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LikeResponse } from './entities/liked.entity';
import { LikedService } from './liked.service';
import { AddLikeInput } from './dto/create-liked.input';
import { UpdateLikeInput } from './dto/update-liked.input';
import { User } from '../users/entities/user.entity';

@Resolver()
export class LikeResolver {
  constructor(private readonly likedService: LikedService) {}

  @Query(() => [LikeResponse])
  fetchLikes(@Args('userid') userId: string): Promise<LikeResponse[]> {
    return this.likedService.findAll(userId);
  }

  @Mutation(() => LikeResponse)
  async addLike(
    @Args('addLikeInput') addLikeInput: AddLikeInput,
  ): Promise<LikeResponse> {
    return this.likedService.addLike({ addLikeInput });
  }

  @Mutation(() => LikeResponse)
  async updateLike(@Args('updateLikeInput') updateLikeInput: UpdateLikeInput) {
    return this.likedService.updateLike({ updateLikeInput });
  }
}
