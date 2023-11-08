import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeResolver } from './liked.resolver';
import { LikedService } from './liked.service';
import { LikeResponse } from './entities/liked.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LikeResponse, //
    ]),
  ],
  providers: [
    LikeResolver, //
    LikedService,
  ],
})
export class LikedModule {}
