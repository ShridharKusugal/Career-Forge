import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Briefcase, FileText, Send, Check, Loader2, ArrowLeft, 
    Globe, ShieldCheck, Mail, Phone, ExternalLink 
} from 'lucide-react';

const LinkedInIcon = ({ size = 12, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

const GitHubIcon = ({ size = 12, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

// Dynamic company branding helper
const getCompanyBranding = (name = "") => {
    const lower = name.toLowerCase();
    if (lower.includes("google")) {
        return {
            bg: "bg-slate-50",
            primary: "from-blue-600 to-indigo-600",
            accent: "text-blue-600",
            button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
            logoColor: "text-blue-500",
            tagline: "Build for everyone.",
            font: "font-sans",
            headerBg: "bg-white border-b border-slate-100"
        };
    } else if (lower.includes("meta") || lower.includes("facebook")) {
        return {
            bg: "bg-slate-50",
            primary: "from-blue-700 to-sky-700",
            accent: "text-blue-700",
            button: "bg-blue-700 hover:bg-blue-800 focus:ring-blue-600",
            logoColor: "text-blue-600",
            tagline: "Move fast, build together.",
            font: "font-sans",
            headerBg: "bg-white border-b border-slate-100"
        };
    } else if (lower.includes("amazon")) {
        return {
            bg: "bg-slate-900 text-white",
            primary: "from-amber-500 to-orange-500",
            accent: "text-amber-500",
            button: "bg-amber-500 text-slate-950 hover:bg-amber-600 focus:ring-amber-500",
            logoColor: "text-amber-500",
            tagline: "Work Hard. Have Fun. Make History.",
            font: "font-sans",
            headerBg: "bg-slate-950 border-b border-slate-800"
        };
    } else if (lower.includes("netflix")) {
        return {
            bg: "bg-neutral-950 text-white",
            primary: "from-red-600 to-rose-700",
            accent: "text-red-600",
            button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
            logoColor: "text-red-600",
            tagline: "Entertainment that connects us.",
            font: "font-sans",
            headerBg: "bg-neutral-900 border-b border-neutral-800"
        };
    } else if (lower.includes("microsoft")) {
        return {
            bg: "bg-slate-50",
            primary: "from-teal-600 to-cyan-600",
            accent: "text-teal-600",
            button: "bg-teal-600 hover:bg-teal-700 focus:ring-teal-500",
            logoColor: "text-teal-600",
            tagline: "Empower every person and every organization.",
            font: "font-sans",
            headerBg: "bg-white border-b border-slate-100"
        };
    }
    // General fallback
    return {
        bg: "bg-slate-50",
        primary: "from-violet-600 to-purple-600",
        accent: "text-violet-600",
        button: "bg-violet-600 hover:bg-violet-700 focus:ring-violet-500",
        logoColor: "text-violet-500",
        tagline: "Official Corporate Career Center",
        font: "font-sans",
        headerBg: "bg-white border-b border-slate-100"
    };
};

const ExternalApply = () => {
    const { companyId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const jobTitle = searchParams.get('jobTitle') || 'Software Engineer';
    const jobCode = searchParams.get('jobCode') || 'SWE-101';

    const [company, setCompany] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        githubUrl: '',
        linkedinUrl: '',
        resumeText: '',
        coverLetter: ''
    });

    useEffect(() => {
        const loadPageData = async () => {
            try {
                const [companyRes, resumesRes] = await Promise.all([
                    axios.get(`/api/companies/${companyId}`),
                    axios.get('/api/resumes').catch(() => ({ data: [] }))
                ]);
                setCompany(companyRes.data);
                const resumesList = resumesRes.data || [];
                setResumes(resumesList);
                
                // Pre-fill form from URL parameters (candidate details in the redirection link) or user fallback
                const fullName = searchParams.get('fullName') || user?.username || '';
                const email = searchParams.get('email') || user?.email || '';
                const phone = searchParams.get('phone') || '';
                const githubUrl = searchParams.get('githubUrl') || localStorage.getItem('cf_github') || '';
                const linkedinUrl = searchParams.get('linkedinUrl') || localStorage.getItem('cf_linkedin') || '';

                setForm(prev => ({
                    ...prev,
                    fullName,
                    email,
                    phone,
                    githubUrl,
                    linkedinUrl
                }));

                // Auto-select first resume if available to pre-fill CV text automatically
                if (resumesList.length > 0) {
                    const firstResume = resumesList[0];
                    setSelectedResumeId(firstResume.id.toString());
                    setForm(prev => ({
                        ...prev,
                        resumeText: `SUMMARY:\n${firstResume.summary || ''}\n\nSKILLS:\n${firstResume.skills || ''}\n\nEXPERIENCE:\n${firstResume.experience || ''}\n\nPROJECTS:\n${firstResume.projects || ''}\n\nEDUCATION:\n${firstResume.education || ''}`
                    }));
                }
            } catch (err) {
                console.error("Error loading application portal", err);
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, [companyId, user, searchParams]);

    const handleResumeChange = (resumeId) => {
        setSelectedResumeId(resumeId);
        if (!resumeId) return;
        const selected = resumes.find(r => r.id === parseInt(resumeId, 10));
        if (selected) {
            setForm(prev => ({
                ...prev,
                fullName: selected.name || prev.fullName || user?.username || '',
                email: selected.email || prev.email || user?.email || '',
                phone: selected.phone || prev.phone || '',
                githubUrl: selected.githubUrl || prev.githubUrl || '',
                linkedinUrl: selected.linkedinUrl || prev.linkedinUrl || '',
                resumeText: `SUMMARY:\n${selected.summary || ''}\n\nSKILLS:\n${selected.skills || ''}\n\nEXPERIENCE:\n${selected.experience || ''}\n\nPROJECTS:\n${selected.projects || ''}\n\nEDUCATION:\n${selected.education || ''}`
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                companyId: parseInt(companyId, 10),
                jobTitle: jobTitle,
                jobCode: jobCode,
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                githubUrl: form.githubUrl,
                linkedinUrl: form.linkedinUrl,
                resumeText: form.resumeText,
                coverLetter: form.coverLetter
            };
            
            // Post direct to backend to store application with date and time under user profile
            await axios.post('/api/jobs/apply', payload);
            setSuccess(true);
        } catch (err) {
            console.error("Submission failed", err);
            alert("Official portal system encountered an error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white space-y-4">
                <Loader2 size={32} className="animate-spin text-primary-500" />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading Official Talent Portal...</p>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 space-y-4">
                <p className="text-sm font-semibold text-rose-500">Invalid official company job link.</p>
                <button onClick={() => window.close()} className="px-5 py-2.5 bg-slate-800 rounded-xl text-xs font-bold text-white">
                    Close Window
                </button>
            </div>
        );
    }

    const brand = getCompanyBranding(company.name);

    return (
        <div className={`min-h-screen ${brand.bg} ${brand.font} flex flex-col transition-all duration-300`}>
            {/* Header */}
            <header className={`py-4 px-6 shadow-sm flex items-center justify-between ${brand.headerBg}`}>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center text-slate-900 font-black text-sm uppercase shadow-sm">
                        {company.name.slice(0, 2)}
                    </div>
                    <div>
                        <h1 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight uppercase tracking-wider">
                            {company.name} Careers
                        </h1>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-semibold">{brand.tagline}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        Verified Official Board
                    </span>
                </div>
            </header>

            {/* Content Body */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:py-12 space-y-8">
                {success ? (
                    <div className="bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 md:p-12 text-center max-w-xl mx-auto space-y-6 shadow-xl animate-fadeIn">
                        <div className={`h-16 w-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center`}>
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="font-black text-2xl text-slate-850 dark:text-white leading-tight">
                                Application Submitted!
                            </h2>
                            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                                Your application for <span className="text-slate-800 dark:text-white font-black">{jobTitle} ({jobCode})</span> has been officially submitted directly to the <span className="font-bold">{company.name}</span> talent database.
                            </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl text-left space-y-2">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                Placement Tracker Logged
                            </div>
                            <div className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                The application details and timestamp have been automatically recorded under your <span className="font-bold text-slate-900 dark:text-white">CareerForge User Profile</span>. You can track this role's progress directly from your dashboard.
                            </div>
                        </div>

                        <button 
                            onClick={() => window.close()} 
                            className="w-full bg-slate-900 dark:bg-slate-100 dark:text-slate-950 text-white rounded-2xl py-3 text-xs font-black hover:opacity-90 shadow-lg"
                        >
                            Close Tab
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Job Details Card */}
                        <div className="bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-6 shadow-sm">
                            <div className="space-y-2">
                                <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1 bg-slate-100 dark:bg-slate-850 rounded-full text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800`}>
                                    Active Job Posting
                                </span>
                                <h2 className="font-black text-xl text-slate-800 dark:text-white leading-tight">
                                    {jobTitle}
                                </h2>
                                <span className="text-[10px] text-slate-400 font-bold block">
                                    Code: {jobCode} • {company.jobLocation}
                                </span>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Hiring Entity</div>
                                    <div className="text-xs text-slate-800 dark:text-slate-200 font-black">{company.name}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Location Format</div>
                                    <div className="text-xs text-slate-800 dark:text-slate-200 font-bold">{company.jobLocation}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Compensation Tier</div>
                                    <div className="text-xs text-slate-800 dark:text-slate-200 font-bold">{company.salaryPackage || "Market Standard"}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Required Profile Skills</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {company.requiredSkills.split(',').map((skill, i) => (
                                            <span key={i} className="bg-slate-100 dark:bg-slate-800 text-[9px] font-bold px-2 py-0.5 rounded text-slate-800 dark:text-slate-300">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Application Form */}
                        <div className="md:col-span-2 bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                            <div className="space-y-1">
                                <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">Submit Candidate Details</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    Enter credentials below to apply for this official job role.
                                </p>
                            </div>

                            {/* Resume Import Option */}
                            {resumes.length > 0 && (
                                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                                        Auto-fill from CareerForge Resume Builder
                                    </label>
                                    <select
                                        value={selectedResumeId}
                                        onChange={(e) => handleResumeChange(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-slate-400 font-semibold text-slate-700 dark:text-slate-250 shadow-sm"
                                    >
                                        <option value="">-- Enter Details Manually --</option>
                                        {resumes.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.name} (ATS Score: {r.atsScore}%)
                                            </option>
                                        ))}
                                    </select>
                                    <span className="text-[9px] text-slate-400 font-medium block">
                                        💡 Selecting a profile automatically imports your portfolio text and contact logs.
                                    </span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Full Name *</label>
                                        <input
                                            required
                                            value={form.fullName}
                                            onChange={(e) => setForm(p => ({ ...p, fullName: e.target.value }))}
                                            placeholder="John Doe"
                                            className="w-full bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-slate-800 dark:text-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Email Address *</label>
                                        <input
                                            required
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                                            placeholder="john@example.com"
                                            className="w-full bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-slate-800 dark:text-slate-200"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Contact Phone *</label>
                                        <input
                                            required
                                            value={form.phone}
                                            onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-slate-800 dark:text-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">GitHub Link</label>
                                        <input
                                            value={form.githubUrl}
                                            onChange={(e) => setForm(p => ({ ...p, githubUrl: e.target.value }))}
                                            placeholder="github.com/username"
                                            className="w-full bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-slate-800 dark:text-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">LinkedIn Link</label>
                                        <input
                                            value={form.linkedinUrl}
                                            onChange={(e) => setForm(p => ({ ...p, linkedinUrl: e.target.value }))}
                                            placeholder="linkedin.com/in/username"
                                            className="w-full bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-slate-800 dark:text-slate-200"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                                        Resume / Portfolio CV Content *
                                    </label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={form.resumeText}
                                        onChange={(e) => setForm(p => ({ ...p, resumeText: e.target.value }))}
                                        placeholder="Paste your education, skills, key works, and work logs here..."
                                        className="w-full bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono resize-none text-slate-800 dark:text-slate-200"
                                    />
                                </div>

                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                                        Cover Letter (Optional)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={form.coverLetter}
                                        onChange={(e) => setForm(p => ({ ...p, coverLetter: e.target.value }))}
                                        placeholder="State briefly why you are a great match for this role..."
                                        className="w-full bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none text-slate-800 dark:text-slate-200"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full text-white font-black text-xs py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 ${brand.button}`}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" /> Submitting to {company.name}...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={14} /> Submit Application to {company.name}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ExternalApply;
