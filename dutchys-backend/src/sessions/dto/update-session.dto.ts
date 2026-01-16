import { IsInt, IsObject, IsOptional, IsUUID, Max, Min } from 'class-validator';

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
}
