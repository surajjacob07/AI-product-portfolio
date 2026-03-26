'use client';

import {
  Users,
  Gift,
  TrendingUp,
  Brain,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  Send,
  Settings,
  ChevronRight,
  Activity,
  Clock,
  Wallet,
  Lightbulb,
} from 'lucide-react';
import { recentActivity } from '@/lib/mock-data';
import clsx from 'clsx';
import Link from 'next/link';

const metrics = [
  {
    label: 'Total Employees',
    value: '3,159',
    change: '+12 this week',
    changeType: 'positive' as const,
    icon: Users,
    color: 'indigo',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    ringColor: 'ring-indigo-100',
  },
  {
    label: 'Gifts Sent This Month',
    value: '284',
    change: '+38% vs last month',
    changeType: 'positive' as const,
    icon: Gift,
    color: 'violet',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    ringColor: 'ring-violet-100',
  },
  {
    label: 'Budget Utilized',
    value: '₹26.2L',
    change: '71% of ₹36.9L total',
    changeType: 'neutral' as const,
    icon: Wallet,
    color: 'cyan',
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    ringColor: 'ring-cyan-100',
  },
  {
    label: 'Pending AI Recs',
    value: '47',
    change: '2 high priority',
    changeType: 'warning' as const,
    icon: Lightbulb,
    color: 'amber',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    ringColor: 'ring-amber-100',
  },
];

const layerCards = [
  {
    layer: 'Layer 1',
    title: 'HRMS Integration',
    description: 'Plug & Play connectors for Workday, SAP SF, Darwinbox, Keka, Oracle HCM, Xoxoday Plum, and Almonds AI via REST API/SSO/SCIM/Webhooks.',
    status: '5 Connected · 1 Syncing · 1 Error',
    statusColor: 'text-amber-600',
    statusBg: 'bg-amber-50',
    dotColor: 'bg-amber-400',
    connectors: ['Workday', 'SAP SF', 'Darwinbox', 'Keka', 'Oracle HCM'],
    href: '/hrms',
    gradient: 'from-indigo-500 to-indigo-600',
    metric: '3,159 employees synced',
  },
  {
    layer: 'Layer 2',
    title: 'AI Research Engine',
    description: 'Claude-powered engine analyzing HRMS data, Slack/Teams sentiment, Email/Calendar milestones for attrition prediction and personalized recommendations.',
    status: 'Operational · Claude 3.5 Active',
    statusColor: 'text-green-600',
    statusBg: 'bg-green-50',
    dotColor: 'bg-green-400',
    connectors: ['HRMS Data', 'Slack/Teams', 'Outlook', 'Calendars'],
    href: '/research',
    gradient: 'from-violet-500 to-purple-600',
    metric: '47 recommendations today',
  },
  {
    layer: 'Layer 3',
    title: 'Auto-Enablement & Fulfillment',
    description: 'Gift Cards (QwikCliver, Tillo), Meal Vouchers (Pluxee, Zaggle), MF Gift PPI (AMC Partners) delivered via WhatsApp/RCS/Email/D2C Widgets.',
    status: '4 Providers Active · 1 Maintenance',
    statusColor: 'text-green-600',
    statusBg: 'bg-green-50',
    dotColor: 'bg-green-400',
    connectors: ['QwikCliver', 'Tillo', 'Pluxee', 'AMC Partners'],
    href: '/fulfillment',
    gradient: 'from-cyan-500 to-teal-600',
    metric: '284 gifts delivered this month',
  },
];

const activityIconMap: Record<string, React.ElementType> = {
  gift: Gift,
  alert: AlertCircle,
  sync: RefreshCw,
  budget: Wallet,
};

const activityColorMap: Record<string, string> = {
  indigo: 'bg-indigo-100 text-indigo-600',
  red: 'bg-red-100 text-red-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  yellow: 'bg-yellow-100 text-yellow-600',
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-400 pulse-green"></div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">Live System</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            AAGP{' '}
            <span className="gradient-text">Command Center</span>
          </h1>
          <p className="text-slate-500 mt-1">
            Agentic AI Gift Platform — Real-time overview of all three layers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <RefreshCw size={14} />
            Sync All
          </button>
          <Link
            href="/research"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-200"
          >
            <Brain size={14} />
            AI Insights
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="metric-card card-hover bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center ring-4', metric.bg, metric.ringColor)}>
                  <Icon className={clsx('w-5 h-5', metric.iconColor)} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</p>
              <p className="text-sm text-slate-500 mb-2">{metric.label}</p>
              <div className="flex items-center gap-1">
                <span
                  className={clsx(
                    'text-xs font-medium',
                    metric.changeType === 'positive' && 'text-green-600',
                    metric.changeType === 'warning' && 'text-amber-600',
                    metric.changeType === 'neutral' && 'text-slate-500'
                  )}
                >
                  {metric.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Layer Status Cards */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Platform Architecture</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {layerCards.map((card) => (
            <div
              key={card.layer}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden card-hover"
            >
              {/* Gradient Header */}
              <div className={clsx('bg-gradient-to-r p-4', card.gradient)}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/70 uppercase tracking-widest">{card.layer}</span>
                  <Zap className="w-4 h-4 text-white/70" />
                </div>
                <h3 className="text-white font-bold text-lg mt-1">{card.title}</h3>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">{card.description}</p>

                {/* Status Badge */}
                <div className={clsx('flex items-center gap-2 px-3 py-2 rounded-lg', card.statusBg)}>
                  <div className={clsx('w-2 h-2 rounded-full pulse-green', card.dotColor)}></div>
                  <span className={clsx('text-xs font-medium', card.statusColor)}>{card.status}</span>
                </div>

                {/* Connector Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {card.connectors.map((c) => (
                    <span key={c} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {c}
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-400 px-2 py-0.5">+more</span>
                </div>

                {/* Metric */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">{card.metric}</span>
                  <Link href={card.href} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                    View <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row: Activity Feed + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <h3 className="font-semibold text-slate-800">Recent Activity</h3>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={11} /> Live Feed
            </span>
          </div>

          <div className="space-y-3">
            {recentActivity.map((item) => {
              const Icon = activityIconMap[item.icon] || Activity;
              const colorClass = activityColorMap[item.color] || 'bg-slate-100 text-slate-600';
              return (
                <div key={item.id} className="flex items-start gap-3 message-appear group">
                  <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', colorClass)}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">{item.message}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 flex-shrink-0 mt-1 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-violet-600" />
            <h3 className="font-semibold text-slate-800">Quick Actions</h3>
          </div>

          <div className="space-y-3">
            <Link
              href="/research"
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 border border-indigo-100 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Run AI Analysis</p>
                <p className="text-xs text-slate-500">Detect attrition & milestones</p>
              </div>
              <ChevronRight size={14} className="ml-auto text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/fulfillment"
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 border border-violet-100 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Send className="w-5 h-5 text-white" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Send Bulk Gifts</p>
                <p className="text-xs text-slate-500">47 pending recommendations</p>
              </div>
              <ChevronRight size={14} className="ml-auto text-violet-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/hrms"
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-cyan-50 to-teal-50 hover:from-cyan-100 hover:to-teal-100 border border-cyan-100 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-white" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Sync HRMS</p>
                <p className="text-xs text-slate-500">Force sync all connectors</p>
              </div>
              <ChevronRight size={14} className="ml-auto text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/analytics"
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-100 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">View Reports</p>
                <p className="text-xs text-slate-500">Q1 spend & impact analytics</p>
              </div>
              <ChevronRight size={14} className="ml-auto text-green-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center">
                <Settings className="w-5 h-5 text-slate-600" size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700">Configure Platform</p>
                <p className="text-xs text-slate-400">API keys, budgets, rules</p>
              </div>
              <ChevronRight size={14} className="ml-auto text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* System Health */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">System Health</p>
            <div className="space-y-2">
              {[
                { label: 'API Gateway', status: 'green' },
                { label: 'AI Inference', status: 'green' },
                { label: 'Gift Delivery Queue', status: 'green' },
                { label: 'Oracle HCM Sync', status: 'red' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{s.label}</span>
                  <div className="flex items-center gap-1.5">
                    {s.status === 'green' ? (
                      <>
                        <CheckCircle2 size={12} className="text-green-500" />
                        <span className="text-xs text-green-600">OK</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={12} className="text-red-500" />
                        <span className="text-xs text-red-600">Error</span>
                      </>
                    )}
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
