import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Search, 
    MapPin, 
    Calendar, 
    DollarSign, 
    TrendingUp, 
    BookOpen, 
    Layers, 
    X, 
    Briefcase,
    Loader2,
    Users,
    Building2,
    ArrowUpDown,
    Filter,
    Clock,
    CheckCircle,
    Building,
    Check,
    FileText,
    Sparkles,
    Send,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [prepQuestions, setPrepQuestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [loading, setLoading] = useState(true);
    const [prepLoading, setPrepLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('details'); // details | jobs | prep

    const { user } = useAuth();
    
    // Hiring Intelligence Stats
    const [stats, setStats] = useState({
        totalRecruiters: 35,
        activeJobs: 105,
        applicantsCount: 520,
        averagePackage: "14.8 LPA"
    });

    // Company specific jobs
    const [companyJobs, setCompanyJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(false);

    // AI ATS Resume Match states
    const [atsResults, setAtsResults] = useState({}); // jobId -> result
    const [atsLoading, setAtsLoading] = useState({}); // jobId -> bool
    
    // Job Application States
    const [resumes, setResumes] = useState([]);
    const [userApplications, setUserApplications] = useState([]);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applyingJob, setApplyingJob] = useState(null); // { title, code }
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [applySuccess, setApplySuccess] = useState(false);
    const [applicationForm, setApplicationForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        githubUrl: '',
        linkedinUrl: '',
        resumeText: '',
        coverLetter: ''
    });

    useEffect(() => {
        const fetchCompaniesAndStats = async () => {
            try {
                const [compRes, statsRes] = await Promise.all([
                    axios.get('/api/companies'),
                    axios.get('/api/jobs/stats').catch(() => null)
                ]);
                setCompanies(compRes.data);
                if (statsRes && statsRes.data) {
                    setStats(statsRes.data);
                }
            } catch (error) {
                console.error("Error fetching companies/stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompaniesAndStats();
    }, []);

    // Load resumes and user's job applications on mount / user change, and handle window focus tracking
    useEffect(() => {
        const fetchResumesAndApps = async () => {
            if (!user) return;
            try {
                const [resumesRes, appsRes] = await Promise.all([
                    axios.get('/api/resumes').catch(() => ({ data: [] })),
                    axios.get('/api/jobs/applications').catch(() => ({ data: [] }))
                ]);
                setResumes(resumesRes.data || []);
                setUserApplications(appsRes.data || []);
            } catch (error) {
                console.error("Error fetching resumes/applications", error);
            }
        };
        fetchResumesAndApps();

        // Listen for window focus to fetch any recently submitted applications
        const handleFocus = () => {
            if (user) {
                axios.get('/api/jobs/applications')
                    .then(res => setUserApplications(res.data || []))
                    .catch(() => {});
            }
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [user]);

    const handleSelectCompany = async (company) => {
        setSelectedCompany(company);
        setActiveTab('details');
        setPrepLoading(true);
        setJobsLoading(true);
        setCompanyJobs([]);
        try {
            const res = await axios.get(`/api/companies/${company.id}/prep`);
            setPrepQuestions(res.data);
        } catch (error) {
            console.error("Error loading preparation questions", error);
        } finally {
            setPrepLoading(false);
        }

        try {
            const jobsRes = await axios.get(`/api/jobs/search?companyId=${company.id}`);
            setCompanyJobs(jobsRes.data || []);
        } catch (error) {
            console.error("Error loading company jobs", error);
        } finally {
            setJobsLoading(false);
        }
    };

    const handleCheckAtsScore = async (job) => {
        setAtsLoading(prev => ({ ...prev, [job.id]: true }));
        try {
            const resumeText = resumes[0]?.resumeText || "Skills: Java, React, SQL, HTML, CSS, JavaScript, Git, Spring Boot";
            const res = await axios.post('/api/ai/resume-match', {
                jobId: job.id.toString(),
                resumeText: resumeText
            });
            setAtsResults(prev => ({ ...prev, [job.id]: res.data }));
        } catch (error) {
            console.error("Error checking ATS match", error);
        } finally {
            setAtsLoading(prev => ({ ...prev, [job.id]: false }));
        }
    };

    const getSpecificJobLink = (companyName, generalLink, jobTitle) => {
        if (!generalLink) return '#';
        const query = encodeURIComponent(jobTitle);
        const cleanName = companyName.toLowerCase();
        
        if (cleanName.includes('google')) {
            return `https://careers.google.com/jobs/results/?q=${query}`;
        }
        if (cleanName.includes('walmart')) {
            return `https://careers.walmart.com/results?q=${query}`;
        }
        if (cleanName.includes('visa')) {
            return `https://careers.visa.com/jobs/?q=${query}`;
        }
        if (cleanName.includes('mastercard')) {
            return `https://careers.mastercard.com/us/en/search-results?keywords=${query}`;
        }
        if (cleanName.includes('mckinsey')) {
            return `https://www.mckinsey.com/careers/search-jobs?query=${query}`;
        }
        if (cleanName.includes('ey') || cleanName.includes('ernst')) {
            return `https://careers.ey.com/ey/search/?q=${query}`;
        }
        if (cleanName.includes('barclays')) {
            return `https://search.jobs.barclays/search-jobs/${encodeURIComponent(jobTitle)}`;
        }
        if (cleanName.includes('deutsche') || cleanName.includes('db')) {
            return `https://careers.db.com/professionals/search-roles/#/search-results?keyword=${query}`;
        }
        if (cleanName.includes('ubs')) {
            return `https://jobs.ubs.com/TGnewUI/Search/Home/HomeWithPreLoad?partnerid=25008&siteid=5012#keyWordSearch=${query}`;
        }
        if (cleanName.includes('tower research')) {
            return `https://www.tower-research.com/careers?q=${query}`;
        }
        if (cleanName.includes('jio')) {
            return `https://careers.jio.com/jobsearch.aspx?q=${query}`;
        }
        if (cleanName.includes('myntra')) {
            return `https://careers.myntra.com/jobs?q=${query}`;
        }
        if (cleanName.includes('nutanix')) {
            return `https://nutanix.50three.com/jobs/search?query=${query}`;
        }
        if (cleanName.includes('rippling')) {
            return `https://www.rippling.com/careers?q=${query}`;
        }
        if (cleanName.includes('thoughtspot')) {
            return `https://www.thoughtspot.com/careers?q=${query}`;
        }
        if (cleanName.includes('epam')) {
            return `https://welcome.epam.com/careers/job-listings?recruitmentPid=${query}`;
        }
        if (cleanName.includes('zscaler')) {
            return `https://www.zscaler.com/careers/jobs?q=${query}`;
        }
        if (cleanName.includes('harness')) {
            return `https://harness.io/careers?q=${query}`;
        }
        if (cleanName.includes('vercel')) {
            return `https://vercel.com/careers?q=${query}`;
        }
        if (cleanName.includes('rubrik')) {
            return `https://www.rubrik.com/careers?q=${query}`;
        }
        if (cleanName.includes('druva')) {
            return `https://www.druva.com/careers?q=${query}`;
        }
        if (cleanName.includes('hasura')) {
            return `https://hasura.io/careers?q=${query}`;
        }
        if (cleanName.includes('intuit')) {
            return `https://careers.intuit.com/search-jobs?kw=${query}`;
        }
        if (cleanName.includes('x.com') || cleanName.includes('twitter')) {
            return `https://careers.x.com/en/jobs?q=${query}`;
        }
        if (cleanName.includes('linkedin')) {
            return `https://www.linkedin.com/jobs/search/?keywords=${query}`;
        }
        if (cleanName.includes('uber')) {
            return `https://www.uber.com/careers/list/?q=${query}`;
        }
        if (cleanName.includes('ericsson')) {
            return `https://jobs.ericsson.com/search/?q=${query}`;
        }
        if (cleanName.includes('siemens')) {
            return `https://jobs.siemens.com/careers?query=${query}`;
        }
        if (cleanName.includes('bosch')) {
            return `https://www.bosch-career.com/en/job-search/?search=${query}`;
        }
        if (cleanName.includes('thoughtworks')) {
            return `https://www.thoughtworks.com/careers/jobs?query=${query}`;
        }
        if (cleanName.includes('media.net') || cleanName.includes('directi')) {
            return `https://careers.media.net/jobs?q=${query}`;
        }
        if (cleanName.includes('cisco')) {
            return `https://jobs.cisco.com/jobs/SearchJobs/?listFilterMode=1&project=${query}`;
        }

        try {
            const base = new URL(generalLink);
            return `${base.origin}${base.pathname}?search=${query}&q=${query}`;
        } catch {
            return `${generalLink}?search=${query}`;
        }
    };

    const handleApplyClick = async (jobOrTitle, fallbackCode) => {
        if (!user) {
            alert("Please log in to apply.");
            return;
        }

        let jobObj = {};
        let destUrl = "";

        if (jobOrTitle && typeof jobOrTitle === 'object') {
            jobObj = jobOrTitle;
            destUrl = jobObj.applicationUrl;
        } else {
            jobObj = {
                id: null,
                title: jobOrTitle,
                jobCode: fallbackCode || 'DIR-101',
                applicationUrl: getSpecificJobLink(selectedCompany.name, selectedCompany.applicationLink, jobOrTitle)
            };
            destUrl = jobObj.applicationUrl;
        }
        
        const defaultResume = resumes[0] || {};
        const fullName = defaultResume.name || user.username || '';
        const email = defaultResume.email || user.email || '';
        const phone = defaultResume.phone || '';
        const githubUrl = defaultResume.githubUrl || localStorage.getItem('cf_github') || '';
        const linkedinUrl = defaultResume.linkedinUrl || localStorage.getItem('cf_linkedin') || '';

        try {
            const res = await axios.post('/api/jobs/apply', {
                companyId: selectedCompany.id,
                jobId: jobObj.id,
                jobTitle: jobObj.title,
                jobCode: jobObj.jobCode,
                fullName: fullName,
                email: email,
                phone: phone,
                githubUrl: githubUrl,
                linkedinUrl: linkedinUrl,
                status: 'STARTED'
            });

            if (res.data) {
                setUserApplications(prev => [...prev, res.data]);
            }
        } catch (error) {
            console.error("Error registering job application tracking", error);
        }

        window.open(destUrl, '_blank', 'noopener,noreferrer');
    };
    // Get list of unique industries for filter chips
    const industries = ['All', ...new Set(companies.map(c => c.industry || 'Technology').filter(Boolean))];

    // Filter and Sort logic
    const filteredCompanies = companies.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.hiringRoles.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.requiredSkills.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry;
        
        return matchSearch && matchIndustry;
    });

    const sortedCompanies = [...filteredCompanies].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        if (sortBy === 'salary') {
            const getVal = (str) => {
                const match = str.match(/(\d+)/);
                return match ? parseInt(match[0], 10) : 0;
            };
            return getVal(b.salaryPackage) - getVal(a.salaryPackage);
        }
        if (sortBy === 'posts') {
            return (b.jobPostsCount || 0) - (a.jobPostsCount || 0);
        }
        if (sortBy === 'applicants') {
            return (b.totalApplicants || 0) - (a.totalApplicants || 0);
        }
        return 0;
    });

    // Helper for robust company logos
    const CompanyLogo = ({ company, className = "h-12 w-12" }) => {
        const [imgSrc, setImgSrc] = useState(null);
        const [fallbackLevel, setFallbackLevel] = useState(0); // 0: primary, 1: google favicon, 2: text avatar

        useEffect(() => {
            setFallbackLevel(0);
            if (company.logoUrl) {
                // Map the sunset clearbit URL to hunter.io immediately to save time/requests
                if (company.logoUrl.includes('logo.clearbit.com')) {
                    const domain = company.logoUrl.replace('https://logo.clearbit.com/', '');
                    setImgSrc(`https://logos.hunter.io/${domain}`);
                } else {
                    setImgSrc(company.logoUrl);
                }
            } else {
                const domain = `${company.name.toLowerCase().replace(/\s+/g, '')}.com`;
                setImgSrc(`https://logos.hunter.io/${domain}`);
            }
        }, [company]);

        const handleError = () => {
            if (fallbackLevel === 0) {
                // Try Google Favicon as first fallback (excellent fallback for x.com etc)
                let domain = '';
                if (imgSrc && imgSrc.includes('logos.hunter.io/')) {
                    domain = imgSrc.split('logos.hunter.io/')[1];
                } else if (company.logoUrl && company.logoUrl.includes('logo.clearbit.com')) {
                    domain = company.logoUrl.replace('https://logo.clearbit.com/', '');
                } else {
                    domain = `${company.name.toLowerCase().replace(/\s+/g, '')}.com`;
                }
                setImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
                setFallbackLevel(1);
            } else {
                // Fallback to text avatar
                setFallbackLevel(2);
            }
        };

        // Dynamic background color based on name length to ensure a colorful avatar
        const colors = [
            'bg-sky-500 text-white font-extrabold shadow-md shadow-sky-500/10',
            'bg-emerald-500 text-white font-extrabold shadow-md shadow-emerald-500/10',
            'bg-indigo-500 text-white font-extrabold shadow-md shadow-indigo-500/10',
            'bg-amber-500 text-white font-extrabold shadow-md shadow-amber-500/10',
            'bg-rose-500 text-white font-extrabold shadow-md shadow-rose-500/10',
            'bg-purple-500 text-white font-extrabold shadow-md shadow-purple-500/10'
        ];
        const colorClass = colors[company.name.length % colors.length];

        if (fallbackLevel >= 2 || !imgSrc) {
            return (
                <div className={`${className} shrink-0 rounded-xl ${colorClass} flex items-center justify-center font-black text-xl select-none border border-slate-200/50 dark:border-slate-800`}>
                    {company.name.charAt(0)}
                </div>
            );
        }

        return (
            <img 
                src={imgSrc} 
                alt={company.name} 
                onError={handleError}
                className={`${className} shrink-0 rounded-xl object-contain p-1.5 bg-white border border-slate-200/50 dark:border-slate-800`}
            />
        );
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 size={32} className="animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header section with Stats Overview */}
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-primary-600 to-indigo-500 dark:from-white dark:via-primary-400 dark:to-indigo-300 bg-clip-text text-transparent tracking-tight">Hiring Intelligence</h1>
                    <p className="text-slate-500 dark:text-slate-300 mt-2 font-medium text-sm">
                        Discover top recruiters, active vacancy analytics, interview patterns, and apply on official portals.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="glass-card p-4 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500">
                            <Building2 size={18} />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-300 font-extrabold uppercase block">Recruiters</span>
                            <span className="text-sm font-black text-slate-800 dark:text-white">{stats.totalRecruiters} Partners</span>
                        </div>
                    </div>
                    <div className="glass-card p-4 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                            <Briefcase size={18} />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-300 font-extrabold uppercase block">Job Posts</span>
                            <span className="text-sm font-black text-slate-800 dark:text-white">
                                {stats.activeJobs} Active
                            </span>
                        </div>
                    </div>
                    <div className="glass-card p-4 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500">
                            <Users size={18} />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-300 font-extrabold uppercase block">Applicants</span>
                            <span className="text-sm font-black text-slate-800 dark:text-white">
                                {stats.applicantsCount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div className="glass-card p-4 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-300 font-extrabold uppercase block">Avg Package</span>
                            <span className="text-sm font-black text-slate-800 dark:text-white">{stats.averagePackage}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-slate-50 dark:bg-slate-900/30 p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                {/* Search */}
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 dark:text-slate-300">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search company, job role, or skills..."
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        <ArrowUpDown size={14} /> Sort By
                    </span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs font-black text-slate-800 dark:text-slate-100 py-2.5 px-3 rounded-2xl focus:outline-none focus:border-primary-500"
                    >
                        <option value="name">Name (A-Z)</option>
                        <option value="salary">Salary (High to Low)</option>
                        <option value="posts">Active Job Posts</option>
                        <option value="applicants">Total Applicants</option>
                    </select>
                </div>
            </div>

            {/* Industry Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <span className="text-xs font-black text-slate-750 dark:text-slate-200 flex items-center gap-1.5 shrink-0">
                    <Filter size={14} /> Industry:
                </span>
                {industries.map((ind) => (
                    <button
                        key={ind}
                        onClick={() => setSelectedIndustry(ind)}
                        className={`text-xs font-bold px-4 py-2 rounded-full border transition-all shrink-0 ${
                            selectedIndustry === ind 
                                ? 'bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/10' 
                                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                    >
                        {ind}
                    </button>
                ))}
            </div>

            {/* List */}
            {sortedCompanies.length === 0 ? (
                <div className="text-center py-16 glass-card">
                    <Building size={48} className="mx-auto text-slate-400 dark:text-slate-600 mb-4" />
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">No recruiting partners match your query</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 font-semibold">Try resetting the industry filters or searching for different terms.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedCompanies.map((c, cIdx) => (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: Math.min(cIdx * 0.03, 0.5) }}
                            whileHover={{ y: -5, scale: 1.015 }}
                            onClick={() => handleSelectCompany(c)}
                            className="glass-card p-6 flex flex-col justify-between cursor-pointer group hover:shadow-xl hover:shadow-primary-500/5 hover:border-primary-400/30 transition-all duration-300"
                        >
                            <div className="space-y-4">
                                {/* Head */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <CompanyLogo company={c} />
                                        <div>
                                            <h3 className="font-black text-base text-slate-800 dark:text-white group-hover:text-primary-500 transition-colors flex items-center gap-1.5">
                                                {c.name}
                                            </h3>
                                            <span className="text-[9px] font-black uppercase tracking-wider text-primary-655 bg-primary-500/10 px-2 py-0.5 rounded-md border border-primary-500/20">
                                                {c.industry || 'Technology'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-700 dark:text-slate-200 font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full">
                                        {c.experienceLevel || 'Fresher'}
                                    </span>
                                </div>

                                {/* Metrics Badges (User request: Job posts + applicant counts) */}
                                <div className="grid grid-cols-2 gap-2.5 pt-1">
                                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-2.5 border border-slate-100 dark:border-slate-850 flex flex-col">
                                        <span className="text-[9px] text-slate-500 dark:text-slate-300 font-black uppercase">Active Jobs</span>
                                        <span className="text-xs font-black text-slate-800 dark:text-slate-100 mt-0.5 flex items-center gap-1">
                                            <Briefcase size={12} className="text-primary-500" />
                                            {c.jobPostsCount || 10} Posts
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-2.5 border border-slate-100 dark:border-slate-850 flex flex-col">
                                        <span className="text-[9px] text-slate-500 dark:text-slate-300 font-black uppercase">Total Applicants</span>
                                        <span className="text-xs font-black text-slate-800 dark:text-slate-100 mt-0.5 flex items-center gap-1">
                                            <Users size={12} className="text-emerald-500" />
                                            {(c.totalApplicants || 5000).toLocaleString()}+
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-205 font-bold pt-1">
                                    <div className="flex items-center gap-2">
                                        <Layers size={14} className="text-slate-500 dark:text-slate-400" />
                                        <span>{c.hiringRoles}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={14} className="text-slate-500 dark:text-slate-400" />
                                        <span>{c.salaryPackage} LPA</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-slate-500 dark:text-slate-400" />
                                        <span>{c.jobLocation}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                                {c.requiredSkills.split(',').slice(0, 3).map((skill, i) => (
                                    <span key={i} className="bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                                        {skill.trim()}
                                    </span>
                                ))}
                                {c.requiredSkills.split(',').length > 3 && (
                                    <span className="text-[10px] text-slate-700 dark:text-slate-200 font-black bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200/30 dark:border-slate-800">
                                        +{c.requiredSkills.split(',').length - 3}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal Detail view */}
            {selectedCompany && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Modal Head */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <CompanyLogo company={selectedCompany} className="h-14 w-14" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-extrabold text-xl text-slate-800 dark:text-white">{selectedCompany.name}</h2>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                                            {selectedCompany.industry || 'Technology'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-705 dark:text-slate-300 font-extrabold">
                                        {selectedCompany.hiringRoles} • {selectedCompany.salaryPackage?.toLowerCase().includes('lpa') ? selectedCompany.salaryPackage : `${selectedCompany.salaryPackage} LPA`}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedCompany(null)}
                                className="rounded-xl p-2 hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`px-4 py-3 text-xs font-black border-b-2 transition-all ${activeTab === 'details' ? 'border-primary-500 text-primary-500' : 'border-transparent text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
                            >
                                Eligibility & Rounds
                            </button>
                            <button
                                onClick={() => setActiveTab('jobs')}
                                className={`px-4 py-3 text-xs font-black border-b-2 transition-all ${activeTab === 'jobs' ? 'border-primary-500 text-primary-500' : 'border-transparent text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
                            >
                                Active Job Positions ({selectedCompany.jobPostsCount || 3})
                            </button>
                            <button
                                onClick={() => setActiveTab('prep')}
                                className={`px-4 py-3 text-xs font-black border-b-2 transition-all ${activeTab === 'prep' ? 'border-primary-500 text-primary-500' : 'border-transparent text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
                            >
                                Preparation Q&As
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-8 overflow-y-auto flex-1 min-h-0 max-h-[calc(90vh-210px)] space-y-6 pb-12">
                            {activeTab === 'details' ? (() => {
                                const rounds = selectedCompany.hiringRounds
                                    ? (selectedCompany.hiringRounds.includes('\n') 
                                        ? selectedCompany.hiringRounds.split('\n') 
                                        : selectedCompany.hiringRounds.split(','))
                                    : [];
                                const cleanRoundText = (text) => {
                                    return text.replace(/^\d+[\s\.\)]+/, '').trim();
                                };
                                return (
                                    <div className="space-y-6">
                                        {/* Description Card */}
                                        <div className="p-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2">
                                            <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                <Building2 size={14} className="text-primary-500" /> About The Company
                                            </h4>
                                            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                                                {selectedCompany.companyDescription || 'Leading technology recruiter offering placement opportunities for core platform engineering roles.'}
                                            </p>
                                        </div>

                                        {/* Stats Row */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <div>
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase tracking-wider">Founded</span>
                                                <span className="text-sm font-black text-slate-850 dark:text-white mt-0.5">{selectedCompany.foundedYear || '1998'}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase tracking-wider">Headquarters</span>
                                                <span className="text-sm font-black text-slate-850 dark:text-white mt-0.5">{selectedCompany.headquarters || 'USA'}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase tracking-wider">Employee Count</span>
                                                <span className="text-sm font-black text-slate-850 dark:text-white mt-0.5">{selectedCompany.employeeCount || '10,000+'}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase tracking-wider">Hiring Stage</span>
                                                <span className="text-sm font-black text-emerald-500 flex items-center gap-1 mt-0.5">
                                                    <CheckCircle size={14} /> Active
                                                </span>
                                            </div>
                                        </div>

                                        {/* Main 2-Column Grid */}
                                        <div className="grid gap-6 md:grid-cols-2">
                                            {/* Left Column: Requirements & Info */}
                                            <div className="space-y-6">
                                                {/* Eligibility Box */}
                                                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                                                    <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                        <BookOpen size={14} className="text-primary-500" /> Academic Eligibility
                                                    </h4>
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl p-3.5 shadow-sm">
                                                        {selectedCompany.eligibility}
                                                    </p>
                                                </div>

                                                {/* Tech Stack Box */}
                                                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                                                    <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                        <Layers size={14} className="text-primary-500" /> Required Tech Stack
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedCompany.requiredSkills.split(',').map((skill, i) => (
                                                            <span key={i} className="bg-primary-500/10 text-primary-655 dark:text-primary-400 text-xs font-black px-3.5 py-1.5 rounded-xl border border-primary-500/10 hover:border-primary-500/30 transition-all">
                                                                {skill.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Quick Details Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0 border border-primary-500/15">
                                                            <MapPin size={18} />
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Location</span>
                                                            <span className="text-xs font-black text-slate-800 dark:text-slate-205 leading-snug">{selectedCompany.jobLocation}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/15">
                                                            <Calendar size={18} />
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Apply Before</span>
                                                            <span className="text-xs font-black text-rose-600 dark:text-rose-400 leading-snug">
                                                                {selectedCompany.lastDate ? new Date(selectedCompany.lastDate).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'}) : 'September 30, 2026'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Timeline & Insights */}
                                            <div className="space-y-6">
                                                {/* Timeline Box */}
                                                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                                                    <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                        <Clock size={14} className="text-primary-500" /> Interview & Hiring Rounds
                                                    </h4>
                                                    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 pl-6 ml-3 space-y-4">
                                                        {rounds.map((round, i) => {
                                                            const cleanRound = cleanRoundText(round);
                                                            if (!cleanRound) return null;
                                                            return (
                                                                <div key={i} className="relative group">
                                                                    {/* Circle Indicator */}
                                                                    <div className="absolute -left-[35px] top-0.5 h-6 w-6 rounded-full bg-primary-500 border-4 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-white group-hover:scale-110 transition-transform">
                                                                        {i + 1}
                                                                    </div>
                                                                    {/* Round Card */}
                                                                    <div className="p-3.5 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl hover:border-primary-500/30 transition-all shadow-sm">
                                                                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed block">{cleanRound}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Insights Box */}
                                                <div className="bg-sky-500/5 dark:bg-sky-500/10 rounded-2xl p-5 border border-sky-500/20 space-y-2">
                                                    <h4 className="text-xs font-black text-sky-655 dark:text-sky-400 flex items-center gap-1.5">
                                                        <TrendingUp size={14} /> AI Hiring Trend Insights
                                                    </h4>
                                                    <p className="text-sm text-slate-850 dark:text-slate-200 leading-relaxed font-semibold">
                                                        {selectedCompany.hiringTrends || 'This company has increased hiring for full stack systems. Technical questions heavily focus on logical operations, database indexes, and OOP principles.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })() : activeTab === 'jobs' ? (
                                <div className="space-y-4">
                                    {jobsLoading ? (
                                        <div className="flex h-32 items-center justify-center">
                                            <Loader2 size={24} className="animate-spin text-primary-500" />
                                        </div>
                                    ) : companyJobs.length === 0 ? (
                                        <div className="text-center py-12 glass-card">
                                            <Briefcase size={36} className="mx-auto text-slate-400 dark:text-slate-600 mb-3" />
                                            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">No active positions aggregated at this moment</h4>
                                            <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">Please check back later or proceed via the official company site redirection below.</p>
                                        </div>
                                    ) : (
                                        companyJobs.map((job) => {
                                            const alreadyApplied = userApplications.some(
                                                app => app.companyId === selectedCompany.id && (app.jobId === job.id || app.jobTitle === job.title)
                                            );
                                            const ats = atsResults[job.id];
                                            const atsLoad = atsLoading[job.id];

                                            return (
                                                <div key={job.id} className="bg-slate-50 dark:bg-slate-855/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 space-y-4">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                        <div>
                                                            <h4 className="text-sm font-black text-slate-800 dark:text-white">{job.title}</h4>
                                                            <span className="text-[10px] text-slate-500 dark:text-slate-350 font-bold block mt-0.5">
                                                                Code: {job.jobCode} • {job.location} • {job.experienceLevel || 'Entry Level'} • {job.salaryRange || '12 - 18 LPA'}
                                                            </span>
                                                        </div>
                                                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${job.hiringStatus === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-amber-500/10 border-amber-500/20 text-amber-600'}`}>
                                                            {job.hiringStatus}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-800 dark:text-slate-205 leading-relaxed font-medium">
                                                        {job.description}
                                                    </p>
                                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {job.skillsRequired && job.skillsRequired.split(',').map((skill, i) => (
                                                                <span key={i} className="bg-slate-200 dark:bg-slate-800 text-[10px] font-black px-2.5 py-0.5 rounded text-slate-800 dark:text-slate-202">
                                                                    {skill.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleCheckAtsScore(job)}
                                                                disabled={atsLoad}
                                                                className="text-[10px] font-extrabold text-primary-500 hover:text-primary-600 bg-primary-500/10 px-3 py-1.5 rounded-xl border border-primary-500/15 flex items-center gap-1 shrink-0 transition-all hover:bg-primary-500/25"
                                                            >
                                                                {atsLoad ? (
                                                                    <>Matching... <Loader2 size={11} className="animate-spin" /></>
                                                                ) : ats ? (
                                                                    <>Re-check ATS Match</>
                                                                ) : (
                                                                    <>Check ATS Match</>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => handleApplyClick(job)}
                                                                className="text-[10px] font-extrabold px-4.5 py-2 rounded-xl transition-all shadow-sm shrink-0 border bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white border-transparent hover:translate-y-[-1px]"
                                                            >
                                                                Apply via Company Site
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Expanded ATS Panel */}
                                                    {ats && (
                                                        <div className="bg-gradient-to-r from-primary-500/5 to-indigo-500/5 border border-primary-500/10 rounded-2xl p-4 space-y-3 mt-3 animate-fadeIn">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">AI Resume Match Score</span>
                                                                <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${ats.matchScore >= 75 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-amber-500/10 border-amber-500/20 text-amber-600'}`}>
                                                                    {ats.matchScore}% Match
                                                                </span>
                                                            </div>
                                                            <div className="grid md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <span className="text-[9px] text-emerald-605 font-extrabold uppercase tracking-wider block mb-1">Matched Skills</span>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {ats.matchedSkills && ats.matchedSkills.map((s, i) => (
                                                                            <span key={i} className="text-[9px] font-bold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/15">{s}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span className="text-[9px] text-amber-605 font-extrabold uppercase tracking-wider block mb-1">Missing Skills</span>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {ats.missingSkills && ats.missingSkills.map((s, i) => (
                                                                            <span key={i} className="text-[9px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full border border-amber-500/15">{s}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="pt-2 border-t border-slate-200/45 dark:border-slate-800/45">
                                                                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1">Coach Recommendation</span>
                                                                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-350 leading-relaxed bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-850">
                                                                    {ats.feedback}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {prepLoading ? (
                                        <div className="flex h-32 items-center justify-center">
                                            <Loader2 size={24} className="animate-spin text-primary-500" />
                                        </div>
                                    ) : prepQuestions.length === 0 ? (
                                        <div className="text-center py-12 glass-card">
                                            <BookOpen size={36} className="mx-auto text-slate-400 dark:text-slate-600 mb-3" />
                                            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">No official prep questions configured yet</h4>
                                            <p className="text-[10px] text-slate-505 mt-0.5">We will launch simulated practice patterns shortly.</p>
                                        </div>
                                    ) : (
                                        prepQuestions.map((q) => (
                                            <div key={q.id} className="bg-slate-50 dark:bg-slate-850/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${q.difficulty === 'HARD' ? 'bg-rose-500/10 text-rose-500' : q.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                        {q.difficulty}
                                                    </span>
                                                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-wider">{q.type}</span>
                                                </div>
                                                <h4 className="text-xs font-black text-slate-800 dark:text-white flex gap-1.5">
                                                    <span className="text-primary-500 font-black shrink-0">Q:</span>
                                                    <span>{q.question}</span>
                                                </h4>
                                                <div className="text-sm text-slate-855 dark:text-slate-205 leading-relaxed pt-2.5 border-t border-slate-200/50 dark:border-slate-800/50 flex gap-1.5 font-semibold">
                                                    <span className="text-emerald-505 font-black shrink-0">A:</span>
                                                    <div>
                                                        <span className="font-black text-slate-800 dark:text-white block mb-1">Answer Strategy:</span>
                                                        {q.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/20 px-6">
                            <span className="text-[10px] text-rose-500 font-extrabold flex items-center gap-1">
                                <Clock size={12} /> Apply before deadline
                            </span>
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const primaryRole = selectedCompany.hiringRoles.split(',')[0].trim();
                                    const jobToApply = companyJobs.length > 0 ? companyJobs[0] : primaryRole;
                                    const alreadyApplied = userApplications.some(
                                        app => app.companyId === selectedCompany.id && 
                                               (app.jobTitle === primaryRole || (companyJobs.length > 0 && app.jobId === companyJobs[0].id))
                                    );
                                    return (
                                        <button
                                            onClick={() => handleApplyClick(jobToApply, 'DIR-101')}
                                            className="rounded-xl px-5 py-2.5 text-xs font-black shadow-md transition-all border flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white border-transparent hover:translate-y-[-1px] shadow-primary-500/20"
                                        >
                                            Apply via Company Site <ExternalLink size={12} />
                                        </button>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Companies;
