'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { PortalLayout, Button, Icon } from '@eduverse/ui';
import { teacherMessagesService } from '../../../services/teacherMessagesService';

export default function TeacherMessagesPage() {
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [activeConv, setActiveConv] = React.useState<any | null>(null);
  const [inputText, setInputText] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    teacherMessagesService.getConversations().then((data) => {
      if (data.length === 0) {
        setConversations([
          {
            id: 'c1',
            recipientName: 'Sophia Johnson',
            recipientRole: 'Student',
            lastMessage: 'Is it fine if I upload Calculus notebook tomorrow?',
            messages: [
              { id: '1', sender: 'student', text: 'Is it fine if I upload Calculus notebook tomorrow?', timestamp: '09:00 AM' },
            ],
          },
        ]);
      } else {
        setConversations(data);
      }
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    if (conversations.length > 0 && !activeConv) {
      setActiveConv(conversations[0]);
    }
  }, [conversations, activeConv]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const newMsg = {
      id: Math.random().toString(),
      sender: 'teacher',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          const updated = [...c.messages, newMsg];
          const updatedConv = { ...c, lastMessage: inputText, messages: updated };
          setActiveConv(updatedConv);
          return updatedConv;
        }
        return c;
      })
    );
    setInputText('');
  };

  return (
    <PortalLayout
      role="TEACHER"
      pageTitle="Communications Hub"
      pageDescription="Reply to student course enquiries, share study guides, and publish broadcasts."
    >
      {loading ? (
        <div className="p-12 text-center animate-pulse">
          <span className="text-xs text-muted-foreground">Loading chat threads...</span>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 border border-border/60 rounded-xl bg-card overflow-hidden h-[500px]">
          {/* List */}
          <div className="lg:col-span-1 border-r border-border/60 flex flex-col h-full select-none">
            <div className="flex-grow overflow-y-auto">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  className={`w-full p-4 text-left border-b border-border/30 transition-all flex gap-3 items-start ${
                    activeConv?.id === c.id ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/20'
                  }`}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {c.recipientName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground font-heading">{c.recipientName}</h5>
                    <p className="text-[10px] text-muted-foreground truncate mt-1">{c.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Messages view */}
          <div className="lg:col-span-2 flex flex-col h-full bg-muted/5">
            {activeConv ? (
              <>
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                  {activeConv.messages.map((msg: any) => {
                    const isSelf = msg.sender === 'teacher';
                    return (
                      <div key={msg.id} className={`flex flex-col max-w-[75%] ${isSelf ? 'self-end items-end' : 'self-start items-start'}`}>
                        <div className={`p-3 rounded-lg text-xs leading-normal ${
                          isSelf ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/40 text-foreground'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[8px] text-muted-foreground mt-1 select-none">{msg.timestamp}</span>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-border/60 bg-card flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a response..."
                    className="flex-1 bg-muted/20 border border-input rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background text-foreground transition-all"
                  />
                  <Button type="submit" variant="primary" className="text-xs h-9 px-4">Send</Button>
                </form>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center text-xs text-muted-foreground select-none">
                Select a thread to start messaging.
              </div>
            )}
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
