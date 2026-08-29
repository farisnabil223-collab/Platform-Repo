'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';
import { cartRepository, Cart } from '../../repositories/CartRepository';
import { checkoutRepository } from '../../repositories/CheckoutRepository';
import { useAuthStore, Button, Card } from '@eduverse/ui';
import { CreditCard, ShoppingBag, ShieldCheck, Ticket, CheckCircle2, ArrowRight } from 'lucide-react';
import { analytics } from '../../utils/analytics';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const couponParam = searchParams.get('coupon') || '';

  const [cart, setCart] = useState<Cart | null>(null);
  const [totals, setTotals] = useState({ subtotal: 0, discount: 0, tax: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  // Form States
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [couponCode, setCouponCode] = useState(couponParam);
  const [appliedCoupon, setAppliedCoupon] = useState(couponParam);
  const [couponError, setCouponError] = useState('');

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/register?redirect=/checkout');
      return;
    }
    loadCheckoutDetails();
  }, [isAuthenticated, appliedCoupon]);

  const loadCheckoutDetails = async () => {
    setLoading(true);
    const cartData = await cartRepository.get();
    if (cartData) {
      setCart(cartData);
      const calc = await cartRepository.calculate(appliedCoupon || undefined);
      if (calc) {
        setTotals(calc);
      }
    }
    setLoading(false);
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode) return;

    const calc = await cartRepository.calculate(couponCode);
    if (calc) {
      setTotals(calc);
      setAppliedCoupon(couponCode);
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentLoading(true);

    const result = await checkoutRepository.checkout(appliedCoupon || undefined);
    if (result && result.order) {
      // Simulate Paymob webhook success right after checkout creation
      const simulatedTxn = 'paymob_txn_' + Date.now();
      await checkoutRepository.simulateWebhookSuccess(result.order.id, simulatedTxn);
      
      setOrderResult(result.order);
      setSuccess(true);
      analytics.trackEvent('checkout_success', { orderId: result.order.id, amount: totals.total });
    } else {
      window.alert('Checkout failed. Please review your cart.');
    }
    setPaymentLoading(false);
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="h-96 flex items-center justify-center animate-pulse">
          <span className="text-xs text-slate-500 font-bold">Preparing checkout session...</span>
        </div>
      </PublicLayout>
    );
  }

  if (success && orderResult) {
    return (
      <PublicLayout>
        <div className="max-w-md mx-auto py-16 text-center space-y-6 animate-fade-in">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-900 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Enrollment Activated!</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Your transaction has been processed securely. Your workspace and course access has been established.
            </p>
          </div>
          <Card className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-left text-xs divide-y divide-slate-800">
            <div className="pb-3 flex justify-between">
              <span className="text-slate-400">Order Number:</span>
              <span className="text-white font-bold">{orderResult.orderNumber}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="text-emerald-400 font-bold uppercase">PAID / ACTIVATED</span>
            </div>
            <div className="pt-3 flex justify-between">
              <span className="text-slate-400">Total Paid:</span>
              <span className="text-indigo-400 font-bold">${totals.total.toFixed(2)}</span>
            </div>
          </Card>
          <div className="pt-2">
            <Button
              onClick={() => router.push('/student/purchase-history')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
            >
              Go to Purchase History
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="space-y-10 animate-fade-in">
        <SectionHeader
          badge="Secure Checkout"
          title="Complete Your Enrollment"
          subtitle="All transactions are encrypted with absolute safety protocols. Set up billing details below."
        />

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Billing Form (Left 2 Columns) */}
          <form onSubmit={handleCheckoutSubmit} className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <CreditCard size={14} className="text-indigo-400" /> Credit Card Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Expiration Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">CVV</label>
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold px-2">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span>SSL Secured Checkout. 30-Day refund policies apply unconditionally.</span>
            </div>

            <Button
              type="submit"
              disabled={paymentLoading || !cart || cart.items.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg text-xs transition-colors flex items-center justify-center gap-2"
            >
              {paymentLoading ? 'Processing secure payment...' : `Authorize Transaction ($${totals.total.toFixed(2)})`}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>

          {/* Cart Summary (Right Column) */}
          <div className="space-y-6">
            <Card className="bg-slate-900 border border-slate-850 p-6 rounded-xl space-y-6 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-3">
                <ShoppingBag size={14} className="text-indigo-400" /> Order Summary
              </h3>

              <div className="space-y-3">
                {cart?.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-white font-bold block">{item.product.title}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-white font-bold shrink-0">
                      ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-xs border-t border-slate-800 pt-4">
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

              <div className="flex justify-between border-t border-slate-850 pt-4 text-xs font-bold text-white">
                <span>Total Due:</span>
                <span className="text-indigo-400 text-sm font-black">${totals.total.toFixed(2)}</span>
              </div>

              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2 border-t border-slate-850">
                <div className="relative flex-1">
                  <Ticket size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="w-full pl-8 pr-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition-colors"
                >
                  Apply
                </button>
              </form>
              {couponError && <span className="text-[10px] text-red-400 block">{couponError}</span>}
              {appliedCoupon && (
                <span className="text-[10px] text-emerald-400 font-bold block">
                  Coupon applied successfully! ({appliedCoupon.toUpperCase()})
                </span>
              )}
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <PublicLayout>
        <div className="h-96 flex items-center justify-center animate-pulse">
          <span className="text-xs text-slate-500 font-bold">Loading checkout console...</span>
        </div>
      </PublicLayout>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
