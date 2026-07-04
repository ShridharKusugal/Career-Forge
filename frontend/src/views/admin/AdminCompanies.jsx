import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, Plus, Trash2, Edit3, Search, X, Loader2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

const s = {
  card: { background: 'var(--admin-card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--admin-card-border)', borderRadius: '16px', boxShadow: 'var(--admin-card-shadow)' },
  input: { width: '100%', padding: '11px 14px', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-input-border)', borderRadius: '10px', color: 'var(--admin-input-text)', fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  label: { color: 'var(--admin-card-subtext)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', display: 'block' },
  textarea: { width: '100%', padding: '11px 14px', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-input-border)', borderRadius: '10px', color: 'var(--admin-input-text)', fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '80px' },
};

const EMPTY = { name:'', logoUrl:'', hiringRoles:'', eligibility:'', requiredSkills:'', hiringRounds:'', salaryPackage:'', jobLocation:'', applicationLink:'', experienceLevel:'', hiringTrends:'', jobPostsCount:0, totalApplicants:0, companyDescription:'', industry:'', foundedYear:'', headquarters:'', employeeCount:'' };

const Toast = ({ msg, type, onClose }) => (
  <div style={{ position:'fixed', bottom:'24px', right:'24px', zIndex:9999, display:'flex', alignItems:'center', gap:'10px', padding:'14px 20px', background: 'var(--admin-modal-bg)', border:`1px solid ${type==='success'?'rgba(16,185,129,0.4)':'rgba(239,68,68,0.4)'}`, borderRadius:'12px', backdropFilter:'blur(20px)', boxShadow:'0 10px 30px -10px rgba(0,0,0,0.15)', animation:'fadeInUp 0.3s ease', maxWidth:'340px' }}>
    {type==='success'?<CheckCircle2 size={16} color="#10b981"/>:<AlertCircle size={16} color="#ef4444"/>}
    <span style={{color:'var(--admin-card-text)',fontSize:'13px',fontWeight:600}}>{msg}</span>
    <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',marginLeft:'8px',padding:0,display:'flex',alignItems:'center'}}><X size={14} color="var(--admin-card-subtext)"/></button>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'16px' }}>
    <div style={{ background:'var(--admin-modal-bg)', border:'1px solid var(--admin-card-border)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'640px', maxHeight:'92vh', overflowY:'auto', boxShadow:'0 20px 40px -15px rgba(0,0,0,0.1)', animation:'fadeInUp 0.3s ease' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <h3 style={{ color:'var(--admin-card-text)', fontWeight:800, fontSize:'16px', margin:0 }}>{title}</h3>
        <button onClick={onClose} style={{ background:'var(--admin-input-bg)', border:'1px solid var(--admin-input-border)', borderRadius:'8px', padding:'6px', cursor:'pointer', display:'flex', alignItems:'center', color:'var(--admin-card-subtext)' }}>
          <X size={16} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const FormGrid = ({ form, setForm, fields }) => (
  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
    {fields.map(f => (
      <div key={f.key} style={{ gridColumn: f.full ? '1/-1' : 'auto' }}>
        <label style={s.label}>{f.label}</label>
        {f.type === 'textarea'
          ? <textarea style={s.textarea} placeholder={f.placeholder || ''} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
          : <input style={s.input} type={f.type || 'text'} placeholder={f.placeholder || ''} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
        }
      </div>
    ))}
  </div>
);

const FIELDS = [
  { key:'name', label:'Company Name', placeholder:'e.g. Google', full:false },
  { key:'industry', label:'Industry', placeholder:'e.g. Technology', full:false },
  { key:'logoUrl', label:'Logo URL', placeholder:'https://…', full:false },
  { key:'headquarters', label:'Headquarters', placeholder:'e.g. Mountain View, CA', full:false },
  { key:'foundedYear', label:'Founded Year', type:'number', placeholder:'e.g. 1998', full:false },
  { key:'employeeCount', label:'Employee Count', placeholder:'e.g. 100,000+', full:false },
  { key:'salaryPackage', label:'Salary Package', placeholder:'e.g. ₹20-40 LPA', full:false },
  { key:'jobLocation', label:'Job Location', placeholder:'e.g. Bangalore, Remote', full:false },
  { key:'experienceLevel', label:'Experience Level', placeholder:'e.g. Fresher / 0-2 Years', full:false },
  { key:'applicationLink', label:'Application Link', placeholder:'https://careers.google.com', full:false },
  { key:'hiringRoles', label:'Hiring Roles', placeholder:'SDE, Data Analyst, PM…', full:true },
  { key:'requiredSkills', label:'Required Skills (comma separated)', placeholder:'Java, Python, DSA…', full:true },
  { key:'eligibility', label:'Eligibility Criteria', placeholder:'B.Tech CSE/IT, 7+ CGPA…', full:true },
  { key:'hiringRounds', label:'Hiring Rounds', placeholder:'Online Test → Technical → HR…', full:true },
  { key:'hiringTrends', label:'Hiring Trends', type:'textarea', placeholder:'Current hiring patterns…', full:true },
  { key:'companyDescription', label:'Company Description', type:'textarea', placeholder:'Brief about the company…', full:true },
];

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // null | 'create' | company_obj
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const load = () => {
    setLoading(true);
    axios.get('/api/admin/companies').then(r => setCompanies(r.data)).catch(() => showToast('Failed to load', 'error')).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit = (c) => { setForm({ ...c }); setModal(c); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'create') {
        await axios.post('/api/admin/companies', form);
        showToast('Company added successfully!');
      } else {
        await axios.put(`/api/admin/companies/${modal.id}`, form);
        showToast('Company updated successfully!');
      }
      setModal(null); load();
    } catch { showToast('Failed to save company', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete company "${name}"?`)) return;
    try {
      await axios.delete(`/api/admin/companies/${id}`);
      setCompanies(c => c.filter(x => x.id !== id));
      showToast(`"${name}" deleted`);
    } catch { showToast('Failed to delete', 'error'); }
  };

  const filtered = companies.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.industry?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} 
        input:focus,textarea:focus{border-color:rgba(239,68,68,0.5)!important;} 
        select option{
          background: var(--admin-modal-bg);
          color: var(--admin-card-text);
        }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <Building2 size={20} color="#6366f1"/>
          <h2 style={{ color:'var(--admin-card-text)', fontSize:'20px', fontWeight:800, margin:0 }}>Company Management</h2>
          <span style={{ background:'rgba(99,102,241,0.15)', color:'#6366f1', padding:'2px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:700 }}>{companies.length} companies</span>
        </div>
        <button onClick={openCreate} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 20px', background:'linear-gradient(135deg,#6366f1,#7c3aed)', border:'none', borderRadius:'10px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:700, fontFamily:'inherit' }}>
          <Plus size={15}/> Add Company
        </button>
      </div>

      {/* Search */}
      <div style={{ position:'relative', maxWidth:'400px' }}>
        <Search size={14} color="var(--admin-card-subtext)" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)' }}/>
        <input style={{ ...s.input, paddingLeft:'36px' }} placeholder="Search companies…" value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'80px', gap:'12px' }}>
          <Loader2 size={24} color="#6366f1" style={{ animation:'spin 1s linear infinite' }}/><span style={{ color:'var(--admin-card-subtext)' }}>Loading…</span>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'16px' }}>
          {filtered.map(c => (
            <div key={c.id} style={{ ...s.card, padding:'20px', display:'flex', flexDirection:'column', gap:'12px', transition:'transform 0.2s,border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='rgba(99,102,241,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='var(--admin-card-border)'; }}>
              {/* Company Header */}
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                {c.logoUrl ? (
                  <img src={c.logoUrl} alt={c.name} style={{ width:'40px', height:'40px', objectFit:'contain', borderRadius:'10px', background:'rgba(120,120,120,0.08)', padding:'4px' }} onError={e => e.target.style.display='none'}/>
                ) : (
                  <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'rgba(99,102,241,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Building2 size={20} color="#6366f1"/>
                  </div>
                )}
                <div>
                  <p style={{ color:'var(--admin-card-text)', fontWeight:800, fontSize:'15px', margin:0 }}>{c.name}</p>
                  <p style={{ color:'var(--admin-card-subtext)', fontSize:'12px', margin:'2px 0 0' }}>{c.industry || 'Technology'}</p>
                </div>
              </div>

              {/* Info */}
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                {c.salaryPackage && <p style={{ color:'var(--admin-card-subtext)', fontSize:'12px', margin:0 }}>💰 {c.salaryPackage}</p>}
                {c.jobLocation && <p style={{ color:'var(--admin-card-subtext)', fontSize:'12px', margin:0 }}>📍 {c.jobLocation}</p>}
                {c.experienceLevel && <p style={{ color:'var(--admin-card-subtext)', fontSize:'12px', margin:0 }}>👤 {c.experienceLevel}</p>}
              </div>

              {/* Roles */}
              {c.hiringRoles && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                  {c.hiringRoles.split(',').slice(0,3).map((r,i) => (
                    <span key={i} style={{ background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.2)', color:'#818cf8', padding:'2px 8px', borderRadius:'6px', fontSize:'11px', fontWeight:600 }}>{r.trim()}</span>
                  ))}
                  {c.hiringRoles.split(',').length > 3 && <span style={{ color:'var(--admin-card-subtext)', fontSize:'11px' }}>+{c.hiringRoles.split(',').length - 3} more</span>}
                </div>
              )}

              {/* Actions */}
              <div style={{ display:'flex', gap:'8px', marginTop:'auto' }}>
                <button onClick={() => openEdit(c)} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'8px', background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'8px', color:'#818cf8', cursor:'pointer', fontSize:'12px', fontWeight:700, fontFamily:'inherit' }}>
                  <Edit3 size={13}/> Edit
                </button>
                {c.applicationLink && (
                  <a href={c.applicationLink} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'8px 12px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'8px', color:'#10b981', textDecoration:'none' }}>
                    <ExternalLink size={13}/>
                  </a>
                )}
                <button onClick={() => handleDelete(c.id, c.name)} style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'8px 12px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'#ef4444', cursor:'pointer', fontFamily:'inherit' }}>
                  <Trash2 size={13}/>
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'80px', color:'var(--admin-card-subtext)' }}>No companies found</div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modal !== null && (
        <Modal title={modal === 'create' ? 'Add New Company' : `Edit — ${modal.name}`} onClose={() => setModal(null)}>
          <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <FormGrid form={form} setForm={setForm} fields={FIELDS}/>
            <button type="submit" disabled={saving} style={{ padding:'14px', background:'linear-gradient(135deg,#6366f1,#7c3aed)', border:'none', borderRadius:'12px', color:'#fff', fontWeight:700, fontSize:'14px', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginTop:'4px' }}>
              {saving ? <><Loader2 size={16} style={{ animation:'spin 1s linear infinite' }}/> Saving...</> : <><Plus size={16}/> {modal === 'create' ? 'Add Company' : 'Save Changes'}</>}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminCompanies;
