// src/catalog/catalog-public.controller.ts
import { Controller, Get, Headers, Param, Query, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { createHash } from 'crypto';
import { CatalogService } from './catalog.service';
import { ProductType } from './catalog.types';

@Controller('/public/catalog')
export class CatalogPublicController {
  constructor(private readonly catalogService: CatalogService) {}

  private normalizeProductType(value?: string): ProductType | undefined {
    if (!value) {
      return undefined;
    }

    const normalized = value
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/-/g, '_');

    if (
      normalized === 'COLDPLUNGE' ||
      normalized === 'COLD_PLUNGE' ||
      normalized === 'COOLER' ||
      normalized === 'COOLERS' ||
      normalized === 'ICEBATH' ||
      normalized === 'ICE_BATH'
    ) {
      return ProductType.COLD_PLUNGE;
    }

    if (normalized === 'HOT_TUB' || normalized === 'HOTTUB') {
      return ProductType.HOTTUB;
    }

    if (normalized === 'SAUNA' || normalized === 'SAUNAS') {
      return ProductType.SAUNA;
    }

    return normalized as ProductType;
  }

  @Get()
  @Throttle({ default: { limit: 30, ttl: 60 } })
  async getCatalog(
    @Query('type') type: ProductType | string | undefined,
    @Headers('if-none-match') ifNoneMatch: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    const payload = await this.catalogService.getPublicCatalog(this.normalizeProductType(type));
    const etag = `"${createHash('sha1').update(JSON.stringify(payload)).digest('hex')}"`;

    response.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    response.setHeader('ETag', etag);

    if (ifNoneMatch === etag) {
      response.status(304);
      return;
    }

    return payload;
  }

  @Get('products')
  @Throttle({ default: { limit: 30, ttl: 60 } })
  async getProductIds(@Query('type') type: ProductType | string | undefined) {
    return this.catalogService.getPublicProductIds(this.normalizeProductType(type));
  }

  @Get('products/:id')
  @Throttle({ default: { limit: 60, ttl: 60 } })
  async getProductById(@Param('id') id: string) {
    return this.catalogService.getPublicProductById(id);
  }

  @Get('template')
  @Throttle({ default: { limit: 30, ttl: 60 } })
  async getTemplate(@Query('type') type: ProductType | string | undefined) {
    const normalizedType = this.normalizeProductType(type);
    if (!normalizedType) {
      return null;
    }
    return this.catalogService.getPublicTemplate(normalizedType);
  }
}
