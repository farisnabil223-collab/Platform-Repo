'use client';
 

import React from 'react';
import { PortalLayout, Button } from '@eduverse/ui';

export default function ParentMessagesPage() {
  const [messages, setMessages] = React.useState<any[]>([
    { id: '1', sender: 'teacher', text: 'Hello Marcus, I wanted to discuss Sophia\'s progress on integral calculations. She is showing great improvements.', timestamp: '03:15 PM' },
  ]);
  const [inputText, setInputText] = React.useState('');

  const directory = [
    { name: 'Dr. Emily Watson', role: 'Calculus III Instructor', status: 'Online' },
    { name: 'Principal Arthur', role: 'School Administration', status: 'Offline' },
    { name: 'Sarah Miller', role: 'Homeroom Advisor', status: 'Online' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: Math.random().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
  };

  return (
    <PortalLayout
      role="PARENT"
      pageTitle="Guardian Communication Center"
      pageDescription="Coordinate directly with homeroom teachers, subject instructors, and administrative staff."
    >
      <div className="grid lg:grid-cols-4 gap-6 items-start h-[500px]">
        {/* Directory List */}
        <div className="lg:col-span-1 p-4 bg-card border border-border/60 rounded-xl flex flex-col gap-3 select-none h-full overflow-y-auto">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading pb-2 border-b border-border/40">
            Contacts Directory
          </h4>
          <div className="flex flex-col gap-2">
            {directory.map((c, idx) => (
              <div key={idx} className="p-2.5 bg-muted/10 border border-border/30 hover:border-primary/20 rounded-lg transition-all cursor-pointer">
                <h5 className="text-[11px] font-bold text-foreground font-heading">{c.name}</h5>
                <span className="text-[9px] text-muted-foreground block">{c.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Threads */}
        <div className="lg:col-span-3 border border-border/60 bg-card rounded-xl flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg) => {
              const isSelf = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col max-w-[70%] ${isSelf ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div className={`p-3 rounded-lg text-xs leading-normal select-none ${
                    isSelf ? 'bg-primary text-primary-foreground' : 'bg-muted/20 border border-border/20 text-foreground'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-muted-foreground mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-border/60 bg-card flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send message..."
              className="flex-1 bg-muted/20 border border-input rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background text-foreground transition-all"
            />
            <Button type="submit" variant="primary" className="text-xs h-9 px-4 font-heading">Send</Button>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}
