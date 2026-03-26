'use client';

import { useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  XCircle,
  Plus,
  Users,
  Clock,
  Link as LinkIcon,
  ChevronDown,
  Filter,
  Search,
} from 'lucide-react';
import { employees, hrmsConnectors, HRMSConnector } from '@/lib/mock-data';
import clsx from 'clsx';

const statusConfig = {
  connected: { label: 'Connected', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle2, dotColor: 'bg-green-400' },
  syncing: { label: 'Syncing...', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: Loader2, dotColor: 'bg-blue-400' },
  error: { label: 'Error', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle, dotColor: 'bg-red-400' },
  disconnected: { label: 'Disconnected', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: XCircle, dotColor: 'bg-slate-300' },
};

const employeeStatusConfig = {
  active: { label: 'Active', color: 'text-green-700', bg: 'bg-green-100' },
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100' },
  flagged: { label: 'Flagged', color: 'text-red-700', bg: 'bg-red-100' },
};

function ConnectorCard({ connector }: { connector: HRMSConnector }) {
  const [isSyncing, setIsSyncing] = useState(connector.status === 'syncing');
  const status = isSyncing ? statusConfig.syncing : statusConfig[connector.status];
  const StatusIcon = status.icon;

  const handleSync = () => {
    if (connector.status === 'disconnected' || connector.status === 'error') return;
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 3000);
  };

  return (
    <div className={clsx(
      'bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden',
      connector.status === 'error' ? 'border-red-200' : 'border-slate-100'
    )}>
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: connector.color }}></div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0"
              style={{ backgroundColor: connector.color }}
            >
              {connector.logo}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">{connector.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{connector.description}</p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border mb-3', status.bg, status.color, status.border)}>
          <div className={clsx('w-1.5 h-1.5 rounded-full', status.dotColor, isSyncing && 'pulse-green')}></div>
          {status.label}
        </div>

        {/* Details */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <LinkIcon size={11} className="text-slate-400" />
            <span>{connector.connectionType}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock size={11} className="text-slate-400" />
            <span>Last sync: {connector.lastSync}</span>
          </div>
          {connector.employeeCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users size={11} className="text-slate-400" />
              <span>{connector.employeeCount.toLocaleString()} employees synced</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={connector.status === 'disconnected' || isSyncing}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all',
              connector.status === 'disconnected'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'
            )}
          >
            <RefreshCw size={11} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
          {connector.status === 'disconnected' ? (
            <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all">
              <Plus size={11} />
              Connect
            </button>
          ) : connector.status === 'error' ? (
            <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-all">
              <AlertCircle size={11} />
              Fix Error
            </button>
          ) : (
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100 transition-all">
              Settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HRMSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const connectedCount = hrmsConnectors.filter((c) => c.status === 'connected').length;
  const totalEmployees = hrmsConnectors.reduce((sum, c) => sum + c.employeeCount, 0);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.hrmsSource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">Layer 1</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">HRMS Integration</h1>
          <p className="text-slate-500 mt-1">
            Plug & Play connectors for all major HRMS platforms — REST API, SSO, SCIM, Webhooks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">{totalEmployees.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Total employees synced</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-200">
            <RefreshCw size={14} />
            Sync All
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Connected', value: connectedCount, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
          { label: 'Syncing', value: 1, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
          { label: 'Error', value: 1, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
          { label: 'Disconnected', value: 1, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
        ].map((stat) => (
          <div key={stat.label} className={clsx('rounded-xl p-3 border text-center', stat.bg, stat.border)}>
            <p className={clsx('text-2xl font-bold', stat.color)}>{stat.value}</p>
            <p className={clsx('text-xs font-medium', stat.color)}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* HRMS Connector Cards Grid */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">HRMS Connectors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {hrmsConnectors.map((connector) => (
            <ConnectorCard key={connector.id} connector={connector} />
          ))}
        </div>
      </div>

      {/* Employee Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-800">Employee Directory</h2>
            <p className="text-sm text-slate-500 mt-0.5">{filteredEmployees.length} employees from all HRMS sources</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-48"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter size={13} />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full enterprise-table">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left">Employee</th>
                <th className="px-5 py-3 text-left">Department</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-left">Tenure</th>
                <th className="px-5 py-3 text-left">HRMS Source</th>
                <th className="px-5 py-3 text-left">Location</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEmployees.map((emp) => {
                const status = employeeStatusConfig[emp.status];
                return (
                  <tr key={emp.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {emp.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600">{emp.department}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{emp.role}</td>
                    <td className="px-5 py-3 text-sm text-slate-500">{emp.tenure}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium border border-indigo-100">
                        {emp.hrmsSource}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500">{emp.location}</td>
                    <td className="px-5 py-3">
                      <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', status.bg, status.color)}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing {filteredEmployees.length} of {employees.length} employees (sample)
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors">
              1
            </button>
            <button className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Integration Notes */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Supported Integration Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { method: 'REST API', desc: 'Standard REST endpoints for real-time data pull', color: 'text-indigo-600' },
            { method: 'SSO / OAuth2', desc: 'Single Sign-On with SAML 2.0 & OAuth 2.0', color: 'text-violet-600' },
            { method: 'SCIM 2.0', desc: 'Automated user provisioning & deprovisioning', color: 'text-cyan-600' },
            { method: 'Webhooks', desc: 'Real-time event-driven data push notifications', color: 'text-teal-600' },
          ].map((item) => (
            <div key={item.method} className="bg-white rounded-xl p-3 border border-white shadow-sm">
              <p className={clsx('text-sm font-bold mb-1', item.color)}>{item.method}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
