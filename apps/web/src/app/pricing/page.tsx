'use client';

import React, { useEffect, useState } from 'react';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';
import FAQAccordion from '../../components/ui/FAQAccordion';
import { pricingRepository } from '../../repositories/PricingRepository';
import { Button } from '@eduverse/ui';
import { Check, X } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pricingRepository.getAll().then((data) => {
      setPlans(data);
      setLoading(false);
    });
  }, []);

  const pricingFaq = [
    { question: 'What payment methods are supported?', answer: 'We accept major credit cards (Visa, MasterCard, Amex) and localized school sponsor purchase orders.' },
    { question: 'Can I cancel my subscription anytime?', answer: 'Yes! Subscriptions (monthly or annual passes) can be cancelled at any time through your Profile Billing Console without penalties.' },
    { question: 'Do you offer a refund policy?', answer: 'Absolutely. We offer a 30-day money-back guarantee for all single course purchases and specialization bundles if you are unsatisfied with the syllabus.' },
  ];

  const featuresList = [
    { name: 'Public course directory browsing', free: true, single: true, bundle: true, annual: true },
    { name: 'Lesson video previews (first 2 lessons)', free: true, single: true, bundle: true, annual: true },
    { name: 'Full syllabus workspace access', free: false, single: '1 Course', bundle: 'Bundle Only', annual: 'All Courses' },
    { name: 'Grading certificates upon completion', free: false, single: true, bundle: true, annual: true },
    { name: 'Direct Q&A with instructor', free: false, single: true, bundle: true, annual: true },
    { name: 'Parent portal dashboard linking', free: false, free_note: false, single: false, bundle: false, annual: true },
    { name: 'AI Learning Assistant (24/7)', free: false, single: false, bundle: true, annual: true },
  ];

  return (
    <PublicLayout>
      <div className="space-y-16 select-none animate-fade-in">
        <SectionHeader
          badge="Pricing & Subscriptions"
          title="Transparent Pricing Packages"
          subtitle="Choose the model that matches your learning schedule. Direct course access, bundles, or annual subscription passes."
        />

        {/* Pricing Cards Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-slate-900 border border-slate-800 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-slate-900/60 border rounded-2xl p-5 flex flex-col justify-between h-[450px] shadow-lg ${
                  plan.popular ? 'border-indigo-500 bg-slate-900 shadow-indigo-500/5' : 'border-slate-800'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold font-heading text-white uppercase tracking-wider">{plan.name}</h4>
                    {plan.popular && (
                      <span className="text-[7px] bg-indigo-500/25 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 text-white">
                    <span className="text-2xl font-black font-heading">{plan.price}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      / {plan.period === 'one-time' ? 'lifetime' : plan.period}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed min-h-[40px]">{plan.description}</p>

                  <ul className="space-y-2 text-[10px] text-slate-300 pt-2 border-t border-slate-850">
                    {(plan.features || []).map((f: string) => (
                      <li key={f} className="flex items-start gap-1.5">
                        <Check size={10} className="text-indigo-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800/40">
                  <Link href={`/checkout?plan=${plan.id}`} className="block w-full">
                    <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full text-xs font-bold py-2 shadow-md">
                      {plan.ctaText}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feature Comparison Table */}
        <div className="space-y-6 pt-6">
          <SectionHeader
            title="Side-by-Side Features Comparison"
            subtitle="Understand precisely what privileges are unlocked with each learning tier."
          />

          <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-900/40 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-white font-heading text-[10px] uppercase tracking-wider">
                  <th className="p-4">Feature Privilege</th>
                  <th className="p-4 text-center">Free Plan</th>
                  <th className="p-4 text-center">Single Course</th>
                  <th className="p-4 text-center">Course Bundle</th>
                  <th className="p-4 text-center">Annual Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {featuresList.map((feature, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{feature.name}</td>
                    
                    {/* Free column */}
                    <td className="p-4 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? <Check size={14} className="text-indigo-400 mx-auto" /> : <X size={14} className="text-slate-600 mx-auto" />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500">{feature.free}</span>
                      )}
                    </td>

                    {/* Single column */}
                    <td className="p-4 text-center">
                      {typeof feature.single === 'boolean' ? (
                        feature.single ? <Check size={14} className="text-indigo-400 mx-auto" /> : <X size={14} className="text-slate-600 mx-auto" />
                      ) : (
                        <span className="text-[10px] font-bold text-white bg-slate-950 px-2 py-0.5 border border-slate-800 rounded">{feature.single}</span>
                      )}
                    </td>

                    {/* Bundle column */}
                    <td className="p-4 text-center">
                      {typeof feature.bundle === 'boolean' ? (
                        feature.bundle ? <Check size={14} className="text-indigo-400 mx-auto" /> : <X size={14} className="text-slate-600 mx-auto" />
                      ) : (
                        <span className="text-[10px] font-bold text-white bg-slate-950 px-2 py-0.5 border border-slate-800 rounded">{feature.bundle}</span>
                      )}
                    </td>

                    {/* Annual column */}
                    <td className="p-4 text-center">
                      {typeof feature.annual === 'boolean' ? (
                        feature.annual ? <Check size={14} className="text-indigo-400 mx-auto" /> : <X size={14} className="text-slate-600 mx-auto" />
                      ) : (
                        <span className="text-[10px] font-bold text-white bg-slate-950 px-2 py-0.5 border border-slate-800 rounded">{feature.annual}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing FAQs Accordion */}
        <div className="space-y-6 pt-6">
          <SectionHeader
            title="Subscription Policies & FAQ"
            subtitle="Learn about billing methods, cancellation periods, and refund guarantees."
          />
          <FAQAccordion items={pricingFaq} />
        </div>
      </div>
    </PublicLayout>
  );
}
