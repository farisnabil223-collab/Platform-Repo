import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService } from '../application/product.service';
import { ProductType } from '@prisma/client';

@ApiTags('Public Catalog')
@Controller('public/products')
export class ProductPublicController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'List all public products with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getProducts(
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    const data = await this.productService.getProducts({
      type,
      visibility: 'PUBLIC',
      status: 'PUBLISHED',
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      search,
      sort,
    });
    return {
      success: true,
      message: 'Products fetched successfully',
      data: data.items,
      meta: {
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      },
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a product details by its unique slug' })
  async getProductBySlug(@Param('slug') slug: string) {
    const product = await this.productService.getProductBySlug(slug);
    return {
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    };
  }
}
