import * as React from 'react';
import { cn } from '../../index';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card/Card';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';
import { StatisticCard } from '../StatisticCard/StatisticCard';
import { Timeline } from '../Timeline/Timeline';
import { Calendar } from '../Calendar/Calendar';
import { SVGLineChart, SVGBarChart } from '../ChartContainer/ChartContainer';

// 1. STATISTIC WIDGET
export const StatisticWidget: React.FC<{
  title: string;
  value: string | number;
  description?: string;
  trend?: { value: string | number; type: 'up' | 'down' | 'neutral' };
  icon?: React.ReactNode;
}> = ({ title, value, description, trend, icon }) => (
  <StatisticCard title={title} value={value} description={description} trend={trend} icon={icon} />
);

// 2. ACTIVITY WIDGET
export const ActivityWidget: React.FC<{
  title?: string;
  activities: { id: string; title: string; time: string; description?: string }[];
}> = ({ title = 'Recent Activities', activities }) => (
  <Card className="border border-border/60">
    <CardHeader className="p-5 pb-3">
      <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider font-heading">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-5 pt-0">
      <Timeline items={activities} />
    </CardContent>
  </Card>
);

// 3. ANNOUNCEMENT WIDGET
export const AnnouncementWidget: React.FC<{
  announcements: { id: string; title: string; content: string; date: string; author: string }[];
}> = ({ announcements }) => (
  <Card className="border border-border/60 select-none">
    <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
      <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider font-heading">
        Announcements
      </CardTitle>
      <Badge variant="info" className="text-[9px]">Syllabus Alerts</Badge>
    </CardHeader>
    <CardContent className="p-5 pt-0 flex flex-col gap-3.5">
      {announcements.map((ann) => (
        <div key={ann.id} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/20 border border-border/20">
          <div className="flex justify-between items-baseline gap-2">
            <h5 className="text-xs font-semibold text-foreground font-heading leading-tight">{ann.title}</h5>
            <span className="text-[9px] text-muted-foreground whitespace-nowrap">{ann.date}</span>
          </div>
          <p className="text-[11px] text-foreground/80 leading-relaxed mt-1">{ann.content}</p>
          <span className="text-[9px] text-muted-foreground mt-1">Published by: {ann.author}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

// 4. NOTIFICATION WIDGET
export const NotificationWidget: React.FC<{
  notifications: { id: string; title: string; description: string; type?: 'success' | 'error' | 'warning' | 'info' }[];
}> = ({ notifications }) => (
  <Card className="border border-border/60">
    <CardHeader className="p-5 pb-3">
      <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider font-heading">
        Portal Alerts
      </CardTitle>
    </CardHeader>
    <CardContent className="p-5 pt-0 flex flex-col gap-2.5">
      {notifications.map((n) => (
        <div key={n.id} className="p-2.5 rounded bg-muted/30 border border-border/20 text-xs flex gap-2.5 items-start">
          <div className="mt-0.5 shrink-0">
            {n.type === 'success' && <span className="text-emerald-500">✓</span>}
            {n.type === 'error' && <span className="text-red-500">✕</span>}
            {n.type === 'warning' && <span className="text-amber-500">⚠</span>}
            {n.type === 'info' && <span className="text-sky-500">ℹ</span>}
          </div>
          <div className="flex-1">
            <h5 className="font-semibold font-heading leading-none text-foreground">{n.title}</h5>
            <p className="text-muted-foreground text-[10px] mt-1 leading-normal">{n.description}</p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

// 5. CALENDAR WIDGET
export const CalendarWidget: React.FC = () => (
  <Card className="border border-border/60 flex items-center justify-center">
    <CardContent className="p-6">
      <Calendar value={new Date()} />
    </CardContent>
  </Card>
);

// 6. CHART WIDGET
export const ChartWidget: React.FC<{
  title: string;
  type: 'line' | 'bar';
  data: { label: string; value: number }[];
}> = ({ title, type, data }) => (
  <Card className="border border-border/60">
    <CardHeader className="p-5 pb-3">
      <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider font-heading">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-5 pt-0 h-[200px] flex items-end">
      {type === 'line' ? <SVGLineChart data={data} /> : <SVGBarChart data={data} />}
    </CardContent>
  </Card>
);

// 7. TASK WIDGET
export const TaskWidget: React.FC<{
  tasks: { id: string; label: string; checked: boolean }[];
  onToggleTask?: (id: string) => void;
}> = ({ tasks, onToggleTask }) => (
  <Card className="border border-border/60">
    <CardHeader className="p-5 pb-3">
      <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider font-heading">
        Personal Tasks
      </CardTitle>
    </CardHeader>
    <CardContent className="p-5 pt-0 flex flex-col gap-2">
      {tasks.map((t) => (
        <label
          key={t.id}
          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/20 border border-border/20 cursor-pointer text-xs group"
        >
          <input
            type="checkbox"
            checked={t.checked}
            onChange={() => onToggleTask?.(t.id)}
            className="rounded border-border text-primary bg-background focus:ring-0"
          />
          <span className={cn('text-foreground/80 group-hover:text-foreground font-medium', t.checked && 'line-through text-muted-foreground')}>{t.label}</span>
        </label>
      ))}
    </CardContent>
  </Card>
);

// 8. QUICK ACTIONS WIDGET
export const QuickActionsWidget: React.FC<{
  actions: { id: string; label: string; description: string; action: () => void; icon?: React.ReactNode }[];
}> = ({ actions }) => (
  <Card className="border border-border/60">
    <CardHeader className="p-5 pb-3">
      <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider font-heading">
        Quick Actions
      </CardTitle>
    </CardHeader>
    <CardContent className="p-5 pt-0 grid grid-cols-2 gap-3">
      {actions.map((act) => (
        <button
          key={act.id}
          onClick={act.action}
          className="p-3 text-left border border-border/50 rounded-lg hover:bg-muted/40 transition-colors flex flex-col gap-1 focus-visible:outline-none focus:outline-none"
        >
          <div className="flex items-center gap-2 text-primary">
            {act.icon}
            <span className="text-xs font-semibold font-heading leading-tight">{act.label}</span>
          </div>
          <span className="text-[10px] text-muted-foreground leading-normal">{act.description}</span>
        </button>
      ))}
    </CardContent>
  </Card>
);

// 9. AI ASSISTANT CHAT WIDGET
export const AIAssistantWidget: React.FC = () => {
  const [messages, setMessages] = React.useState<{ id: string; sender: 'user' | 'ai'; text: string }[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your EduVerse AI learning helper. How can I assist you with your classes or schedule today?' },
  ]);
  const [input, setInput] = React.useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Math.random().toString(), sender: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), sender: 'ai' as const, text: 'I am analyzing that request for you. As an enterprise helper, I can help schedule homework slots, review syllabuses, or display server stats.' },
      ]);
    }, 1000);
  };

  return (
    <Card className="border border-border/60 flex flex-col h-[320px] select-none overflow-hidden">
      <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <CardTitle className="text-xs font-bold uppercase tracking-wider font-heading">
            AI Assistant Help
          </CardTitle>
        </div>
        <Badge variant="primary" className="text-[8px] bg-indigo-500/10 text-indigo-400">Agentic Beta</Badge>
      </CardHeader>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'max-w-[80%] rounded-lg p-2.5 text-xs leading-normal',
              msg.sender === 'ai' ? 'bg-muted/40 border border-border/20 self-start text-foreground/90' : 'bg-primary text-primary-foreground self-end'
            )}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Form input */}
      <form onSubmit={handleSend} className="p-3 border-t border-border/40 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI anything..."
          className="flex-1 bg-muted/30 border border-input rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring focus:bg-background transition-all"
        />
        <Button type="submit" variant="primary" size="sm" className="text-xs h-8 px-3">
          Send
        </Button>
      </form>
    </Card>
  );
};
