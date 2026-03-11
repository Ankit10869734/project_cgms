import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../api/adminAPI';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const total = stats?.total_complaints || 0;
  const resRate = total > 0 ? `${Math.round((stats.resolved / total) * 100)}%` : '0%';
  const pendingRate = total > 0 ? `${Math.round((stats.pending / total) * 100)}%` : '0%';

  const trends = [
    { label: 'Total Complaints', value: loading ? '—' : total, change: 'All time', up: true },
    { label: 'Critical Pending', value: loading ? '—' : stats?.critical_pending ?? 0, change: 'Needs action', up: false },
    { label: 'Resolution Rate', value: loading ? '—' : resRate, change: 'Of all complaints', up: true },
    { label: 'In Progress', value: loading ? '—' : stats?.in_progress ?? 0, change: 'Active cases', up: true },
  ];

  const categories = [
    { category: 'Maintenance', percentage: 28 },
    { category: 'IT Support',  percentage: 24 },
    { category: 'Infrastructure', percentage: 18 },
    { category: 'Discipline', percentage: 15 },
    { category: 'Safety',     percentage: 9 },
    { category: 'Other',      percentage: 6 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Insights</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Performance metrics and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trends.map((trend, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <div className={`flex items-center gap-1 text-xs font-semibold ${trend.up ? 'text-success' : 'text-danger'}`}>
                {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend.change}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {loading ? <RefreshCw className="w-6 h-6 animate-spin text-primary" /> : trend.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{trend.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Status Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Resolved', value: stats?.resolved || 0, color: 'bg-success' },
              { label: 'In Progress', value: stats?.in_progress || 0, color: 'bg-info' },
              { label: 'Pending', value: stats?.pending || 0, color: 'bg-warning' },
              { label: 'Critical', value: stats?.critical_pending || 0, color: 'bg-danger' },
            ].map((item) => {
              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                    <span className="text-gray-600 dark:text-gray-400">{loading ? '—' : item.value} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Category Breakdown</h3>
          <div className="space-y-4">
            {categories.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{item.category}</span>
                  <span className="text-gray-600 dark:text-gray-400">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
