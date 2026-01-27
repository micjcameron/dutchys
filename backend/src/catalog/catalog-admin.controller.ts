import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { BaseProductEntity } from './entities/base-product.entity';
import { OptionEntity } from './entities/option.entity';
import { OptionGroupEntity } from './entities/option-group.entity';
import { RuleEntity } from './entities/rule.entity';

@Controller('api/admin/catalog')
export class CatalogAdminController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('base-products')
  listBaseProducts() {
    return this.catalogService.listBaseProducts();
  }

  @Post('base-products')
  createBaseProduct(@Body() body: Partial<BaseProductEntity>) {
    return this.catalogService.createBaseProduct(body);
  }

  @Patch('base-products/:id')
  updateBaseProduct(@Param('id') id: string, @Body() body: Partial<BaseProductEntity>) {
    return this.catalogService.updateBaseProduct(id, body);
  }

  @Delete('base-products/:id')
  deleteBaseProduct(@Param('id') id: string) {
    return this.catalogService.deleteBaseProduct(id);
  }

  @Get('option-groups')
  listOptionGroups() {
    return this.catalogService.listOptionGroups();
  }

  @Post('option-groups')
  createOptionGroup(@Body() body: Partial<OptionGroupEntity>) {
    return this.catalogService.createOptionGroup(body);
  }

  @Patch('option-groups/:id')
  updateOptionGroup(@Param('id') id: string, @Body() body: Partial<OptionGroupEntity>) {
    return this.catalogService.updateOptionGroup(id, body);
  }

  @Delete('option-groups/:id')
  deleteOptionGroup(@Param('id') id: string) {
    return this.catalogService.deleteOptionGroup(id);
  }

  @Get('options')
  listOptions() {
    return this.catalogService.listOptions();
  }

  @Post('options')
  createOption(@Body() body: Partial<OptionEntity>) {
    return this.catalogService.createOption(body);
  }

  @Patch('options/:id')
  updateOption(@Param('id') id: string, @Body() body: Partial<OptionEntity>) {
    return this.catalogService.updateOption(id, body);
  }

  @Delete('options/:id')
  deleteOption(@Param('id') id: string) {
    return this.catalogService.deleteOption(id);
  }

  @Get('rules')
  listRules() {
    return this.catalogService.listRules();
  }

  @Post('rules')
  createRule(@Body() body: Partial<RuleEntity>) {
    return this.catalogService.createRule(body);
  }

  @Patch('rules/:id')
  updateRule(@Param('id') id: string, @Body() body: Partial<RuleEntity>) {
    return this.catalogService.updateRule(id, body);
  }

  @Delete('rules/:id')
  deleteRule(@Param('id') id: string) {
    return this.catalogService.deleteRule(id);
  }
}
