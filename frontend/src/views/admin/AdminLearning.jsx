import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Trash2, Edit3, Search, X, Loader2, CheckCircle2, AlertCircle, FolderPlus } from 'lucide-react';

const s = {
  card: { background:'var(--admin-card-bg)', backdropFilter:'blur(20px)', border:'1px solid var(--admin-card-border)', borderRadius:'16px', boxShadow:'var(--admin-card-shadow)' },
  input: { width:'100%', padding:'11px 14px', background:'var(--admin-input-bg)', border:'1px solid var(--admin-input-border)', borderRadius:'10px', color:'var(--admin-input-text)', fontSize:'13px', fontFamily:'inherit', outline:'none', boxSizing:'border-box' },
  label: { color:'var(--admin-card-subtext)', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px', display:'block' },
  textarea: { width:'100%', padding:'11px 14px', background:'var(--admin-input-bg)', border:'1px solid var(--admin-input-border)', borderRadius:'10px', color:'var(--admin-input-text)', fontSize:'13px', fontFamily:'inherit', outline:'none', boxSizing:'border-box', resize:'vertical', minHeight:'80px' },
};

const diffColors = { BEGINNER:'#10b981', INTERMEDIATE:'#f59e0b', ADVANCED:'#ef4444' };

const Toast = ({ msg, type, onClose }) => (
  <div style={{ position:'fixed', bottom:'24px', right:'24px', zIndex:9999, display:'flex', alignItems:'center', gap:'10px', padding:'14px 20px', background:'var(--admin-modal-bg)', border:`1px solid ${type==='success'?'rgba(16,185,129,0.4)':'rgba(239,68,68,0.4)'}`, borderRadius:'12px', backdropFilter:'blur(20px)', boxShadow:'0 10px 30px -10px rgba(0,0,0,0.15)', animation:'fadeInUp 0.3s ease', maxWidth:'340px' }}>
    {type==='success'?<CheckCircle2 size={16} color="#10b981"/>:<AlertCircle size={16} color="#ef4444"/>}
    <span style={{color:'var(--admin-card-text)',fontSize:'13px',fontWeight:600}}>{msg}</span>
    <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',padding:0,display:'flex',alignItems:'center'}}><X size={14} color="var(--admin-card-subtext)"/></button>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'16px' }}>
    <div style={{ background:'var(--admin-modal-bg)', border:'1px solid var(--admin-card-border)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'560px', maxHeight:'92vh', overflowY:'auto', boxShadow:'0 20px 40px -15px rgba(0,0,0,0.1)', animation:'fadeInUp 0.3s ease' }}>
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

const EMPTY_COURSE = { domainId:'', title:'', description:'', difficulty:'BEGINNER', videoUrl:'', notesPath:'', assignment:'', project:'' };
const EMPTY_DOMAIN = { name:'', description:'' };

const AdminLearning = () => {
  const [courses, setCourses] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [domainModal, setDomainModal] = useState(false);
  const [form, setForm] = useState(EMPTY_COURSE);
  const [domainForm, setDomainForm] = useState(EMPTY_DOMAIN);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const load = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/admin/courses'),
      axios.get('/api/admin/domains'),
    ]).then(([cr, dr]) => {
      setCourses(cr.data);
      setDomains(dr.data);
    }).catch(()=>showToast('Failed to load','error')).finally(()=>setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY_COURSE); setModal('create'); };
  const openEdit = (c) => { setForm({ domainId:c.domain_id||c.domainId||'', title:c.title||'', description:c.description||'', difficulty:c.difficulty||'BEGINNER', videoUrl:c.video_url||c.videoUrl||'', notesPath:c.notes_path||c.notesPath||'', assignment:c.assignment||'', project:c.project||'' }); setModal(c); };

  const handleSaveCourse = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'create') { await axios.post('/api/admin/courses', form); showToast('Course added!'); }
      else { await axios.put(`/api/admin/courses/${modal.id}`, form); showToast('Course updated!'); }
      setModal(null); load();
    } catch { showToast('Failed to save','error'); } finally { setSaving(false); }
  };

  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try { await axios.delete(`/api/admin/courses/${id}`); setCourses(c=>c.filter(x=>x.id!==id)); showToast('Course deleted'); }
    catch { showToast('Failed to delete','error'); }
  };

  const handleSaveDomain = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await axios.post('/api/admin/domains', domainForm); showToast('Domain added!'); setDomainModal(false); setDomainForm(EMPTY_DOMAIN); load(); }
    catch { showToast('Failed to add domain','error'); } finally { setSaving(false); }
  };

  const filtered = courses.filter(c => {
    const matchSearch = (c.title||'').toLowerCase().includes(search.toLowerCase());
    const matchDomain = domainFilter === 'ALL' || String(c.domain_id||c.domainId) === String(domainFilter);
    return matchSearch && matchDomain;
  });

  const getDomainName = (id) => domains.find(d=>d.id===id||d.id===Number(id))?.name || 'Unknown';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      {toast && <Toast {...toast} onClose={()=>setToast(null)} />}
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} 
        input:focus,textarea:focus,select:focus{border-color:rgba(16,185,129,0.5)!important;} 
        select option{
          background: var(--admin-modal-bg);
          color: var(--admin-card-text);
        }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <BookOpen size={20} color="#10b981"/>
          <h2 style={{ color:'var(--admin-card-text)', fontSize:'20px', fontWeight:800, margin:0 }}>Learning Center</h2>
          <span style={{ background:'rgba(16,185,129,0.15)', color:'#10b981', padding:'2px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:700 }}>{courses.length} courses</span>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={()=>setDomainModal(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:'10px', color:'#10b981', cursor:'pointer', fontSize:'13px', fontWeight:700, fontFamily:'inherit' }}>
             <FolderPlus size={14}/> Add Domain
          </button>
          <button onClick={openCreate} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 20px', background:'linear-gradient(135deg,#10b981,#059669)', border:'none', borderRadius:'10px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:700, fontFamily:'inherit' }}>
            <Plus size={15}/> Add Course
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'4px', background:'var(--admin-input-bg)', border:'1px solid var(--admin-input-border)', borderRadius:'12px', padding:'4px', width:'fit-content' }}>
        {[['courses','📚 Courses'],['domains','🗂️ Domains']].map(([k,l])=>(
          <button key={k} onClick={()=>setActiveTab(k)} style={{ padding:'8px 20px', borderRadius:'9px', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:'13px', fontWeight:700, transition:'all 0.2s', background:activeTab===k?'rgba(16,185,129,0.2)':'transparent', color:activeTab===k?'#10b981':'var(--admin-card-subtext)' }}>{l}</button>
        ))}
      </div>

      {activeTab === 'courses' && (
        <>
          {/* Filters */}
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
            <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
              <Search size={14} color="var(--admin-card-subtext)" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)' }} />
              <input style={{ ...s.input, paddingLeft:'36px' }} placeholder="Search courses…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <select style={{ ...s.input, width:'auto', minWidth:'160px', cursor:'pointer' }} value={domainFilter} onChange={e=>setDomainFilter(e.target.value)}>
              <option value="ALL">All Domains</option>
              {domains.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          {/* Course Table */}
          <div style={{ ...s.card, overflow:'hidden' }}>
            {loading ? (
              <div style={{ display:'flex', justifyContent:'center', padding:'60px', gap:'12px', alignItems:'center' }}>
                <Loader2 size={24} color="#10b981" style={{ animation:'spin 1s linear infinite' }}/><span style={{ color:'var(--admin-card-subtext)' }}>Loading…</span>
              </div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid var(--admin-sidebar-border)' }}>
                      {['ID','Title','Domain','Difficulty','Video','Actions'].map(h=>(
                        <th key={h} style={{ padding:'14px 18px', textAlign:'left', color:'var(--admin-card-subtext)', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c=>(
                      <tr key={c.id} style={{ borderBottom:'1px solid var(--admin-sidebar-border)', transition:'background 0.15s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='var(--admin-row-hover)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <td style={{ padding:'12px 18px', color:'var(--admin-card-subtext)', fontSize:'12px', fontFamily:'monospace' }}>#{c.id}</td>
                        <td style={{ padding:'12px 18px', color:'var(--admin-card-text)', fontWeight:700, fontSize:'14px', maxWidth:'200px' }}>
                          <p style={{ margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.title}</p>
                          {c.description && <p style={{ margin:'2px 0 0', color:'var(--admin-card-subtext)', opacity: 0.8, fontSize:'11px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.description}</p>}
                        </td>
                        <td style={{ padding:'12px 18px' }}>
                          <span style={{ background:'rgba(99,102,241,0.12)', color:'#818cf8', padding:'3px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:700 }}>
                            {c.domain_name || getDomainName(c.domain_id || c.domainId)}
                          </span>
                        </td>
                        <td style={{ padding:'12px 18px' }}>
                          <span style={{ background:`${diffColors[c.difficulty]||'#6366f1'}18`, color:diffColors[c.difficulty]||'#6366f1', padding:'3px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:700 }}>
                            {c.difficulty || 'BEGINNER'}
                          </span>
                        </td>
                        <td style={{ padding:'12px 18px', color:(c.video_url||c.videoUrl)?'#10b981':'var(--admin-card-subtext)', fontSize:'12px' }}>
                          {(c.video_url||c.videoUrl) ? '✓ Yes' : '—'}
                        </td>
                        <td style={{ padding:'12px 18px' }}>
                          <div style={{ display:'flex', gap:'8px' }}>
                            <button onClick={()=>openEdit(c)} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 12px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'8px', color:'#10b981', cursor:'pointer', fontSize:'12px', fontWeight:700, fontFamily:'inherit' }}>
                              <Edit3 size={12}/> Edit
                            </button>
                            <button onClick={()=>handleDeleteCourse(c.id, c.title)} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'6px 12px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'#ef4444', cursor:'pointer', fontSize:'12px', fontWeight:700, fontFamily:'inherit' }}>
                              <Trash2 size={12}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length===0&&<tr><td colSpan={6} style={{ padding:'60px', textAlign:'center', color:'var(--admin-card-subtext)' }}>No courses found</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'domains' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'16px' }}>
          {domains.map(d=>(
            <div key={d.id} style={{ ...s.card, padding:'20px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <BookOpen size={18} color="#10b981"/>
                </div>
                <div>
                  <p style={{ color:'var(--admin-card-text)', fontWeight:800, fontSize:'14px', margin:0 }}>{d.name}</p>
                  <p style={{ color:'var(--admin-card-subtext)', fontSize:'11px', margin:'2px 0 0' }}>
                    {courses.filter(c=>(c.domain_id||c.domainId)===d.id).length} courses
                  </p>
                </div>
              </div>
              {d.description&&<p style={{ color:'var(--admin-card-subtext)', fontSize:'12px', margin:0, lineHeight:1.5 }}>{d.description}</p>}
            </div>
          ))}
          <button onClick={()=>setDomainModal(true)} style={{ border:'2px dashed var(--admin-card-border)', borderRadius:'16px', padding:'20px', background:'transparent', color:'#10b981', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', fontSize:'14px', fontWeight:700, fontFamily:'inherit', minHeight:'100px' }}>
            <Plus size={18}/> Add New Domain
          </button>
        </div>
      )}

      {/* Course Modal */}
      {modal !== null && (
        <Modal title={modal==='create'?'Add New Course':`Edit — ${modal.title}`} onClose={()=>setModal(null)}>
          <form onSubmit={handleSaveCourse} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div>
              <label style={s.label}>Domain</label>
              <select style={{ ...s.input, cursor:'pointer' }} value={form.domainId} onChange={e=>setForm(p=>({...p,domainId:e.target.value}))} required>
                <option value="">Select domain…</option>
                {domains.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div><label style={s.label}>Title</label><input style={s.input} placeholder="Course title…" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required/></div>
            <div>
              <label style={s.label}>Description</label>
              <textarea style={s.textarea} placeholder="Course description…" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/>
            </div>
            <div>
              <label style={s.label}>Difficulty</label>
              <select style={{ ...s.input, cursor:'pointer' }} value={form.difficulty} onChange={e=>setForm(p=>({...p,difficulty:e.target.value}))}>
                {['BEGINNER','INTERMEDIATE','ADVANCED'].map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div><label style={s.label}>Video URL</label><input style={s.input} placeholder="https://youtube.com/…" value={form.videoUrl} onChange={e=>setForm(p=>({...p,videoUrl:e.target.value}))}/></div>
            <div><label style={s.label}>Notes Path / URL</label><input style={s.input} placeholder="Notes link…" value={form.notesPath} onChange={e=>setForm(p=>({...p,notesPath:e.target.value}))}/></div>
            <div><label style={s.label}>Assignment</label><input style={s.input} placeholder="Assignment description…" value={form.assignment} onChange={e=>setForm(p=>({...p,assignment:e.target.value}))}/></div>
            <div><label style={s.label}>Project</label><input style={s.input} placeholder="Project description…" value={form.project} onChange={e=>setForm(p=>({...p,project:e.target.value}))}/></div>
            <button type="submit" disabled={saving} style={{ padding:'13px', background:'linear-gradient(135deg,#10b981,#059669)', border:'none', borderRadius:'12px', color:'#fff', fontWeight:700, fontSize:'14px', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginTop:'4px' }}>
              {saving?<><Loader2 size={16} style={{animation:'spin 1s linear infinite'}}/> Saving…</>:<><Plus size={16}/>{modal==='create'?'Add Course':'Save Changes'}</>}
            </button>
          </form>
        </Modal>
      )}

      {/* Domain Modal */}
      {domainModal && (
        <Modal title="Add New Domain" onClose={()=>setDomainModal(false)}>
          <form onSubmit={handleSaveDomain} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div><label style={s.label}>Domain Name</label><input style={s.input} placeholder="e.g. Full Stack Development" value={domainForm.name} onChange={e=>setDomainForm(p=>({...p,name:e.target.value}))} required/></div>
            <div><label style={s.label}>Description</label><textarea style={s.textarea} placeholder="Brief description…" value={domainForm.description} onChange={e=>setDomainForm(p=>({...p,description:e.target.value}))}/></div>
            <button type="submit" disabled={saving} style={{ padding:'13px', background:'linear-gradient(135deg,#10b981,#059669)', border:'none', borderRadius:'12px', color:'#fff', fontWeight:700, fontSize:'14px', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
              {saving?<><Loader2 size={16} style={{animation:'spin 1s linear infinite'}}/> Adding…</>:<><FolderPlus size={16}/> Add Domain</>}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminLearning;
