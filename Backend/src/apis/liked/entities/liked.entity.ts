import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class LikeResponse {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Boolean)
  like: boolean;

  @ManyToOne(() => User, (user) => user.userLikes)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Product, (product) => product.likes)
  @Field(() => Product)
  product: Product;
}
