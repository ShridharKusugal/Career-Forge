import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, Loader2, Sun, Moon } from 'lucide-react';

const AdminLogin = () => {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.usernameOrEmail, form.password);
      if (data.role !== 'ADMIN') {
        setError('Access denied. Admin credentials required.');
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: darkMode 
        ? 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a0f1e 100%)' 
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif", position: 'relative', overflow: 'hidden',
      transition: 'background 0.3s ease'
    }}>
      {/* Floating Theme Toggle */}
      <button
          onClick={toggleTheme}
          style={{
            position: 'fixed', top: '24px', right: '24px', zIndex: 50, padding: '12px',
            borderRadius: '16px', border: '1px solid', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
            background: darkMode ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.8)',
            borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            color: darkMode ? '#f8fafc' : '#0f172a',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            backdropFilter: 'blur(8px)'
          }}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Animated Background Orbs */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
        background: darkMode 
          ? 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)' 
          : 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)',
        top: '-150px', left: '-150px', animation: 'pulse 4s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
        background: darkMode 
          ? 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' 
          : 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
        bottom: '-100px', right: '-100px', animation: 'pulse 5s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
        background: darkMode 
          ? 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)' 
          : 'radial-gradient(circle, rgba(239,68,68,0.03) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)'
      }} />

      {/* Grid Pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: darkMode 
          ? 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)' 
          : 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        transition: 'background-image 0.3s ease'
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes pulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .admin-input { width:100%; padding:14px 14px 14px 46px; background:rgba(0,0,0,0.03);
          border:1px solid rgba(0,0,0,0.08); border-radius:12px; color:#1e293b;
          font-size:14px; font-family:inherit; outline:none; transition:all 0.3s;
          box-sizing:border-box; }
        .dark .admin-input { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:#fff; }
        .admin-input:focus { border-color:rgba(239,68,68,0.6); background:rgba(0,0,0,0.04);
          box-shadow:0 0 0 3px rgba(239,68,68,0.15); }
        .dark .admin-input:focus { border-color:rgba(239,68,68,0.6); background:rgba(255,255,255,0.08);
          box-shadow:0 0 0 3px rgba(239,68,68,0.1); }
        .admin-input::placeholder { color:rgba(0,0,0,0.35); }
        .dark .admin-input::placeholder { color:rgba(255,255,255,0.3); }
        .login-btn { width:100%; padding:15px; border:none; border-radius:12px; cursor:pointer;
          font-weight:700; font-size:15px; font-family:inherit; transition:all 0.3s;
          background:linear-gradient(135deg,#dc2626,#7c3aed);
          color:#fff; letter-spacing:0.5px; }
        .login-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 30px rgba(220,38,38,0.35); }
        .login-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .card { animation: fadeInUp 0.6s ease; }
      `}</style>

      <div className="card" style={{
        width: '100%', maxWidth: '420px', padding: '48px 40px',
        background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(24px)',
        borderRadius: '24px',
        border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        boxShadow: darkMode ? '0 32px 64px rgba(0,0,0,0.5)' : '0 32px 64px rgba(15,23,42,0.08)',
        position: 'relative', zIndex: 10, margin: '16px',
        transition: 'all 0.3s ease'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 20px',
            background: 'linear-gradient(135deg,rgba(220,38,38,0.2),rgba(124,58,237,0.2))',
            border: '1px solid rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={36} color="#ef4444" />
          </div>
          <h1 style={{ 
            color: darkMode ? '#fff' : '#0f172a', 
            fontSize: '26px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' 
          }}>
            Admin Portal
          </h1>
          <p style={{ 
            color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.5)', 
            fontSize: '13px', margin: 0, fontWeight: 500 
          }}>
            CareerForge Platform Management
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '10px', marginBottom: '20px'
          }}>
            <AlertCircle size={16} color="#f87171" />
            <p style={{ color: '#ef4444', fontSize: '13px', margin: 0, fontWeight: 600 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email/Username */}
          <div style={{ position: 'relative' }}>
            <Mail size={16} color={darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(15,23,42,0.4)'} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
            <input
              className="admin-input"
              type="text"
              placeholder="Admin email or username"
              value={form.usernameOrEmail}
              onChange={e => setForm(p => ({ ...p, usernameOrEmail: e.target.value }))}
              required
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Lock size={16} color={darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(15,23,42,0.4)'} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
            <input
              className="admin-input"
              type={showPass ? 'text' : 'password'}
              placeholder="Admin password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              style={{ paddingRight: '46px' }}
              required
            />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{
              position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0
            }}>
              {showPass 
                ? <EyeOff size={16} color={darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(15,23,42,0.4)'} /> 
                : <Eye size={16} color={darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(15,23,42,0.4)'} />}
            </button>
          </div>

          {/* Submit */}
          <button className="login-btn" type="submit" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Authenticating...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ShieldCheck size={16} /> Access Admin Panel
              </span>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a href="/login" style={{ 
            color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.5)', 
            fontSize: '12px', textDecoration: 'none', fontWeight: 600 
          }}>
            ← Back to main login
          </a>
        </div>

        {/* Security note */}
        <div style={{
          marginTop: '20px', padding: '10px 14px', 
          background: darkMode ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.03)',
          border: darkMode ? '1px solid rgba(239,68,68,0.1)' : '1px solid rgba(239,68,68,0.08)', 
          borderRadius: '8px', textAlign: 'center'
        }}>
          <p style={{ 
            color: darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.4)', 
            fontSize: '11px', margin: 0, fontWeight: 500 
          }}>
            🔒 This is a secured admin-only access point
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
