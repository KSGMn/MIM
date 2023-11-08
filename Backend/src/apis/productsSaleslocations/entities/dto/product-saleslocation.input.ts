import { InputType, OmitType } from '@nestjs/graphql';
import { ProductSaleslocation } from '../productsSaleslocations.entity';

@InputType()
export class productSaleslocationInput extends OmitType(
  ProductSaleslocation,
  ['id'],
  InputType,
) {}
