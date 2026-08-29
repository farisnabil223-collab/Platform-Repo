import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from '../application/product.service';
import { CreateProductDto, UpdateProductDto, UpdatePriceDto } from './product.dto';

import { AuthGuard } from '@nestjs/passport';

@ApiTags('Admin Catalog')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('admin/products')
export class ProductAdminController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Admin search/filter all products' })
  async getProducts(
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    const data = await this.productService.getProducts({
      type,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      search,
      sort,
    });
    return {
      success: true,
      message: 'Admin products list fetched successfully',
      data: data.items,
      meta: {
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new catalog product in draft mode' })
  async createProduct(@Body() dto: CreateProductDto) {
    const product = await this.productService.createProduct(dto);
    return {
      success: true,
      message: 'Product draft created successfully',
      data: product,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update catalog product properties' })
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const product = await this.productService.updateProduct(id, dto);
    return {
      success: true,
      message: 'Product updated successfully',
      data: product,
    };
  }

  @Put(':id/price')
  @ApiOperation({ summary: 'Update product price with audit log history entry' })
  async updatePrice(@Param('id') id: string, @Body() dto: UpdatePriceDto) {
    const product = await this.productService.updateProductPrice(
      id,
      dto.newPrice,
      dto.newDiscountPrice,
      dto.reason
    );
    return {
      success: true,
      message: 'Product price updated and logged successfully',
      data: product,
    };
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit product for approval workflow step' })
  async submit(@Param('id') id: string) {
    const product = await this.productService.submitForApproval(id);
    return {
      success: true,
      message: 'Product submitted for approval successfully',
      data: product,
    };
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve product draft step' })
  async approve(@Param('id') id: string) {
    const product = await this.productService.approveProduct(id);
    return {
      success: true,
      message: 'Product approved successfully',
      data: product,
    };
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish product version to public list' })
  async publish(@Param('id') id: string) {
    const product = await this.productService.publishProduct(id);
    return {
      success: true,
      message: 'Product published and version bumped successfully',
      data: product,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete product' })
  async delete(@Param('id') id: string) {
    await this.productService.deleteProduct(id);
    return {
      success: true,
      message: 'Product soft-deleted successfully',
    };
  }

  @Get(':id/price-history')
  @ApiOperation({ summary: 'Retrieve product price revision history audit log' })
  async priceHistory(@Param('id') id: string) {
    const history = await this.productService.getPriceHistory(id);
    return {
      success: true,
      message: 'Price history audit retrieved successfully',
      data: history,
    };
  }
}
