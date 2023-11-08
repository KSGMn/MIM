import { Injectable } from '@nestjs/common';
import { Comments } from './entites/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export interface ICommentsServiceCreate {
  createCommentInput: CreateCommentInput;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
  ) {}

  findAll(): Promise<Comments[]> {
    return this.commentsRepository.find({
      relations: ['user', 'product'],
    });
  }

  async createComment({
    createCommentInput,
  }: ICommentsServiceCreate): Promise<Comments> {
    const { userId, productId, comment } = createCommentInput;

    const result = await this.commentsRepository.save({
      user: { id: userId },
      product: { id: productId },
      comment,
    });
    return result;
  }
}
