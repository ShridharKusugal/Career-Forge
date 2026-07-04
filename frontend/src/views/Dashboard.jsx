import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Award, BookOpen, CheckCircle, Flame, TrendingUp, 
    Compass, Briefcase, Loader2, Target, Zap, Brain,
    Code2, ArrowRight, Star, Clock, ChevronUp, Mail,
    RefreshCw, Check, ExternalLink, ShieldAlert, Calendar,
    UserCheck, Database, Server, ChevronDown, CheckSquare, X
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Animated counter hook
const useCounter = (target, duration = 1200) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!target) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return count;
};

const StatCard = ({ icon: Icon, label, value, suffix = '', color, trend, delay }) => {
    const animated = useCounter(typeof value === 'number' ? value : 0);
    const colorMap = {
        violet:  { bg: 'bg-primary-500/10 dark:bg-primary-500/15',  icon: 'text-primary-600 dark:text-primary-400',  border: 'border-primary-500/20' },
        emerald: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', icon: 'text-emerald-500', border: 'border-emerald-500/20' },
        cyan:    { bg: 'bg-cyan-500/10 dark:bg-cyan-500/15',       icon: 'text-cyan-500',    border: 'border-cyan-500/20' },
        amber:   { bg: 'bg-amber-500/10 dark:bg-amber-500/15',     icon: 'text-amber-500',   border: 'border-amber-500/20' },
    };
    const c = colorMap[color] || colorMap.sky;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`glass-card p-6 flex items-center justify-between border ${c.border}`}
        >
            <div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">{label}</span>
                <div className="flex items-end gap-1">
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white">{animated}{suffix}</h2>
                </div>
                {trend && (
                    <span className={`text-[11px] font-semibold flex items-center gap-1 mt-1.5 ${c.icon}`}>
                        <ChevronUp size={12} /> {trend}
                    </span>
                )}
            </div>
            <div className={`h-12 w-12 rounded-2xl ${c.bg} ${c.icon} flex items-center justify-center`}>
                <Icon size={24} />
            </div>
        </motion.div>
    );
};

const SkillBar = ({ label, percent, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.35 }}
        className="space-y-1.5"
    >
        <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
            <span className="text-xs font-black text-slate-600 dark:text-slate-400">{percent}%</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.9, delay: delay + 0.2, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${color}`}
            />
        </div>
    </motion.div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [progressList, setProgressList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Job tracking states
    const [applications, setApplications] = useState([]);
    const [emailIntegrations, setEmailIntegrations] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null); // application details map
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [syncingEmail, setSyncingEmail] = useState(false);
    const [syncLogs, setSyncLogs] = useState([]);
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [connectForm, setConnectForm] = useState({ provider: 'gmail', emailAddress: '' });
    const [confirmingApp, setConfirmingApp] = useState(null);
    const [activeTab, setActiveTab] = useState('tracking'); // tracking | emailSync

    const fetchDashboardData = async () => {
        try {
            const [recsRes, progRes, appsRes, intsRes] = await Promise.all([
                axios.get('/api/ai/recommendations'),
                axios.get('/api/domains/progress'),
                axios.get('/api/jobs/applications').catch(() => ({ data: [] })),
                axios.get('/api/email/status').catch(() => ({ data: [] }))
            ]);
            setStats(recsRes.data);
            setProgressList(progRes.data);
            setApplications(appsRes.data || []);
            setEmailIntegrations(intsRes.data || []);
        } catch (error) {
            console.error("Error loading dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Fetch details of selected application (timeline, interviews, assessments)
    const handleViewAppDetails = async (appId) => {
        if (selectedAppId === appId) {
            setSelectedAppId(null);
            setSelectedApp(null);
            return;
        }
        setSelectedAppId(appId);
        try {
            const res = await axios.get(`/api/jobs/applications/${appId}/details`);
            setSelectedApp(res.data);
        } catch (error) {
            console.error("Error loading application details", error);
        }
    };

    // Confirm submission manual verification prompt
    const handleConfirmApplied = async (appId, notes = "User confirmed application submission manually") => {
        try {
            await axios.post(`/api/jobs/applications/${appId}/status`, {
                status: 'APPLIED',
                notes: notes
            });
            setConfirmingApp(null);
            // Refresh
            fetchDashboardData();
            if (selectedAppId === appId) {
                // reload details
                const res = await axios.get(`/api/jobs/applications/${appId}/details`);
                setSelectedApp(res.data);
            }
        } catch (error) {
            console.error("Error updating status to applied", error);
        }
    };

    // Trigger mock email synchronization
    const handleSyncInbox = async () => {
        if (emailIntegrations.length === 0) {
            setShowConnectModal(true);
            return;
        }
        setSyncingEmail(true);
        setSyncLogs([]);
        try {
            const res = await axios.post('/api/email/sync');
            if (res.data && res.data.logs) {
                setSyncLogs(res.data.logs);
            }
            // Refresh dashboard
            fetchDashboardData();
        } catch (error) {
            console.error("Error syncing inbox", error);
        } finally {
            setSyncingEmail(false);
        }
    };

    // Connect simulated email account
    const handleConnectEmail = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/email/connect', connectForm);
            setShowConnectModal(false);
            setConnectForm({ provider: 'gmail', emailAddress: '' });
            fetchDashboardData();
        } catch (error) {
            console.error("Error connecting email", error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center flex-col gap-3">
                <Loader2 size={36} className="animate-spin text-primary-500" />
                <p className="text-sm font-semibold text-slate-400">Loading your dashboard...</p>
            </div>
        );
    }

    const activityData = [
        { day: 'Mon', mins: 45 },
        { day: 'Tue', mins: 60 },
        { day: 'Wed', mins: 30 },
        { day: 'Thu', mins: 90 },
        { day: 'Fri', mins: 75 },
        { day: 'Sat', mins: 120 },
        { day: 'Sun', mins: 95 }
    ];
    const barColors = [
        '#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'
    ];

    const coursesCompleted = progressList.filter(p => p.entityType === 'COURSE' && p.status === 'COMPLETED').length;
    const testsCompleted   = progressList.filter(p => p.entityType === 'MOCK_TEST' && p.status === 'COMPLETED').length;
    const codingCompleted  = progressList.filter(p => p.entityType === 'CODING_PROBLEM' && p.status === 'COMPLETED').length;
    const readiness        = stats?.readinessScore || 0;

    // 6-week performance trend
    const chartData = [
        { name: 'Wk 1', score: Math.max(30, readiness - 35), tests: 2 },
        { name: 'Wk 2', score: Math.max(38, readiness - 28), tests: 4 },
        { name: 'Wk 3', score: Math.max(45, readiness - 20), tests: 5 },
        { name: 'Wk 4', score: Math.max(52, readiness - 14), tests: 7 },
        { name: 'Wk 5', score: Math.max(58, readiness - 7),  tests: 6 },
        { name: 'Wk 6', score: readiness,                     tests: 9 },
    ];

    // Domain proficiency bars
    const skills = [
        { label: 'Data Structures & Algorithms', percent: Math.min(95, codingCompleted * 3 + 30), color: 'from-sky-400 to-blue-500' },
        { label: 'System Design',                percent: Math.min(90, readiness - 5),            color: 'from-primary-400 to-primary-600' },
        { label: 'Full Stack Development',       percent: Math.min(92, coursesCompleted * 4 + 20), color: 'from-emerald-400 to-teal-500' },
        { label: 'Mock Interview Performance',   percent: stats?.interviewsCompleted > 0 ? stats.averageInterviewScore : Math.min(88, testsCompleted * 6 + 35),  color: 'from-amber-400 to-orange-500' },
        { label: 'Aptitude & Reasoning',         percent: Math.min(85, readiness - 8),            color: 'from-rose-400 to-pink-500' },
    ];

    const iconMapping = {
        Code2: Code2,
        Brain: Brain,
        BookOpen: BookOpen,
        Target: Target
    };

    const backendNextSteps = stats?.nextSteps?.map(step => ({
        icon: iconMapping[step.icon] || Target,
        label: step.label,
        tag: step.tag,
        color: step.color
    }));

    const nextSteps = backendNextSteps && backendNextSteps.length > 0 ? backendNextSteps : [
        { icon: Code2,  label: 'Solve 3 Medium DSA problems', tag: 'Coding Arena',   color: 'sky' },
        { icon: Brain,  label: 'Complete System Design Mock', tag: 'Mock Interview',  color: 'indigo' },
        { icon: BookOpen, label: 'Finish Redis & Caching course', tag: 'Learning',    color: 'emerald' },
        { icon: Target, label: 'Take Full Stack Assessment',   tag: 'Mock Tests',     color: 'amber' },
    ];

    const handleNextStepClick = (tag) => {
        const routes = {
            'Coding Arena': '/coding',
            'Mock Interview': '/interview',
            'Learning': '/learning',
            'Mock Tests': '/tests'
        };
        const targetRoute = routes[tag];
        if (targetRoute) {
            navigate(targetRoute);
        }
    };

    const getStatusStyles = (status) => {
        switch (status?.toUpperCase()) {
            case 'STARTED':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
            case 'APPLIED':
                return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
            case 'ASSESSMENT_RECEIVED':
                return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
            case 'INTERVIEW_SCHEDULED':
                return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
            case 'OFFER_RECEIVED':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            case 'REJECTED':
                return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
            default:
                return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="space-y-8 pb-16"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-accent-500 to-primary-500 dark:from-primary-400 dark:via-accent-300 dark:to-primary-300 bg-clip-text text-transparent tracking-tight">
                    Career Dashboard
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                    Your real-time preparation metrics, skill proficiency, and AI-powered study plan.
                </p>
            </motion.div>

            {/* KPI Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Award}   label="Readiness Score" value={readiness}       suffix="%" color="violet"  trend="+12% this week"    delay={0.05} />
                <StatCard icon={BookOpen} label="Courses Done"   value={coursesCompleted} suffix=""  color="emerald" trend="Active progress"    delay={0.10} />
                <StatCard icon={Code2}   label="Coding Solved"   value={codingCompleted}  suffix=""  color="cyan"    trend="Practice sandbox"   delay={0.15} />
                <StatCard icon={Flame}   label="Prep Streak"     value={stats?.learningStreak || 0} suffix=" days" color="amber" trend="Keep it up!" delay={0.20} />
            </div>

            {/* Main Application Tracking System Row */}
            <div className="glass-card p-6 border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                        <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                            <Briefcase className="text-primary-500" size={20} /> Direct Application Lifecycle Center
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                            Track external company board application states, verify submissions, and sync hiring emails.
                        </p>
                    </div>
                    
                    {/* Mode Navigation */}
                    <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800 shrink-0">
                        <button
                            onClick={() => setActiveTab('tracking')}
                            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${activeTab === 'tracking' ? 'bg-white dark:bg-slate-850 text-slate-850 dark:text-white shadow-sm' : 'text-slate-500'}`}
                        >
                            Applications ({applications.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('emailSync')}
                            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${activeTab === 'emailSync' ? 'bg-white dark:bg-slate-850 text-slate-850 dark:text-white shadow-sm' : 'text-slate-500'}`}
                        >
                            Email Verification ({emailIntegrations.length > 0 ? 'Connected' : 'Configure'})
                        </button>
                    </div>
                </div>

                {activeTab === 'tracking' ? (
                    <div className="space-y-4 animate-fadeIn">
                        {applications.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                <Mail className="mx-auto text-slate-400 mb-3" size={32} />
                                <h4 className="text-xs font-black text-slate-800 dark:text-white">No active application sessions tracked</h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">Apply to jobs in the Hiring Intelligence dashboard to kickstart verification.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {applications.map((app) => (
                                    <div key={app.id} className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 transition-all">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className="text-xs font-black text-slate-850 dark:text-white">{app.jobTitle}</h4>
                                                    <span className="text-[9px] font-black uppercase text-slate-400">Code: {app.jobCode || 'DIR-101'}</span>
                                                </div>
                                                <div className="text-[11px] font-bold text-slate-500">
                                                    Company: <span className="font-extrabold text-slate-700 dark:text-slate-300">{app.companyName || 'Corporate Partner'}</span>
                                                </div>
                                            </div>

                                            {/* Stepper Status Indicators */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl border uppercase tracking-wider ${getStatusStyles(app.status)}`}>
                                                    {app.status?.replace('_', ' ')}
                                                </span>

                                                {app.status === 'STARTED' && (
                                                    <button
                                                        onClick={() => setConfirmingApp(app)}
                                                        className="text-[10px] font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-3 py-1.5 rounded-xl transition-all shadow-sm hover:translate-y-[-1px]"
                                                    >
                                                        Confirm Applied
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleViewAppDetails(app.id)}
                                                    className="text-[10px] font-extrabold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all"
                                                >
                                                    {selectedAppId === app.id ? 'Hide Details' : 'View Timeline'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Timeline Details */}
                                        <AnimatePresence>
                                            {selectedAppId === app.id && selectedApp && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-850 space-y-4 overflow-hidden"
                                                >
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        {/* Status Timeline logs */}
                                                        <div className="space-y-3">
                                                            <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                                                <Clock size={12} /> Status History Logs
                                                            </h5>
                                                            <div className="space-y-2 border-l border-slate-200 dark:border-slate-800 pl-4 ml-2">
                                                                {selectedApp.history && selectedApp.history.map((h, i) => (
                                                                    <div key={i} className="relative text-[11px] font-semibold text-slate-700 dark:text-slate-350">
                                                                        <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary-500 border-2 border-white dark:border-slate-900" />
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="font-extrabold uppercase text-slate-850 dark:text-white text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200/50">
                                                                                {h.status}
                                                                            </span>
                                                                            <span className="text-[9px] text-slate-400">
                                                                                {new Date(h.updated_at).toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                        <p className="mt-0.5 text-slate-500 font-medium text-[10px]">{h.notes}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Assessments and Interviews */}
                                                        <div className="space-y-4">
                                                            {/* Assessments */}
                                                            {selectedApp.assessments && selectedApp.assessments.length > 0 && (
                                                                <div className="space-y-2 bg-indigo-500/5 dark:bg-indigo-500/10 p-3.5 rounded-2xl border border-indigo-500/10">
                                                                    <h5 className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                                                        <Target size={12} /> Technical Online Assessments
                                                                    </h5>
                                                                    {selectedApp.assessments.map((a, i) => (
                                                                        <div key={i} className="text-[11px] space-y-1">
                                                                            <div className="font-bold text-slate-800 dark:text-slate-100">{a.test_name}</div>
                                                                            <div className="text-[10px] text-slate-500 flex justify-between">
                                                                                <span>Deadline: {new Date(a.deadline).toLocaleDateString()}</span>
                                                                                <span className="font-extrabold uppercase text-indigo-500">{a.status}</span>
                                                                            </div>
                                                                            {a.score && (
                                                                                <div className="text-[10px] font-black text-emerald-500">
                                                                                    Score: {a.score}/100
                                                                                </div>
                                                                            )}
                                                                            {a.status === 'RECEIVED' && (
                                                                                <a
                                                                                    href={a.test_url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="inline-flex items-center gap-1 mt-1 text-[10px] font-black text-primary-500 hover:underline"
                                                                                >
                                                                                    Launch Coding Platform <ExternalLink size={10} />
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Interviews */}
                                                            {selectedApp.interviews && selectedApp.interviews.length > 0 && (
                                                                <div className="space-y-2 bg-purple-500/5 dark:bg-purple-500/10 p-3.5 rounded-2xl border border-purple-500/10">
                                                                    <h5 className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                                                                        <Calendar size={12} /> Scheduled Mock / Tech Interviews
                                                                    </h5>
                                                                    {selectedApp.interviews.map((int, i) => (
                                                                        <div key={i} className="text-[11px] space-y-1">
                                                                            <div className="font-bold text-slate-850 dark:text-slate-100">{int.round_name}</div>
                                                                            <div className="text-[10px] text-slate-500">
                                                                                Time: {new Date(int.scheduled_time).toLocaleString()}
                                                                            </div>
                                                                            <div className="flex items-center justify-between pt-1">
                                                                                <span className="text-[9px] font-black uppercase bg-purple-500/10 text-purple-600 px-1.5 py-0.5 rounded">
                                                                                    {int.status}
                                                                                </span>
                                                                                {int.meeting_link && (
                                                                                    <a
                                                                                        href={int.meeting_link}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="inline-flex items-center gap-1 text-[10px] font-black text-primary-500 hover:underline"
                                                                                    >
                                                                                        Join Google Meet <ExternalLink size={10} />
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-5 animate-fadeIn">
                        {/* Connection status header */}
                        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Connected Mailbox</span>
                                    {emailIntegrations.length > 0 ? (
                                        <div className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5 mt-0.5">
                                            {emailIntegrations[0].email_address}
                                            <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">Active</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-bold text-slate-550 block mt-0.5">No email connected</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowConnectModal(true)}
                                    className="text-[10px] font-extrabold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-all shrink-0"
                                >
                                    {emailIntegrations.length > 0 ? 'Change Email' : 'Connect Account'}
                                </button>
                                <button
                                    onClick={handleSyncInbox}
                                    disabled={syncingEmail || emailIntegrations.length === 0}
                                    className={`text-[10px] font-black px-4.5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 ${
                                        emailIntegrations.length === 0
                                            ? 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                                            : 'bg-primary-500 hover:bg-primary-600 text-white hover:translate-y-[-1px] shadow-primary-500/10'
                                    }`}
                                >
                                    {syncingEmail ? (
                                        <>Scanning Inbox... <Loader2 size={12} className="animate-spin" /></>
                                    ) : (
                                        <>Sync & Scan Mailbox <RefreshCw size={12} /></>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Scanner Sync logs */}
                        {syncLogs.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                    <Database size={14} className="text-primary-500" /> Synced Inbox Scraped Records
                                </h4>
                                <div className="space-y-2.5">
                                    {syncLogs.map((log, i) => (
                                        <div key={i} className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 p-4 rounded-2xl space-y-2 animate-fadeIn">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div>
                                                    <span className="text-[9px] font-black uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                                                        {log.resolvedAction}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 block mt-1">From: {log.from}</span>
                                                </div>
                                                <span className="text-[9px] text-slate-400">{new Date(log.receivedAt).toLocaleTimeString()}</span>
                                            </div>
                                            <h5 className="text-[11px] font-extrabold text-slate-800 dark:text-white">Subject: {log.subject}</h5>
                                            <p className="text-[10px] font-semibold text-slate-500 leading-relaxed bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-850">
                                                {log.body}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Informational Panel */}
                        <div className="bg-sky-500/5 border border-sky-500/15 p-4 rounded-2xl flex items-start gap-3">
                            <ShieldAlert className="text-sky-500 shrink-0 mt-0.5" size={16} />
                            <div className="space-y-1">
                                <h5 className="text-xs font-black text-sky-700 dark:text-sky-400">Security & OAuth Authentication Note</h5>
                                <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">
                                    TechnoCrate integrates Gmail/Outlook verification via secure read-only token queries. We run a background natural-language scan for sender domains (e.g. greenhouse.io, lever.co, workdayjobs.com, oracle.com) matching job confirmation templates. No private messages or personal databases are indexed.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* 6-Week Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="glass-card p-6 lg:col-span-2 space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-extrabold text-base flex items-center gap-2">
                                <TrendingUp className="text-sky-500" size={18} /> Performance Trend
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5 font-medium">6-week readiness score progression</p>
                        </div>
                        <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            +{Math.max(5, readiness - 40)}% growth
                        </span>
                    </div>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.92)', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                                <Area type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" dot={{ fill: '#7c3aed', r: 4 }} activeDot={{ r: 6 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Weekly Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 space-y-4"
                >
                    <div>
                        <h3 className="font-extrabold text-base flex items-center gap-2">
                            <Zap className="text-amber-500" size={18} /> Weekly Activity
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">Study minutes per day</p>
                    </div>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.92)', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                                <Bar dataKey="mins" radius={[6,6,0,0]}>
                                    {activityData.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Skill Proficiency + AI Panel Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Skill Bars */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="glass-card p-6 lg:col-span-2 space-y-5"
                >
                    <h3 className="font-extrabold text-base flex items-center gap-2">
                        <Brain className="text-violet-500" size={18} /> Skill Proficiency Index
                    </h3>
                    <div className="space-y-4">
                        {skills.map((s, i) => (
                            <SkillBar key={s.label} label={s.label} percent={s.percent} color={s.color} delay={0.4 + i * 0.06} />
                        ))}
                    </div>
                </motion.div>

                {/* AI Recommendations */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 space-y-5"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base flex items-center gap-2">
                            <Compass className="text-sky-500" size={18} /> AI Recommender
                        </h3>
                        <span className="text-[9px] font-black text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20 uppercase tracking-wider">Live</span>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-2">Career Paths</span>
                            {stats?.recommendedDomains?.map((d, i) => (
                                <div key={i} className="flex items-center gap-2 bg-gradient-to-r from-primary-500/5 to-indigo-500/5 border border-primary-500/10 rounded-xl px-3 py-2 mb-2">
                                    <Star size={12} className="text-primary-500 shrink-0" />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{d}</span>
                                </div>
                            ))}
                        </div>

                        <div>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-2">Suggested Skills</span>
                            <div className="flex flex-wrap gap-1.5">
                                {stats?.suggestedSkills?.map((s, i) => (
                                    <span key={i} className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-500/15">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-2">Company Match</span>
                            <div className="flex items-center gap-2.5">
                                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                    <Briefcase size={16} />
                                </div>
                                <span className="text-sm font-black text-slate-800 dark:text-white">{stats?.companyMatchPrediction}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* What to Study Next */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6 space-y-4"
            >
                <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base flex items-center gap-2">
                        <Target className="text-rose-500" size={18} /> AI Study Plan — Next Steps
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <Clock size={11} /> Updated today
                    </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {nextSteps.map((step, i) => {
                        const colorMap = {
                            sky:     'from-sky-500/10 to-sky-500/5 border-sky-500/20 text-sky-600 dark:text-sky-400',
                            indigo:  'from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400',
                            emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
                            amber:   'from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400',
                        };
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55 + i * 0.05 }}
                                whileHover={{ y: -3, scale: 1.02 }}
                                onClick={() => handleNextStepClick(step.tag)}
                                className={`flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br border cursor-pointer select-none ${colorMap[step.color]}`}
                            >
                                <step.icon size={20} className="shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-white leading-snug">{step.label}</p>
                                    <span className="text-[10px] font-black uppercase tracking-wider opacity-70 mt-1 block">{step.tag}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Verification / Connect Email Modal */}
            {showConnectModal && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-black text-slate-850 dark:text-white flex items-center gap-2">
                                <Mail className="text-primary-500" size={18} /> Connect Simulated Email Account
                            </h3>
                            <button 
                                onClick={() => setShowConnectModal(false)}
                                className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleConnectEmail} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase block">Provider</label>
                                <select
                                    value={connectForm.provider}
                                    onChange={(e) => setConnectForm(prev => ({ ...prev, provider: e.target.value }))}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs font-bold py-2.5 px-3 rounded-xl focus:outline-none"
                                >
                                    <option value="gmail">Google (Gmail)</option>
                                    <option value="outlook">Microsoft (Outlook)</option>
                                    <option value="yahoo">Yahoo Mail</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase block">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="yourname@domain.com"
                                    value={connectForm.emailAddress}
                                    onChange={(e) => setConnectForm(prev => ({ ...prev, emailAddress: e.target.value }))}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs font-bold py-2.5 px-3 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full text-xs font-black bg-primary-500 hover:bg-primary-600 text-white py-2.5 rounded-xl transition-all shadow-md shadow-primary-500/10"
                            >
                                Connect & Authenticate via OAuth
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Manual Status Confirmation Prompt */}
            {confirmingApp && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-black text-slate-850 dark:text-white flex items-center gap-2">
                                <CheckSquare className="text-emerald-500" size={18} /> Confirm Job Application Submission
                            </h3>
                            <button 
                                onClick={() => setConfirmingApp(null)}
                                className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                                You are about to manually verify that you successfully completed the application form on the official careers page of <span className="font-extrabold text-slate-700 dark:text-slate-300">{confirmingApp.companyName}</span> for the role <span className="font-extrabold text-slate-700 dark:text-slate-300">{confirmingApp.jobTitle}</span>.
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border">
                                This will transition the tracking status to <span className="text-sky-500 font-black">APPLIED</span>, unlock learning points, and schedule placement simulation timelines.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setConfirmingApp(null)}
                                className="flex-1 text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleConfirmApplied(confirmingApp.id)}
                                className="flex-1 text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2.5 rounded-xl transition-all shadow-md"
                            >
                                Confirm Submitted
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Dashboard;
