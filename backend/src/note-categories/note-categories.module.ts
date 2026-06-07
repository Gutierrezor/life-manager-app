import { Module } from '@nestjs/common';
import { NoteCategoriesController } from './note-categories.controller';
import { NoteCategoriesService } from './note-categories.service';

@Module({
  controllers: [NoteCategoriesController],
  providers: [NoteCategoriesService]
})
export class NoteCategoriesModule {}
