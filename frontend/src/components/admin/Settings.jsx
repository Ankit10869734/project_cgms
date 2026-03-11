import React, { useState } from 'react';
import { Bell, Database } from 'lucide-react';
import { showToast } from '../../utils/adminHelpers';

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotif: true, criticalAlerts: true, weeklyReport: false, autoAssign: false,
  });

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    showToast(`Setting updated`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure system preferences</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg"><Bell className="w-5 h-5 text-primary" /></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>
          <div className="space-y-4">
            {Object.entries({ emailNotif: 'Email Notifications', criticalAlerts: 'Critical Alerts', weeklyReport: 'Weekly Reports', autoAssign: 'Auto Assignment' }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                <button onClick={() => toggle(key)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${settings[key] ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[key] ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-warning/10 rounded-lg"><Database className="w-5 h-5 text-warning" /></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Info</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between"><span>Version</span><span className="font-mono text-primary">v2.1.0</span></div>
            <div className="flex justify-between"><span>Backend</span><span className="font-mono text-success">Django 6.x</span></div>
            <div className="flex justify-between"><span>Auth</span><span className="font-mono text-info">JWT + Google OAuth</span></div>
            <div className="flex justify-between"><span>Status</span><span className="font-mono text-success">● Online</span></div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => showToast('Settings saved', 'success')}
          className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-black font-semibold rounded-lg transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
