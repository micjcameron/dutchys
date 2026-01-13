import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createMollieClient, MollieClient, PaymentStatus as MollieStatus } from '@mollie/api-client';
import axios from 'axios';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './payment.entity';
import { PaymentStatus } from './payment-status.enum';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly mollieClient: MollieClient | null;
  private readonly mollieApiKey: string;

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly configService: ConfigService,
  ) {
    this.mollieApiKey = this.configService.get<string>('MOLLIE_API_KEY', '');
    this.mollieClient = this.mollieApiKey ? createMollieClient({ apiKey: this.mollieApiKey }) : null;
  }

  async createPayment(dto: CreatePaymentDto) {
    const mollieClient = this.getMollieClient();
    const molliePayment = await mollieClient.payments.create({
      amount: {
        currency: dto.currency,
        value: dto.amountValue,
      },
      description: dto.description,
      redirectUrl: dto.redirectUrl,
      webhookUrl: dto.webhookUrl,
      metadata: dto.metadata,
    });

    const payment = this.paymentsRepository.create({
      molliePaymentId: molliePayment.id ?? null,
      status: this.mapStatus(molliePayment.status),
      amountValue: dto.amountValue,
      currency: dto.currency,
      description: dto.description ?? null,
      redirectUrl: dto.redirectUrl ?? null,
      webhookUrl: dto.webhookUrl ?? null,
      metadata: dto.metadata ?? null,
    });

    const saved = await this.paymentsRepository.save(payment);

    return {
      id: saved.id,
      molliePaymentId: saved.molliePaymentId,
      status: saved.status,
      checkoutUrl: molliePayment?._links?.checkout?.href ?? null,
    };
  }

  async handleWebhook(molliePaymentId: string): Promise<Payment | null> {
    this.assertApiKey();
    const molliePayment = await this.fetchMolliePayment(molliePaymentId);
    const payment = await this.paymentsRepository.findByMollieId(molliePaymentId);

    if (!payment) {
      this.logger.warn(`Payment not found for Mollie ID ${molliePaymentId}`);
      return null;
    }

    payment.status = this.mapStatus(molliePayment.status);
    return this.paymentsRepository.save(payment);
  }

  private async fetchMolliePayment(molliePaymentId: string) {
    const response = await axios.get(`https://api.mollie.com/v2/payments/${molliePaymentId}`, {
      headers: {
        Authorization: `Bearer ${this.mollieApiKey}`,
      },
    });

    return response.data as { status?: MollieStatus | null };
  }

  private getMollieClient(): MollieClient {
    if (!this.mollieClient) {
      throw new Error('MOLLIE_API_KEY is not configured');
    }

    return this.mollieClient;
  }

  private assertApiKey() {
    if (!this.mollieApiKey) {
      throw new Error('MOLLIE_API_KEY is not configured');
    }
  }

  private mapStatus(status?: MollieStatus | null): PaymentStatus {
    switch (status) {
      case 'paid':
        return PaymentStatus.Paid;
      case 'failed':
        return PaymentStatus.Failed;
      case 'canceled':
        return PaymentStatus.Canceled;
      case 'expired':
        return PaymentStatus.Expired;
      case 'open':
        return PaymentStatus.Open;
      case 'authorized':
        return PaymentStatus.Authorized;
      case 'pending':
      default:
        return PaymentStatus.Pending;
    }
  }
}
