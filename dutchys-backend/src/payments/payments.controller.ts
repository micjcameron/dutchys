import { Body, Controller, Get, HttpCode, Logger, NotFoundException, Param, Post } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MollieWebhookDto } from './dto/mollie-webhook.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPayment(@Body() dto: CreatePaymentDto) {
    this.logger.log('POST /payments', {
      amountValue: dto.amountValue,
      currency: dto.currency,
      description: dto.description,
      redirectUrl: dto.redirectUrl,
      webhookUrl: dto.webhookUrl,
      metadata: dto.metadata,
    });
    return this.paymentsService.createPayment(dto);
  }

  @Get(':id')
  async getPayment(@Param('id') id: string) {
    this.logger.log(`GET /payments/${id}`);
    const payment = await this.paymentsService.getPayment(id);
    if (!payment) {
      this.logger.warn(`Payment not found: ${id}`);
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() dto: MollieWebhookDto) {
    this.logger.log('POST /payments/webhook', { id: dto.id });
    await this.paymentsService.handleWebhook(dto.id);
    return { received: true };
  }
}
