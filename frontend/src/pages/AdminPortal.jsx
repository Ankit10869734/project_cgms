import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';
import DashboardView from '../components/admin/Dashboard';
import ComplaintsTable from '../components/admin/ComplaintsTable';
import Analytics from '../components/admin/Analytics';
import UsersTable from '../components/admin/UsersTable';
import StaffTable from '../components/admin/StaffTable';
import ActivityLog from '../components/admin/ActivityLog';
import Settings from '../components/admin/Settings';
import Reports from '../components/admin/Reports';
import { getAdminTheme, saveAdminTheme, showToast } from '../utils/adminHelpers';
import { adminAPI } from '../api/adminAPI';

export default function AdminPortal() {
  const navigate = useNavigate();

  // Guard: if no access token, redirect to login
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [theme, setTheme] = useState(() => getAdminTheme());
  const [showNotification, setShowNotification] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [criticalCount, setCriticalCount] = useState(0);
  const adminUsername = localStorage.getItem('adminUsername') || 'admin';

  // Apply theme class to portal wrapper (isolated from user portal)
  // We use a state variable for the wrapper's class

  // Fetch critical count for notification banner
  useEffect(() => {
    adminAPI.getStats()
      .then(res => setCriticalCount(res.data.critical_pending || 0))
      .catch(() => {});
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    saveAdminTheme(newTheme);
  };

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('adminUsername');
    setShowLogoutModal(false);
    showToast('Logged out successfully', 'info');
    setTimeout(() => navigate('/login', { replace: true }), 300);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':   return <DashboardView />;
      case 'complaints':  return <ComplaintsTable />;
      case 'analytics':   return <Analytics />;
      case 'users':       return <UsersTable />;
      case 'staff':       return <StaffTable />;
      case 'activity':    return <ActivityLog />;
      case 'settings':    return <Settings />;
      case 'reports':     return <Reports />;
      default:            return <DashboardView />;
    }
  };

  return (
    // The `dark` class here is scoped to the admin portal div tree
    // All Tailwind dark: classes inside will respond to this
    <div className={`${theme === 'dark' ? 'dark' : ''}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          adminUsername={adminUsername}
        />

        <div className="flex-1 ml-64 flex flex-col">
          <Topbar
            theme={theme}
            onThemeToggle={handleThemeToggle}
            showNotification={showNotification}
            onCloseNotification={() => setShowNotification(false)}
            criticalCount={criticalCount}
          />
          <main className="flex-1 p-6 custom-scrollbar overflow-auto">
            {renderPage()}
          </main>
        </div>

        {/* Logout Confirm Modal */}
        {showLogoutModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowLogoutModal(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-danger/10 rounded-lg">
                  <LogOut className="w-6 h-6 text-danger" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Logout</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to logout from the admin panel?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold transition-colors text-gray-800 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2 bg-danger hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        <div
          id="admin-toast-container"
          className="fixed bottom-6 right-6 px-6 py-3 rounded-lg text-white font-medium shadow-lg z-50 transition-all duration-300 opacity-0"
          style={{ transform: 'translateX(400px)' }}
        />
      </div>
    </div>
  );
}
