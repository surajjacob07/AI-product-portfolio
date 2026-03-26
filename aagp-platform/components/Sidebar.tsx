'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Brain,
  Gift,
  BarChart3,
  Zap,
  Activity,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/hrms',
    label: 'HRMS Integration',
    icon: Users,
  },
  {
    href: '/research',
    label: 'AI Research Engine',
    icon: Brain,
  },
  {
    href: '/fulfillment',
    label: 'Fulfillment',
    icon: Gift,
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none tracking-wide">AAGP</p>
            <p className="text-indigo-300 text-[10px] font-medium tracking-widest uppercase mt-0.5">
              AI Gift Platform
            </p>
          </div>
        </div>
      </div>

      {/* Layer Labels */}
      <div className="px-4 pt-5 pb-2">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2">
          Platform Layers
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 sidebar-scroll overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'sidebar-active text-indigo-200'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              )}
            >
              <Icon
                className={clsx(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'
                )}
                size={18}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              )}
            </Link>
          );
        })}

        {/* Layer Divider Labels */}
        <div className="pt-4 pb-1">
          <div className="border-t border-white/5"></div>
        </div>

        {/* Layer Status Mini-cards */}
        <div className="space-y-2 pt-1">
          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-green"></div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Layer 1: HRMS</p>
            </div>
            <p className="text-slate-300 text-xs">5/7 connectors live</p>
          </div>

          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 pulse-green"></div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Layer 2: AI Engine</p>
            </div>
            <p className="text-slate-300 text-xs">Claude 3.5 active</p>
          </div>

          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 pulse-green"></div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Layer 3: Fulfillment</p>
            </div>
            <p className="text-slate-300 text-xs">4/5 providers ready</p>
          </div>
        </div>
      </nav>

      {/* AI Status Widget */}
      <div className="px-4 pb-5 pt-3 border-t border-white/10">
        <div className="rounded-xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold">AI Engine</p>
              <div className="flex items-center gap-1">
                <Activity className="w-2.5 h-2.5 text-green-400" />
                <p className="text-green-400 text-[10px]">Operational</p>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Recommendations today</span>
              <span className="text-indigo-300 font-semibold">47</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Gifts auto-sent</span>
              <span className="text-indigo-300 font-semibold">23</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Attrition alerts</span>
              <span className="text-red-400 font-semibold">2</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
