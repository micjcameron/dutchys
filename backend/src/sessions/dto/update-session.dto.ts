import { IsEnum, IsInt, IsObject, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { ProductType } from '../../catalog/entities/base-product.entity';

export class UpdateSessionDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18)
  stepCompleted?: number;

  @IsOptional()
  @IsObject()
  currentProduct?: Record<string, unknown>;

  @IsOptional()
  @IsUUID()
  cartId?: string;

  @IsOptional()
  @IsEnum(ProductType)
  productType?: ProductType;
}
