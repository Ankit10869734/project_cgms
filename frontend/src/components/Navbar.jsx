import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'

export default function Navbar() {
  const { toggleTheme, theme, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [activeSection, setActiveSection] = useState('home')
  const navigate = useNavigate()
  const location = useLocation()

  const isOnLanding = location.pathname === '/'

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem('access')
    if (token) {
      api.get('/profile/')
        .then(res => setUserProfile(res.data))
        .catch(err => {
          console.error('Error fetching profile:', err)
          if (err.response?.status === 401) {
            localStorage.clear()
            setUserProfile(null)
          }
        })
    }
  }, [])

  // Track active section on scroll
  useEffect(() => {
  if (location.pathname !== '/') return;
  
  const handleScroll = () => {
    const sections = ['home', 'complaints', 'about', 'contact'];
    let current = 'home';
    
    // Calculate scroll position relative to document
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    // Special case: if near bottom, always show contact
    const distanceFromBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
    if (distanceFromBottom < 100) {
      current = 'contact';
    } else {
      // Find which section is currently in view
      sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = id;
          }
        }
      });
    }
    
    setActiveSection(current);
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll); // Also listen for zoom changes
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);
  };
}, [location.pathname]);
  const handleLogout = () => {
    logout()
    localStorage.clear()
    setUserProfile(null)
    setDropdownOpen(false)
    navigate('/')
  }

  const handleDashboard = () => {
    setDropdownOpen(false)
    navigate('/dashboard')
  }

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      // Navigate to landing page first, then scroll
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } else {
      // Already on landing, just scroll
      document.getElementById(sectionId)?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-icon">⬢</span>
          <span className="brand-text">CGMS</span>
          <span className="brand-subtitle">v3.0</span>
        </div>

        <ul className="nav-menu">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isOnLanding && activeSection === 'home' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/complaints" 
              className={`nav-link ${location.pathname === '/complaints' ? 'active' : ''}`}
            >
              Complaints
            </Link>
          </li>
          <li>
            <a 
              href="#about" 
              className={`nav-link ${isOnLanding && activeSection === 'about' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              className={`nav-link ${isOnLanding && activeSection === 'contact' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
            >
              Contact
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          {userProfile ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>
                {userProfile.avatar ? (
                  <img 
                    src={userProfile.avatar} 
                    alt="Profile"
                    style={{ 
                      width: 45, 
                      height: 45, 
                      borderRadius: '50%', 
                      border: '2px solid #00ccff', 
                      objectFit: 'cover' 
                    }} 
                  />
                ) : (
                  <div style={{ 
                    width: 45, 
                    height: 45, 
                    borderRadius: '50%', 
                    border: '2px solid #00ccff', 
                    background: '#00ccff', 
                    color: '#0a0a0f', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 'bold', 
                    fontSize: '1.2rem' 
                  }}>
                    {userProfile.first_initial || 'U'}
                  </div>
                )}
              </div>

              {dropdownOpen && (
                <div style={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: 55, 
                  background: '#12121a', 
                  border: '1px solid #1e1e28', 
                  borderRadius: '8px', 
                  minWidth: 200, 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)', 
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    padding: '16px 20px', 
                    borderBottom: '1px solid #1e1e28',
                    background: 'rgba(0,204,255,0.05)'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#e0e0e8',
                      marginBottom: '4px'
                    }}>
                      {userProfile.name || userProfile.username}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#888899'
                    }}>
                      {userProfile.email}
                    </div>
                  </div>

                  {isOnLanding && (
                    <button 
                      onClick={handleDashboard}
                      style={{ 
                        width: '100%', 
                        textAlign: 'left', 
                        padding: '14px 20px', 
                        background: 'none', 
                        border: 'none', 
                        color: '#00ccff', 
                        cursor: 'pointer', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        borderBottom: '1px solid #1e1e28',
                        transition: 'background 0.2s',
                        fontFamily: 'inherit'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(0,204,255,0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      📊 Dashboard
                    </button>
                  )}

                  <button 
                    onClick={handleLogout}
                    style={{ 
                      width: '100%', 
                      textAlign: 'left', 
                      padding: '14px 20px', 
                      background: 'none', 
                      border: 'none', 
                      color: '#ff3366', 
                      cursor: 'pointer', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      transition: 'background 0.2s',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,51,102,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btn-container">
              <Link to="/login" className="auth-btn login-btn" data-tooltip="LOG IN">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
                </svg>
              </Link>
            </div>
          )}

          <button className="theme-toggle" onClick={toggleTheme} style={{ width: 45, height: 45 }}>
            <span className="theme-icon">{theme === 'dark' ? '◑' : '◐'}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}