import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
    FileText, 
    Plus, 
    Trash2, 
    Save, 
    Loader2, 
    CheckCircle, 
    AlertTriangle, 
    Download, 
    Eye, 
    Edit3, 
    Mail, 
    Phone, 
    MapPin, 
    Award, 
    BookOpen, 
    Briefcase,
    Layout,
    Globe,
    Sparkles,
    ChevronRight
} from 'lucide-react';

const LinkedInIcon = ({ size = 10, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

const GitHubIcon = ({ size = 10, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

const TEMPLATES = [
    { id: 'classic', name: 'Classic Professional', desc: 'Traditional serif design suitable for corporate applications' },
    { id: 'modern', name: 'Modern Minimalist', desc: 'Clean, asymmetrical two-column layout with sidebar' },
    { id: 'executive', name: 'Executive Crimson', desc: 'Top-accented layout with rich styling for leadership roles' },
    { id: 'tech', name: 'Tech Indigo', desc: 'Modern layout with tech stack badges and prominent projects' }
];

const ResumeBuilder = () => {
    const location = useLocation();
    const [resumes, setResumes] = useState([]);
    const [editing, setEditing] = useState(false);
    const [viewingResume, setViewingResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeFormTab, setActiveFormTab] = useState('personal'); // personal | work | projects | skills
    
    // Resume Form State
    const [form, setForm] = useState({
        id: null,
        name: '',
        phone: '',
        email: '',
        linkedinUrl: '',
        githubUrl: '',
        summary: '',
        education: '',
        experience: '',
        projects: '',
        skills: '',
        certifications: '',
        achievements: '',
        templateId: 'classic'
    });

    const previewRef = useRef(null);

    const analyzeResumeATS = (formData) => {
        const textToScan = `${formData.name} ${formData.summary} ${formData.experience} ${formData.projects} ${formData.skills} ${formData.certifications} ${formData.achievements}`.toLowerCase();
        
        const keywords = {
            languages: ['java', 'python', 'javascript', 'c++', 'typescript', 'sql', 'go', 'rust', 'ruby', 'kotlin', 'swift'],
            frameworks: ['spring boot', 'react', 'node', 'django', 'flask', 'next.js', 'hibernate', 'express', 'angular', 'vue'],
            databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sqlite', 'cassandra'],
            cloudDevops: ['aws', 'docker', 'kubernetes', 'git', 'ci/cd', 'linux', 'maven', 'gradle', 'azure', 'gcp'],
            concepts: ['rest api', 'microservices', 'data structures', 'algorithms', 'oops', 'system design', 'agile', 'unit testing', 'mvc']
        };

        let score = 35; // baseline
        let foundKeywords = [];
        let missingKeywords = [];

        // Analyze keywords
        Object.keys(keywords).forEach(cat => {
            keywords[cat].forEach(kw => {
                if (textToScan.includes(kw)) {
                    if (!foundKeywords.includes(kw)) {
                        foundKeywords.push(kw);
                        score += 2.5;
                    }
                } else {
                    missingKeywords.push(kw);
                }
            });
        });

        // Check section completeness
        if (formData.skills && formData.skills.trim().length > 10) score += 10;
        if (formData.experience && formData.experience.trim().length > 30) score += 15;
        if (formData.projects && formData.projects.trim().length > 30) score += 15;
        if (formData.summary && formData.summary.trim().length > 20) score += 5;
        if (formData.education && formData.education.trim().length > 15) score += 5;

        // Contact details check
        if (formData.email && formData.phone) score += 5;
        if (formData.linkedinUrl) score += 3;
        if (formData.githubUrl) score += 3;

        score = Math.min(100, Math.round(score));
        
        return {
            score,
            foundKeywords,
            missingKeywords: missingKeywords.slice(0, 15), // suggest top 15 missing keywords
        };
    };

    const fetchResumes = () => {
        setLoading(true);
        axios.get('/api/resumes')
            .then(res => setResumes(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { 
        fetchResumes(); 
    }, []);

    useEffect(() => {
        if (location.state?.prefill) {
            setForm(prev => ({
                ...prev,
                ...location.state.prefill
            }));
            setEditing(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleEdit = (resume) => {
        setForm({
            id: resume.id,
            name: resume.name || '',
            phone: resume.phone || '',
            email: resume.email || '',
            linkedinUrl: resume.linkedinUrl || '',
            githubUrl: resume.githubUrl || '',
            summary: resume.summary || '',
            education: resume.education || '',
            experience: resume.experience || '',
            projects: resume.projects || '',
            skills: resume.skills || '',
            certifications: resume.certifications || '',
            achievements: resume.achievements || '',
            templateId: resume.templateId || 'classic'
        });
        setEditing(true);
        setViewingResume(null);
    };

    const handleSave = async (e) => {
        if(e) e.preventDefault();
        setSaving(true);
        try {
            const atsAnalysis = analyzeResumeATS(form);
            const dataToSave = {
                ...form,
                atsScore: atsAnalysis.score,
                suggestions: atsAnalysis.missingKeywords.length > 0 
                    ? `Integrate standard placement keywords to optimize ATS alignment: ${atsAnalysis.missingKeywords.slice(0, 8).join(', ')}`
                    : "Excellent! Your resume is highly optimized for applicant tracking systems."
            };
            await axios.post('/api/resumes', dataToSave);
            setEditing(false);
            setForm({
                id: null,
                name: '',
                phone: '',
                email: '',
                linkedinUrl: '',
                githubUrl: '',
                summary: '',
                education: '',
                experience: '',
                projects: '',
                skills: '',
                certifications: '',
                achievements: '',
                templateId: 'classic'
            });
            fetchResumes();
        } catch (err) { 
            console.error(err); 
        } finally { 
            setSaving(false); 
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this resume permanently?')) return;
        await axios.delete(`/api/resumes/${id}`);
        fetchResumes();
    };

    // Client-side A4 PDF Generation using html2canvas & jsPDF
    const exportPDF = async (resumeName) => {
        const element = previewRef.current;
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2, // Increase resolution
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgWidth = 210; // A4 size
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${resumeName.replace(/\s+/g, '_')}_Resume.pdf`);
        } catch (error) {
            console.error("Error generating PDF", error);
        }
    };

    const scoreColor = s => s >= 75 ? 'text-emerald-500' : s >= 55 ? 'text-amber-500' : 'text-rose-500';
    const scoreBarColor = s => s >= 75 ? 'bg-emerald-500' : s >= 55 ? 'bg-amber-500' : 'bg-rose-500';
    const scoreLabel = s => s >= 75 ? 'ATS Optimized' : s >= 55 ? 'Needs Improvement' : 'Weak Profile';

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 size={32} className="animate-spin text-primary-500" />
            </div>
        );
    }

    // Interactive Preview Component based on chosen Template
    const ResumePreview = ({ data }) => {
        const {
            name, phone, email, linkedinUrl, githubUrl, summary, 
            education, experience, projects, skills, certifications, achievements, templateId 
        } = data;

        const renderedSkills = skills ? skills.split(',').map(s => s.trim()) : [];
        const renderedCerts = certifications ? certifications.split(',').map(c => c.trim()) : [];
        const renderedAchievements = achievements ? achievements.split(',').map(a => a.trim()) : [];

        if (templateId === 'modern') {
            // Asymmetrical Modern Minimalist Layout
            return (
                <div ref={previewRef} className="w-full bg-white text-slate-800 p-8 shadow-inner font-sans text-xs flex gap-6 min-h-[297mm]">
                    {/* Left Column (Sidebar) */}
                    <div className="w-1/3 border-r border-slate-100 pr-4 flex flex-col gap-5">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-none">{name || 'Your Name'}</h2>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase">Tech Candidate</p>
                        </div>
                        <div className="space-y-2 text-[10px] text-slate-500 font-medium">
                            {email && <div className="flex items-center gap-1.5"><Mail size={10} /> <span>{email}</span></div>}
                            {phone && <div className="flex items-center gap-1.5"><Phone size={10} /> <span>{phone}</span></div>}
                            {linkedinUrl && <div className="flex items-center gap-1.5"><LinkedInIcon size={10} /> <span>LinkedIn</span></div>}
                            {githubUrl && <div className="flex items-center gap-1.5"><GitHubIcon size={10} /> <span>GitHub</span></div>}
                        </div>

                        <div>
                            <h4 className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider mb-2 pb-1 border-b-2 border-slate-900">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                                {renderedSkills.map((s, i) => (
                                    <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[9px] font-bold">{s}</span>
                                ))}
                            </div>
                        </div>

                        {certifications && (
                            <div>
                                <h4 className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider mb-2 pb-1 border-b-2 border-slate-900">Certifications</h4>
                                <ul className="space-y-1 text-[10px] font-medium text-slate-650">
                                    {renderedCerts.map((c, i) => <li key={i}>• {c}</li>)}
                                </ul>
                            </div>
                        )}

                        {achievements && (
                            <div>
                                <h4 className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider mb-2 pb-1 border-b-2 border-slate-900">Achievements</h4>
                                <ul className="space-y-1 text-[10px] font-medium text-slate-650">
                                    {renderedAchievements.map((a, i) => <li key={i}>• {a}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Main) */}
                    <div className="flex-1 flex flex-col gap-5">
                        {summary && (
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Summary</h4>
                                <p className="text-slate-600 leading-relaxed font-semibold">{summary}</p>
                            </div>
                        )}

                        {experience && (
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider pb-1 border-b border-slate-200">Experience</h4>
                                <p className="text-slate-650 leading-relaxed whitespace-pre-wrap font-medium">{experience}</p>
                            </div>
                        )}

                        {projects && (
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider pb-1 border-b border-slate-200">Projects</h4>
                                <p className="text-slate-650 leading-relaxed whitespace-pre-wrap font-medium">{projects}</p>
                            </div>
                        )}

                        {education && (
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider pb-1 border-b border-slate-200">Education</h4>
                                <p className="text-slate-650 leading-relaxed whitespace-pre-wrap font-medium">{education}</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (templateId === 'executive') {
            // Elegant Rich Corporate Crimson/Navy Accent
            return (
                <div ref={previewRef} className="w-full bg-white text-slate-800 p-10 shadow-inner font-serif text-xs min-h-[297mm] space-y-6">
                    <div className="border-t-4 border-rose-700 pt-4 flex flex-col items-center text-center gap-2">
                        <h2 className="text-2xl font-black text-rose-800 tracking-wide uppercase leading-none">{name || 'Your Name'}</h2>
                        <div className="flex flex-wrap justify-center gap-3 text-[10px] text-slate-500 font-bold">
                            {email && <span className="flex items-center gap-1"><Mail size={10} className="text-rose-700" /> {email}</span>}
                            {phone && <span className="flex items-center gap-1"><Phone size={10} className="text-rose-700" /> {phone}</span>}
                            {linkedinUrl && <span className="flex items-center gap-1"><LinkedInIcon size={10} className="text-rose-700" /> LinkedIn</span>}
                            {githubUrl && <span className="flex items-center gap-1"><GitHubIcon size={10} className="text-rose-700" /> GitHub</span>}
                        </div>
                    </div>

                    {summary && (
                        <div className="space-y-1.5">
                            <h3 className="text-xs font-bold text-rose-800 border-b border-rose-200 uppercase tracking-widest pb-1">Professional Profile</h3>
                            <p className="leading-relaxed text-slate-650 italic font-semibold">{summary}</p>
                        </div>
                    )}

                    {experience && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-rose-800 border-b border-rose-200 uppercase tracking-widest pb-1">Experience</h3>
                            <p className="leading-relaxed whitespace-pre-wrap text-slate-650 font-medium">{experience}</p>
                        </div>
                    )}

                    {projects && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-rose-800 border-b border-rose-200 uppercase tracking-widest pb-1">Key Projects</h3>
                            <p className="leading-relaxed whitespace-pre-wrap text-slate-650 font-medium">{projects}</p>
                        </div>
                    )}

                    {skills && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-rose-800 border-b border-rose-200 uppercase tracking-widest pb-1">Core Competencies</h3>
                            <p className="leading-relaxed text-slate-650 font-bold">{skills}</p>
                        </div>
                    )}

                    {education && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-rose-800 border-b border-rose-200 uppercase tracking-widest pb-1">Education</h3>
                            <p className="leading-relaxed whitespace-pre-wrap text-slate-650 font-medium">{education}</p>
                        </div>
                    )}
                </div>
            );
        }

        if (templateId === 'tech') {
            // Indigo tech stack styled template
            return (
                <div ref={previewRef} className="w-full bg-white text-slate-800 p-8 shadow-inner font-mono text-[11px] min-h-[297mm] space-y-6">
                    <div className="bg-indigo-900 text-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white">{name || 'Your Name'}</h2>
                            <p className="text-[10px] text-indigo-300 font-bold tracking-widest mt-1 uppercase">Software Development Engineer</p>
                        </div>
                        <div className="space-y-1 text-[10px] text-indigo-200 font-medium">
                            {email && <div className="flex items-center gap-1"><Mail size={10} /> {email}</div>}
                            {phone && <div className="flex items-center gap-1"><Phone size={10} /> {phone}</div>}
                            {linkedinUrl && <div className="flex items-center gap-1"><LinkedInIcon size={10} /> link.in/profile</div>}
                            {githubUrl && <div className="flex items-center gap-1"><GitHubIcon size={10} /> github.com/dev</div>}
                        </div>
                    </div>

                    {summary && (
                        <div className="space-y-1.5">
                            <h3 className="text-xs font-bold text-indigo-900 border-l-4 border-indigo-900 pl-2 uppercase">About Me</h3>
                            <p className="leading-relaxed text-slate-600 font-semibold">{summary}</p>
                        </div>
                    )}

                    {skills && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-indigo-900 border-l-4 border-indigo-900 pl-2 uppercase">Tech Stack</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {renderedSkills.map((s, i) => (
                                    <span key={i} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded text-[10px] font-bold border border-indigo-100">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {experience && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-indigo-900 border-l-4 border-indigo-900 pl-2 uppercase">Work History</h3>
                            <p className="leading-relaxed whitespace-pre-wrap text-slate-600 font-medium">{experience}</p>
                        </div>
                    )}

                    {projects && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-indigo-900 border-l-4 border-indigo-900 pl-2 uppercase">Projects</h3>
                            <p className="leading-relaxed whitespace-pre-wrap text-slate-600 font-medium">{projects}</p>
                        </div>
                    )}

                    {education && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-indigo-900 border-l-4 border-indigo-900 pl-2 uppercase">Education</h3>
                            <p className="leading-relaxed whitespace-pre-wrap text-slate-600 font-medium">{education}</p>
                        </div>
                    )}
                </div>
            );
        }

        // Default Classic Professional
        return (
            <div ref={previewRef} className="w-full bg-white text-slate-800 p-10 shadow-inner font-serif text-xs min-h-[297mm] space-y-5">
                <div className="text-center space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">{name || 'Your Name'}</h2>
                    <div className="flex justify-center flex-wrap gap-2.5 text-[10px] text-slate-500 font-medium">
                        {phone && <span>{phone}</span>}
                        {email && <span>• {email}</span>}
                        {linkedinUrl && <span>• {linkedinUrl}</span>}
                        {githubUrl && <span>• {githubUrl}</span>}
                    </div>
                </div>

                {summary && (
                    <div className="space-y-1">
                        <h3 className="text-[11px] font-bold border-b border-slate-300 uppercase tracking-widest pb-0.5">Professional Summary</h3>
                        <p className="leading-relaxed text-slate-650 font-semibold">{summary}</p>
                    </div>
                )}

                {education && (
                    <div className="space-y-1.5">
                        <h3 className="text-[11px] font-bold border-b border-slate-300 uppercase tracking-widest pb-0.5">Education</h3>
                        <p className="leading-relaxed whitespace-pre-wrap text-slate-650 font-medium">{education}</p>
                    </div>
                )}

                {experience && (
                    <div className="space-y-1.5">
                        <h3 className="text-[11px] font-bold border-b border-slate-300 uppercase tracking-widest pb-0.5">Experience</h3>
                        <p className="leading-relaxed whitespace-pre-wrap text-slate-650 font-medium">{experience}</p>
                    </div>
                )}

                {projects && (
                    <div className="space-y-1.5">
                        <h3 className="text-[11px] font-bold border-b border-slate-300 uppercase tracking-widest pb-0.5">Academic Projects</h3>
                        <p className="leading-relaxed whitespace-pre-wrap text-slate-650 font-medium">{projects}</p>
                    </div>
                )}

                {skills && (
                    <div className="space-y-1">
                        <h3 className="text-[11px] font-bold border-b border-slate-300 uppercase tracking-widest pb-0.5">Skills</h3>
                        <p className="leading-relaxed text-slate-650 font-bold">{skills}</p>
                    </div>
                )}

                {certifications && (
                    <div className="space-y-1.5">
                        <h3 className="text-[11px] font-bold border-b border-slate-300 uppercase tracking-widest pb-0.5">Certifications</h3>
                        <p className="leading-relaxed text-slate-650 font-semibold">{certifications}</p>
                    </div>
                )}

                {achievements && (
                    <div className="space-y-1.5">
                        <h3 className="text-[11px] font-bold border-b border-slate-300 uppercase tracking-widest pb-0.5">Honors & Achievements</h3>
                        <p className="leading-relaxed text-slate-650 font-semibold">{achievements}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Resume Builder</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1.5">
                        Construct multiple premium resumes, customize templates, and optimize against real ATS filters.
                    </p>
                </div>
                {!editing && !viewingResume && (
                    <button 
                        onClick={() => {
                            setForm({
                                id: null,
                                name: '',
                                phone: '',
                                email: '',
                                linkedinUrl: '',
                                githubUrl: '',
                                summary: '',
                                education: '',
                                experience: '',
                                projects: '',
                                skills: '',
                                certifications: '',
                                achievements: '',
                                templateId: 'classic'
                            });
                            setEditing(true);
                        }}
                        className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 hover:translate-y-[-1px] transition-all"
                    >
                        <Plus size={16} /> Create Resume
                    </button>
                )}
            </div>

            {/* A4 Fullscreen Viewer Mode */}
            {viewingResume && (
                <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center justify-between gap-4 glass-card px-6 py-4">
                        <div>
                            <h2 className="font-extrabold text-base">{viewingResume.name} Preview</h2>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                ATS Rating: {viewingResume.atsScore}%
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => exportPDF(viewingResume.name)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
                            >
                                <Download size={14} /> Download PDF
                            </button>
                            <button 
                                onClick={() => handleEdit(viewingResume)}
                                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
                            >
                                <Edit3 size={14} /> Edit Fields
                            </button>
                            <button 
                                onClick={() => setViewingResume(null)}
                                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-550 hover:bg-slate-50 dark:hover:bg-slate-900"
                            >
                                Exit Preview
                            </button>
                        </div>
                    </div>

                    {/* Template Switcher in Viewer */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0">
                            <Layout size={14} /> Template Layout:
                        </span>
                        {TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setViewingResume(prev => ({ ...prev, templateId: t.id }))}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                                    viewingResume.templateId === t.id
                                        ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900'
                                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600'
                                }`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>

                    {/* Render Selected Template */}
                    <div className="border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden bg-white max-w-[210mm] mx-auto">
                        <ResumePreview data={viewingResume} />
                    </div>
                </div>
            )}

            {/* Split Screen Creator / Editor */}
            {editing && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
                    
                    {/* Left Pane - Form Fields */}
                    <div className="glass-card p-6 flex flex-col justify-between overflow-y-auto max-h-[85vh] scrollbar-thin space-y-6">
                        <div className="space-y-5">
                            <h2 className="font-extrabold text-base flex items-center gap-2">
                                <FileText className="text-primary-500" size={20} />
                                {form.id ? 'Edit Placement Profile' : 'Build Profile'}
                            </h2>

                            {/* Real-time ATS Dashboard Widget */}
                            {(() => {
                                const ats = analyzeResumeATS(form);
                                return (
                                    <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-inner">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-xs font-black text-slate-100 flex items-center gap-1">
                                                    <Sparkles size={14} className="text-amber-400 animate-pulse" /> Real-time ATS Assessment
                                                </h3>
                                                <p className="text-[10px] text-slate-450 mt-0.5">Calculated based on structure & keywords</p>
                                            </div>
                                            <div className="relative flex items-center justify-center shrink-0">
                                                <svg className="w-14 h-14 transform -rotate-90">
                                                    <circle cx="28" cy="28" r="23" stroke="#1e293b" strokeWidth="3" fill="transparent" />
                                                    <circle cx="28" cy="28" r="23" stroke="url(#atsGaugeGrad)" strokeWidth="3" fill="transparent"
                                                        strokeDasharray={2 * Math.PI * 23}
                                                        strokeDashoffset={2 * Math.PI * 23 * (1 - ats.score / 100)}
                                                        className="transition-all duration-700 ease-out" />
                                                    <defs>
                                                        <linearGradient id="atsGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#38bdf8" />
                                                            <stop offset="100%" stopColor="#4f46e5" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                <span className="absolute text-xs font-black text-sky-400">{ats.score}%</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 border-t border-slate-900 pt-3">
                                            <div className="flex justify-between items-center text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
                                                <span>Keyword Alignment</span>
                                                <span className="text-sky-400">{ats.foundKeywords.length} Matched</span>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto scrollbar-thin pr-1">
                                                {ats.foundKeywords.map(kw => (
                                                    <span key={kw} className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                                                        <CheckCircle size={8} /> {kw}
                                                    </span>
                                                ))}
                                                {ats.missingKeywords.map(kw => (
                                                    <button
                                                        key={kw}
                                                        type="button"
                                                        onClick={() => {
                                                            const currentSkills = form.skills.trim();
                                                            const separator = currentSkills ? ', ' : '';
                                                            setForm(p => ({ 
                                                                ...p, 
                                                                skills: `${currentSkills}${separator}${kw.charAt(0).toUpperCase() + kw.slice(1)}` 
                                                            }));
                                                        }}
                                                        className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-450 hover:text-slate-200 text-[9px] font-bold px-2 py-0.5 rounded-lg transition-colors"
                                                        title="Click to instantly inject into your skills stack"
                                                    >
                                                        + {kw}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-[8px] text-slate-500 italic">💡 Click missing keywords to instantly inject them into your technical stack.</p>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Form Tabs */}
                            <div className="flex border-b border-slate-100 dark:border-slate-800">
                                {[
                                    { id: 'personal', label: 'Contact Details' },
                                    { id: 'work', label: 'Experience' },
                                    { id: 'projects', label: 'Projects' },
                                    { id: 'skills', label: 'Skills & Achievements' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveFormTab(tab.id)}
                                        className={`px-3 py-2 text-[10px] font-extrabold uppercase border-b-2 transition-all ${
                                            activeFormTab === tab.id 
                                                ? 'border-primary-500 text-primary-500' 
                                                : 'border-transparent text-slate-400 hover:text-slate-700'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Form content */}
                            <div className="space-y-4 pt-2">
                                {activeFormTab === 'personal' && (
                                    <div className="space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Full Name *</label>
                                                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                                    placeholder="Shridhar Sharma"
                                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary-500" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Mobile Phone</label>
                                                <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                                    placeholder="+91 98765 43210"
                                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary-500" />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Email Address *</label>
                                                <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                                    placeholder="shridhar@gmail.com"
                                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary-500" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">LinkedIn Profile URL</label>
                                                <input value={form.linkedinUrl} onChange={e => setForm(p => ({ ...p, linkedinUrl: e.target.value }))}
                                                    placeholder="linkedin.com/in/username"
                                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary-500" />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">GitHub Profile URL</label>
                                                <input value={form.githubUrl} onChange={e => setForm(p => ({ ...p, githubUrl: e.target.value }))}
                                                    placeholder="github.com/username"
                                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary-500" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Template Style</label>
                                                <select value={form.templateId} onChange={e => setForm(p => ({ ...p, templateId: e.target.value }))}
                                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary-500 font-semibold">
                                                    {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Professional Summary</label>
                                            <textarea rows={3} value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))}
                                                placeholder="A self-driven tech graduate with experience building secure Spring Boot services..."
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary-500 resize-none" />
                                        </div>
                                    </div>
                                )}

                                {activeFormTab === 'work' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Professional / Internship Experience</label>
                                            <textarea rows={6} value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}
                                                placeholder="Software Engineer Intern | ABC Technologies | June 2025 - Present&#10;• Designed high performance Java Microservices&#10;• Reduced latency by 20% using Redis caches"
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-primary-500 font-mono" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Education Details</label>
                                            <textarea rows={4} value={form.education} onChange={e => setForm(p => ({ ...p, education: e.target.value }))}
                                                placeholder="B.Tech CSE | ABC Institute of Tech | 2022 - 2026 | CGPA: 9.1&#10;High School | Central Academy School | 2020 - 2022 | Score: 94%"
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-primary-500 font-mono" />
                                        </div>
                                    </div>
                                )}

                                {activeFormTab === 'projects' && (
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Key Technical Projects</label>
                                        <textarea rows={10} value={form.projects} onChange={e => setForm(p => ({ ...p, projects: e.target.value }))}
                                            placeholder="CareerForge Prep Platform | Java, Spring Boot, React, MySQL&#10;• Developed full-stack placement portal supporting compiler integrations&#10;• Implemented JWT authorization filters securing REST endpoints"
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-primary-500 font-mono" />
                                    </div>
                                )}

                                {activeFormTab === 'skills' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Technical Skills (Comma separated) *</label>
                                            <input value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))}
                                                placeholder="Java, Python, Spring Boot, React, Docker, Kubernetes, MySQL"
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary-500" />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Certifications (Comma separated)</label>
                                            <input value={form.certifications} onChange={e => setForm(p => ({ ...p, certifications: e.target.value }))}
                                                placeholder="AWS Cloud Practitioner, Oracle Java Associate"
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary-500" />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Achievements (Comma separated)</label>
                                            <input value={form.achievements} onChange={e => setForm(p => ({ ...p, achievements: e.target.value }))}
                                                placeholder="LeetCode Top 5% Global Rank, ACM ICPC Regional Qualifier"
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary-500" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button 
                                onClick={handleSave} 
                                disabled={saving}
                                className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                Save Profile & Score ATS
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setEditing(false)}
                                className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    {/* Right Pane - Live A4 Template Preview */}
                    <div className="flex flex-col gap-4 max-h-[85vh]">
                        <div className="flex justify-between items-center glass-card p-4">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                <Eye size={14} /> Real-time A4 Layout Preview
                            </span>
                            <div className="flex gap-2">
                                {TEMPLATES.map(t => (
                                    <button 
                                        key={t.id}
                                        onClick={() => setForm(prev => ({ ...prev, templateId: t.id }))}
                                        className={`text-[9px] font-bold px-2.5 py-1 rounded-md border ${
                                            form.templateId === t.id 
                                                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' 
                                                : 'bg-white text-slate-600 border-slate-200'
                                        }`}
                                    >
                                        {t.name.split(' ')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-850 rounded-2xl bg-slate-100 p-4 scrollbar-thin">
                            <div className="max-w-[210mm] mx-auto overflow-hidden bg-white shadow-lg">
                                <ResumePreview data={form} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* List of existing resumes */}
            {!editing && !viewingResume && (
                <>
                    {resumes.length === 0 ? (
                        <div className="glass-card p-16 text-center space-y-4">
                            <FileText size={48} className="text-slate-300 dark:text-slate-700 mx-auto" />
                            <h3 className="font-extrabold text-base text-slate-700 dark:text-slate-350">No placement profiles built yet</h3>
                            <p className="text-xs text-slate-450 max-w-xs mx-auto">
                                Build an ATS-aligned profile to evaluate score ratings, receive actionable feedback, and export dynamic PDF templates.
                            </p>
                            <button 
                                onClick={() => setEditing(true)}
                                className="text-primary-500 font-bold text-xs hover:underline flex items-center gap-1 mx-auto mt-2"
                            >
                                <Plus size={14} /> Create Your Profile Now
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {resumes.map(resume => (
                                <div key={resume.id} className="glass-card p-6 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
                                    <div className="space-y-4">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-extrabold text-lg flex items-center gap-2 text-slate-850 dark:text-slate-150">
                                                    {resume.name}
                                                </h3>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                    Style: {TEMPLATES.find(t => t.id === resume.templateId)?.name || 'Classic'}
                                                </span>
                                            </div>
                                            <div className="flex gap-1.5">
                                                <button 
                                                    onClick={() => setViewingResume(resume)}
                                                    className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-primary-500 transition-colors"
                                                    title="Preview PDF Layout"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleEdit(resume)}
                                                    className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-primary-500 transition-colors"
                                                    title="Edit Resume Fields"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDelete(resume.id, e)}
                                                    className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                                                    title="Delete Profile"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* ATS Score rating */}
                                        <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Score Compatibility</span>
                                                <span className={`text-xl font-black ${scoreColor(resume.atsScore)}`}>{resume.atsScore}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200/50 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className={`h-1.5 rounded-full transition-all duration-700 ${scoreBarColor(resume.atsScore)}`} style={{ width: `${resume.atsScore}%` }} />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {resume.atsScore >= 75
                                                    ? <CheckCircle size={12} className="text-emerald-500" />
                                                    : <AlertTriangle size={12} className="text-amber-500" />}
                                                <span className={`text-[9px] font-bold uppercase tracking-wider ${scoreColor(resume.atsScore)}`}>
                                                    {scoreLabel(resume.atsScore)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* AI Feedback */}
                                        {resume.suggestions && (
                                            <div className="space-y-1.5">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">AI Placement Suggestions</span>
                                                <div className="space-y-1.5">
                                                    {resume.suggestions.split(' | ').slice(0, 3).map((s, i) => (
                                                        <p key={i} className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed font-semibold flex items-start gap-1">
                                                            <span className="text-primary-500 font-bold shrink-0">→</span>
                                                            <span>{s}</span>
                                                        </p>
                                                    ))}
                                                    {resume.suggestions.split(' | ').length > 3 && (
                                                        <span className="text-[9px] text-slate-400 font-bold italic block pl-3">
                                                            +{resume.suggestions.split(' | ').length - 3} more suggestions in editing console
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Foot */}
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <button 
                                            onClick={() => exportPDF(resume.name)}
                                            className="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1"
                                        >
                                            <Download size={14} /> Download PDF File
                                        </button>
                                        <button 
                                            onClick={() => setViewingResume(resume)}
                                            className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-1"
                                        >
                                            View Template Profile <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ResumeBuilder;
