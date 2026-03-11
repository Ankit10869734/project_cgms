import React from 'react';
import { Search, Moon, Sun, Bell, X } from 'lucide-react';

export default function Topbar({ theme, onThemeToggle, showNotification, onCloseNotification, criticalCount }) {
  return (
    <>
      {/* Notification Banner */}
      {showNotification && criticalCount > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-900/50 px-6 py-3 flex items-center gap-3">
          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <div className="flex-1 text-sm text-blue-900 dark:text-blue-200">
            <span className="font-semibold">{criticalCount} critical complaint{criticalCount !== 1 ? 's' : ''}</span> require immediate attention
          </div>
          <button
            onClick={onCloseNotification}
            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        </div>
      )}

      {/* Topbar */}
      <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center gap-4 sticky top-0 z-30">
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg w-64">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Quick search..."
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none"
          />
          <kbd className="px-2 py-0.5 text-xs font-mono text-gray-500 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
            /
          </kbd>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    </>
  );
}
