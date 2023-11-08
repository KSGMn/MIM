// products-tags-service.interface.ts

export interface IProductsTagsServiceFindByName {
  tagNames: string[];
}

export interface IProductsTagsServiceBulkInsert {
  names: {
    name: string;
  }[];
}
