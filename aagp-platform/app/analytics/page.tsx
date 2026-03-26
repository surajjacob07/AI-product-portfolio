'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Gift,
  Users,
  Wallet,
  Award,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  monthlySpendData,
  giftCategoryData,
  recognitionTrendData,
  departments,
} from '@/lib/mock-data';
import clsx from 'clsx';

const DEPT_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const keyMetrics = [
  {
    label: 'Total Q1 Spend',
    value: '₹26.2L',
    change: '+18.3%',
    trend: 'up' as const,
    sub: 'vs Q4 FY2023',
    icon: Wallet,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    label: 'Recognition Rate',
    value: '89.4%',
    change: '+5.2%',
    trend: 'up' as const,
    sub: 'employees recognized',
    icon: Award,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    label: 'Avg Gift Value',
    value: '₹1,842',
    change: '+12.1%',
    trend: 'up' as const,
    sub: 'per employee',
    icon: Gift,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
  {
    label: 'Attrition Saved',
    value: '23',
    change: '-61%',
    trend: 'down' as const,
    sub: 'vs projected exits',
    icon: Users,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-slate-700 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-slate-500">{entry.dataKey}:</span>
            <span className="font-semibold text-slate-700">
              {typeof entry.value === 'number' && entry.value > 1000
                ? `₹${(entry.value / 1000).toFixed(0)}K`
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-slate-700">{payload[0].name}</p>
        <p className="text-indigo-600 font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const totalSpend = monthlySpendData.reduce((sum, m) => {
    return sum + m.Engineering + m.Sales + m.HR + m.Finance + m.Marketing + m['Customer Success'];
  }, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">Analytics</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Platform Analytics</h1>
          <p className="text-slate-500 mt-1">
            Gift card spend, recognition trends & ROI insights — Q1 FY2024
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option>Q1 FY2024</option>
            <option>Q4 FY2023</option>
            <option>Q3 FY2023</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-200">
            <BarChart3 size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {keyMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center ring-4 ring-white', metric.bg)}>
                  <Icon className={clsx('w-5 h-5', metric.color)} />
                </div>
                <div className={clsx(
                  'flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
                  metric.trend === 'up'
                    ? metric.label === 'Attrition Saved' ? 'text-green-700 bg-green-100' : 'text-green-700 bg-green-100'
                    : 'text-red-700 bg-red-100'
                )}>
                  {metric.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {metric.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</p>
              <p className="text-sm text-slate-500">{metric.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{metric.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-12 gap-6">
        {/* Bar Chart — Monthly Spend by Department */}
        <div className="col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <h2 className="font-semibold text-slate-800">Monthly Gift Card Spend by Department</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Total: ₹{(totalSpend / 100000).toFixed(2)}L across 6 months
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlySpendData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v / 1000}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
              />
              {departments.map((dept, i) => (
                <Bar
                  key={dept.name}
                  dataKey={dept.name}
                  fill={DEPT_COLORS[i]}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={18}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — Gift Category Breakdown */}
        <div className="col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <PieIcon className="w-4 h-4 text-violet-600" />
            <h2 className="font-semibold text-slate-800">Gift Category Mix</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={giftCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {giftCategoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="space-y-2 mt-2">
            {giftCategoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-700">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-12 gap-6">
        {/* Line Chart — Recognition Trend */}
        <div className="col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" />
                <h2 className="font-semibold text-slate-800">Employee Recognition Trend</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Total, AI-automated & manual recognitions</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full border border-green-100">
              <TrendingUp size={11} />
              +35.5% overall
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={recognitionTrendData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="automatedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="recognitions"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#totalGradient)"
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                name="Total"
              />
              <Area
                type="monotone"
                dataKey="automated"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#automatedGradient)"
                strokeDasharray="5 3"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                name="AI Automated"
              />
              <Line
                type="monotone"
                dataKey="manual"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 3 }}
                name="Manual"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department ROI Summary */}
        <div className="col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-4 h-4 text-amber-500" />
            <h2 className="font-semibold text-slate-800">Department ROI Summary</h2>
          </div>

          <div className="space-y-3">
            {departments.map((dept, i) => {
              const pct = Math.round((dept.usedBudget / dept.allocatedBudget) * 100);
              const perEmployee = Math.round(dept.usedBudget / dept.headcount);
              return (
                <div key={dept.id} className="flex items-center gap-3">
                  <div
                    className="w-3 h-8 rounded-full flex-shrink-0"
                    style={{ backgroundColor: DEPT_COLORS[i] }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-slate-700 truncate">{dept.name}</p>
                      <span className="text-xs text-slate-500 ml-2 flex-shrink-0">₹{perEmployee.toLocaleString()}/emp</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: DEPT_COLORS[i] }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-slate-400">{dept.headcount} employees</span>
                      <span className="text-[10px] font-bold" style={{ color: DEPT_COLORS[i] }}>{pct}% utilized</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Footer */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
            <div className="bg-indigo-50 rounded-xl p-3 text-center border border-indigo-100">
              <p className="text-lg font-bold text-indigo-700">71%</p>
              <p className="text-[10px] text-indigo-500 font-medium">Overall Utilization</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
              <p className="text-lg font-bold text-green-700">4.2x</p>
              <p className="text-[10px] text-green-500 font-medium">Estimated ROI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Strip */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-5 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Gifts Delivered', value: '284', sub: 'This month', icon: '🎁' },
            { label: 'AI Recommendations', value: '1,247', sub: 'All time', icon: '🤖' },
            { label: 'Avg Delivery Time', value: '< 2 min', sub: 'WhatsApp channel', icon: '⚡' },
            { label: 'Employee NPS Impact', value: '+18pts', sub: 'Post-recognition survey', icon: '📈' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm font-medium text-white/90">{stat.label}</p>
              <p className="text-xs text-white/60 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
