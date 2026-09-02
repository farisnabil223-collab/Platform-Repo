'use client';

import React from 'react';
import { PortalLayout, Button } from '@eduverse/ui';

export default function AdminAIAssistantPage() {
  const [messages, setMessages] = React.useState<any[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your Admin AI copilot helper. Select an option or prompt me to summarize security events, analyze financial margins, or audit logs.' },
  ]);
  const [inputText, setInputText] = React.useState('');

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = { id: Math.random().toString(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const aiMsg = { id: Math.random().toString(), sender: 'ai', text: `Analyzing system request: "${text}". All operational nodes healthy and telemetry parameters within normal threshold.` };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  const shortcuts = [
    { label: 'Security Summaries', prompt: 'Highlight suspicious failed login sessions logs.' },
    { label: 'Financial Insights', prompt: 'Audit monthly collected tuition revenue metrics.' },
  ];

  return (
    <PortalLayout
      role="ADMIN"
      pageTitle="AI Admin Copilot Hub"
      pageDescription="Analyze platform operational logs, inspect security alerts, or summarize support ticket resolutions."
    >
      <div className="grid lg:grid-cols-4 gap-6 items-start h-[500px]">
        {/* Chat Console */}
        <div className="lg:col-span-3 border border-border/60 bg-card rounded-xl flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg) => {
              const isSelf = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col max-w-[75%] ${isSelf ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div className={`p-3 rounded-lg text-xs leading-relaxed whitespace-pre-line select-none ${
                    isSelf ? 'bg-primary text-primary-foreground' : 'bg-muted/30 border border-border/30 text-foreground'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }}
            className="p-3 border-t border-border/60 bg-card flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send a prompt instructions..."
              className="flex-1 bg-muted/20 border border-input rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background text-foreground transition-all"
            />
            <Button type="submit" variant="primary" className="text-xs h-9 px-4">Prompt</Button>
          </form>
        </div>

        {/* Shortcuts */}
        <div className="lg:col-span-1 p-5 bg-card border border-border/60 rounded-xl flex flex-col gap-4 select-none">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">
            Copilot Shortcuts
          </h4>
          <div className="flex flex-col gap-2">
            {shortcuts.map((sc, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sc.prompt)}
                className="p-3 text-left border border-border/40 hover:border-primary/40 hover:bg-muted/15 rounded-lg text-[10px] font-semibold text-foreground transition-all"
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
