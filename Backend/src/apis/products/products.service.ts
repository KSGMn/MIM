// products.service.ts

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import {
  IProductServiceCheckSoldout,
  IProductsServiceCreate,
  IProductsServiceDelete,
  IProductsServiceFindOne,
  IProductsServiceUpdate,
} from './interfaces/products-service.interface';
import { ProductsSaleslocationsService } from '../productsSaleslocations/entities/productsSaleslocation.service';
import { ProductsTagsService } from '../productsTags/productsTags.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    private readonly productsSaleslocationsService: ProductsSaleslocationsService,

    private readonly productsTagsService: ProductsTagsService,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: [
        'productSaleslocation',
        'productCategory',
        'productTags',
        'user',
      ],
    });
  }

  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
      relations: ['productSaleslocation', 'productCategory', 'user'],
    });
  }

  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    // 2. 상품과 상품거래위치를 같이 등록하는 방법
    const {
      userEmail,
      userName,
      url,
      userId,
      productSaleslocation,
      productCategoryId,
      productTags,
      ...product
    } = createProductInput;

    // 2-1) 상품거래위치 등록
    const result = await this.productsSaleslocationsService.create({
      productSaleslocation,
    }); // 서비스를 타고 가야하는 이유는
    // 레파지토리에 직접 접근하면 검증 로직을 통일 시킬 수 없음

    // 2-2) 상품태그 등록
    // productTags가 ["#전자제품", "#영등포", "#컴퓨터"]와 같은 패턴으로 가정
    const tagNames = productTags.map((el) => el.replace('#', '')); // ["전자제품", "영등포", "컴퓨터"]
    const prevTags = await this.productsTagsService.findByNames({ tagNames });

    const temp = [];
    tagNames.forEach((el) => {
      const isExists = prevTags.find((prevEl) => el === prevEl.name);
      if (!isExists) temp.push({ name: el });
    });

    const newTags = await this.productsTagsService.bulkInsert({ names: temp }); // bulk-insert는 save()로 불가능

    const tags = [...prevTags, ...newTags.identifiers]; // newTags.identifiers  =>  등록된 id 배열. ex, [{ id: aaa }, { id: qqq }, ...]
    // 1. 실무에서 반드시 for문 써야하는 경우가 아니면, for문 잘 안 씀 => map, forEach 사용
    // 2. for안에서 await를 사용하지 않음 => 안티패턴 => Promise.all 사용
    // 3. DB에 동일한 패턴 데이터를 반복적으로 등록하지 않음(네트워크 왔다갔다 비효율) => bulk-insert 사용

    // 2-3) 상품 등록
    const result2 = this.productsRepository.save({
      ...product,
      productSaleslocation: result, // result 통째로 넣기 vs id만 빼서 넣기
      productCategory: {
        id: productCategoryId,
        // 만약에 name까지 받고싶다면
        // ==> createProductInput에 name까지 포함해서 받아오기
      },
      productTags: tags,
      user: {
        id: userId,
      },
      url,
      userName,
      userEmail,
    });

    return result2; // {id: akljdfq-1283aad, name: "마우스", description: "좋은 마우스", price: 3000}
  }

  async update({
    productId,
    updateProductInput,
  }: IProductsServiceUpdate): Promise<Product> {
    const { productTags } = updateProductInput;
    // 기존 있는 내용을 재사용하여, 로직을 통일
    const product = await this.findOne({ productId });
    const tagNames = productTags.map((el) => el.replace('#', ''));
    const prevTags = await this.productsTagsService.findByNames({ tagNames });
    const tags = [...prevTags];

    // 검증은 서비스에서 하자
    this.checkSoldout({ product });

    /* this.productsRepository.create() //DB 접속이랑 관련 없음 등록을 위해서 빈 껍데기 객체 만들기 위함
    this.productsRepository.insert() //결과를 객체로 못 돌려 받는 등록 방법
    this.productsRepository.update()//결과를 객체로 못 돌려 받는 수정 방법 */

    const result = this.productsRepository.save({
      ...product, // 수정 후, 수정되지 않은 다른 결과값까지 모두 객체로 돌려 받고 싶을 때
      ...updateProductInput,
      productTags: tags,
    });
    return result;
  }

  //1. checkSoldout을 함수로 만드는 이유 => 수정시, 삭제시 등 같은 검증 로직 사용
  checkSoldout({ product }: IProductServiceCheckSoldout): void {
    if (product.isSoldout) {
      throw new UnprocessableEntityException('이미 판매 완료된 상품입니다.');
    }
    // if (product.isSoldout) {
    //   throw new HttpException(
    //     '이미 판매 완료된 상품입니다.',
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    // 1. 실제 삭제
    // const result = await this.productsRepository.delete({ id: productId });
    // return result.affected ? true : false;

    //2. 소프트 삭제(직접구현) - isDeleted
    // this.productsRepository.update({id: productId}, {isDeleted: true})

    //3. 소프트 삭제(직접구현) deletedAt
    // this.productsRepository.update({id:productId}, {deletedAt:  new Date()})

    //4. 소프트 삭제(TypeORM 제공) - softRemove
    //this.productsRepository.softRemove({ id: productId });//단점: id로만 삭제 가능
    // 장점:여러 ID 한번에 지우기 가능
    //   .softeRemove([{id: qqq}, {id:aaa}, {id: zzz}])

    //5. 소프트 삭제 (TypeORM 제공) - softDelete
    const result = await this.productsRepository.softDelete({ id: productId }); //단점: 여러ID 한번에 지우기 불가능
    return result.affected ? true : false; //----------------------------------- 장점: 다른 컬럼으로도 삭제 가능 (id말고 다른것)
  }
}
