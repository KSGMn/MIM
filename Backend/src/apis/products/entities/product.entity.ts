import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comments } from 'src/apis/comments/entites/comment.entity';
import { LikeResponse } from 'src/apis/liked/entities/liked.entity';
import { ProductCategory } from 'src/apis/productsCategories/entities/productCategory.entity';
import { ProductSaleslocation } from 'src/apis/productsSaleslocations/entities/productsSaleslocations.entity';
import { ProductTag } from 'src/apis/productsTags/entities/productsTags.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => String)
  url: string;

  @Column()
  @Field(() => String)
  userName: string;

  @Column()
  @Field(() => String)
  userEmail: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isSoldout: boolean;

  @JoinColumn()
  @Field(() => ProductSaleslocation)
  @OneToOne(() => ProductSaleslocation)
  productSaleslocation: ProductSaleslocation;

  @ManyToOne(() => ProductCategory)
  @Field(() => ProductCategory)
  productCategory: ProductCategory;

  @ManyToOne(() => User)
  @Field(() => User, { nullable: true })
  user: User;

  @JoinTable()
  @ManyToMany(() => ProductTag, (productTags) => productTags.products)
  @Field(() => [ProductTag])
  productTags: ProductTag[];

  @DeleteDateColumn() //소프트 삭제 시간 기록을 위함
  deletedAt: Date;

  @OneToMany(() => Comments, (comments) => comments.product)
  @Field(() => [Comments])
  comments: Comments[];

  @OneToMany(() => LikeResponse, (likes) => likes.product)
  @Field(() => [LikeResponse])
  likes: LikeResponse[];
}
