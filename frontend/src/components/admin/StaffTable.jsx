import React from 'react';
import { TrendingUp } from 'lucide-react';

const staff = [
  { id: 1, name: 'Admin Team', role: 'System Administrator', assigned: '—', resolved: '—', efficiency: '—' },
];

export default function StaffTable() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Staff assignment management</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
        <div className="text-4xl mb-4">🏗️</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Staff Module</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Staff assignment and role management will be available in a future update.
          Currently all complaints are managed directly by administrators.
        </p>
      </div>
    </div>
  );
}
