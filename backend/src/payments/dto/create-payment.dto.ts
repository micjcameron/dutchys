import { IsNotEmpty, IsObject, IsOptional, IsString, Matches } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsString()
  @Matches(/^\d+\.\d{2}$/)
  amountValue!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsString()
  redirectUrl?: string;

  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
