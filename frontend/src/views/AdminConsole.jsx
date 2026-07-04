import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck, LayoutDashboard, Users, Building2, BookOpen,
  ClipboardList, Code2, MessageSquare, LogOut, Menu, X,
  ChevronRight, Activity, ArrowLeft, Sun, Moon
} from 'lucide-react';

import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/AdminUsers';
import AdminCompanies from './admin/AdminCompanies';
import AdminLearning from './admin/AdminLearning';
import AdminAssessments from './admin/AdminAssessments';
import AdminCoding from './admin/AdminCoding';
import AdminInterviewQs from './admin/AdminInterviewQs';

const NAV_ITEMS = [
  { id:'dashboard',  label:'Dashboard',        icon:LayoutDashboard, color:'#ef4444' },
  { id:'users',      label:'Users',            icon:Users,           color:'#0ea5e9' },
  { id:'companies',  label:'Companies',        icon:Building2,       color:'#6366f1' },
  { id:'learning',   label:'Learning Center',  icon:BookOpen,        color:'#10b981' },
  { id:'assessments',label:'Assessments',      icon:ClipboardList,   color:'#f59e0b' },
  { id:'coding',     label:'Coding Arena',     icon:Code2,           color:'#ef4444' },
  { id:'interviews', label:'Interview Qs',     icon:MessageSquare,   color:'#8b5cf6' },
];

const SECTION_MAP = {
  dashboard:   AdminDashboard,
  users:       AdminUsers,
  companies:   AdminCompanies,
  learning:    AdminLearning,
  assessments: AdminAssessments,
  coding:      AdminCoding,
  interviews:  AdminInterviewQs,
};

const AdminConsole = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const ActiveSection = SECTION_MAP[active] || AdminDashboard;
  const activeNav = NAV_ITEMS.find(n => n.id === active);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--admin-bg)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif", color: 'var(--admin-text)',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        
        :root {
          --admin-bg: linear-gradient(135deg, #f5f7fb 0%, #ebedf3 50%, #f5f7fb 100%);
          --admin-text: #1e293b;
          --admin-sidebar-bg: #ffffff;
          --admin-sidebar-border: rgba(0, 0, 0, 0.08);
          --admin-sidebar-logo-text: #0f172a;
          --admin-header-bg: rgba(255, 255, 255, 0.85);
          --admin-header-border: rgba(0, 0, 0, 0.08);
          --admin-card-bg: #ffffff;
          --admin-card-border: rgba(0, 0, 0, 0.08);
          --admin-card-text: #0f172a;
          --admin-card-subtext: #64748b;
          --admin-card-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.04);
          --admin-input-bg: #f8fafc;
          --admin-input-border: rgba(0, 0, 0, 0.1);
          --admin-input-text: #0f172a;
          --admin-modal-bg: #ffffff;
          --admin-row-hover: rgba(0, 0, 0, 0.02);
          --admin-tooltip-bg: #ffffff;
          --admin-axis-stroke: #64748b;
          --admin-grid-stroke: rgba(0, 0, 0, 0.06);
          --admin-cursor-fill: rgba(0, 0, 0, 0.02);
        }
        
        .dark {
          --admin-bg: linear-gradient(135deg, #070b17 0%, #0a1022 50%, #070b17 100%);
          --admin-text: #ffffff;
          --admin-sidebar-bg: rgba(255,255,255,0.03);
          --admin-sidebar-border: rgba(255,255,255,0.07);
          --admin-sidebar-logo-text: #ffffff;
          --admin-header-bg: rgba(255,255,255,0.02);
          --admin-header-border: rgba(255,255,255,0.06);
          --admin-card-bg: rgba(255,255,255,0.04);
          --admin-card-border: rgba(255,255,255,0.08);
          --admin-card-text: #ffffff;
          --admin-card-subtext: rgba(255,255,255,0.4);
          --admin-card-shadow: none;
          --admin-input-bg: rgba(255,255,255,0.06);
          --admin-input-border: rgba(255,255,255,0.1);
          --admin-input-text: #ffffff;
          --admin-modal-bg: #0d1224;
          --admin-row-hover: rgba(255, 255, 255, 0.03);
          --admin-tooltip-bg: rgba(10, 15, 30, 0.95);
          --admin-axis-stroke: rgba(255, 255, 255, 0.3);
          --admin-grid-stroke: rgba(255, 255, 255, 0.06);
          --admin-cursor-fill: rgba(255, 255, 255, 0.04);
        }

        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(120,120,120,0.2); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(120,120,120,0.3); }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: sidebarOpen ? '240px' : '72px',
        flexShrink: 0,
        background: 'var(--admin-sidebar-bg)',
        borderRight: '1px solid var(--admin-sidebar-border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
        zIndex: 50,
      }}>
        {/* Logo Area */}
        <div style={{
          padding: '20px 16px', borderBottom: '1px solid var(--admin-sidebar-border)',
          display: 'flex', alignItems: 'center', gap: '12px', minHeight: '72px',
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
            background: 'linear-gradient(135deg,rgba(220,38,38,0.3),rgba(124,58,237,0.3))',
            border: '1px solid rgba(220,38,38,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck size={22} color="#ef4444"/>
          </div>
          {sidebarOpen && (
            <div style={{ animation: 'slideIn 0.2s ease', overflow:'hidden' }}>
              <p style={{ color: 'var(--admin-sidebar-logo-text)', fontWeight: 900, fontSize: '14px', margin: 0, whiteSpace:'nowrap' }}>CareerForge</p>
              <p style={{ color: '#ef4444', fontWeight: 700, fontSize: '11px', margin: '2px 0 0', whiteSpace:'nowrap' }}>Admin Panel</p>
            </div>
          )}
        </div>

        {/* Admin Badge */}
        {sidebarOpen && (
          <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--admin-sidebar-border)' }}>
            <div style={{ padding:'10px 12px', background:'var(--admin-input-bg)', border:'1px solid var(--admin-sidebar-border)', borderRadius:'10px' }}>
              <p style={{ color:'var(--admin-card-subtext)', fontSize:'10px', fontWeight:700, textTransform:'uppercase', margin:'0 0 2px' }}>Logged in as</p>
              <p style={{ color:'var(--admin-card-text)', fontWeight:800, fontSize:'13px', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.username}</p>
              <span style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444', fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'4px', marginTop:'4px', display:'inline-block' }}>ADMIN</span>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => setActive(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: sidebarOpen ? '11px 14px' : '11px',
                borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: isActive ? `${item.color}15` : 'transparent',
                outline: isActive ? `1px solid ${item.color}25` : 'none',
                width: '100%', textAlign: 'left', transition: 'all 0.2s',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--admin-row-hover)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} color={isActive ? item.color : 'var(--admin-card-subtext)'} style={{ flexShrink: 0 }}/>
                {sidebarOpen && (
                  <span style={{
                    color: isActive ? 'var(--admin-card-text)' : 'var(--admin-card-subtext)',
                    fontWeight: isActive ? 700 : 500, fontSize: '13px', whiteSpace: 'nowrap',
                    animation: 'slideIn 0.15s ease', flex: 1,
                  }}>{item.label}</span>
                )}
                {sidebarOpen && isActive && <ChevronRight size={14} color={item.color}/>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--admin-sidebar-border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Toggle */}
          <button onClick={() => setSidebarOpen(v => !v)} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: 'var(--admin-input-bg)', color: 'var(--admin-card-subtext)',
            width: '100%', transition: 'all 0.2s', justifyContent: sidebarOpen ? 'flex-start' : 'center',
          }}>
            {sidebarOpen ? <X size={16}/> : <Menu size={16}/>}
            {sidebarOpen && <span style={{ fontSize: '12px', fontWeight: 600 }}>Collapse</span>}
          </button>
          {/* Logout */}
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: 'rgba(239,68,68,0.08)', color: '#ef4444',
            width: '100%', transition: 'all 0.2s', justifyContent: sidebarOpen ? 'flex-start' : 'center',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          >
            <LogOut size={16} style={{ flexShrink: 0 }}/>
            {sidebarOpen && <span style={{ fontSize: '12px', fontWeight: 700 }}>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Top Bar */}
        <header style={{
          padding: '0 28px', height: '72px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', borderBottom: '1px solid var(--admin-header-border)',
          background: 'var(--admin-header-bg)', backdropFilter: 'blur(20px)',
          position: 'sticky', top: 0, zIndex: 40, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {activeNav && (
              <>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${activeNav.color}15`, border: `1px solid ${activeNav.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <activeNav.icon size={18} color={activeNav.color}/>
                </div>
                <div>
                  <h1 style={{ color: 'var(--admin-card-text)', fontSize: '18px', fontWeight: 800, margin: 0 }}>{activeNav.label}</h1>
                  <p style={{ color: 'var(--admin-card-subtext)', fontSize: '11px', margin: 0 }}>CareerForge Admin Console</p>
                </div>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px',
              background: 'var(--admin-input-bg)', border: '1px solid var(--admin-input-border)',
              borderRadius: '9px', color: 'var(--admin-card-subtext)', textDecoration: 'none',
              fontSize: '12px', fontWeight: 600, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--admin-row-hover)'; e.currentTarget.style.color='var(--admin-card-text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--admin-input-bg)'; e.currentTarget.style.color='var(--admin-card-subtext)'; }}
            >
              <ArrowLeft size={13}/> Main Site
            </Link>
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'var(--admin-input-bg)', border: '1px solid var(--admin-input-border)',
                color: 'var(--admin-card-subtext)', cursor: 'pointer', transition: 'all 0.2s',
              }}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px' }}>
              <Activity size={12} color="#10b981"/>
              <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 700 }}>System Online</span>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239,68,68,0.25)' }}>
              <ShieldCheck size={18} color="#ef4444"/>
            </div>
          </div>
        </header>

        {/* Section Content */}
        <div style={{ flex: 1, padding: '28px', animation: 'fadeInUp 0.4s ease' }} key={active}>
          <ActiveSection/>
        </div>
      </main>
    </div>
  );
};

export default AdminConsole;
