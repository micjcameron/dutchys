import { IsNotEmpty, IsString } from 'class-validator';

export class MollieWebhookDto {
  @IsString()
  @IsNotEmpty()
  id!: string;
}
