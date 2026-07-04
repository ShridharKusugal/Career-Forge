import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, Plus, Trash2, Edit3, Search, X, Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const s = {
  card: { background:'var(--admin-card-bg)', backdropFilter:'blur(20px)', border:'1px solid var(--admin-card-border)', borderRadius:'16px', boxShadow:'var(--admin-card-shadow)' },
  input: { width:'100%', padding:'11px 14px', background:'var(--admin-input-bg)', border:'1px solid var(--admin-input-border)', borderRadius:'10px', color:'var(--admin-input-text)', fontSize:'13px', fontFamily:'inherit', outline:'none', boxSizing:'border-box' },
  label: { color:'var(--admin-card-subtext)', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px', display:'block' },
  textarea: { width:'100%', padding:'11px 14px', background:'var(--admin-input-bg)', border:'1px solid var(--admin-input-border)', borderRadius:'10px', color:'var(--admin-input-text)', fontSize:'13px', fontFamily:'inherit', outline:'none', boxSizing:'border-box', resize:'vertical', minHeight:'120px' },
};

const typeColors = { APTITUDE:'#f59e0b', TECHNICAL:'#0ea5e9', COMPETITIVE:'#6366f1', INTERVIEW:'#10b981', DOMAIN:'#8b5cf6' };
const TYPES = ['APTITUDE','TECHNICAL','COMPETITIVE','INTERVIEW','DOMAIN'];
const CATEGORIES = ['COMPETITIVE','INTERVIEW','DOMAIN'];

const Toast = ({ msg, type, onClose }) => (
  <div style={{ position:'fixed', bottom:'24px', right:'24px', zIndex:9999, display:'flex', alignItems:'center', gap:'10px', padding:'14px 20px', background:'var(--admin-modal-bg)', border:`1px solid ${type==='success'?'rgba(16,185,129,0.4)':'rgba(239,68,68,0.4)'}`, borderRadius:'12px', backdropFilter:'blur(20px)', boxShadow:'0 10px 30px -10px rgba(0,0,0,0.15)', animation:'fadeInUp 0.3s ease', maxWidth:'340px' }}>
    {type==='success'?<CheckCircle2 size={16} color="#10b981"/>:<AlertCircle size={16} color="#ef4444"/>}
    <span style={{color:'var(--admin-card-text)',fontSize:'13px',fontWeight:600}}>{msg}</span>
    <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',padding:0,display:'flex',alignItems:'center'}}><X size={14} color="var(--admin-card-subtext)"/></button>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'16px' }}>
    <div style={{ background:'var(--admin-modal-bg)', border:'1px solid var(--admin-card-border)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'600px', maxHeight:'92vh', overflowY:'auto', boxShadow:'0 20px 40px -15px rgba(0,0,0,0.1)', animation:'fadeInUp 0.3s ease' }}>
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

const EMPTY = { title:'', type:'APTITUDE', durationMinutes:30, questions:'', companyId:'', category:'COMPETITIVE' };

const AdminAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const load = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/admin/assessments'),
      axios.get('/api/admin/companies'),
    ]).then(([ar, cr]) => {
      setAssessments(ar.data);
      setCompanies(cr.data);
    }).catch(()=>showToast('Failed to load','error')).finally(()=>setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit = (a) => { setForm({ title:a.title||'', type:a.type||'APTITUDE', durationMinutes:a.durationMinutes||30, questions:a.questions||'', companyId:a.companyId||'', category:a.category||'COMPETITIVE' }); setModal(a); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, durationMinutes: Number(form.durationMinutes), companyId: form.companyId ? Number(form.companyId) : null };
      if (modal==='create') { await axios.post('/api/admin/assessments', payload); showToast('Assessment added!'); }
      else { await axios.put(`/api/admin/assessments/${modal.id}`, payload); showToast('Assessment updated!'); }
      setModal(null); load();
    } catch { showToast('Failed to save','error'); } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete assessment "${title}"?`)) return;
    try { await axios.delete(`/api/admin/assessments/${id}`); setAssessments(a=>a.filter(x=>x.id!==id)); showToast('Deleted successfully'); }
    catch { showToast('Failed to delete','error'); }
  };

  const getCompanyName = (id) => companies.find(c=>c.id===id||c.id===Number(id))?.name || '—';

  const filtered = assessments.filter(a => {
    const matchSearch = (a.title||'').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter==='ALL' || a.type===typeFilter;
    return matchSearch && matchType;
  });

  const getQuestionCount = (qJson) => {
    try { return JSON.parse(qJson || '[]').length; } catch { return '—'; }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      {toast && <Toast {...toast} onClose={()=>setToast(null)} />}
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} 
        input:focus,textarea:focus,select:focus{border-color:rgba(245,158,11,0.5)!important;} 
        select option{
          background: var(--admin-modal-bg);
          color: var(--admin-card-text);
        }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <ClipboardList size={20} color="#f59e0b"/>
          <h2 style={{ color:'var(--admin-card-text)', fontSize:'20px', fontWeight:800, margin:0 }}>Assessment Management</h2>
          <span style={{ background:'rgba(245,158,11,0.15)', color:'#f59e0b', padding:'2px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:700 }}>{assessments.length} tests</span>
        </div>
        <button onClick={openCreate} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 20px', background:'linear-gradient(135deg,#d97706,#b45309)', border:'none', borderRadius:'10px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:700, fontFamily:'inherit' }}>
          <Plus size={15}/> Add Assessment
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
          <Search size={14} color="var(--admin-card-subtext)" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)' }} />
          <input style={{ ...s.input, paddingLeft:'36px' }} placeholder="Search assessments…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {['ALL',...TYPES].map(t=>(
            <button key={t} onClick={()=>setTypeFilter(t)} style={{ padding:'8px 14px', borderRadius:'10px', border:`1px solid ${typeFilter===t?(typeColors[t]||'rgba(245,158,11,0.4)'):'var(--admin-input-border)'}`, background:typeFilter===t?`${typeColors[t]||'#f59e0b'}18`:'var(--admin-input-bg)', color:typeFilter===t?(typeColors[t]||'#f59e0b'):'var(--admin-card-subtext)', cursor:'pointer', fontSize:'12px', fontWeight:700, fontFamily:'inherit' }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'12px' }}>
        {TYPES.map(t=>(
          <div key={t} style={{ padding:'14px 16px', background:'var(--admin-input-bg)', border:`1px solid ${typeColors[t]}20`, borderRadius:'12px' }}>
            <p style={{ color:'var(--admin-card-subtext)', fontSize:'10px', fontWeight:700, textTransform:'uppercase', margin:'0 0 4px' }}>{t}</p>
            <p style={{ color:typeColors[t], fontSize:'22px', fontWeight:900, margin:0 }}>{assessments.filter(a=>a.type===t).length}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...s.card, overflow:'hidden' }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px', gap:'12px', alignItems:'center' }}>
            <Loader2 size={24} color="#f59e0b" style={{ animation:'spin 1s linear infinite' }}/><span style={{ color:'var(--admin-card-subtext)' }}>Loading…</span>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--admin-sidebar-border)' }}>
                  {['#','Title','Type','Duration','Questions','Company','Actions'].map(h=>(
                    <th key={h} style={{ padding:'14px 18px', textAlign:'left', color:'var(--admin-card-subtext)', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a=>(
                  <tr key={a.id} style={{ borderBottom:'1px solid var(--admin-sidebar-border)' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--admin-row-hover)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'13px 18px', color:'var(--admin-card-subtext)', fontSize:'12px', fontFamily:'monospace' }}>#{a.id}</td>
                    <td style={{ padding:'13px 18px', color:'var(--admin-card-text)', fontWeight:700, fontSize:'13px', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.title}</td>
                    <td style={{ padding:'13px 18px' }}>
                      <span style={{ background:`${typeColors[a.type]||'#6366f1'}18`, color:typeColors[a.type]||'#6366f1', padding:'3px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:700 }}>{a.type}</span>
                    </td>
                    <td style={{ padding:'13px 18px' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:'5px', color:'var(--admin-card-subtext)', fontSize:'12px' }}>
                        <Clock size={12}/>{a.durationMinutes} min
                      </span>
                    </td>
                    <td style={{ padding:'13px 18px', color:'var(--admin-card-subtext)', fontSize:'12px', fontWeight:700 }}>
                      {getQuestionCount(a.questions)} Qs
                    </td>
                    <td style={{ padding:'13px 18px', color:'var(--admin-card-subtext)', fontSize:'12px' }}>
                      {a.companyId ? getCompanyName(a.companyId) : '—'}
                    </td>
                    <td style={{ padding:'13px 18px' }}>
                      <div style={{ display:'flex', gap:'8px' }}>
                        <button onClick={()=>openEdit(a)} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 12px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'8px', color:'#f59e0b', cursor:'pointer', fontSize:'12px', fontWeight:700, fontFamily:'inherit' }}>
                          <Edit3 size={12}/> Edit
                        </button>
                        <button onClick={()=>handleDelete(a.id, a.title)} style={{ padding:'6px 10px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'#ef4444', cursor:'pointer', fontFamily:'inherit' }}>
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length===0&&<tr><td colSpan={7} style={{ padding:'60px', textAlign:'center', color:'var(--admin-card-subtext)' }}>No assessments found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal!==null && (
        <Modal title={modal==='create'?'Add New Assessment':`Edit — ${modal.title}`} onClose={()=>setModal(null)}>
          <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div><label style={s.label}>Title</label><input style={s.input} placeholder="Assessment title…" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required/></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div>
                <label style={s.label}>Type</label>
                <select style={{ ...s.input, cursor:'pointer' }} value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
                  {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Category</label>
                <select style={{ ...s.input, cursor:'pointer' }} value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div><label style={s.label}>Duration (minutes)</label><input style={s.input} type="number" min={5} max={300} value={form.durationMinutes} onChange={e=>setForm(p=>({...p,durationMinutes:e.target.value}))}/></div>
              <div>
                <label style={s.label}>Company (optional)</label>
                <select style={{ ...s.input, cursor:'pointer' }} value={form.companyId} onChange={e=>setForm(p=>({...p,companyId:e.target.value}))}>
                  <option value="">No company</option>
                  {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={s.label}>Questions JSON</label>
              <textarea style={{ ...s.textarea, minHeight:'160px', fontFamily:'monospace', fontSize:'12px' }}
                placeholder={'[\n  {\n    "id": 1,\n    "question": "What is …?",\n    "options": ["A","B","C","D"],\n    "answer": "A"\n  }\n]'}
                value={form.questions} onChange={e=>setForm(p=>({...p,questions:e.target.value}))}/>
              <p style={{ color:'var(--admin-card-subtext)', fontSize:'11px', margin:'4px 0 0' }}>Each question needs: id, question, options (array), answer</p>
            </div>
            <button type="submit" disabled={saving} style={{ padding:'13px', background:'linear-gradient(135deg,#d97706,#b45309)', border:'none', borderRadius:'12px', color:'#fff', fontWeight:700, fontSize:'14px', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginTop:'4px' }}>
              {saving?<><Loader2 size={16} style={{animation:'spin 1s linear infinite'}}/> Saving…</>:<><Plus size={16}/>{modal==='create'?'Add Assessment':'Save Changes'}</>}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminAssessments;
