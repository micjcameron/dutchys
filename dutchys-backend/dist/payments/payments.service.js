"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const api_client_1 = require("@mollie/api-client");
const axios_1 = require("axios");
const payment_status_enum_1 = require("./payment-status.enum");
const payments_repository_1 = require("./payments.repository");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(paymentsRepository, configService) {
        this.paymentsRepository = paymentsRepository;
        this.configService = configService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
        this.mollieApiKey = this.configService.get('MOLLIE_API_KEY', '');
        this.mollieClient = this.mollieApiKey ? (0, api_client_1.createMollieClient)({ apiKey: this.mollieApiKey }) : null;
    }
    async createPayment(dto) {
        const mollieClient = this.getMollieClient();
        this.logger.log('Creating Mollie payment', {
            amountValue: dto.amountValue,
            currency: dto.currency,
            description: dto.description,
            redirectUrl: dto.redirectUrl,
            webhookUrl: dto.webhookUrl,
            metadata: dto.metadata,
        });
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
    async handleWebhook(molliePaymentId) {
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
    async getPayment(id) {
        const payment = await this.paymentsRepository.findById(id);
        if (payment) {
            return payment;
        }
        return this.paymentsRepository.findByMollieId(id);
    }
    async fetchMolliePayment(molliePaymentId) {
        this.logger.log('Fetching Mollie payment status', { molliePaymentId });
        const response = await axios_1.default.get(`https://api.mollie.com/v2/payments/${molliePaymentId}`, {
            headers: {
                Authorization: `Bearer ${this.mollieApiKey}`,
            },
        });
        return response.data;
    }
    getMollieClient() {
        if (!this.mollieClient) {
            throw new Error('MOLLIE_API_KEY is not configured');
        }
        return this.mollieClient;
    }
    assertApiKey() {
        if (!this.mollieApiKey) {
            throw new Error('MOLLIE_API_KEY is not configured');
        }
    }
    mapStatus(status) {
        switch (status) {
            case 'paid':
                return payment_status_enum_1.PaymentStatus.Paid;
            case 'failed':
                return payment_status_enum_1.PaymentStatus.Failed;
            case 'canceled':
                return payment_status_enum_1.PaymentStatus.Canceled;
            case 'expired':
                return payment_status_enum_1.PaymentStatus.Expired;
            case 'open':
                return payment_status_enum_1.PaymentStatus.Open;
            case 'authorized':
                return payment_status_enum_1.PaymentStatus.Authorized;
            case 'pending':
            default:
                return payment_status_enum_1.PaymentStatus.Pending;
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payments_repository_1.PaymentsRepository,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map