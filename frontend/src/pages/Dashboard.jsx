import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Scanlines from '../components/Scanlines'
import api from '../api/axios'
import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()
  const { theme } = useAuthStore()

  // Fetch complaints from API
  useEffect(() => {
    const token = localStorage.getItem('access')
    if (token) {
      api.get('/complaints/my/')
        .then(res => {
          setComplaints(res.data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error loading complaints:', err)
          setLoading(false)
        })
    }
  }, [])

  const stats = {
    pending: complaints.filter(c => c.status === 'pending').length,
    progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    total: complaints.length
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  if (loading) {
    return (
      <>
        <Scanlines />
        <Navbar />
        <main className={`main-content ${theme === 'dark' ? 'dark-mode' : ''}`}>
          <div style={{ textAlign: 'center', padding: '100px', color: '#00ccff', fontSize: '20px' }}>
            Loading dashboard...
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Scanlines />
      <Navbar />
      <main className="main-content">
        <section id="homePage" className="page active">
          <div className="page-header">
            <h1 className="page-title"><span className="title-accent">{'>'}</span> System Dashboard</h1>
            <p className="page-subtitle">Real-time complaint management & analytics</p>
          </div>

          <div className="stats-grid">
            {[
              { icon: '◉', cls: 'pending-icon', label: 'Pending', val: stats.pending, trend: '+2 today', trendCls: 'up' },
              { icon: '◐', cls: 'progress-icon', label: 'In Progress', val: stats.progress, trend: 'Active', trendCls: '' },
              { icon: '◎', cls: 'resolved-icon', label: 'Resolved', val: stats.resolved, trend: '-3 this week', trendCls: 'down' },
              { icon: '◈', cls: 'total-icon', label: 'Total', val: stats.total, trend: 'All time', trendCls: '' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                <div className="stat-content">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.val}</div>
                </div>
                <div className={`stat-trend ${s.trendCls}`}>{s.trend}</div>
              </div>
            ))}
          </div>

          <div className="section-container">
            <h2 className="section-title"><span className="title-accent">{'>'}</span> Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn primary" onClick={() => navigate('/complaints')}>
                <span className="btn-icon">+</span><span>New Complaint</span>
              </button>
              <button className="action-btn secondary" onClick={() => navigate('/complaints')}>
                <span className="btn-icon">◈</span><span>View All</span>
              </button>
            </div>
          </div>

          <div className="section-container">
            <h2 className="section-title"><span className="title-accent">{'>'}</span> Recent Complaints</h2>
            <div className="activity-feed">
              {complaints.length === 0 ? (
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <div className="activity-text">No complaints yet</div>
                    <div className="activity-time">Submit your first complaint</div>
                  </div>
                </div>
              ) : (
                complaints.slice(0, 5).map((c, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-dot"></div>
                    <div className="activity-content">
                      <div className="activity-text">{c.title}</div>
                      <div className="activity-time">
                        {c.status} • {new Date(c.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {toast && <div className="toast show success">{toast}</div>}
    </>
  )
}