'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';
import { cartRepository, CartItem } from '../../repositories/CartRepository';
import { useAuthStore, Button, Card } from '@eduverse/ui';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Totals
  const [totals, setTotals] = useState({ subtotal: 0, discount: 0, tax: 0, total: 0 });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/register?redirect=/cart');
      return;
    }
    loadCart();
  }, [isAuthenticated]);

  const loadCart = async () => {
    setLoading(true);
    const cart = await cartRepository.get();
    if (cart) {
      setCartItems(cart.items || []);
      // Calculate totals
      const calc = await cartRepository.calculate(appliedCoupon || undefined);
      if (calc) {
        setTotals(calc);
      }
    }
    setLoading(false);
  };

  const handleQuantityChange = async (itemId: string, currentQty: number, delta: number) => {
    const nextQty = currentQty + delta;
    if (nextQty < 1) return;
    const success = await cartRepository.updateItem(itemId, nextQty);
    if (success) {
      loadCart();
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const success = await cartRepository.removeItem(itemId);
    if (success) {
      loadCart();
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode) return;

    const calc = await cartRepository.calculate(couponCode);
    if (calc) {
      setTotals(calc);
      setAppliedCoupon(couponCode);
      setCouponCode('');
    } else {
      setCouponError('Invalid or expired coupon code');
    }
  };

  const handleRemoveCoupon = async () => {
    setAppliedCoupon('');
    const calc = await cartRepository.calculate(undefined);
    if (calc) {
      setTotals(calc);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="h-96 flex flex-col items-center justify-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-slate-800" />
          <div className="h-4 w-32 bg-slate-800 rounded" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="space-y-10 animate-fade-in">
        <SectionHeader
          badge="Shopping Cart"
          title="Review Your Cart Selection"
          subtitle="Add courses or subscriptions to customize your academic path."
        />

        {cartItems.length === 0 ? (
          <Card className="p-12 text-center bg-slate-900 border-slate-800 flex flex-col items-center space-y-6">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-full text-indigo-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Your Cart is Empty</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Discover courses taught by verified professional instructors in Mathematics, Physics, and Tech.
              </p>
            </div>
            <Link href="/search">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-6 rounded-lg transition-colors">
                Browse Courses
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl gap-4 hover:border-indigo-500/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {item.product.thumbnail ? (
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-800"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-indigo-950/40 border border-indigo-900 flex items-center justify-center text-indigo-400 font-bold text-xs">
                        {item.product.type[0]}
                      </div>
                    )}
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                        {item.product.type}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{item.product.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {item.product.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-800">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-slate-950 border border-slate-850 rounded-lg p-0.5">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        className="p-1 hover:text-white text-slate-400 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold px-3 text-white">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        className="p-1 hover:text-white text-slate-400 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price and Action */}
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">
                        ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                      </div>
                      {item.product.discountPrice && (
                        <div className="text-[10px] text-slate-500 line-through">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 bg-slate-950 hover:bg-red-950/20 text-slate-400 hover:text-red-400 border border-slate-850 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="space-y-4">
              <div className="p-6 bg-slate-900 border border-slate-850 rounded-xl space-y-6">
                <h3 className="text-sm font-bold text-white">Order Summary</h3>

                <div className="space-y-3 text-xs border-b border-slate-800 pb-4">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">${totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span>-${totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Tax (14% VAT)</span>
                    <span className="font-semibold text-white">${totals.tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="flex justify-between items-center text-white">
                  <span className="text-xs font-semibold">Total</span>
                  <span className="text-lg font-bold text-indigo-400">${totals.total.toFixed(2)}</span>
                </div>

                {/* Coupon Application */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. EDU50)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-10 py-2 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1.5 p-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
                    >
                      <Tag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-400">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="flex justify-between items-center bg-slate-950 border border-slate-850 px-2.5 py-1.5 rounded-lg">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        Applied: {appliedCoupon}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[9px] font-bold hover:text-white text-slate-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                {/* Proceed Button */}
                <Link href={`/checkout?coupon=${appliedCoupon}`}>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs mt-4">
                    Proceed to Checkout
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>

                <div className="flex items-center gap-2 justify-center text-[10px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Secure SSL Checkout via Paymob
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
