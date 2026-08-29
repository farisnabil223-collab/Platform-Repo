import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from '../application/cart.service';
import { AuthGuard } from '@nestjs/passport';

import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class AddItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  quantity?: number;
}

class UpdateQuantityDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity!: number;
}

@ApiTags('Student Cart')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('student/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private getMockUser(req: any) {
    // Return mock user if not logged in to facilitate testing
    return req.user?.id || 'd3b07384-d113-4ec2-a5d8-c04d021f1da8';
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve student cart details' })
  async getCart(@Request() req: any) {
    const userId = this.getMockUser(req);
    const cart = await this.cartService.getOrCreateCart(userId);
    return {
      success: true,
      message: 'Cart retrieved successfully',
      data: cart,
    };
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to shopping cart' })
  async addItem(@Request() req: any, @Body() dto: AddItemDto) {
    const userId = this.getMockUser(req);
    const cart = await this.cartService.addItem(userId, dto.productId, dto.quantity || 1);
    return {
      success: true,
      message: 'Item added to cart successfully',
      data: cart,
    };
  }

  @Put('items/:productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateQuantity(
    @Request() req: any,
    @Param('productId') productId: string,
    @Body() dto: UpdateQuantityDto
  ) {
    const userId = this.getMockUser(req);
    const cart = await this.cartService.updateQuantity(userId, productId, dto.quantity);
    return {
      success: true,
      message: 'Cart quantity updated successfully',
      data: cart,
    };
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeItem(@Request() req: any, @Param('productId') productId: string) {
    const userId = this.getMockUser(req);
    const cart = await this.cartService.removeItem(userId, productId);
    return {
      success: true,
      message: 'Item removed from cart successfully',
      data: cart,
    };
  }

  @Get('summary')
  @ApiOperation({ summary: 'Retrieve cart pricing totals calculation summary' })
  async getSummary(@Request() req: any, @Query('coupon') coupon?: string) {
    const userId = this.getMockUser(req);
    const summary = await this.cartService.calculateCartTotals(userId, coupon);
    return {
      success: true,
      message: 'Cart pricing summary calculated successfully',
      data: summary,
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Clear student cart' })
  async clearCart(@Request() req: any) {
    const userId = this.getMockUser(req);
    await this.cartService.clearCart(userId);
    return {
      success: true,
      message: 'Cart cleared successfully',
    };
  }
}
