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

  private getBaseUrls() {
    const apiBaseUrl =
      this.configService.get<string>('NEXT_PUBLIC_API_BASE_URL') ??
      this.configService.get<string>('API_BASE_URL') ??
      '';
    const siteBaseUrl =
      this.configService.get<string>('NEXT_PUBLIC_SITE_URL') ??
      this.configService.get<string>('SITE_URL') ??
      '';

    const normalize = (value: string) => value.replace(/\/+$/, '');

    return {
      apiBaseUrl: apiBaseUrl ? normalize(apiBaseUrl) : '',
      siteBaseUrl: siteBaseUrl ? normalize(siteBaseUrl) : '',
    };
  }

  async createPayment(dto: CreatePaymentDto) {
    const mollieClient = this.getMollieClient();
    const { apiBaseUrl, siteBaseUrl } = this.getBaseUrls();
    if (!siteBaseUrl) {
      throw new Error('NEXT_PUBLIC_SITE_URL is not configured');
    }
    const redirectUrl = `${siteBaseUrl}/payment-success`;
    const webhookUrl = apiBaseUrl ? `${apiBaseUrl}/payments/webhook` : undefined;
    this.logger.log('Creating Mollie payment', {
      amountValue: dto.amountValue,
      currency: dto.currency,
      description: dto.description,
      redirectUrl,
      webhookUrl,
      metadata: dto.metadata,
    });
    const molliePayment = await mollieClient.payments.create({
      amount: {
        currency: dto.currency,
        value: dto.amountValue,
      },
      description: dto.description,
      redirectUrl,
      webhookUrl,
      metadata: dto.metadata,
    });

    const payment = this.paymentsRepository.create({
      molliePaymentId: molliePayment.id ?? null,
      status: this.mapStatus(molliePayment.status),
      amountValue: dto.amountValue,
      currency: dto.currency,
      description: dto.description ?? null,
      redirectUrl: redirectUrl ?? null,
      webhookUrl: webhookUrl ?? null,
      metadata: dto.metadata ?? null,
    });

    const saved = await this.paymentsRepository.save(payment);

    this.logger.log('Mollie payment created', {
      paymentId: saved.id,
      molliePaymentId: molliePayment.id ?? null,
      status: saved.status,
      checkoutUrl: molliePayment?._links?.checkout?.href ?? null,
    });

    return {
      id: saved.id,
      molliePaymentId: saved.molliePaymentId,
      status: saved.status,
      checkoutUrl: molliePayment?._links?.checkout?.href ?? null,
    };
  }

  async handleWebhook(molliePaymentId: string): Promise<Payment | null> {
    this.assertApiKey();
    this.logger.log('Handling Mollie webhook', { molliePaymentId });
    const molliePayment = await this.fetchMolliePayment(molliePaymentId);
    const payment = await this.paymentsRepository.findByMollieId(molliePaymentId);

    if (!payment) {
      this.logger.warn(`Payment not found for Mollie ID ${molliePaymentId}`);
      return null;
    }

    payment.status = this.mapStatus(molliePayment.status);
    this.logger.log('Updated payment status from Mollie', {
      molliePaymentId,
      status: payment.status,
    });
    return this.paymentsRepository.save(payment);
  }

  async getPayment(id: string): Promise<Payment | null> {
    const payment = await this.paymentsRepository.findById(id);
    if (payment) {
      return payment;
    }
    return this.paymentsRepository.findByMollieId(id);
  }

  private async fetchMolliePayment(molliePaymentId: string) {
    this.logger.log('Fetching Mollie payment status', { molliePaymentId });
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
        return PaymentStatus.PAID;
      case 'failed':
        return PaymentStatus.FAILED;
      case 'canceled':
        return PaymentStatus.CANCELED;
      case 'expired':
        return PaymentStatus.EXPIRED;
      case 'open':
        return PaymentStatus.OPEN;
      case 'authorized':
        return PaymentStatus.AUTHORIZED;
      case 'pending':
      default:
        return PaymentStatus.PENDING;
    }
  }
}
