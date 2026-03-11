// Theme Management
export const getAdminTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('cgms-admin-theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const saveAdminTheme = (theme) => {
  localStorage.setItem('cgms-admin-theme', theme);
};

// Toast Notification
let toastTimeout;
export const showToast = (message, type = 'success') => {
  const toast = document.getElementById('admin-toast-container');
  if (!toast) return;
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };
  toast.className = `fixed bottom-6 right-6 px-6 py-3 rounded-lg text-white font-medium shadow-lg z-50 transition-all duration-300 ${colors[type] || colors.success}`;
  toast.textContent = message;
  toast.style.transform = 'translateX(0)';
  toast.style.opacity = '1';
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    toast.style.opacity = '0';
  }, 3000);
};

// Export CSV from complaint data
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Generate text report
export const generateReport = (complaints) => {
  const lines = [
    'CGMS v2.1 - ADMIN REPORT',
    `Generated: ${new Date().toDateString()}`,
    '='.repeat(50),
    '',
    'SUMMARY',
    '-------',
    `Total Complaints : ${complaints.length}`,
    `Critical Pending : ${complaints.filter(c => c.priority === 'critical' && c.status === 'pending').length}`,
    `In Progress      : ${complaints.filter(c => c.status === 'in_progress').length}`,
    `Resolved         : ${complaints.filter(c => c.status === 'resolved').length}`,
    '',
    'COMPLAINT DETAILS',
    '-----------------',
  ];
  complaints.forEach(c => {
    lines.push(`[#${c.id}] ${c.title}`);
    lines.push(`  Category : ${c.category} | Priority : ${c.priority} | Status : ${c.status}`);
    lines.push(`  User : ${c.user} | Date : ${c.created_at?.slice(0, 10) ?? ''}`);
    lines.push('');
  });
  lines.push('='.repeat(50));
  lines.push('CGMS Admin Panel - Confidential');
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cgms-report.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Display helpers
export const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
export const formatStatus = (s) => s ? s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : '';
export const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
export const timeAgo = (date) => {
  const sec = Math.floor((new Date() - new Date(date)) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
};
