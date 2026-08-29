'use client';

import React from 'react';
import {
  PortalLayout,
  Icon,
  Button,
} from '@eduverse/ui';
import { studentService } from '../../../services/studentService';
import { mockConversations } from '../../../services/studentData';

export default function StudentMessagesPage() {
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [activeConv, setActiveConv] = React.useState<any | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [inputText, setInputText] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    studentService.getConversations().then((data) => {
      const items = data.length > 0 ? data : mockConversations;
      setConversations(items);
      if (items.length > 0) {
        setActiveConv(items[0]);
      }
      setLoading(false);
    });
  }, []);

  const filteredConversations = React.useMemo(() => {
    return conversations.filter((c) =>
      c.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const newMsg = {
      id: Math.random().toString(),
      sender: 'student' as const,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          const updatedMessages = [...c.messages, newMsg];
          const updatedConv = {
            ...c,
            lastMessage: inputText,
            messages: updatedMessages,
          };
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
      role="STUDENT"
      pageTitle="Communications Center"
      pageDescription="Coordinate with instructors, seek clarifications, and review attached documents."
    >
      {loading ? (
        <div className="p-12 text-center animate-pulse">
          <span className="text-xs text-muted-foreground">Loading conversations inbox...</span>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 border border-border/60 rounded-xl bg-card overflow-hidden shadow-sm h-[600px]">
          {/* Left Side: Conversation List & Search */}
          <div className="lg:col-span-1 border-r border-border/60 flex flex-col h-full select-none">
            {/* Search bar */}
            <div className="p-4 border-b border-border/40">
              <div className="relative">
                <Icon name="search" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 bg-muted/20 border border-input rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto flex flex-col">
              {filteredConversations.map((c) => {
                const isActive = activeConv?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveConv(c);
                      c.unreadCount = 0;
                    }}
                    className={`p-4 text-left border-b border-border/30 transition-all flex gap-3 items-start focus:outline-none ${
                      isActive ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/20'
                    }`}
                  >
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {c.recipientName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold text-foreground font-heading truncate">{c.recipientName}</h4>
                        {c.unreadCount > 0 && (
                          <span className="h-4 w-4 bg-primary text-primary-foreground text-[8px] rounded-full flex items-center justify-center font-bold shrink-0">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-muted-foreground font-semibold uppercase">{c.recipientRole}</span>
                      <p className="text-[10px] text-muted-foreground truncate mt-1">{c.lastMessage}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side: Chat Message Window */}
          <div className="lg:col-span-2 flex flex-col h-full bg-muted/5">
            {activeConv ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-border/60 bg-card flex justify-between items-center select-none">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {activeConv.recipientName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground font-heading">{activeConv.recipientName}</h4>
                      <span className="text-[9px] text-muted-foreground uppercase">{activeConv.recipientRole}</span>
                    </div>
                  </div>
                </div>

                {/* Message History list */}
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                  {activeConv.messages.map((msg: any) => {
                    const isSelf = msg.sender === 'student';
                    return (
                      <div key={msg.id} className={`flex flex-col max-w-[70%] ${isSelf ? 'self-end items-end' : 'self-start items-start'}`}>
                        <div className={`p-3 rounded-lg text-xs leading-normal ${
                          isSelf ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/40 text-foreground'
                        }`}>
                          {msg.text}
                          
                          {msg.attachment && (
                            <div className={`mt-2 p-2 rounded flex items-center gap-2 border text-[10px] ${
                              isSelf ? 'bg-primary-foreground/10 border-primary-foreground/20' : 'bg-muted/40 border-border/30'
                            }`}>
                              <Icon name="paperclip" size="sm" />
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold block truncate">{msg.attachment.name}</span>
                                <span className="text-[8px] opacity-80 block">{msg.attachment.size}</span>
                              </div>
                              <button className="hover:underline font-bold">Download</button>
                            </div>
                          )}
                        </div>
                        <span className="text-[8px] text-muted-foreground mt-1 select-none">{msg.timestamp}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Message form */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-border/60 bg-card flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-muted/20 border border-input rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
                  />
                  <Button type="submit" variant="primary" className="text-xs h-9 px-4 gap-1.5" disabled={!inputText.trim()}>
                    <Icon name="send" size="sm" /> Send
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center text-xs text-muted-foreground select-none">
                Select a conversation thread to start messaging.
              </div>
            )}
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
