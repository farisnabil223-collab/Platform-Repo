'use client';

import React, { useState, useEffect } from 'react';
import { PortalLayout } from '@eduverse/ui';
import { checkoutRepository } from '../../../repositories/CheckoutRepository';
import { cartRepository } from '../../../repositories/CartRepository';
import { useRouter } from 'next/navigation';
import { ShoppingBag, FileText, CheckCircle2, Clock, RotateCcw, ShieldCheck } from 'lucide-react';

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [renewingId, setRenewingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await checkoutRepository.getOrders(1, 20);
    if (data && data.items) {
      setOrders(data.items);
    }
    setLoading(false);
  };

  const handleRenewPlan = async (productId: string) => {
    setRenewingId(productId);
    const success = await cartRepository.add(productId, 1);
    if (success) {
      router.push('/cart');
    } else {
      window.alert('Failed to add plan to cart. Please try again.');
    }
    setRenewingId(null);
  };

  return (
    <PortalLayout
      role="STUDENT"
      pageTitle="Purchase & Billing History"
      pageDescription="Inspect past order logs, view invoice statements, download receipts, and manage subscription renewals."
    >
      {loading ? (
        <div className="h-96 flex items-center justify-center animate-pulse">
          <span className="text-xs text-slate-500 font-bold">Loading billing history...</span>
        </div>
      ) : (
        <div className="space-y-6 text-foreground select-none animate-fade-in">
          {orders.length === 0 ? (
            <div className="p-12 text-center border border-border rounded-2xl bg-card text-card-foreground shadow-sm space-y-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-heading">No Purchase Records Found</h3>
                <p className="text-xs text-muted-foreground">You haven't bought any courses or subscription plans yet.</p>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border text-muted-foreground font-bold">
                      <th className="p-4 uppercase tracking-wider font-heading">Order No.</th>
                      <th className="p-4 uppercase tracking-wider font-heading">Products Purchased</th>
                      <th className="p-4 uppercase tracking-wider font-heading">Total</th>
                      <th className="p-4 uppercase tracking-wider font-heading">Status</th>
                      <th className="p-4 uppercase tracking-wider font-heading">Date</th>
                      <th className="p-4 uppercase tracking-wider text-right font-heading">Billing Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-bold text-foreground font-mono">{order.orderNumber}</td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <span className="font-semibold text-foreground">{item.product.title}</span>
                                <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.2 rounded border border-border uppercase tracking-wider">
                                  {item.product.type}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-primary font-heading">${order.netAmount.toFixed(2)}</td>
                        <td className="p-4">
                          {order.status === 'PAID' ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-teal">
                              <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" /> PENDING
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            {/* Invoice PDF download */}
                            {order.invoices && order.invoices.length > 0 && (
                              <a
                                href={order.invoices[0].pdfUrl || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1 bg-muted/30 border border-border hover:border-primary/40 rounded-lg text-[10px] font-bold text-foreground hover:text-primary transition-colors"
                              >
                                <FileText className="w-3 h-3 text-primary" /> Invoice PDF
                              </a>
                            )}

                            {/* Renew subscription if order items contain a PLAN product */}
                            {order.items.some((item: any) => item.product.type === 'PLAN') && (
                              <button
                                disabled={renewingId !== null}
                                onClick={() => handleRenewPlan(order.items.find((item: any) => item.product.type === 'PLAN').product.id)}
                                className="flex items-center gap-1 px-2.5 py-1 bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-lg text-[10px] font-bold text-primary-foreground font-heading transition-colors"
                              >
                                <RotateCcw className="w-3 h-3" />
                                {renewingId ? 'Processing...' : 'Renew'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 justify-center text-[10px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            Platform checkout billing integration backed by SSL encryption.
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
