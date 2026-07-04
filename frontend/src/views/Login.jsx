import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
    KeyRound, Mail, Loader2, ArrowRight, Sparkles, Shield, Zap, 
    BookOpen, Code2, Bot, Building2, Link2, FileText, X, CheckCircle2,
    Clock, Layers, MapPin, Calendar, TrendingUp, Users, CheckCircle,
    Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import axios from 'axios';

const Login = () => {
    const { login, setUser } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState('');

    const handleSocialLogin = async (provider) => {
        setError('');
        setLoading(true);
        try {
            const username = `social_${provider.toLowerCase()}_user`;
            const email = `${username}@example.com`;
            const res = await axios.post('/api/auth/social', {
                provider,
                username,
                email
            });
            const data = res.data;
            localStorage.setItem('token', data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data || `Failed to sign in with ${provider}.`);
        } finally {
            setLoading(false);
        }
    };

    const [previewKey, setPreviewKey] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [previewLoading, setPreviewLoading] = useState(false);

    const [selectedCompany, setSelectedCompany] = useState(null);
    const [prepQuestions, setPrepQuestions] = useState([]);
    const [prepLoading, setPrepLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    const handleSelectCompany = async (company) => {
        setSelectedCompany(company);
        setActiveTab('details');
        setPrepLoading(true);
        try {
            const res = await axios.get(`/api/public/companies/${company.id}/prep`);
            setPrepQuestions(res.data);
        } catch (error) {
            console.error("Error loading preparation questions", error);
        } finally {
            setPrepLoading(false);
        }
    };

    // Helper for robust company logos
    const CompanyLogo = ({ company, className = "h-12 w-12" }) => {
        const [imgSrc, setImgSrc] = useState(null);
        const [fallbackLevel, setFallbackLevel] = useState(0); // 0: primary, 1: google favicon, 2: text avatar

        useEffect(() => {
            setFallbackLevel(0);
            if (company.logoUrl) {
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
                setFallbackLevel(2);
            }
        };

        const colors = [
            'bg-sky-500 text-white font-extrabold shadow-md shadow-sky-500/10',
            'bg-emerald-500 text-white font-extrabold shadow-md shadow-emerald-500/10',
            'bg-indigo-500 text-white font-extrabold shadow-md shadow-indigo-500/10',
            'bg-amber-500 text-white font-extrabold shadow-md shadow-amber-500/10',
            'bg-rose-500 text-white font-extrabold shadow-md shadow-rose-500/10',
            'bg-slate-500 text-white font-extrabold shadow-md shadow-slate-500/10'
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

    const handleOpenPreview = async (key) => {
        setPreviewKey(key);
        setPreviewLoading(true);
        setPreviewData([]);
        
        if (key === 'linkedin') {
            setPreviewData([
                { id: 1, name: "Profile Headline Scanner", description: "Verifies the presence of key industry keywords and role clarity." },
                { id: 2, name: "Summary & About Evaluator", description: "Checks for narrative engagement, contact callouts, and skill density." },
                { id: 3, name: "Work History Analyzer", description: "Validates action-verb usage, accomplishment metrics, and timeline continuity." },
                { id: 4, name: "Skills Matcher", description: "Compares listed technical skills against standard industry profiles." }
            ]);
            setPreviewLoading(false);
            return;
        }
        
        if (key === 'resume') {
            setPreviewData([
                { id: 1, name: "Single-Column Layout Format", description: "Ensures layout parses cleanly in all major ATS parsers." },
                { id: 2, name: "Section Headers Standardization", description: "Validates headers match industry standards (Experience, Education, Skills)." },
                { id: 3, name: "Keyword Density Scanning", description: "Matches resume descriptions with target job description terms." },
                { id: 4, name: "Action Verb Frequency", description: "Evaluates bullet point strength based on performance action verbs." }
            ]);
            setPreviewLoading(false);
            return;
        }

        let endpoint = '';
        if (key === 'coding') endpoint = '/api/public/coding';
        else if (key === 'interview') endpoint = '/api/public/interviews';
        else if (key === 'learning') endpoint = '/api/public/courses';
        else if (key === 'companies') endpoint = '/api/public/companies';

        try {
            const res = await axios.get(endpoint);
            setPreviewData(res.data || []);
        } catch (err) {
            console.error("Failed to load public preview data", err);
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(usernameOrEmail, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: Zap,      label: 'AI-Powered Interview Prep' },
        { icon: BookOpen, label: '111+ Structured Courses' },
        { icon: Shield,   label: '100 DSA Coding Challenges' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-slate-100 flex flex-col relative overflow-x-hidden transition-colors duration-300">
            {/* Floating Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-lg backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Split Screen Viewport */}
            <div className="flex items-stretch min-h-screen relative w-full overflow-hidden shrink-0">
                {/* Animated gradient orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                        className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/12 rounded-full blur-[90px]"
                    />
                    <motion.div
                        animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
                        className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-primary-500/8 rounded-full blur-[80px]"
                    />
                    {/* Grid overlay */}
                    <div className="absolute inset-0 grid-overlay" />
                </div>

                {/* Left panel — hero */}
                <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative z-10">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3"
                    >
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-sky-500/30">
                            CF
                        </div>
                        <div>
                            <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight">CareerForge</span>
                            <span className="block text-[10px] font-bold text-sky-500 dark:text-sky-400 uppercase tracking-widest">Career Platform</span>
                        </div>
                    </motion.div>

                    {/* Hero text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold px-4 py-2 rounded-full">
                            <Sparkles size={13} /> AI-Powered Career Ecosystem
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">
                            Land Your{' '}
                            <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-primary-500 dark:from-sky-400 dark:via-indigo-400 dark:to-primary-400 bg-clip-text text-transparent">
                                Dream Tech Job
                            </span>{' '}
                            Faster
                        </h1>
                        <p className="text-slate-650 dark:text-slate-400 text-lg leading-relaxed max-w-md font-medium">
                            Structured courses, AI mock interviews, real coding challenges, and company-specific preparation — all in one platform.
                        </p>

                        <div className="space-y-3 pt-2">
                            {features.map((f, i) => (
                                <motion.div
                                    key={f.label}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-650 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                        <f.icon size={15} />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm">{f.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Stats row */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="flex gap-8"
                    >
                        {[['111+','Courses'],['100+','DSA Problems'],['30+','Top Companies']].map(([val, lbl]) => (
                            <div key={lbl}>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">{val}</p>
                                <p className="text-xs text-slate-500 font-bold">{lbl}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-slate-200 dark:via-slate-700/50 to-transparent" />

                {/* Right panel — form */}
                <div className="flex-1 flex items-center justify-center p-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-md"
                    >
                        {/* Card */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/50 rounded-3xl p-8 shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-black/40">
                            {/* Mobile logo */}
                            <div className="lg:hidden flex items-center gap-2 mb-6">
                                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">CF</div>
                                <span className="font-black text-lg text-slate-900 dark:text-white">CareerForge</span>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Welcome back 👋</h2>
                                <p className="text-slate-650 dark:text-slate-400 text-sm mt-1.5 font-medium">Log in to continue your preparation journey</p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs rounded-xl p-3.5 mb-6 font-semibold flex items-start gap-2"
                                >
                                    <span className="text-rose-500 mt-0.5">⚠</span> {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Username field */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">
                                        Username or Email
                                    </label>
                                    <div className={`relative transition-all duration-200 ${focused === 'user' ? 'ring-2 ring-sky-500/30 rounded-xl' : ''}`}>
                                        <span className={`absolute inset-y-0 left-0 pl-3.5 flex items-center transition-colors ${focused === 'user' ? 'text-sky-550' : 'text-slate-450 dark:text-slate-550'}`}>
                                            <Mail size={16} />
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            value={usernameOrEmail}
                                            onChange={e => setUsernameOrEmail(e.target.value)}
                                            onFocus={() => setFocused('user')}
                                            onBlur={() => setFocused('')}
                                            placeholder="Enter email or username"
                                            className="w-full bg-slate-100/50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Password field */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">
                                        Password
                                    </label>
                                    <div className={`relative transition-all duration-200 ${focused === 'pass' ? 'ring-2 ring-sky-500/30 rounded-xl' : ''}`}>
                                        <span className={`absolute inset-y-0 left-0 pl-3.5 flex items-center transition-colors ${focused === 'pass' ? 'text-sky-550' : 'text-slate-450 dark:text-slate-550'}`}>
                                            <KeyRound size={16} />
                                        </span>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            onFocus={() => setFocused('pass')}
                                            onBlur={() => setFocused('')}
                                            placeholder="Enter password"
                                            className="w-full bg-slate-100/50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.01 }}
                                    whileTap={{ scale: loading ? 1 : 0.98 }}
                                    className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl py-3.5 text-sm font-bold shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                >
                                    {loading ? (
                                        <><Loader2 size={16} className="animate-spin" /> Verifying...</>
                                    ) : (
                                        <>Sign In to Platform <ArrowRight size={16} /></>
                                    )}
                                </motion.button>
                             </form>

                             <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
                                <p className="text-slate-500 dark:text-slate-500 text-sm font-medium">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-sky-550 dark:text-sky-400 font-bold hover:text-sky-655 dark:hover:text-sky-305 transition-colors">
                                        Create free account →
                                    </Link>
                                </p>
                            </div>

                            {/* Demo credentials hint */}
                            <div className="mt-4 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 rounded-xl p-3 text-center">
                                <div className="text-[10px] text-slate-500 dark:text-slate-550 font-semibold flex flex-wrap justify-center gap-x-2 gap-y-1">
                                    <span className="text-slate-650 dark:text-slate-400">Demo Logins:</span>
                                    <span>
                                        <span className="text-slate-800 dark:text-slate-305 font-black">student</span> / <span className="text-slate-800 dark:text-slate-305 font-black">password123</span>
                                    </span>
                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                    <span>
                                        <span className="text-slate-800 dark:text-slate-305 font-black">mentor</span> / <span className="text-slate-800 dark:text-slate-305 font-black">password123</span>
                                    </span>
                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                    <span>
                                        <span className="text-slate-800 dark:text-slate-305 font-black">admin</span> / <span className="text-slate-800 dark:text-slate-305 font-black">admin123</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Platform Information Section */}
            <div className="bg-slate-100/50 dark:bg-[#080B14] py-24 px-6 border-t border-slate-200 dark:border-slate-800/80 relative z-10 transition-colors duration-300">
                <div className="max-w-6xl mx-auto space-y-16">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-sky-600 via-indigo-650 to-primary-600 dark:from-sky-400 dark:via-indigo-400 dark:to-primary-400 bg-clip-text text-transparent tracking-tight leading-tight">
                            Engineered for Placement Success
                        </h2>
                        <p className="text-slate-650 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-semibold leading-relaxed">
                            Discover the cutting-edge modules and tools that make CareerForge the ultimate learning and interview preparation hub.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Feature 1 */}
                        <div 
                            onClick={() => handleOpenPreview('coding')}
                            className="bg-white dark:bg-slate-900/80 backdrop-blur-md p-8 border border-slate-200 dark:border-slate-800/80 rounded-3xl flex flex-col justify-between space-y-4 hover:border-primary-500/30 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300 cursor-pointer group"
                        >
                            <div>
                                <div className="h-12 w-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-6">
                                    <Code2 size={22} />
                                </div>
                                <h3 className="text-slate-900 dark:text-white text-lg font-extrabold flex items-center justify-between">
                                    Coding Arena
                                    <span className="text-[10px] text-primary-600 dark:text-primary-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Preview &rarr;</span>
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-semibold mt-2.5">
                                    Solve 100+ industry-standard DSA challenges. Write, compile, and run code in our local sandboxed execution engine supporting Python, Java, and JavaScript.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div 
                            onClick={() => handleOpenPreview('interview')}
                            className="bg-white dark:bg-slate-900/80 backdrop-blur-md p-8 border border-slate-200 dark:border-slate-800/80 rounded-3xl flex flex-col justify-between space-y-4 hover:border-sky-500/30 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300 cursor-pointer group"
                        >
                            <div>
                                <div className="h-12 w-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-655 dark:text-sky-400 flex items-center justify-center mb-6">
                                    <Bot size={22} />
                                </div>
                                <h3 className="text-slate-900 dark:text-white text-lg font-extrabold flex items-center justify-between">
                                    AI Interview Suite
                                    <span className="text-[10px] text-sky-650 dark:text-sky-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Preview &rarr;</span>
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-semibold mt-2.5">
                                    Practice customized mock interviews matching specific roles and technologies. Get real-time AI analytics, performance scoring, and feedback.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div 
                            onClick={() => handleOpenPreview('learning')}
                            className="bg-white dark:bg-slate-900/80 backdrop-blur-md p-8 border border-slate-200 dark:border-slate-800/80 rounded-3xl flex flex-col justify-between space-y-4 hover:border-emerald-500/30 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300 cursor-pointer group"
                        >
                            <div>
                                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                                    <BookOpen size={22} />
                                </div>
                                <h3 className="text-slate-900 dark:text-white text-lg font-extrabold flex items-center justify-between">
                                    Learning Center
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Preview &rarr;</span>
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-semibold mt-2.5">
                                    Gain complete domain mastery with 111+ structured pathways. Study detailed notes, watch video guides, and access multi-language search support.
                                </p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div 
                            onClick={() => handleOpenPreview('companies')}
                            className="bg-white dark:bg-slate-900/80 backdrop-blur-md p-8 border border-slate-200 dark:border-slate-800/80 rounded-3xl flex flex-col justify-between space-y-4 hover:border-amber-500/30 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300 cursor-pointer group"
                        >
                            <div>
                                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                                    <Building2 size={22} />
                                </div>
                                <h3 className="text-slate-900 dark:text-white text-lg font-extrabold flex items-center justify-between">
                                    Hiring Intelligence
                                    <span className="text-[10px] text-amber-655 dark:text-amber-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Preview &rarr;</span>
                                </h3>
                                <p className="text-slate-600 dark:text-slate-305 text-xs leading-relaxed font-semibold mt-2.5">
                                    Study comprehensive guides for 30+ top tech companies. Review recruitment pipelines, required stacks, eligibility criteria, and interview questions.
                                </p>
                            </div>
                        </div>

                        {/* Feature 5 */}
                        <div 
                            onClick={() => handleOpenPreview('linkedin')}
                            className="bg-white dark:bg-slate-900/80 backdrop-blur-md p-8 border border-slate-200 dark:border-slate-800/80 rounded-3xl flex flex-col justify-between space-y-4 hover:border-blue-500/30 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300 cursor-pointer group"
                        >
                            <div>
                                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                                    <Link2 size={22} />
                                </div>
                                <h3 className="text-slate-900 dark:text-white text-lg font-extrabold flex items-center justify-between">
                                    LinkedIn Profiler
                                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Preview &rarr;</span>
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-semibold mt-2.5">
                                    Analyze your professional presence and get intelligence reports to optimize your profile for technical recruiters.
                                </p>
                            </div>
                        </div>

                        {/* Feature 6 */}
                        <div 
                            onClick={() => handleOpenPreview('resume')}
                            className="bg-white dark:bg-slate-900/80 backdrop-blur-md p-8 border border-slate-200 dark:border-slate-800/80 rounded-3xl flex flex-col justify-between space-y-4 hover:border-teal-500/30 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300 cursor-pointer group"
                        >
                            <div>
                                <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
                                    <FileText size={22} />
                                </div>
                                <h3 className="text-slate-900 dark:text-white text-lg font-extrabold flex items-center justify-between">
                                    Resume Builder
                                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Preview &rarr;</span>
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-semibold mt-2.5">
                                    Build clean, ATS-compliant resumes with integrated format checks and optimization checklists. Download print-ready PDFs instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
               {/* Public Module Preview Modal */}
            <AnimatePresence>
                {previewKey && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPreviewKey(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        
                        {/* Modal Body */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl relative z-10 flex flex-col justify-between text-left transition-colors duration-300"
                        >
                            <div>
                                {/* Header */}
                                <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                                    <div>
                                        <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block mb-1">
                                            Platform Preview / Guest Mode
                                        </span>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white capitalize">
                                            {previewKey.replace('-', ' ')} Highlights
                                        </h3>
                                    </div>
                                    <button 
                                        onClick={() => setPreviewKey(null)}
                                        className="text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Content */}
                                {previewLoading ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                                        <Loader2 size={32} className="animate-spin text-sky-500 dark:text-sky-400" />
                                        <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Fetching related database content...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-slate-650 dark:text-slate-300 text-sm font-semibold mb-4">
                                            Explore premium preview metrics and items directly from our placement preparation engine:
                                        </p>
                                        <div className="grid gap-4 sm:grid-cols-2 max-h-[48vh] overflow-y-auto pr-1">
                                            {previewData.length > 0 ? (
                                                previewData.map((item, index) => {
                                                    if (previewKey === 'coding') {
                                                        return (
                                                            <div key={item.id || index} className="p-5 bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between gap-3 hover:border-primary-500/40 hover:bg-slate-200/60 dark:hover:bg-slate-900/60 transition-all group relative overflow-hidden">
                                                                <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-primary-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="h-8 w-8 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                                                                        <Code2 size={16} />
                                                                    </div>
                                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                                        item.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                                                        item.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                                                                        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                                                    }`}>
                                                                        {item.difficulty}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-bold text-slate-850 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors tracking-wide leading-snug">
                                                                        {item.title}
                                                                    </h4>
                                                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 block">
                                                                        {item.topicTags || 'Algorithmic DSA'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    if (previewKey === 'learning') {
                                                        return (
                                                            <div key={item.id || index} className="p-5 bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between gap-3 hover:border-emerald-500/40 hover:bg-slate-200/60 dark:hover:bg-slate-900/60 transition-all group relative overflow-hidden">
                                                                <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-650 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                                                        <BookOpen size={16} />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 rounded-full">
                                                                        {item.difficulty || 'All Levels'}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-bold text-slate-850 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors tracking-wide leading-snug">
                                                                        {item.title}
                                                                    </h4>
                                                                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-semibold mt-1">
                                                                        {item.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    if (previewKey === 'companies') {
                                                        return (
                                                            <div 
                                                                key={item.id || index} 
                                                                onClick={() => handleSelectCompany(item)}
                                                                className="p-5 bg-slate-100/50 dark:bg-slate-955/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between gap-4 hover:border-amber-500/40 hover:bg-slate-200/60 dark:hover:bg-slate-900/60 hover:scale-[1.01] active:scale-[0.99] transition-all group relative overflow-hidden cursor-pointer"
                                                            >
                                                                <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                <div className="flex items-center gap-3">
                                                                    <CompanyLogo company={item} className="h-10 w-10" />
                                                                    <div>
                                                                        <h4 className="text-sm font-extrabold text-slate-850 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors tracking-wide">
                                                                            {item.name}
                                                                        </h4>
                                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                                                                            {item.hiringRoles || 'Software Engineer'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80 pt-3">
                                                                    <div>
                                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase">Package</span>
                                                                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                                                            {item.salaryPackage?.toLowerCase().includes('lpa') ? item.salaryPackage : `${item.salaryPackage} LPA`}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase">Experience</span>
                                                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.experienceLevel || 'Fresher'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    if (previewKey === 'interview') {
                                                        return (
                                                            <div key={item.id || index} className="p-5 bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between gap-3 hover:border-sky-500/40 hover:bg-slate-200/60 dark:hover:bg-slate-900/60 transition-all group relative overflow-hidden">
                                                                <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-sky-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                                                                        <Bot size={16} />
                                                                    </div>
                                                                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 rounded-full">
                                                                        {item.type}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold leading-relaxed group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                                                                        "{item.question}"
                                                                    </p>
                                                                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-2 block">
                                                                        Difficulty: {item.difficulty}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    // Local check lists for resume and linkedin
                                                    return (
                                                        <div key={item.id || index} className="p-5 bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between gap-3 hover:border-sky-500/40 hover:bg-slate-200/60 dark:hover:bg-slate-900/60 transition-all group relative overflow-hidden">
                                                            <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-sky-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                                                                    <CheckCircle2 size={16} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-slate-850 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors tracking-wide leading-snug">
                                                                    {item.name}
                                                                </h4>
                                                                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-semibold mt-1">
                                                                    {item.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="py-12 text-center text-slate-500 text-xs font-semibold sm:col-span-2">
                                                    No preview content currently available.
                                                 </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Action CTA */}
                            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-[11px] text-slate-655 dark:text-slate-400 font-semibold text-center sm:text-left">
                                    Want to access the full workspace, interactive compiler tests, and personalized tracker metrics?
                                </p>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setPreviewKey(null)}
                                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-905 dark:text-slate-400 dark:hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <Link 
                                        to="/register"
                                        onClick={() => setPreviewKey(null)}
                                        className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl px-5 py-2.5 text-xs font-black shadow-lg shadow-sky-500/20 flex items-center gap-1.5 transition-all"
                                    >
                                        Register Now <ArrowRight size={13} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {selectedCompany && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-fadeIn">
                    <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-left transition-colors duration-300">
                        {/* Modal Head */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <CompanyLogo company={selectedCompany} className="h-14 w-14" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-extrabold text-xl text-white">{selectedCompany.name}</h2>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                                            {selectedCompany.industry || 'Technology'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-350 font-extrabold">
                                        {selectedCompany.hiringRoles} • {selectedCompany.salaryPackage?.toLowerCase().includes('lpa') ? selectedCompany.salaryPackage : `${selectedCompany.salaryPackage} LPA`}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedCompany(null)}
                                className="rounded-xl p-2 hover:bg-slate-800 text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex px-6 border-b border-slate-800 bg-slate-950/20">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`px-4 py-3 text-xs font-black border-b-2 transition-all ${activeTab === 'details' ? 'border-primary-500 text-primary-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                            >
                                Eligibility & Rounds
                            </button>
                            <button
                                onClick={() => setActiveTab('jobs')}
                                className={`px-4 py-3 text-xs font-black border-b-2 transition-all ${activeTab === 'jobs' ? 'border-primary-500 text-primary-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                            >
                                Active Job Positions ({selectedCompany.jobPostsCount || 3})
                            </button>
                            <button
                                onClick={() => setActiveTab('prep')}
                                className={`px-4 py-3 text-xs font-black border-b-2 transition-all ${activeTab === 'prep' ? 'border-primary-500 text-primary-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                            >
                                Preparation Q&As
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6 pb-12">
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
                                        <div className="p-5 bg-slate-100/50 dark:bg-slate-955/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl space-y-2">
                                            <h4 className="text-xs font-black text-slate-550 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                <Building2 size={14} className="text-primary-500 dark:text-primary-400" /> About The Company
                                            </h4>
                                            <p className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed font-bold">
                                                {selectedCompany.companyDescription || 'Leading technology recruiter offering placement opportunities for core platform engineering roles.'}
                                            </p>
                                        </div>

                                        {/* Stats Row */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-100/50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80">
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
                                                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                                                    <CheckCircle size={14} /> Active
                                                </span>
                                            </div>
                                        </div>

                                        {/* Main 2-Column Grid */}
                                        <div className="grid gap-6 md:grid-cols-2">
                                            {/* Left Column: Requirements & Info */}
                                            <div className="space-y-6">
                                                {/* Eligibility Box */}
                                                <div className="bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 space-y-3">
                                                    <h4 className="text-xs font-black text-slate-550 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                        <BookOpen size={14} className="text-primary-500 dark:text-primary-400" /> Academic Eligibility
                                                    </h4>
                                                    <p className="text-xs font-bold text-slate-655 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
                                                        {selectedCompany.eligibility}
                                                    </p>
                                                </div>

                                                {/* Tech Stack Box */}
                                                <div className="bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                                                    <h4 className="text-xs font-black text-slate-550 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                        <Layers size={14} className="text-primary-500 dark:text-primary-400" /> Required Tech Stack
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedCompany.requiredSkills.split(',').map((skill, i) => (
                                                            <span key={i} className="bg-primary-500/10 text-primary-650 dark:text-primary-400 text-xs font-black px-3.5 py-1.5 rounded-xl border border-primary-500/10 hover:border-primary-500/30 transition-all">
                                                                {skill.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Quick Details Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="p-4 bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 border border-primary-500/15">
                                                            <MapPin size={18} />
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Location</span>
                                                            <span className="text-xs font-black text-slate-800 dark:text-slate-200 leading-snug">{selectedCompany.jobLocation}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-450 flex items-center justify-center shrink-0 border border-rose-500/15">
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
                                                <div className="bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                                                    <h4 className="text-xs font-black text-slate-550 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                        <Clock size={14} className="text-primary-500 dark:text-primary-400" /> Interview & Hiring Rounds
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
                                                                    <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-primary-500/30 transition-all shadow-sm">
                                                                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 leading-relaxed block">{cleanRound}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Insights Box */}
                                                <div className="bg-sky-500/5 dark:bg-sky-500/10 rounded-2xl p-5 border border-sky-500/20 space-y-2">
                                                    <h4 className="text-xs font-black text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                                                        <TrendingUp size={14} /> AI Hiring Trend Insights
                                                    </h4>
                                                    <p className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed font-semibold">
                                                        {selectedCompany.hiringTrends || 'This company has increased hiring for full stack systems. Technical questions heavily focus on logical operations, database indexes, and OOP principles.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })() : activeTab === 'jobs' ? (
                                <div className="space-y-4">
                                    {[
                                        { title: "Software Engineer - Developer Platform", type: "Full-Time", code: "SWE-892", loc: selectedCompany.jobLocation.split(',')[0], applicants: Math.floor(selectedCompany.totalApplicants * 0.45), desc: "Develop and maintain core platform infrastructure. Design high-performance distributed REST APIs, and collaborate closely with product teams to build clean developer tools." },
                                        { title: "Associate Engineer - Cloud Native Solutions", type: "Full-Time", code: "ASE-302", loc: "Remote / Office Hybrid", applicants: Math.floor(selectedCompany.totalApplicants * 0.35), desc: "Architect solutions utilizing AWS/Azure services. Focus on building and managing scalable Docker and Kubernetes environments for microservice deployments." },
                                        { title: "Systems Quality Assurance Engineer", type: "Full-Time", code: "SQA-119", loc: selectedCompany.jobLocation.split(',')[0], applicants: Math.floor(selectedCompany.totalApplicants * 0.2), desc: "Build automated testing frameworks for multi-platform applications. Ensure robust integration, regression, and unit test execution for enterprise software suites." }
                                    ].slice(0, Math.min(3, selectedCompany.jobPostsCount || 3)).map((job, idx) => (
                                        <div key={job.code} className="bg-slate-100/50 dark:bg-slate-955/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-905 dark:text-white">{job.title}</h4>
                                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mt-0.5">Code: {job.code} • {job.loc} • {job.type}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-extrabold self-start sm:self-center">
                                                    <Users size={12} />
                                                    {job.applicants.toLocaleString()} Applied
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-655 dark:text-slate-300 leading-relaxed font-semibold">
                                                {job.desc}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {selectedCompany.requiredSkills.split(',').slice(0, 4).map((skill, i) => (
                                                    <span key={i} className="bg-slate-200 dark:bg-slate-800 text-[10px] font-black px-2.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {prepLoading ? (
                                        <div className="flex h-32 items-center justify-center">
                                            <Loader2 size={24} className="animate-spin text-primary-500" />
                                        </div>
                                    ) : prepQuestions.length === 0 ? (
                                        <div className="text-center py-12 bg-slate-100/50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                                            <BookOpen size={36} className="mx-auto text-slate-500 dark:text-slate-600 mb-3" />
                                            <h4 className="font-extrabold text-sm text-slate-600 dark:text-slate-350">No official prep questions configured yet</h4>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5">We will launch simulated practice patterns shortly.</p>
                                        </div>
                                    ) : (
                                        prepQuestions.map((q) => (
                                            <div key={q.id} className="bg-slate-100/50 dark:bg-slate-955/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${q.difficulty === 'HARD' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-500' : q.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500'}`}>
                                                        {q.difficulty}
                                                    </span>
                                                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">{q.type}</span>
                                                </div>
                                                <h4 className="text-xs font-black text-slate-900 dark:text-white flex gap-1.5">
                                                    <span className="text-primary-500 font-black shrink-0">Q:</span>
                                                    <span>{q.question}</span>
                                                </h4>
                                                <div className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed pt-2.5 border-t border-slate-200 dark:border-slate-800 flex gap-1.5 font-semibold">
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-black shrink-0">A:</span>
                                                    <div>
                                                        <span className="font-black text-slate-850 dark:text-white block mb-1">Answer Strategy:</span>
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
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100/50 dark:bg-slate-950/20 px-6">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold">
                                Preview Mode: Create an account to practice Q&As and apply
                            </span>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setSelectedCompany(null)}
                                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-905 dark:text-slate-400 dark:hover:text-white transition-colors"
                                >
                                    Close
                                </button>
                                <Link
                                    to="/register"
                                    onClick={() => setSelectedCompany(null)}
                                    className="bg-primary-500 hover:bg-primary-600 text-white rounded-xl px-5 py-2.5 text-xs font-black shadow-md shadow-primary-500/20 transition-all"
                                >
                                    Register & Apply Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Login;
