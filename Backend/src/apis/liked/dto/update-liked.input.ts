import {
  Field,
  InputType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { AddLikeInput } from './create-liked.input';

@InputType()
export class UpdateLikeInput extends PartialType(AddLikeInput) {
  // 아래 내용들을 상속받음
  // name?: string
  // description?: string
  // price?: number
}

// PickType(CreateProductInput, ['name', 'price']); => 뽑기
// OmitType(CreateProductInput, ['description']);=> 빼기
// PartialType(CreateProductInput) => 물음표(있어도 되고 없어도 됨) 만들기
