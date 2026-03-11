import React, { useState, useEffect } from 'react';
import { RefreshCw, Activity } from 'lucide-react';
import { adminAPI } from '../../api/adminAPI';
import { showToast, formatStatus, formatDate, timeAgo } from '../../utils/adminHelpers';

const actionClass = (status) => ({
  resolved: 'bg-success/10 text-success',
  in_progress: 'bg-info/10 text-info',
  pending: 'bg-warning/10 text-warning',
  rejected: 'bg-danger/10 text-danger',
}[status] || 'bg-primary/10 text-primary');

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getActivity()
      .then(res => { setLogs(res.data); setLoading(false); })
      .catch(() => { showToast('Failed to load activity', 'error'); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Log</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Recent complaint submissions and updates</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
            Loading activity...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">No activity yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {['ID','Title','Status','Priority','User','Time'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 text-xs font-mono text-gray-600 dark:text-gray-400">#{log.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-xs">
                      <div className="truncate" title={log.title}>{log.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${actionClass(log.status)}`}>
                        {formatStatus(log.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">{log.priority}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{log.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{timeAgo(log.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
