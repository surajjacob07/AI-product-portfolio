'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Brain,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
  ChevronRight,
  Database,
  Hash,
  Mail,
  Calendar,
  AlertTriangle,
  Gift,
} from 'lucide-react';
import { aiInsights } from '@/lib/mock-data';
import clsx from 'clsx';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const dataSources = [
  {
    name: 'HRMS Data',
    icon: Database,
    status: 'connected' as const,
    detail: '3,159 employees · 7 sources',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    name: 'Slack / Teams',
    icon: Hash,
    status: 'connected' as const,
    detail: '42 channels · Live sentiment',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    name: 'Outlook / Email',
    icon: Mail,
    status: 'partial' as const,
    detail: 'Subject-line analysis only',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    name: 'Calendar Milestones',
    icon: Calendar,
    status: 'connected' as const,
    detail: 'Birthdays, anniversaries, events',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
];

const suggestedQuestions = [
  'Which employees are at highest attrition risk this month?',
  'Show me upcoming work anniversaries in Engineering',
  'What is the current sentiment in the Customer Success team?',
  'Recommend gift budgets for Q2 based on department performance',
  'Which departments have low recognition frequency?',
  'Generate a personalized gift recommendation for Priya Sharma',
];

const insightIconMap: Record<string, React.ElementType> = {
  alert: AlertTriangle,
  recommendation: Gift,
  trend: TrendingUp,
};

const insightColorMap = {
  high: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', icon: 'text-red-500' },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500' },
  low: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: 'text-blue-500' },
};

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 message-appear">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
        <Brain size={14} className="text-white" />
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5 h-4">
          <div className="w-2 h-2 rounded-full bg-indigo-400 typing-dot"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-400 typing-dot"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-400 typing-dot"></div>
        </div>
      </div>
    </div>
  );
}

export default function ResearchPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hello! I'm AAGP's AI Research Engine, powered by Claude. I have full visibility into your HRMS data across 7 systems, real-time Slack/Teams sentiment for 42 channels, calendar milestones, and historical gifting data.

I can help you:
• **Detect attrition risk** — identify employees showing flight risk signals
• **Milestone recommendations** — upcoming birthdays, anniversaries, promotions
• **Department mood analysis** — sentiment trends from communication data
• **Budget optimization** — smart allocation based on impact data
• **Personalization** — gift recommendations tailored to individual preferences

What would you like to explore today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('API error');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setIsLoading(false);
      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.delta?.text || parsed.choices?.[0]?.delta?.content || '';
                if (delta) {
                  assistantContent += delta;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id ? { ...m, content: assistantContent } : m
                    )
                  );
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I encountered an error connecting to the AI engine. Please check your API key in `.env.local` and try again.',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^• /gm, '&bull; ')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-violet-500 uppercase tracking-widest bg-violet-50 px-2 py-0.5 rounded">Layer 2</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">AI Research Engine</h1>
          <p className="text-slate-500 mt-1">
            Claude-powered analysis of HRMS data, sentiment, milestones & attrition signals
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-green-400 pulse-green"></div>
          <span className="text-xs font-medium text-green-700">Claude 3.5 Active</span>
        </div>
      </div>

      {/* Three-panel layout */}
      <div className="grid grid-cols-12 gap-5 h-[calc(100%-5rem)]">

        {/* Left Panel — Data Sources */}
        <div className="col-span-2 space-y-3 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Data Sources</p>

          {dataSources.map((source) => {
            const Icon = source.icon;
            return (
              <div key={source.name} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center', source.bg)}>
                    <Icon size={13} className={source.color} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{source.name}</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {source.status === 'connected' ? (
                    <CheckCircle2 size={10} className="text-green-500" />
                  ) : (
                    <Clock size={10} className="text-amber-500" />
                  )}
                  <span className={clsx('text-[10px] font-medium', source.status === 'connected' ? 'text-green-600' : 'text-amber-600')}>
                    {source.status === 'connected' ? 'Live' : 'Partial'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">{source.detail}</p>
              </div>
            );
          })}

          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Model</p>
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={12} className="text-indigo-600" />
                <span className="text-[11px] font-bold text-indigo-700">Claude 3.5 Sonnet</span>
              </div>
              <p className="text-[10px] text-slate-500">Anthropic API · Streaming</p>
              <div className="mt-2 flex items-center gap-1">
                <div className="flex-1 h-1 bg-indigo-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-indigo-500 rounded-full"></div>
                </div>
                <span className="text-[9px] text-indigo-600 font-medium">75%</span>
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5">Context window used</p>
            </div>
          </div>
        </div>

        {/* Center Panel — Chat Interface */}
        <div className="col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Brain size={18} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">AAGP Research Engine</p>
              <p className="text-xs text-slate-500">Analyzing 3,159 employees · 42 Slack channels · 4 data streams</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 pulse-green"></div>
              <span className="text-xs text-green-600 font-medium">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 chat-scroll">
            {messages.map((message) => (
              <div
                key={message.id}
                className={clsx('flex items-start gap-3 message-appear', message.role === 'user' && 'flex-row-reverse')}
              >
                {/* Avatar */}
                <div className={clsx(
                  'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold',
                  message.role === 'assistant'
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600'
                    : 'bg-gradient-to-br from-slate-600 to-slate-800'
                )}>
                  {message.role === 'assistant' ? (
                    <Brain size={14} className="text-white" />
                  ) : (
                    <span className="text-white">U</span>
                  )}
                </div>

                {/* Bubble */}
                <div className={clsx(
                  'max-w-[80%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed',
                  message.role === 'assistant'
                    ? 'bg-white border border-slate-200 rounded-tl-sm text-slate-700'
                    : 'bg-gradient-to-br from-indigo-600 to-violet-600 rounded-tr-sm text-white'
                )}>
                  {message.content ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 h-4">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 typing-dot"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-400 typing-dot"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-400 typing-dot"></div>
                    </div>
                  )}
                  <p className={clsx('text-[10px] mt-2', message.role === 'assistant' ? 'text-slate-400' : 'text-white/60')}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-5 pb-3">
              <p className="text-xs text-slate-400 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="px-4 pb-4 pt-2 border-t border-slate-100">
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-300 focus-within:border-indigo-300 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about attrition risk, milestones, gift recommendations..."
                  className="w-full bg-transparent px-4 py-3 text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none"
                  rows={2}
                />
                <div className="px-4 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={12} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400">Shift+Enter for newline</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{input.length}/2000</span>
                </div>
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md',
                  input.trim() && !isLoading
                    ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-indigo-200'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                )}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel — AI Insights */}
        <div className="col-span-3 space-y-3 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">AI Insights</p>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
              {aiInsights.length} active
            </span>
          </div>

          {aiInsights.map((insight) => {
            const colors = insightColorMap[insight.priority];
            const Icon = insightIconMap[insight.type] || Zap;
            return (
              <div
                key={insight.id}
                className={clsx('rounded-xl border p-3 cursor-pointer hover:shadow-md transition-all', colors.bg, colors.border)}
              >
                <div className="flex items-start gap-2 mb-2">
                  <Icon size={14} className={clsx('flex-shrink-0 mt-0.5', colors.icon)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{insight.title}</p>
                  </div>
                  <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded capitalize flex-shrink-0', colors.badge)}>
                    {insight.priority}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed mb-2">{insight.description}</p>

                <div className="flex items-center justify-between">
                  {insight.department && (
                    <div className="flex items-center gap-1">
                      <Users size={10} className="text-slate-400" />
                      <span className="text-[10px] text-slate-500">{insight.department}</span>
                    </div>
                  )}
                  {insight.actionRequired && (
                    <button className="text-[10px] font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5">
                      Act <ChevronRight size={10} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Dept Mood Summary */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Dept Mood</p>
            <div className="space-y-2">
              {[
                { dept: 'Engineering', mood: 'positive', score: 82 },
                { dept: 'Sales', mood: 'positive', score: 76 },
                { dept: 'Marketing', mood: 'positive', score: 78 },
                { dept: 'HR', mood: 'neutral', score: 61 },
                { dept: 'Finance', mood: 'neutral', score: 58 },
                { dept: 'Cust. Success', mood: 'negative', score: 38 },
              ].map((d) => (
                <div key={d.dept} className="bg-white rounded-lg p-2 border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-slate-700">{d.dept}</span>
                    <div className="flex items-center gap-1">
                      {d.mood === 'positive' && <TrendingUp size={10} className="text-green-500" />}
                      {d.mood === 'negative' && <TrendingDown size={10} className="text-red-500" />}
                      {d.mood === 'neutral' && <AlertCircle size={10} className="text-amber-500" />}
                      <span className="text-[10px] font-bold text-slate-600">{d.score}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full transition-all', d.mood === 'positive' ? 'bg-green-400' : d.mood === 'negative' ? 'bg-red-400' : 'bg-amber-400')}
                      style={{ width: `${d.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
