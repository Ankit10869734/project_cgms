import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import Landing from './pages/landing'
import AdminDashboard from "./pages/AdminDashboard"
import AdminComplaints from "./pages/AdminComplaints"
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Complaints from './pages/Complaints'
import AuthCallback from './pages/AuthCallback'
import AdminPortal from './pages/AdminPortal'

export default function App() {
  const { theme } = useAuthStore()

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode'
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/admin" element={<AdminPortal />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complaints" element={<Complaints />} />
      </Routes>
    </BrowserRouter>
  )
}