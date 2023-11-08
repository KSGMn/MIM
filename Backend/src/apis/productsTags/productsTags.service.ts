// productsTags.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, InsertResult, Repository } from 'typeorm';
import { ProductTag } from './entities/productsTags.entity';
import {
  IProductsTagsServiceBulkInsert,
  IProductsTagsServiceFindByName,
} from './interfaces/products-tags-service.interface';
@Injectable()
export class ProductsTagsService {
  constructor(
    @InjectRepository(ProductTag)
    private readonly productsTagsRepository: Repository<ProductTag>,
  ) {}

  findByNames({
    tagNames,
  }: IProductsTagsServiceFindByName): Promise<ProductTag[]> {
    return this.productsTagsRepository.find({
      where: { name: In([...tagNames]) },
    });
  }

  bulkInsert({ names }: IProductsTagsServiceBulkInsert): Promise<InsertResult> {
    return this.productsTagsRepository.insert([...names]); // bulk-insert는 save()로 불가능
  }
}
