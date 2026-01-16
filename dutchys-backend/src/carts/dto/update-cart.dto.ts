import { ArrayNotEmpty, IsArray } from 'class-validator';

export class UpdateCartDto {
  @IsArray()
  @ArrayNotEmpty()
  items!: unknown[];
}
