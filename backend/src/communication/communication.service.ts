import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { SubmitContactFormDto } from './dto/submit-contact-form.dto';
import type { Cart } from '../carts/cart.entity';
import type { Sale } from '../sales/sale.entity';

@Injectable()
export class CommunicationService {
  private readonly logger = new Logger(CommunicationService.name);

  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async submitContactForm(dto: SubmitContactFormDto) {
    const toEmail = this.configService.get<string>('CONTACT_FORM_TO_EMAIL', '');
    if (!toEmail) {
      throw new Error('CONTACT_FORM_TO_EMAIL is not configured');
    }

    const subject = `Nieuw contactformulier bericht van ${dto.name}`;
    const text = [
      `Naam: ${dto.name}`,
      `E-mail: ${dto.email}`,
      dto.phone ? `Telefoon: ${dto.phone}` : 'Telefoon: -',
      '',
      'Bericht:',
      dto.message,
    ].join('\n');

    const html = `
      <p><strong>Naam:</strong> ${dto.name}</p>
      <p><strong>E-mail:</strong> ${dto.email}</p>
      <p><strong>Telefoon:</strong> ${dto.phone ?? '-'}</p>
      <p><strong>Bericht:</strong></p>
      <p>${dto.message.replace(/\n/g, '<br />')}</p>
    `;

    const info = await this.mailService.sendMail({
      to: toEmail,
      subject,
      text,
      html,
      replyTo: dto.email,
    });

    this.logger.log('Contact form submitted', {
      to: toEmail,
      messageId: info.messageId,
    });

    return { success: true };
  }

  async sendSaleNotification(sale: Sale, cart: Cart) {
    const toEmail = this.configService.get<string>('SALES_TO_EMAIL', '');
    if (!toEmail) {
      throw new Error('SALES_TO_EMAIL is not configured');
    }

    const subject = `Nieuwe bestelling ${sale.id}`;
    const { saleFields, cartItemsText } = this.buildSaleSummary(sale, cart);

    const text = `${saleFields.map((field) => `${field.label}: ${field.value}`).join('\n')}\n\nCart items:\n${cartItemsText}`;

    const html = `
      <h2>Nieuwe bestelling</h2>
      <ul>
        ${saleFields
          .map((field) => `<li><strong>${field.label}:</strong> ${field.value}</li>`)
          .join('')}
      </ul>
      <h3>Cart items</h3>
      <pre>${cartItemsText}</pre>
    `;

    const info = await this.mailService.sendMail({
      to: toEmail,
      subject,
      text,
      html,
      replyTo: sale.email,
    });

    this.logger.log('Sale notification sent', {
      saleId: sale.id,
      to: toEmail,
      messageId: info.messageId,
    });

    return { success: true };
  }

  async sendDeliveryQuoteRequest(sale: Sale, cart: Cart) {
    const toEmail = this.configService.get<string>('SALES_TO_EMAIL', '');
    if (!toEmail) {
      throw new Error('SALES_TO_EMAIL is not configured');
    }

    const subject = `Offerte aanvraag levering & installatie ${sale.id}`;
    const { saleFields, cartItemsText } = this.buildSaleSummary(sale, cart);
    const introLine = 'De klant vraagt een offerte voor levering en installatie.';

    const text = `${introLine}\n\n${saleFields
      .map((field) => `${field.label}: ${field.value}`)
      .join('\n')}\n\nCart items:\n${cartItemsText}`;

    const html = `
      <h2>Offerte aanvraag levering &amp; installatie</h2>
      <p>${introLine}</p>
      <ul>
        ${saleFields
          .map((field) => `<li><strong>${field.label}:</strong> ${field.value}</li>`)
          .join('')}
      </ul>
      <h3>Cart items</h3>
      <pre>${cartItemsText}</pre>
    `;

    const info = await this.mailService.sendMail({
      to: toEmail,
      subject,
      text,
      html,
      replyTo: sale.email,
    });

    this.logger.log('Delivery quote email sent', {
      saleId: sale.id,
      to: toEmail,
      messageId: info.messageId,
    });

    return { success: true };
  }

  private buildSaleSummary(sale: Sale, cart: Cart) {
    const { total, missing } = this.getCartTotal(cart);
    const totalLabel = total == null
      ? 'Onbekend (prijzen ontbreken in cart)'
      : `€ ${this.formatMoney(total)}${missing > 0 ? ` (ontbrekend voor ${missing} item(s))` : ''}`;
    const normalizeOptional = (value?: string | null) =>
      value && value.trim().length > 0 ? value : '-';

    const saleFields = [
      { label: 'Sale ID', value: sale.id },
      { label: 'Cart ID', value: sale.cartId },
      { label: 'Product type', value: sale.productType ?? '-' },
      { label: 'Delivery', value: sale.delivery ? 'true' : 'false' },
      { label: 'Total price', value: totalLabel },
      { label: 'First name', value: sale.firstName },
      { label: 'Last name', value: sale.lastName },
      { label: 'Email', value: sale.email },
      { label: 'Phone', value: normalizeOptional(sale.phone) },
      { label: 'Street', value: sale.street },
      { label: 'House number', value: sale.houseNumber },
      { label: 'Postal code', value: sale.postalCode },
      { label: 'City', value: sale.city },
      { label: 'Country', value: sale.country },
      { label: 'Delivery notes', value: normalizeOptional(sale.deliveryNotes) },
      { label: 'Created at', value: sale.createdAt?.toISOString?.() ?? String(sale.createdAt) },
    ];

    const cartItems = Array.isArray(cart.items) ? cart.items : [];
    const cartItemsText = JSON.stringify(cartItems, null, 2);

    return { saleFields, cartItemsText };
  }

  private getCartTotal(cart: Cart) {
    const items = Array.isArray(cart.items) ? cart.items : [];
    let total = 0;
    let counted = 0;
    let missing = 0;

    for (const item of items as Array<Record<string, unknown>>) {
      const quantityRaw = item.quantity;
      const quantity = typeof quantityRaw === 'number' && Number.isFinite(quantityRaw) ? quantityRaw : 1;
      const priceIncl = item.priceIncl;
      const priceExcl = item.priceExcl;
      const price =
        typeof priceIncl === 'number' && Number.isFinite(priceIncl)
          ? priceIncl
          : typeof priceExcl === 'number' && Number.isFinite(priceExcl)
            ? priceExcl
            : null;

      if (price == null) {
        missing += 1;
        continue;
      }

      total += price * quantity;
      counted += 1;
    }

    return { total: counted > 0 ? total : null, missing };
  }

  private formatMoney(value: number) {
    return value.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
