import { Module } from '@nestjs/common';
import { BoardsResolver } from './boards.resolver';
import { BoardsService } from './boards.service';

@Module({
  imports: [],
  providers: [
    BoardsService, //
    BoardsResolver,
  ],
})
export class BoardsModule {}
