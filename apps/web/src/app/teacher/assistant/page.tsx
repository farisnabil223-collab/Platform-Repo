'use client';
 

import React from 'react';
import { PortalLayout, Button } from '@eduverse/ui';
import api from '../../../services/api';

export default function TeacherAIAssistantPage() {
  const [messages, setMessages] = React.useState<any[]>([
    { id: '1', sender: 'ai', text: 'Hello Emily! I can help you draft rubrics, generate quizzes, or analyze student performance trends. Select a shortcut below or send a prompt.' },
  ]);
  const [inputText, setInputText] = React.useState('');
  const [conversationId, setConversationId] = React.useState<string | null>(null);

  React.useEffect(() => {
    api.post('/v1/ai/copilot/conversations', { title: 'Teacher Chat Session' })
      .then((res: any) => {
        if (res?.conversationId) {
          setConversationId(res.conversationId);
        }
      })
      .catch((err) => console.error('Failed to create session:', err));
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || !conversationId) return;

    const userMsg = { id: Math.random().toString(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    try {
      const res: any = await api.post('/v1/ai/copilot/chat', {
        conversationId,
        content: text,
      });
      const aiMsg = { id: Math.random().toString(), sender: 'ai', text: res?.response || 'Mock reply.' };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
    }
  };

  const shortcuts = [
    { label: 'Rubric Generator', prompt: 'Draft a rubric for a 10-point limit computation assignment.' },
    { label: 'Quiz Generator', prompt: 'Create a 5-question multiple choice test on derivatives rules.' },
  ];

  return (
    <PortalLayout
      role="TEACHER"
      pageTitle="AI Teaching Assistant"
      pageDescription="Draft lesson syllabus outlines, generate tests sheets, and verify student performance indicators."
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

        {/* Shortcuts Panel */}
        <div className="lg:col-span-1 p-5 bg-card border border-border/60 rounded-xl flex flex-col gap-4 select-none">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">
            Prompt Suggestions
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
