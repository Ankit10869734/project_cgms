import React from 'react';
import {
  LayoutDashboard, FileText, BarChart3, Users, UserCog,
  Activity, Settings, FileBarChart, LogOut, Hexagon,
} from 'lucide-react';

const navItems = [
  { section: 'OVERVIEW', items: [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', badge: null },
  ]},
  { section: 'MANAGEMENT', items: [
    { icon: FileText,  label: 'Complaints', id: 'complaints', badge: { value: '!', type: 'danger' } },
    { icon: BarChart3, label: 'Analytics',  id: 'analytics',  badge: null },
    { icon: Users,     label: 'Users',      id: 'users',      badge: null },
    { icon: UserCog,   label: 'Staff',      id: 'staff',      badge: null },
  ]},
  { section: 'SYSTEM', items: [
    { icon: Activity,     label: 'Activity Log', id: 'activity', badge: { value: '•', type: 'info' } },
    { icon: Settings,     label: 'Settings',     id: 'settings', badge: null },
    { icon: FileBarChart, label: 'Reports',      id: 'reports',  badge: null },
  ]},
];

export default function Sidebar({ currentPage, onNavigate, onLogout, adminUsername }) {
  const initials = adminUsername
    ? adminUsername.slice(0, 2).toUpperCase()
    : 'SA';

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
          <Hexagon className="w-5 h-5 text-black fill-black" />
        </div>
        <div className="flex-1">
          <div className="text-lg font-bold text-primary">CGMS</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">v3.0</div>
        </div>
        <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-bold rounded font-mono">
          ADMIN
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        {navItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <div className="px-6 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-600 tracking-wider">
              {section.section}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full px-6 py-2.5 flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-primary/10 dark:bg-primary/10 text-primary border-l-2 border-primary'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-2 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full font-mono ${
                      item.badge.type === 'danger'
                        ? 'bg-danger text-white'
                        : item.badge.type === 'info'
                        ? 'bg-info text-black'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {item.badge.value}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Admin Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-bold text-sm shadow-lg">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {adminUsername || 'Super Admin'}
            </div>
            <div className="text-xs text-primary font-mono">ADMIN</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
