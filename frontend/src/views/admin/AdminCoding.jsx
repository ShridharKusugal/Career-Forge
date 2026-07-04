import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Code2, Plus, Trash2, Edit3, Search, X, Loader2, CheckCircle2, AlertCircle, Tag } from 'lucide-react';

const s = {
  card: { background:'var(--admin-card-bg)', backdropFilter:'blur(20px)', border:'1px solid var(--admin-card-border)', borderRadius:'16px', boxShadow:'var(--admin-card-shadow)' },
  input: { width:'100%', padding:'11px 14px', background:'var(--admin-input-bg)', border:'1px solid var(--admin-input-border)', borderRadius:'10px', color:'var(--admin-input-text)', fontSize:'13px', fontFamily:'inherit', outline:'none', boxSizing:'border-box' },
  label: { color:'var(--admin-card-subtext)', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px', display:'block' },
  textarea: { width:'100%', padding:'11px 14px', background:'var(--admin-input-bg)', border:'1px solid var(--admin-input-border)', borderRadius:'10px', color:'var(--admin-input-text)', fontSize:'13px', fontFamily:'inherit', outline:'none', boxSizing:'border-box', resize:'vertical', minHeight:'80px' },
  monoArea: { width:'100%', padding:'11px 14px', background:'var(--admin-input-bg)', border:'1px solid var(--admin-input-border)', borderRadius:'10px', color:'#7dd3fc', fontSize:'12px', fontFamily:'monospace', outline:'none', boxSizing:'border-box', resize:'vertical', minHeight:'100px' },
};

const diffColors = { EASY:'#10b981', MEDIUM:'#f59e0b', HARD:'#ef4444' };

const Toast = ({ msg, type, onClose }) => (
  <div style={{ position:'fixed', bottom:'24px', right:'24px', zIndex:9999, display:'flex', alignItems:'center', gap:'10px', padding:'14px 20px', background:'var(--admin-modal-bg)', border:`1px solid ${type==='success'?'rgba(16,185,129,0.4)':'rgba(239,68,68,0.4)'}`, borderRadius:'12px', backdropFilter:'blur(20px)', boxShadow:'0 10px 30px -10px rgba(0,0,0,0.15)', animation:'fadeInUp 0.3s ease', maxWidth:'340px' }}>
    {type==='success'?<CheckCircle2 size={16} color="#10b981"/>:<AlertCircle size={16} color="#ef4444"/>}
    <span style={{color:'var(--admin-card-text)',fontSize:'13px',fontWeight:600}}>{msg}</span>
    <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',padding:0,display:'flex',alignItems:'center'}}><X size={14} color="var(--admin-card-subtext)"/></button>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'16px' }}>
    <div style={{ background:'var(--admin-modal-bg)', border:'1px solid var(--admin-card-border)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'720px', maxHeight:'92vh', overflowY:'auto', boxShadow:'0 20px 40px -15px rgba(0,0,0,0.1)', animation:'fadeInUp 0.3s ease' }}>
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

const EMPTY = { title:'', description:'', difficulty:'EASY', companyId:'', topicTags:'', hints:'[]', testCases:'[]', starterCode:'{}', solutionExplanation:'', timeComplexity:'', spaceComplexity:'' };

const AdminCoding = () => {
  const [problems, setProblems] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('ALL');
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const load = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/admin/coding-problems'),
      axios.get('/api/admin/companies'),
    ]).then(([pr, cr]) => {
      setProblems(pr.data);
      setCompanies(cr.data);
    }).catch(()=>showToast('Failed to load','error')).finally(()=>setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit = (p) => {
    setForm({ title:p.title||'', description:p.description||'', difficulty:p.difficulty||'EASY', companyId:p.companyId||'', topicTags:p.topicTags||'', hints:p.hints||'[]', testCases:p.testCases||'[]', starterCode:p.starterCode||'{}', solutionExplanation:p.solutionExplanation||'', timeComplexity:p.timeComplexity||'', spaceComplexity:p.spaceComplexity||'' });
    setModal(p);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, companyId: form.companyId ? Number(form.companyId) : null };
      if (modal==='create') { await axios.post('/api/admin/coding-problems', payload); showToast('Problem added!'); }
      else { await axios.put(`/api/admin/coding-problems/${modal.id}`, payload); showToast('Problem updated!'); }
      setModal(null); load();
    } catch { showToast('Failed to save','error'); } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete problem "${title}"?`)) return;
    try { await axios.delete(`/api/admin/coding-problems/${id}`); setProblems(p=>p.filter(x=>x.id!==id)); showToast('Problem deleted'); }
    catch { showToast('Failed to delete','error'); }
  };

  const getCompanyName = (id) => companies.find(c=>c.id===id)?.name || '—';

  const filtered = problems.filter(p => {
    const matchSearch = (p.title||'').toLowerCase().includes(search.toLowerCase()) || (p.topicTags||'').toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter==='ALL' || p.difficulty===diffFilter;
    return matchSearch && matchDiff;
  });

  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      {toast && <Toast {...toast} onClose={()=>setToast(null)} />}
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} 
        input:focus,textarea:focus,select:focus{border-color:rgba(239,68,68,0.5)!important;} 
        select option{
          background: var(--admin-modal-bg);
          color: var(--admin-card-text);
        }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <Code2 size={20} color="#ef4444"/>
          <h2 style={{ color:'var(--admin-card-text)', fontSize:'20px', fontWeight:800, margin:0 }}>Coding Arena</h2>
          <span style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444', padding:'2px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:700 }}>{problems.length} problems</span>
        </div>
        <button onClick={openCreate} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 20px', background:'linear-gradient(135deg,#dc2626,#9f1239)', border:'none', borderRadius:'10px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:700, fontFamily:'inherit' }}>
          <Plus size={15}/> Add Problem
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
        {['EASY','MEDIUM','HARD'].map(d=>(
          <div key={d} style={{ padding:'16px', background:'var(--admin-input-bg)', border:`1px solid ${diffColors[d]}25`, borderRadius:'12px', textAlign:'center' }}>
            <p style={{ color:`${diffColors[d]}`, fontSize:'24px', fontWeight:900, margin:'0 0 2px' }}>{problems.filter(p=>p.difficulty===d).length}</p>
            <p style={{ color:'var(--admin-card-subtext)', fontSize:'11px', fontWeight:700, textTransform:'uppercase', margin:0 }}>{d}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
          <Search size={14} color="var(--admin-card-subtext)" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)' }} />
          <input style={{ ...s.input, paddingLeft:'36px' }} placeholder="Search by title or tags…" value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}/>
        </div>
        {['ALL','EASY','MEDIUM','HARD'].map(d=>(
          <button key={d} onClick={()=>{ setDiffFilter(d); setPage(1); }} style={{ padding:'8px 16px', borderRadius:'10px', border:`1px solid ${diffFilter===d?(diffColors[d]||'rgba(255,255,255,0.2)'):'var(--admin-input-border)'}`, background:diffFilter===d?`${diffColors[d]||'#6366f1'}18`:'var(--admin-input-bg)', color:diffFilter===d?(diffColors[d]||'#fff'):'var(--admin-card-subtext)', cursor:'pointer', fontSize:'12px', fontWeight:700, fontFamily:'inherit' }}>{d}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...s.card, overflow:'hidden' }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px', gap:'12px', alignItems:'center' }}>
            <Loader2 size={24} color="#ef4444" style={{ animation:'spin 1s linear infinite' }}/><span style={{ color:'var(--admin-card-subtext)' }}>Loading…</span>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--admin-sidebar-border)' }}>
                  {['#','Title','Difficulty','Tags','Company','Complexity','Actions'].map(h=>(
                    <th key={h} style={{ padding:'13px 16px', textAlign:'left', color:'var(--admin-card-subtext)', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(p=>(
                  <tr key={p.id} style={{ borderBottom:'1px solid var(--admin-sidebar-border)', transition:'background 0.15s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--admin-row-hover)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'12px 16px', color:'var(--admin-card-subtext)', fontSize:'12px', fontFamily:'monospace' }}>#{p.id}</td>
                    <td style={{ padding:'12px 16px', color:'var(--admin-card-text)', fontWeight:700, fontSize:'13px', maxWidth:'220px' }}>
                      <p style={{ margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</p>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ background:`${diffColors[p.difficulty]||'#6366f1'}18`, color:diffColors[p.difficulty]||'#6366f1', padding:'3px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:700 }}>{p.difficulty}</span>
                    </td>
                    <td style={{ padding:'12px 16px', maxWidth:'180px' }}>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                        {(p.topicTags||'').split(',').slice(0,2).map((t,i)=>(
                          <span key={i} style={{ background:'rgba(99,102,241,0.1)', color:'#818cf8', padding:'2px 8px', borderRadius:'4px', fontSize:'10px', fontWeight:600 }}>{t.trim()}</span>
                        ))}
                        {(p.topicTags||'').split(',').length>2&&<span style={{ color:'var(--admin-card-subtext)', fontSize:'10px' }}>+{(p.topicTags||'').split(',').length-2}</span>}
                      </div>
                    </td>
                    <td style={{ padding:'12px 16px', color:'var(--admin-card-subtext)', fontSize:'12px' }}>{p.companyId ? getCompanyName(p.companyId) : '—'}</td>
                    <td style={{ padding:'12px 16px' }}>
                      {p.timeComplexity && <p style={{ color:'var(--admin-card-subtext)', fontSize:'11px', fontFamily:'monospace', margin:'0 0 2px' }}>T: {p.timeComplexity}</p>}
                      {p.spaceComplexity && <p style={{ color:'var(--admin-card-subtext)', fontSize:'11px', fontFamily:'monospace', margin:0 }}>S: {p.spaceComplexity}</p>}
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', gap:'6px' }}>
                        <button onClick={()=>openEdit(p)} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 12px', background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'8px', color:'#818cf8', cursor:'pointer', fontSize:'12px', fontWeight:700, fontFamily:'inherit' }}>
                          <Edit3 size={12}/> Edit
                        </button>
                        <button onClick={()=>handleDelete(p.id, p.title)} style={{ padding:'6px 10px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'#ef4444', cursor:'pointer', fontFamily:'inherit' }}>
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length===0&&<tr><td colSpan={7} style={{ padding:'60px', textAlign:'center', color:'var(--admin-card-subtext)' }}>No problems found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ padding:'8px 16px', borderRadius:'8px', border:'1px solid var(--admin-card-border)', background:'var(--admin-input-bg)', color:'var(--admin-card-subtext)', cursor:'pointer', fontFamily:'inherit', fontSize:'13px' }}>← Prev</button>
          <span style={{ color:'var(--admin-card-subtext)', fontSize:'13px' }}>Page {page} of {totalPages} ({filtered.length} total)</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ padding:'8px 16px', borderRadius:'8px', border:'1px solid var(--admin-card-border)', background:'var(--admin-input-bg)', color:'var(--admin-card-subtext)', cursor:'pointer', fontFamily:'inherit', fontSize:'13px' }}>Next →</button>
        </div>
      )}

      {/* Modal */}
      {modal!==null && (
        <Modal title={modal==='create'?'Add New Problem':`Edit — ${modal.title}`} onClose={()=>setModal(null)}>
          <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div><label style={s.label}>Title</label><input style={s.input} placeholder="Problem title…" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required/></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div>
                <label style={s.label}>Difficulty</label>
                <select style={{ ...s.input, cursor:'pointer' }} value={form.difficulty} onChange={e=>setForm(p=>({...p,difficulty:e.target.value}))}>
                  {['EASY','MEDIUM','HARD'].map(d=><option key={d} value={d}>{d}</option>)}
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
            <div><label style={s.label}>Topic Tags (comma separated)</label><input style={s.input} placeholder="Arrays, HashMap, Two Pointers…" value={form.topicTags} onChange={e=>setForm(p=>({...p,topicTags:e.target.value}))}/></div>
            <div>
              <label style={s.label}>Description</label>
              <textarea style={s.textarea} placeholder="Problem statement…" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} required/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div><label style={s.label}>Time Complexity</label><input style={s.input} placeholder="O(n log n)…" value={form.timeComplexity} onChange={e=>setForm(p=>({...p,timeComplexity:e.target.value}))}/></div>
              <div><label style={s.label}>Space Complexity</label><input style={s.input} placeholder="O(n)…" value={form.spaceComplexity} onChange={e=>setForm(p=>({...p,spaceComplexity:e.target.value}))}/></div>
            </div>
            <div>
              <label style={s.label}>Test Cases (JSON)</label>
              <textarea style={s.monoArea} placeholder={'[{"input":"1 2","expected":"3"}]'} value={form.testCases} onChange={e=>setForm(p=>({...p,testCases:e.target.value}))}/>
            </div>
            <div>
              <label style={s.label}>Hints (JSON array)</label>
              <textarea style={s.monoArea} placeholder={'["Hint 1","Hint 2"]'} value={form.hints} onChange={e=>setForm(p=>({...p,hints:e.target.value}))}/>
            </div>
            <div>
              <label style={s.label}>Solution Explanation</label>
              <textarea style={s.textarea} placeholder="Explain the solution approach…" value={form.solutionExplanation} onChange={e=>setForm(p=>({...p,solutionExplanation:e.target.value}))}/>
            </div>
            <button type="submit" disabled={saving} style={{ padding:'13px', background:'linear-gradient(135deg,#dc2626,#9f1239)', border:'none', borderRadius:'12px', color:'#fff', fontWeight:700, fontSize:'14px', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginTop:'4px' }}>
              {saving?<><Loader2 size={16} style={{animation:'spin 1s linear infinite'}}/> Saving…</>:<><Plus size={16}/>{modal==='create'?'Add Problem':'Save Changes'}</>}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminCoding;
