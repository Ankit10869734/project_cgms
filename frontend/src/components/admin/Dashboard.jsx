import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { adminAPI } from '../../api/adminAPI';
import { formatStatus, timeAgo } from '../../utils/adminHelpers';

const KPICard = ({ title, value, subtitle, trend, icon: Icon, color, loading }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${trend.up ? 'text-success' : 'text-danger'}`}>
          {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend.value}
        </div>
      )}
    </div>
    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
      {loading ? <span className="animate-pulse">—</span> : value}
    </div>
    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</div>
    {subtitle && <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</div>}
  </div>
);

export default function AdminDashboardView() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([
      adminAPI.getStats(),
      adminAPI.getActivity(),
    ]).then(([statsRes, activityRes]) => {
      setStats(statsRes.data);
      setActivity(activityRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const total = stats?.total_complaints || 0;
  const resolutionRate = total > 0 ? Math.round(((stats?.resolved || 0) / total) * 100) : 0;

  const kpis = [
    { title: 'Total Complaints', value: stats?.total_complaints ?? '—', subtitle: 'All time', icon: Activity, color: 'bg-primary/10 text-primary' },
    { title: 'Critical Pending', value: stats?.critical_pending ?? '—', subtitle: 'Requires attention', icon: AlertTriangle, color: 'bg-danger/10 text-danger', trend: stats?.critical_pending > 0 ? { up: false, value: 'urgent' } : null },
    { title: 'In Progress', value: stats?.in_progress ?? '—', subtitle: 'Active cases', icon: Clock, color: 'bg-warning/10 text-warning' },
    { title: 'Resolved', value: stats?.resolved ?? '—', subtitle: 'All time', icon: CheckCircle, color: 'bg-success/10 text-success', trend: { up: true, value: `${resolutionRate}%` } },
  ];

  const metrics = [
    { label: 'Total Complaints', value: stats?.total_complaints ?? '—' },
    { label: 'Resolution Rate', value: `${resolutionRate}%` },
    { label: 'Pending', value: stats?.pending ?? '—' },
    { label: 'In Progress', value: stats?.in_progress ?? '—' },
  ];

  // Status distribution
  const distributions = [
    { label: 'Pending', value: stats?.pending || 0, color: 'bg-warning' },
    { label: 'In Progress', value: stats?.in_progress || 0, color: 'bg-info' },
    { label: 'Resolved', value: stats?.resolved || 0, color: 'bg-success' },
    { label: 'Critical', value: stats?.critical_pending || 0, color: 'bg-danger' },
  ];

  const priorityColorMap = {
    critical: 'bg-danger/10 text-danger',
    high: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    low: 'bg-green-500/10 text-success',
  };

  const activityDotColor = (status) => {
    if (status === 'resolved') return 'bg-success';
    if (status === 'pending') return 'bg-warning';
    if (status === 'in_progress') return 'bg-info';
    return 'bg-danger';
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} loading={loading} />
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-primary mb-1">
              {loading ? <span className="animate-pulse">—</span> : metric.value}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 flex">
          {['overview', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab === 'activity' ? 'Recent Activity' : 'Overview'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent complaints */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Complaints</h3>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : activity.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No complaints yet.</p>
                ) : (
                  <div className="space-y-3">
                    {activity.slice(0, 5).map((c) => (
                      <div key={c.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="text-xs font-mono text-gray-500 dark:text-gray-400">#{c.id}</div>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded ${priorityColorMap[c.priority] || 'bg-gray-100 text-gray-600'}`}>
                            {c.priority?.charAt(0).toUpperCase() + c.priority?.slice(1)}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1 truncate">{c.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{c.user}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Distribution */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h3>
                <div className="space-y-3">
                  {distributions.map((d) => {
                    const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                    return (
                      <div key={d.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 dark:text-gray-300">{d.label}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{loading ? '—' : d.value}</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full ${d.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : activity.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity.</p>
              ) : (
                activity.map((c) => (
                  <div key={c.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${activityDotColor(c.status)}`} />
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">#{c.id}</span> — {c.title}
                        <span className={`ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                          c.priority === 'critical' ? 'bg-danger/10 text-danger' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}>
                          {formatStatus(c.status)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        by {c.user} · {timeAgo(c.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
