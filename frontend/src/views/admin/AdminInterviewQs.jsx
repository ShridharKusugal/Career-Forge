import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Plus, Trash2, Search, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const s = {
  card: { background:'var(--admin-card-bg)', backdropFilter:'blur(20px)', border:'1px solid var(--admin-card-border)', borderRadius:'16px', boxShadow:'var(--admin-card-shadow)' },
  input: { width:'100%', padding:'11px 14px', background:'var(--admin-input-bg)', border:'1px solid var(--admin-input-border)', borderRadius:'10px', color:'var(--admin-input-text)', fontSize:'13px', fontFamily:'inherit', outline:'none', boxSizing:'border-box' },
  label: { color:'var(--admin-card-subtext)', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px', display:'block' },
  textarea: { width:'100%', padding:'11px 14px', background:'var(--admin-input-bg)', border:'1px solid var(--admin-input-border)', borderRadius:'10px', color:'var(--admin-input-text)', fontSize:'13px', fontFamily:'inherit', outline:'none', boxSizing:'border-box', resize:'vertical', minHeight:'100px' },
};

const TYPES = ['TECHNICAL','HR','CODING','APTITUDE'];
const DIFFICULTIES = ['EASY','MEDIUM','HARD'];
const EMPTY = { question:'', answer:'', type:'TECHNICAL', difficulty:'MEDIUM', companyId:'' };

const Toast = ({ msg, type, onClose }) => (
  <div style={{ position:'fixed', bottom:'24px', right:'24px', zIndex:9999, display:'flex', alignItems:'center', gap:'10px', padding:'14px 20px', background:'var(--admin-modal-bg)', border:`1px solid ${type==='success'?'rgba(16,185,129,0.4)':'rgba(239,68,68,0.4)'}`, borderRadius:'12px', backdropFilter:'blur(20px)', boxShadow:'0 10px 30px -10px rgba(0,0,0,0.15)', animation:'fadeInUp 0.3s ease', maxWidth:'340px' }}>
    {type==='success'?<CheckCircle2 size={16} color="#10b981"/>:<AlertCircle size={16} color="#ef4444"/>}
    <span style={{color:'var(--admin-card-text)',fontSize:'13px',fontWeight:600}}>{msg}</span>
    <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',padding:0,display:'flex',alignItems:'center'}}><X size={14} color="var(--admin-card-subtext)"/></button>
  </div>
);

const typeColors = { TECHNICAL:'#0ea5e9', HR:'#10b981', CODING:'#ef4444', APTITUDE:'#f59e0b' };
const diffColors = { EASY:'#10b981', MEDIUM:'#f59e0b', HARD:'#ef4444' };

const AdminInterviewQs = () => {
  const [questions, setQuestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const load = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/admin/interview-questions'),
      axios.get('/api/admin/companies'),
    ]).then(([qr,cr]) => { setQuestions(qr.data); setCompanies(cr.data); })
      .catch(()=>showToast('Failed to load','error')).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  const handleAdd = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, companyId: form.companyId ? Number(form.companyId) : 0 };
      await axios.post('/api/admin/interview-questions', payload);
      showToast('Question added!'); setShowForm(false); setForm(EMPTY); load();
    } catch { showToast('Failed to add','error'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try { await axios.delete(`/api/admin/interview-questions/${id}`); setQuestions(q=>q.filter(x=>x.id!==id)); showToast('Deleted'); }
    catch { showToast('Failed to delete','error'); }
  };

  const getCompanyName = (id) => companies.find(c=>c.id===id||c.id===Number(id))?.name||'—';

  const filtered = questions.filter(q => {
    const matchSearch = (q.question||'').toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter==='ALL' || q.type===catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      {toast && <Toast {...toast} onClose={()=>setToast(null)} />}
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} 
        input:focus,textarea:focus,select:focus{border-color:rgba(139,92,246,0.5)!important;} 
        select option{
          background: var(--admin-modal-bg);
          color: var(--admin-card-text);
        }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <MessageSquare size={20} color="#8b5cf6"/>
          <h2 style={{ color:'var(--admin-card-text)', fontSize:'20px', fontWeight:800, margin:0 }}>Interview Questions</h2>
          <span style={{ background:'rgba(139,92,246,0.15)', color:'#8b5cf6', padding:'2px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:700 }}>{questions.length} questions</span>
        </div>
        <button onClick={()=>setShowForm(v=>!v)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 20px', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', border:'none', borderRadius:'10px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:700, fontFamily:'inherit', transition:'all 0.2s' }}>
          <Plus size={15}/> {showForm?'Cancel':'Add Question'}
        </button>
      </div>

      {/* Add Form (inline) */}
      {showForm && (
        <div style={{ ...s.card, padding:'24px', animation:'fadeInUp 0.3s ease', border:'1px solid var(--admin-card-border)' }}>
          <h3 style={{ color:'#a78bfa', fontWeight:700, fontSize:'14px', margin:'0 0 20px', display:'flex', alignItems:'center', gap:'8px' }}><Plus size={16}/> New Interview Question</h3>
          <form onSubmit={handleAdd} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div>
              <label style={s.label}>Question</label>
              <textarea style={s.textarea} placeholder="Enter the interview question…" value={form.question} onChange={e=>setForm(p=>({...p,question:e.target.value}))} required/>
            </div>
            <div>
              <label style={s.label}>Model Answer</label>
              <textarea style={{ ...s.textarea, minHeight:'120px' }} placeholder="Provide a detailed model answer…" value={form.answer} onChange={e=>setForm(p=>({...p,answer:e.target.value}))} required/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div>
                <label style={s.label}>Type</label>
                <select style={{ ...s.input, cursor:'pointer' }} value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
                  {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Difficulty</label>
                <select style={{ ...s.input, cursor:'pointer' }} value={form.difficulty} onChange={e=>setForm(p=>({...p,difficulty:e.target.value}))}>
                  {DIFFICULTIES.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Company (optional)</label>
                <select style={{ ...s.input, cursor:'pointer' }} value={form.companyId} onChange={e=>setForm(p=>({...p,companyId:e.target.value}))}>
                  <option value="">No company</option>
                  {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={saving} style={{ padding:'12px', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, fontSize:'13px', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
              {saving?<><Loader2 size={15} style={{animation:'spin 1s linear infinite'}}/> Adding…</>:<><Plus size={15}/> Add Question</>}
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
          <Search size={14} color="var(--admin-card-subtext)" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)' }}/>
          <input style={{ ...s.input, paddingLeft:'36px' }} placeholder="Search questions…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {['ALL',...TYPES].map(c=>(
            <button key={c} onClick={()=>setCatFilter(c)} style={{ padding:'7px 13px', borderRadius:'8px', border:`1px solid ${catFilter===c?(typeColors[c]||'rgba(139,92,246,0.4)'):'var(--admin-input-border)'}`, background:catFilter===c?`${typeColors[c]||'#8b5cf6'}18`:'var(--admin-input-bg)', color:catFilter===c?(typeColors[c]||'#8b5cf6'):'var(--admin-card-subtext)', cursor:'pointer', fontSize:'11px', fontWeight:700, fontFamily:'inherit' }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Type Stats */}
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
        {TYPES.map(c=>(
          <div key={c} style={{ padding:'10px 16px', background:`${typeColors[c]||'#8b5cf6'}0d`, border:`1px solid ${typeColors[c]||'#8b5cf6'}20`, borderRadius:'10px', display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ color:typeColors[c]||'#8b5cf6', fontWeight:900, fontSize:'16px' }}>{questions.filter(q=>q.type===c).length}</span>
            <span style={{ color:'var(--admin-card-subtext)', fontSize:'11px', fontWeight:700 }}>{c}</span>
          </div>
        ))}
      </div>

      {/* Questions List */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'60px', gap:'12px', alignItems:'center' }}>
          <Loader2 size={24} color="#8b5cf6" style={{ animation:'spin 1s linear infinite' }}/><span style={{ color:'var(--admin-card-subtext)' }}>Loading…</span>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {filtered.map(q=>(
            <div key={q.id} style={{ ...s.card, padding:'20px', transition:'border-color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(139,92,246,0.25)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--admin-card-border)'}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'16px', marginBottom:'12px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
                  <span style={{ color:'var(--admin-card-subtext)', opacity: 0.6, fontSize:'11px', fontFamily:'monospace' }}>#{q.id}</span>
                  <span style={{ background:`${typeColors[q.type]||'#8b5cf6'}18`, color:typeColors[q.type]||'#8b5cf6', padding:'3px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:700 }}>{q.type||'—'}</span>
                  {q.difficulty && <span style={{ background:`${diffColors[q.difficulty]||'#6366f1'}18`, color:diffColors[q.difficulty]||'#6366f1', padding:'3px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:700 }}>{q.difficulty}</span>}
                  {q.companyId && <span style={{ background:'var(--admin-input-bg)', color:'var(--admin-card-subtext)', padding:'3px 10px', border:'1px solid var(--admin-input-border)', borderRadius:'6px', fontSize:'11px' }}>{getCompanyName(q.companyId)}</span>}
                </div>
                <button onClick={()=>handleDelete(q.id)} style={{ flexShrink:0, padding:'6px 10px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'#ef4444', cursor:'pointer', fontFamily:'inherit' }}>
                  <Trash2 size={13}/>
                </button>
              </div>
              <p style={{ color:'var(--admin-card-text)', fontWeight:700, fontSize:'14px', margin:'0 0 10px', lineHeight:1.5 }}>Q: {q.question}</p>
              {q.answer && (
                <details>
                  <summary style={{ color:'rgba(139,92,246,0.8)', fontSize:'12px', fontWeight:700, cursor:'pointer', userSelect:'none' }}>View Model Answer</summary>
                  <p style={{ color:'var(--admin-card-subtext)', fontSize:'13px', lineHeight:1.6, margin:'10px 0 0', paddingLeft:'12px', borderLeft:'2px solid rgba(139,92,246,0.3)' }}>{q.answer}</p>
                </details>
              )}
            </div>
          ))}
          {filtered.length===0 && (
            <div style={{ textAlign:'center', padding:'80px', color:'var(--admin-card-subtext)', fontSize:'14px' }}>No questions found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminInterviewQs;
