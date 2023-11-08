import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comments } from 'src/apis/comments/entites/comment.entity';
import { LikeResponse } from 'src/apis/liked/entities/liked.entity';
import { Product } from 'src/apis/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  //@Field(() => String) 비밀번호 노출 금지
  password: string;

  @Column()
  @Field(() => String)
  name: string;

  @OneToMany(() => Comments, (comments) => comments.user)
  @Field(() => [Comments], { nullable: true })
  userComments: Comments[];

  @OneToMany(() => LikeResponse, (likes) => likes.user)
  @Field(() => [LikeResponse], { nullable: true })
  userLikes: LikeResponse[];
}
