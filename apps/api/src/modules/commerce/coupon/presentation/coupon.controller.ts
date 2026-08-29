import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CouponService } from '../application/coupon.service';
import { CartService } from '../../cart/application/cart.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Coupons')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('coupons')
export class CouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly cartService: CartService
  ) {}

  private getMockUser(req: any) {
    return req.user?.id || 'd3b07384-d113-4ec2-a5d8-c04d021f1da8';
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a coupon code against current student cart' })
  async validate(@Request() req: any, @Body('code') code: string) {
    if (!code) throw new BadRequestException('Coupon code is required');
    const userId = this.getMockUser(req);
    const cart = await this.cartService.getOrCreateCart(userId);
    const summary = await this.cartService.calculateCartTotals(userId, undefined);

    const result = await this.couponService.validateCoupon(
      code,
      userId,
      summary.subtotal,
      cart.items
    );

    return {
      success: true,
      message: 'Coupon is valid',
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all campaigns coupons (Admin)' })
  async list(@Query('page') page = '1', @Query('limit') limit = '10') {
    const data = await this.couponService.getCoupons(parseInt(page, 10), parseInt(limit, 10));
    return {
      success: true,
      message: 'Coupons retrieved successfully',
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
  @ApiOperation({ summary: 'Create new discount campaign coupon (Admin)' })
  async create(@Body() body: any) {
    const coupon = await this.couponService.createCoupon(body);
    return {
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update coupon properties (Admin)' })
  async update(@Param('id') id: string, @Body() body: any) {
    const coupon = await this.couponService.updateCoupon(id, body);
    return {
      success: true,
      message: 'Coupon updated successfully',
      data: coupon,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete coupon (Admin)' })
  async delete(@Param('id') id: string) {
    await this.couponService.deleteCoupon(id);
    return {
      success: true,
      message: 'Coupon deleted successfully',
    };
  }
}
