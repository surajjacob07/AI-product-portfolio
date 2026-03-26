'use client';

import { useState } from 'react';
import {
  Gift,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  MessageSquare,
  Mail,
  Smartphone,
  Monitor,
  TrendingUp,
  Package,
  Zap,
  ChevronRight,
  Send,
  Filter,
} from 'lucide-react';
import { departments, giftOrders, giftProviders, GiftProvider } from '@/lib/mock-data';
import clsx from 'clsx';

const orderStatusConfig = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock, border: 'border-amber-200' },
  processing: { label: 'Processing', color: 'text-blue-700', bg: 'bg-blue-100', icon: Loader2, border: 'border-blue-200' },
  delivered: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle2, border: 'border-green-200' },
  failed: { label: 'Failed', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle, border: 'border-red-200' },
};

const providerTypeConfig = {
  'gift-card': { label: 'Gift Cards', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  'meal-voucher': { label: 'Meal Vouchers', color: 'text-green-700', bg: 'bg-green-100' },
  'mf-gift': { label: 'MF Gift PPI', color: 'text-cyan-700', bg: 'bg-cyan-100' },
};

const providerStatusConfig = {
  active: { label: 'Active', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-400' },
  inactive: { label: 'Inactive', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', dot: 'bg-slate-300' },
  maintenance: { label: 'Maintenance', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-400' },
};

const deliveryChannels = [
  {
    name: 'WhatsApp',
    icon: MessageSquare,
    status: 'active' as const,
    sent: 142,
    deliveryRate: 98.2,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    name: 'RCS / Email',
    icon: Mail,
    status: 'active' as const,
    sent: 89,
    deliveryRate: 96.7,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'SMS',
    icon: Smartphone,
    status: 'active' as const,
    sent: 38,
    deliveryRate: 99.1,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    name: 'D2C Widget',
    icon: Monitor,
    status: 'active' as const,
    sent: 15,
    deliveryRate: 100,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    gradient: 'from-cyan-500 to-teal-600',
  },
];

function ProviderCard({ provider }: { provider: GiftProvider }) {
  const status = providerStatusConfig[provider.status];
  const typeConfig = providerTypeConfig[provider.type];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div className="h-1.5 w-full" style={{ backgroundColor: provider.color }}></div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-800">{provider.name}</h3>
            <span className={clsx('text-[11px] font-medium px-2 py-0.5 rounded-full', typeConfig.bg, typeConfig.color)}>
              {typeConfig.label}
            </span>
          </div>
          <div className={clsx('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', status.bg, status.color, status.border)}>
            <div className={clsx('w-1.5 h-1.5 rounded-full', status.dot, provider.status === 'active' && 'pulse-green')}></div>
            {status.label}
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-3 leading-relaxed">{provider.description}</p>

        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <Package size={11} />
            {provider.catalogSize.toLocaleString()} catalog items
          </span>
          <span className="text-slate-400 font-mono text-[10px]">API {provider.apiVersion}</span>
        </div>

        <div className="flex gap-2">
          <button
            disabled={provider.status !== 'active'}
            className={clsx(
              'flex-1 py-1.5 text-xs font-medium rounded-lg transition-all',
              provider.status === 'active'
                ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'
                : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100'
            )}
          >
            Test Connection
          </button>
          <button className="px-3 py-1.5 text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100 rounded-lg transition-all">
            Configure
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FulfillmentPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'processing' | 'delivered' | 'failed'>('all');

  const filteredOrders = activeTab === 'all'
    ? giftOrders
    : giftOrders.filter((o) => o.status === activeTab);

  const totalBudget = departments.reduce((s, d) => s + d.allocatedBudget, 0);
  const usedBudget = departments.reduce((s, d) => s + d.usedBudget, 0);
  const utilizationPct = Math.round((usedBudget / totalBudget) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-2 py-0.5 rounded">Layer 3</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Auto-Enablement & Fulfillment</h1>
          <p className="text-slate-500 mt-1">
            Gift Cards, Meal Vouchers & MF Gift PPI delivered via WhatsApp, RCS, Email & D2C Widgets
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-200">
          <Send size={14} />
          Send Bulk Gifts
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'Total Budget', value: `₹${(totalBudget / 100000).toFixed(1)}L`, sub: 'FY2024 allocation', color: 'text-slate-800', bg: 'bg-white', icon: '₹' },
          { label: 'Utilized', value: `₹${(usedBudget / 100000).toFixed(1)}L`, sub: `${utilizationPct}% of total`, color: 'text-indigo-700', bg: 'bg-indigo-50', icon: '↑' },
          { label: 'Gifts Delivered', value: '284', sub: 'This month', color: 'text-green-700', bg: 'bg-green-50', icon: '✓' },
          { label: 'Pending Queue', value: '47', sub: 'Awaiting dispatch', color: 'text-amber-700', bg: 'bg-amber-50', icon: '⏳' },
        ].map((stat) => (
          <div key={stat.label} className={clsx('rounded-2xl p-4 border border-slate-100 shadow-sm', stat.bg === 'bg-white' ? 'bg-white border-slate-100' : stat.bg)}>
            <p className="text-xs text-slate-500 font-medium mb-1">{stat.label}</p>
            <p className={clsx('text-2xl font-bold', stat.color)}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Department Budget Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h2 className="font-semibold text-slate-800">Department Budget Tracker</h2>
          </div>
          <span className="text-xs text-slate-500">Q1 FY2024</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full enterprise-table">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left">Department</th>
                <th className="px-5 py-3 text-left">Manager</th>
                <th className="px-5 py-3 text-right">Headcount</th>
                <th className="px-5 py-3 text-right">Allocated</th>
                <th className="px-5 py-3 text-right">Used</th>
                <th className="px-5 py-3 text-right">Remaining</th>
                <th className="px-5 py-3 text-left">Utilization</th>
                <th className="px-5 py-3 text-left">Sentiment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {departments.map((dept) => {
                const pct = Math.round((dept.usedBudget / dept.allocatedBudget) * 100);
                const remaining = dept.allocatedBudget - dept.usedBudget;
                const sentimentConfig = {
                  positive: { label: 'Positive', color: 'text-green-700', bg: 'bg-green-100' },
                  neutral: { label: 'Neutral', color: 'text-amber-700', bg: 'bg-amber-100' },
                  negative: { label: 'Negative', color: 'text-red-700', bg: 'bg-red-100' },
                };
                const sentiment = sentimentConfig[dept.sentiment];

                return (
                  <tr key={dept.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-semibold text-slate-800">{dept.name}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500">{dept.manager}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 text-right">{dept.headcount}</td>
                    <td className="px-5 py-3 text-sm font-medium text-slate-800 text-right">
                      ₹{(dept.allocatedBudget / 1000).toFixed(0)}K
                    </td>
                    <td className="px-5 py-3 text-sm text-indigo-600 font-medium text-right">
                      ₹{(dept.usedBudget / 1000).toFixed(0)}K
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500 text-right">
                      ₹{(remaining / 1000).toFixed(0)}K
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={clsx(
                              'h-full rounded-full transition-all',
                              pct >= 85 ? 'bg-red-400' : pct >= 60 ? 'bg-amber-400' : 'bg-indigo-400'
                            )}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className={clsx(
                          'text-xs font-bold w-8 text-right',
                          pct >= 85 ? 'text-red-600' : pct >= 60 ? 'text-amber-600' : 'text-indigo-600'
                        )}>
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', sentiment.bg, sentiment.color)}>
                        {sentiment.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gift Providers + Delivery Channels */}
      <div className="grid grid-cols-12 gap-6">
        {/* Provider Cards */}
        <div className="col-span-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Gift & Voucher Providers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {giftProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>

        {/* Delivery Channels */}
        <div className="col-span-4">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Delivery Channels</h2>
          <div className="space-y-3">
            {deliveryChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div key={channel.name} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={clsx('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center', channel.gradient)}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{channel.name}</p>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-green"></div>
                        <span className="text-[10px] text-green-600 font-medium">Active</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={clsx('rounded-lg p-2 text-center', channel.bg)}>
                      <p className={clsx('text-base font-bold', channel.color)}>{channel.sent}</p>
                      <p className="text-[10px] text-slate-500">Sent</p>
                    </div>
                    <div className={clsx('rounded-lg p-2 text-center', channel.bg)}>
                      <p className={clsx('text-base font-bold', channel.color)}>{channel.deliveryRate}%</p>
                      <p className="text-[10px] text-slate-500">Success Rate</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pending Orders Queue */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-violet-600" />
            <h2 className="font-semibold text-slate-800">Gift Order Queue</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex rounded-lg overflow-hidden border border-slate-200">
              {(['all', 'pending', 'processing', 'delivered', 'failed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    'px-3 py-1 text-xs font-medium capitalize transition-colors',
                    activeTab === tab
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter size={11} />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full enterprise-table">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left">Order ID</th>
                <th className="px-5 py-3 text-left">Employee</th>
                <th className="px-5 py-3 text-left">Occasion</th>
                <th className="px-5 py-3 text-left">Gift Type</th>
                <th className="px-5 py-3 text-left">Provider</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-left">Channel</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => {
                const status = orderStatusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={order.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-xs font-mono text-slate-500">{order.id}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{order.employeeName}</p>
                        <p className="text-xs text-slate-400">{order.department}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600">{order.occasion}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{order.giftType}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full font-medium border border-violet-100">
                        {order.provider}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-slate-800 text-right">
                      ₹{order.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {order.deliveryChannel}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', status.bg, status.color, status.border)}>
                        <StatusIcon size={10} className={order.status === 'processing' ? 'animate-spin' : ''} />
                        {status.label}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {order.status === 'pending' && (
                        <button className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800">
                          <Zap size={11} />
                          Send
                        </button>
                      )}
                      {order.status === 'failed' && (
                        <button className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800">
                          <AlertCircle size={11} />
                          Retry
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <CheckCircle2 size={11} />
                          Done
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
