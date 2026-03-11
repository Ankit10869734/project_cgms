import { useState } from "react";

export default function Login() {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  const handleGoogleLogin = () => {
    window.location.href = "https://cgms-hub.onrender.com/accounts/google/login/";
  };

  const handleAdminLogin = async () => {
    try {
      const res = await fetch("https://cgms-hub.onrender.com/api/admin/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUser, password: adminPass })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        window.location.href = "/admin";
      } else {
        alert(data.error || "Admin login failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your account</p>
        </div>

        <div className="login-content">
          {/* Google Login */}
          <button onClick={handleGoogleLogin} className="google-login-btn">
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.621 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* Admin Toggle */}
          <button 
            className="admin-toggle-btn" 
            onClick={() => setShowAdminForm(!showAdminForm)}
          >
            <span> Administrator Login</span>
            <span className="toggle-arrow">{showAdminForm ? '▲' : '▼'}</span>
          </button>

          {/* Admin Form */}
          {showAdminForm && (
            <div className="admin-form">
              <input
                type="text"
                placeholder="Username"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                className="input-field"
              />
              <input
                type="password"
                placeholder="Password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="input-field"
              />
              <button onClick={handleAdminLogin} className="admin-submit-btn">
                Login as Admin
              </button>
            </div>
          )}
        </div>

        <div className="login-footer">
          <p>By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a></p>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
          padding: 20px;
          font-family: 'Segoe UI', system-ui, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(0, 204, 255, 0.08) 0%, transparent 70%);
          top: -100px;
          right: -100px;
          pointer-events: none;
        }

        .login-container::after {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(0, 204, 255, 0.05) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          pointer-events: none;
        }

        .login-box {
          background: rgba(18, 18, 26, 0.95);
          border: 1px solid rgba(0, 204, 255, 0.2);
          border-radius: 16px;
          padding: 40px 32px;
          width: 100%;
          max-width: 440px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          position: relative;
          z-index: 1;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #e0e0e8;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .login-header p {
          font-size: 14px;
          color: #888899;
        }

        .login-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .google-login-btn {
          width: 100%;
          padding: 14px 20px;
          background: #ffffff;
          border: none;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }

        .google-login-btn:hover {
          background: #f5f5f5;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 8px 0;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .divider span {
          padding: 0 16px;
          font-size: 12px;
          color: #666;
          font-weight: 600;
        }

        .admin-toggle-btn {
          width: 100%;
          padding: 14px 20px;
          background: rgba(0, 204, 255, 0.08);
          border: 1px solid rgba(0, 204, 255, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 15px;
          font-weight: 600;
          color: #00ccff;
        }

        .admin-toggle-btn:hover {
          background: rgba(0, 204, 255, 0.12);
          border-color: rgba(0, 204, 255, 0.4);
        }

        .toggle-arrow {
          font-size: 12px;
        }

        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .input-field {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #e0e0e8;
          font-size: 14px;
          transition: all 0.2s;
        }

        .input-field:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.08);
          border-color: #00ccff;
        }

        .input-field::placeholder {
          color: #666;
        }

        .admin-submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #00ccff 0%, #0099cc 100%);
          border: none;
          border-radius: 8px;
          color: #0a0a0f;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 204, 255, 0.4);
        }

        .login-footer {
          margin-top: 24px;
          text-align: center;
        }

        .login-footer p {
          font-size: 12px;
          color: #666;
          line-height: 1.6;
        }

        .login-footer a {
          color: #00ccff;
          text-decoration: none;
        }

        .login-footer a:hover {
          text-decoration: underline;
        }

        button:focus,
        input:focus {
          outline: none !important;
        }
      `}</style>
    </div>
  );
}