import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, CheckCircle, Trash2, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../api/adminAPI';
import { exportToCSV, showToast, formatStatus, formatDate } from '../../utils/adminHelpers';

const STATUS_OPTIONS = ['pending', 'in_progress', 'resolved', 'rejected'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'critical'];

const priorityClass = (p) => ({
  critical: 'bg-danger/10 text-danger',
  high: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  low: 'bg-green-500/10 text-success',
}[p] || 'bg-gray-100 text-gray-600');

const statusClass = (s) => ({
  pending: 'bg-warning/10 text-warning',
  in_progress: 'bg-info/10 text-info',
  resolved: 'bg-success/10 text-success',
  rejected: 'bg-danger/10 text-danger',
}[s] || 'bg-gray-100 text-gray-600');

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [modalState, setModalState] = useState({ type: null, complaint: null });
  const [actionLoading, setActionLoading] = useState(false);

  const loadComplaints = () => {
    setLoading(true);
    adminAPI.getComplaints()
      .then(res => { setComplaints(res.data); setLoading(false); })
      .catch(() => { showToast('Failed to load complaints', 'error'); setLoading(false); });
  };

  useEffect(() => { loadComplaints(); }, []);

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(c.id).includes(searchTerm) ||
      c.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchPriority = filterPriority === 'all' || c.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleAction = (type, complaint) => setModalState({ type, complaint });
  const closeModal = () => { setModalState({ type: null, complaint: null }); setActionLoading(false); };

  const confirmAction = async () => {
    const { type, complaint } = modalState;
    setActionLoading(true);
    try {
      if (type === 'resolve') {
        await adminAPI.updateStatus(complaint.id, 'resolved');
        showToast('Complaint marked as resolved', 'success');
        setComplaints(prev => prev.map(c => c.id === complaint.id ? { ...c, status: 'resolved' } : c));
      } else if (type === 'delete') {
        await adminAPI.deleteComplaint(complaint.id);
        showToast('Complaint deleted', 'error');
        setComplaints(prev => prev.filter(c => c.id !== complaint.id));
      }
    } catch {
      showToast('Action failed. Please try again.', 'error');
    }
    closeModal();
  };

  const handleExport = () => {
    exportToCSV(filtered, 'cgms-complaints.csv');
    showToast('CSV exported successfully', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Complaints Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {filtered.length} of {complaints.length} complaints
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadComplaints} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors" title="Refresh">
            <RefreshCw className={`w-4 h-4 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleExport} className="px-4 py-2 bg-primary hover:bg-primary-dark text-black font-semibold rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, ID, or user..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-900 dark:text-white" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none text-gray-900 dark:text-white">
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{formatStatus(s)}</option>)}
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none text-gray-900 dark:text-white">
            <option value="all">All Priority</option>
            {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />Loading complaints...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">No complaints found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {['ID','Title','Category','Priority','Status','User','Date','Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-600 dark:text-gray-400">#{c.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-xs">
                      <div className="truncate" title={c.title}>{c.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{c.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${priorityClass(c.priority)}`}>
                        {c.priority?.charAt(0).toUpperCase() + c.priority?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${statusClass(c.status)}`}>
                        {formatStatus(c.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{c.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">{formatDate(c.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleAction('view', c)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="View">
                          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        {c.status !== 'resolved' && (
                          <button onClick={() => handleAction('resolve', c)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Resolve">
                            <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        )}
                        <button onClick={() => handleAction('delete', c)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalState.type && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {modalState.type === 'view' && 'Complaint Details'}
              {modalState.type === 'resolve' && 'Mark as Resolved'}
              {modalState.type === 'delete' && 'Delete Complaint'}
            </h3>

            {modalState.type === 'view' && (
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="font-semibold text-gray-900 dark:text-white">ID:</span> #{modalState.complaint.id}</div>
                  <div><span className="font-semibold text-gray-900 dark:text-white">User:</span> {modalState.complaint.user}</div>
                  <div><span className="font-semibold text-gray-900 dark:text-white">Category:</span> {modalState.complaint.category}</div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900 dark:text-white">Priority:</span>
                    <span className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded ${priorityClass(modalState.complaint.priority)}`}>
                      {modalState.complaint.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900 dark:text-white">Status:</span>
                    <span className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded ${statusClass(modalState.complaint.status)}`}>
                      {formatStatus(modalState.complaint.status)}
                    </span>
                  </div>
                  <div><span className="font-semibold text-gray-900 dark:text-white">Date:</span> {formatDate(modalState.complaint.created_at)}</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Title:</span>
                  <p className="mt-1">{modalState.complaint.title}</p>
                </div>
                {modalState.complaint.description && (
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">Description:</span>
                    <p className="mt-1 text-gray-600 dark:text-gray-400 leading-relaxed">{modalState.complaint.description}</p>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white block mb-2">Update Status:</span>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.filter(s => s !== modalState.complaint.status).map(s => (
                      <button key={s} onClick={async () => {
                        try {
                          await adminAPI.updateStatus(modalState.complaint.id, s);
                          showToast(`Status updated to ${formatStatus(s)}`, 'success');
                          setComplaints(prev => prev.map(c => c.id === modalState.complaint.id ? { ...c, status: s } : c));
                          closeModal();
                        } catch { showToast('Update failed', 'error'); }
                      }}
                        className={`px-3 py-1 text-xs font-semibold rounded border border-current cursor-pointer ${statusClass(s)}`}>
                        → {formatStatus(s)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {modalState.type === 'resolve' && (
              <p className="text-gray-600 dark:text-gray-400">
                Mark <strong className="text-gray-900 dark:text-white">#{modalState.complaint.id} — {modalState.complaint.title}</strong> as resolved?
              </p>
            )}
            {modalState.type === 'delete' && (
              <p className="text-gray-600 dark:text-gray-400">
                Permanently delete <strong className="text-gray-900 dark:text-white">#{modalState.complaint.id} — {modalState.complaint.title}</strong>? This cannot be undone.
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold transition-colors text-gray-800 dark:text-gray-200">
                {modalState.type === 'view' ? 'Close' : 'Cancel'}
              </button>
              {modalState.type !== 'view' && (
                <button onClick={confirmAction} disabled={actionLoading}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                    modalState.type === 'delete' ? 'bg-danger hover:bg-red-600 text-white' : 'bg-success hover:bg-green-600 text-black'
                  }`}>
                  {actionLoading ? '...' : modalState.type === 'delete' ? 'Delete' : 'Confirm'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
