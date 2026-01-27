import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class EvaluateCatalogDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsOptional()
  @IsString()
  customerType?: string;

  @IsOptional()
  @IsObject()
  selections?: Record<string, unknown>;
}
