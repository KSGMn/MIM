// create-product.input.ts

import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { productSaleslocationInput } from 'src/apis/productsSaleslocations/entities/dto/product-saleslocation.input';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Min(0)
  @Field(() => Int)
  price: number;

  @Field(() => productSaleslocationInput)
  productSaleslocation: productSaleslocationInput;

  @Field(() => String)
  productCategoryId: string;

  @Field(() => [String])
  productTags: string[];

  @Field(() => String)
  userId: string;

  @Field(() => String)
  url: string;

  @Field(() => String)
  userName: string;

  @Field(() => String)
  userEmail: string;
}
