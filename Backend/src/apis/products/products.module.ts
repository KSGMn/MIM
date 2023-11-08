// products.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { ProductsSaleslocationsService } from '../productsSaleslocations/entities/productsSaleslocation.service';
import { ProductSaleslocation } from '../productsSaleslocations/entities/productsSaleslocations.entity';
import { ProductTag } from '../productsTags/entities/productsTags.entity';
import { ProductsTagsService } from '../productsTags/productsTags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, //
      ProductSaleslocation,
      ProductTag,
    ]),
  ],
  providers: [
    ProductsResolver, //
    ProductsService,
    ProductsSaleslocationsService,
    ProductsTagsService,
  ],
})
export class ProductsModule {}
