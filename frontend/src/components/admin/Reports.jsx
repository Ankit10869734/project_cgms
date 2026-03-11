import React, { useEffect, useState } from 'react';
import { Download, FileText, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../api/adminAPI';
import { exportToCSV, generateReport, showToast } from '../../utils/adminHelpers';

export default function Reports() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getComplaints(), adminAPI.getStats()])
      .then(([cRes, sRes]) => { setComplaints(cRes.data); setStats(sRes.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Export</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Generate and export system reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Download className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Export CSV</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Download all complaints as a CSV file</p>
          <button onClick={() => { exportToCSV(complaints, 'cgms-complaints.csv'); showToast('CSV exported', 'success'); }}
            disabled={loading}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-black font-semibold rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Loading...' : 'Download CSV'}
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Generate Report</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Full system report as text file</p>
          <button onClick={() => { generateReport(complaints); showToast('Report generated', 'success'); }}
            disabled={loading}
            className="px-6 py-2.5 bg-secondary hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Report Summary</h3>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Records', value: stats?.total_complaints ?? 0, color: 'text-primary' },
              { label: 'Resolved', value: stats?.resolved ?? 0, color: 'text-success' },
              { label: 'In Progress', value: stats?.in_progress ?? 0, color: 'text-warning' },
              { label: 'Critical', value: stats?.critical_pending ?? 0, color: 'text-danger' },
            ].map(item => (
              <div key={item.label} className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className={`text-2xl font-bold mb-1 ${item.color}`}>{item.value}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
