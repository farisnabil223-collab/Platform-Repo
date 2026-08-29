'use client';

import React, { useState } from 'react';
import PublicLayout from '../../components/PublicLayout';
import SectionHeader from '../../components/ui/SectionHeader';
import { Button, Input, Textarea } from '@eduverse/ui';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <PublicLayout>
      <div className="space-y-10 select-none max-w-lg mx-auto animate-fade-in">
        <SectionHeader
          badge="Support"
          title="Contact Administration"
          subtitle="Submit your query. Our academic response desk will reach out within 24 hours."
        />
        
        {sent ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-5 rounded-2xl text-xs font-semibold text-center">
            Message submitted successfully! Thank you.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              fullWidth
              className="bg-slate-950 border-slate-800 text-white"
            />
            <Input
              type="email"
              label="Email Address"
              placeholder="you@domain.com"
              required
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              fullWidth
              className="bg-slate-950 border-slate-800 text-white"
            />
            <Textarea
              label="Message"
              placeholder="Describe your inquiry..."
              required
              rows={4}
              value={message}
              onChange={(e: any) => setMessage(e.target.value)}
              fullWidth
              className="bg-slate-950 border-slate-800 text-white"
            />
            <Button type="submit" variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold py-2 shadow-md">
              Send Message
            </Button>
          </form>
        )}
      </div>
    </PublicLayout>
  );
}
