import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeResponse } from './entities/liked.entity';
import { AddLikeInput } from './dto/create-liked.input';
import { UpdateLikeInput } from './dto/update-liked.input';

export interface ILikeServiceAdd {
  addLikeInput: AddLikeInput;
}

interface ILikeServiceUpdate {
  updateLikeInput: UpdateLikeInput;
}

@Injectable()
export class LikedService {
  constructor(
    @InjectRepository(LikeResponse)
    private readonly likeRepository: Repository<LikeResponse>,
  ) {}

  findAll(userId: string): Promise<LikeResponse[]> {
    return this.likeRepository.find({
      relations: ['user', 'product'],
      where: {
        user: { id: userId },
      },
    });
  }

  async addLike({ addLikeInput }: ILikeServiceAdd): Promise<LikeResponse> {
    const { userId, productId } = addLikeInput;

    const result = await this.likeRepository.save({
      like: true,
      user: { id: userId },
      product: { id: productId },
    });
    return result;
  }

  async updateLike({
    updateLikeInput,
  }: ILikeServiceUpdate): Promise<LikeResponse> {
    const { userId, productId } = updateLikeInput;

    const likeRecord = await this.likeRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
    });
    if (likeRecord.like === true) {
      likeRecord.like = false;
      await this.likeRepository.save(likeRecord);
    } else if (likeRecord.like === false) {
      likeRecord.like = true;
      await this.likeRepository.save(likeRecord);
    }

    return likeRecord;
  }
}
