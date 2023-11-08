import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddLikeInput {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  productId: string;

  @Field(() => Boolean)
  isLiked: boolean;
}
