import { ArrayNotEmpty, IsArray, IsOptional, IsUUID } from 'class-validator';

export class CreateCartDto {
  @IsArray()
  @ArrayNotEmpty()
  items!: unknown[];

  @IsOptional()
  @IsUUID()
  sessionId?: string;
}
