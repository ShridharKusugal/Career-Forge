import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Building2, BookOpen, Code2, ClipboardList, TrendingUp,
  CheckCircle2, Loader2, RefreshCw, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart
} from 'recharts';

const COLORS = ['#ef4444', '#6366f1', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6'];

const s = {
  card: {
    background: 'var(--admin-card-bg)', backdropFilter: 'blur(20px)',
    border: '1px solid var(--admin-card-border)', borderRadius: '16px', padding: '24px',
    boxShadow: 'var(--admin-card-shadow)',
  },
  label: { color: 'var(--admin-card-subtext)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' },
  val: { color: 'var(--admin-card-text)', fontSize: '32px', fontWeight: 900, lineHeight: 1 },
};

const KpiCard = ({ label, value, icon: Icon, color, sub }) => (
  <div style={{ ...s.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
    <div>
      <p style={s.label}>{label}</p>
      <p style={s.val}>{value ?? '—'}</p>
      {sub && <p style={{ color: 'var(--admin-card-subtext)', opacity: 0.8, fontSize: '12px', marginTop: '4px' }}>{sub}</p>}
    </div>
    <div style={{
      width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
      background: `${color}18`, border: `1px solid ${color}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <Icon size={24} color={color} />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = () => {
    setLoading(true);
    axios.get('/api/admin/analytics')
      .then(r => { setAnalytics(r.data); setLastRefresh(new Date()); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '12px' }}>
      <Loader2 size={28} color="#ef4444" style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ color: 'var(--admin-card-subtext)', fontSize: '14px' }}>Loading analytics...</span>
    </div>
  );

  const tooltipStyle = {
    contentStyle: { background: 'var(--admin-tooltip-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '12px', color: 'var(--admin-card-text)', fontSize: '12px' },
    cursor: { fill: 'var(--admin-cursor-fill)' }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: 'var(--admin-card-text)', fontSize: '22px', fontWeight: 800, margin: 0 }}>Platform Overview</h2>
          <p style={{ color: 'var(--admin-card-subtext)', fontSize: '12px', margin: '4px 0 0' }}>
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <button onClick={load} style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
          background: 'var(--admin-input-bg)', border: '1px solid var(--admin-input-border)',
          borderRadius: '10px', color: 'var(--admin-card-text)', cursor: 'pointer', fontSize: '13px',
          fontWeight: 600, transition: 'all 0.2s'
        }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        <KpiCard label="Total Students" value={analytics?.totalStudents} icon={Users} color="#0ea5e9" sub="Registered users" />
        <KpiCard label="Companies" value={analytics?.totalCompanies} icon={Building2} color="#6366f1" sub="Listed companies" />
        <KpiCard label="Courses" value={analytics?.totalCourses} icon={BookOpen} color="#10b981" sub="Learning modules" />
        <KpiCard label="Assessments" value={analytics?.totalAssessments} icon={ClipboardList} color="#f59e0b" sub="Mock tests" />
        <KpiCard label="DSA Problems" value={analytics?.totalCodingProblems} icon={Code2} color="#ef4444" sub="Coding challenges" />
        <KpiCard label="Submissions" value={analytics?.totalSubmissions} icon={CheckCircle2} color="#8b5cf6" sub="Completed" />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Domain Popularity */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <TrendingUp size={18} color="#ef4444" />
            <h3 style={{ color: 'var(--admin-card-text)', fontWeight: 700, fontSize: '14px', margin: 0 }}>Domain Popularity</h3>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.domainPopularity || []} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-grid-stroke)" />
                <XAxis dataKey="name" stroke="var(--admin-axis-stroke)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--admin-axis-stroke)" fontSize={10} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Demanded */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Activity size={18} color="#6366f1" />
            <h3 style={{ color: 'var(--admin-card-text)', fontWeight: 700, fontSize: '14px', margin: 0 }}>Top Skills Demanded</h3>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={(analytics?.demandedSkills || []).map(s => ({ name: s.skill, value: s.count }))}
                  cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false}
                >
                  {(analytics?.demandedSkills || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8}
                  formatter={val => <span style={{ color: 'var(--admin-card-subtext)', fontSize: '11px' }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Score Stats */}
      <div style={s.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <TrendingUp size={18} color="#10b981" />
          <h3 style={{ color: 'var(--admin-card-text)', fontWeight: 700, fontSize: '14px', margin: 0 }}>Platform Health</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Avg Mock Score', value: `${analytics?.averageMockScore || 0}%`, color: '#10b981' },
            { label: 'Admin Accounts', value: analytics?.totalAdmins ?? 0, color: '#ef4444' },
            { label: 'Active Domains', value: analytics?.domainPopularity?.length ?? 0, color: '#6366f1' },
            { label: 'Skill Categories', value: analytics?.demandedSkills?.length ?? 0, color: '#f59e0b' },
          ].map(item => (
            <div key={item.label} style={{
              padding: '16px', background: 'var(--admin-input-bg)', borderRadius: '12px',
              border: `1px solid ${item.color}20`
            }}>
              <p style={{ color: 'var(--admin-card-subtext)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px' }}>{item.label}</p>
              <p style={{ color: item.color, fontSize: '28px', fontWeight: 900, margin: 0 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
