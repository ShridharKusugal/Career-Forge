import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Trash2, Edit3, Plus, Search, X, Loader2, CheckCircle2, AlertCircle, UserPlus } from 'lucide-react';

const s = {
  card: { background: 'var(--admin-card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--admin-card-border)', borderRadius: '16px', boxShadow: 'var(--admin-card-shadow)' },
  input: {
    width: '100%', padding: '11px 14px', background: 'var(--admin-input-bg)',
    border: '1px solid var(--admin-input-border)', borderRadius: '10px', color: 'var(--admin-input-text)',
    fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  label: { color: 'var(--admin-card-subtext)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', display: 'block' },
  btn: (color = '#ef4444') => ({
    display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px',
    background: `${color}18`, border: `1px solid ${color}35`, borderRadius: '10px',
    color, cursor: 'pointer', fontSize: '13px', fontWeight: 700, transition: 'all 0.2s', fontFamily: 'inherit',
  }),
};

const roleColors = { ADMIN: '#ef4444', MENTOR: '#f59e0b', STUDENT: '#0ea5e9' };

const Toast = ({ msg, type, onClose }) => (
  <div style={{
    position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
    display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px',
    background: 'var(--admin-modal-bg)',
    border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
    borderRadius: '12px', backdropFilter: 'blur(20px)', maxWidth: '340px',
    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)',
    animation: 'fadeInUp 0.3s ease',
  }}>
    {type === 'success' ? <CheckCircle2 size={16} color="#10b981" /> : <AlertCircle size={16} color="#ef4444" />}
    <span style={{ color: 'var(--admin-card-text)', fontSize: '13px', fontWeight: 600 }}>{msg}</span>
    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '8px', padding: 0, display: 'flex', alignItems: 'center' }}>
      <X size={14} color="var(--admin-card-subtext)" />
    </button>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px'
  }}>
    <div style={{
      background: 'var(--admin-modal-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '20px',
      padding: '28px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto',
      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
      animation: 'fadeInUp 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ color: 'var(--admin-card-text)', fontWeight: 800, fontSize: '16px', margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'var(--admin-input-bg)', border: '1px solid var(--admin-input-border)', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--admin-card-subtext)' }}>
          <X size={16} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [toast, setToast] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(null); // user object
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'STUDENT' });
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = () => {
    setLoading(true);
    axios.get('/api/admin/users')
      .then(r => setUsers(r.data))
      .catch(() => showToast('Failed to load users', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers(u => u.filter(x => x.id !== id));
      showToast(`User "${username}" deleted successfully`);
    } catch { showToast('Failed to delete user', 'error'); }
  };

  const handleRoleChange = async (id, newRole) => {
    setSaving(true);
    try {
      await axios.put(`/api/admin/users/${id}/role`, { role: newRole });
      setUsers(u => u.map(x => x.id === id ? { ...x, role: newRole } : x));
      setShowRoleModal(null);
      showToast('Role updated successfully');
    } catch { showToast('Failed to update role', 'error'); }
    finally { setSaving(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/admin/users', newUser);
      setShowCreate(false);
      setNewUser({ username: '', email: '', password: '', role: 'STUDENT' });
      showToast('User created successfully');
      load();
    } catch { showToast('Failed to create user', 'error'); }
    finally { setSaving(false); }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.username?.toLowerCase().includes(search.toLowerCase()) ||
                        u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} 
        .admin-input-focus:focus{border-color:rgba(239,68,68,0.5)!important;} 
        select option {
          background: var(--admin-modal-bg);
          color: var(--admin-card-text);
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users size={20} color="#0ea5e9" />
          <h2 style={{ color: 'var(--admin-card-text)', fontSize: '20px', fontWeight: 800, margin: 0 }}>User Management</h2>
          <span style={{ background: 'rgba(14,165,233,0.15)', color: '#0ea5e9', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
            {users.length} total
          </span>
        </div>
        <button onClick={() => setShowCreate(true)} style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
          background: 'linear-gradient(135deg,#dc2626,#7c3aed)', border: 'none',
          borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
        }}>
          <UserPlus size={15} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} color="var(--admin-card-subtext)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input className="admin-input-focus" style={{ ...s.input, paddingLeft: '36px' }}
            placeholder="Search by name or email…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['ALL', 'ADMIN', 'MENTOR', 'STUDENT'].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)} style={{
            padding: '9px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            border: '1px solid var(--admin-input-border)', fontFamily: 'inherit',
            background: roleFilter === r ? 'rgba(239,68,68,0.15)' : 'var(--admin-input-bg)',
            color: roleFilter === r ? '#ef4444' : 'var(--admin-card-subtext)',
            borderColor: roleFilter === r ? 'rgba(239,68,68,0.35)' : 'var(--admin-input-border)',
            transition: 'all 0.2s',
          }}>{r}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...s.card, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
            <Loader2 size={24} color="#ef4444" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ color: 'var(--admin-card-subtext)' }}>Loading users…</span>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--admin-sidebar-border)' }}>
                  {['ID', 'Username', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--admin-card-subtext)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--admin-sidebar-border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--admin-row-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px', color: 'var(--admin-card-subtext)', fontSize: '12px', fontFamily: 'monospace' }}>#{u.id}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--admin-card-text)', fontWeight: 700, fontSize: '14px' }}>{u.username}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--admin-card-subtext)', fontSize: '13px' }}>{u.email}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
                        background: `${roleColors[u.role] || '#6366f1'}18`,
                        color: roleColors[u.role] || '#6366f1',
                        border: `1px solid ${roleColors[u.role] || '#6366f1'}30`,
                      }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--admin-card-subtext)', fontSize: '12px' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setShowRoleModal(u)} style={{ ...s.btn('#6366f1'), padding: '6px 12px', fontSize: '12px' }}>
                          <Edit3 size={12} /> Role
                        </button>
                        <button onClick={() => handleDelete(u.id, u.username)} style={{ ...s.btn('#ef4444'), padding: '6px 12px', fontSize: '12px' }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-card-subtext)', fontSize: '14px' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Change Modal */}
      {showRoleModal && (
        <Modal title={`Change Role — ${showRoleModal.username}`} onClose={() => setShowRoleModal(null)}>
          <p style={{ color: 'var(--admin-card-subtext)', fontSize: '13px', marginBottom: '20px' }}>
            Current role: <strong style={{ color: roleColors[showRoleModal.role], textTransform: 'uppercase' }}>{showRoleModal.role}</strong>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['STUDENT', 'MENTOR', 'ADMIN'].map(role => (
              <button key={role} onClick={() => handleRoleChange(showRoleModal.id, role)}
                disabled={saving || showRoleModal.role === role}
                style={{
                  padding: '14px 20px', borderRadius: '12px', border: `1px solid ${roleColors[role]}30`,
                  background: showRoleModal.role === role ? `${roleColors[role]}20` : 'var(--admin-input-bg)',
                  color: roleColors[role], fontWeight: 700, fontSize: '14px', cursor: showRoleModal.role === role ? 'default' : 'pointer',
                  opacity: saving ? 0.6 : 1, fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                {showRoleModal.role === role ? '✓ Current Role' : `Set as ${role}`}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Create User Modal */}
      {showCreate && (
        <Modal title="Create New User" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Username', key: 'username', type: 'text', placeholder: 'Enter username' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'Enter email' },
              { label: 'Password', key: 'password', type: 'password', placeholder: 'Enter password' },
            ].map(f => (
              <div key={f.key}>
                <label style={s.label}>{f.label}</label>
                <input className="admin-input-focus" style={s.input} type={f.type} placeholder={f.placeholder}
                  value={newUser[f.key]} onChange={e => setNewUser(p => ({ ...p, [f.key]: e.target.value }))} required />
              </div>
            ))}
            <div>
              <label style={s.label}>Role</label>
              <select style={{ ...s.input, cursor: 'pointer' }} value={newUser.role}
                onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}>
                {['STUDENT', 'MENTOR', 'ADMIN'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button type="submit" disabled={saving} style={{
              padding: '13px', background: 'linear-gradient(135deg,#dc2626,#7c3aed)',
              border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '14px',
              cursor: 'pointer', marginTop: '4px', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={16} />}
              {saving ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminUsers;
