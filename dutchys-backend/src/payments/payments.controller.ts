import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MollieWebhookDto } from './dto/mollie-webhook.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(dto);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() dto: MollieWebhookDto) {
    await this.paymentsService.handleWebhook(dto.id);
    return { received: true };
  }
}
