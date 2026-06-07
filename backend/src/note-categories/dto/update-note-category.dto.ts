import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteCategoryDto } from './create-note-category.dto';

export class UpdateNoteCategoryDto extends PartialType(CreateNoteCategoryDto) {}
