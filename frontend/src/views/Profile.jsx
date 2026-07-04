import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    UserCircle, Code2, BookOpen, Trophy, Star, Award, Edit3,
    Plus, X, GitBranch, Link2, Globe, MapPin, Briefcase,
    CheckCircle, BarChart2, Zap, Target, Save, Camera
} from 'lucide-react';

const SKILL_SUGGESTIONS = [
    'Java', 'Python', 'JavaScript', 'TypeScript', 'React', 'Spring Boot',
    'Node.js', 'MySQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS',
    'System Design', 'DSA', 'Git', 'REST APIs', 'GraphQL', 'Redis',
    'C++', 'Go', 'Kotlin', 'Flutter', 'Machine Learning', 'TensorFlow'
];

const BADGE_LIST = [
    { id: 'first_test', label: 'First Test Taken', icon: '🎯', color: 'violet' },
    { id: 'coder',      label: '10 Problems Solved', icon: '💻', color: 'cyan' },
    { id: 'learner',    label: 'Course Completed', icon: '📚', color: 'emerald' },
    { id: 'interviewer',label: 'Mock Interview Done', icon: '🎤', color: 'amber' },
    { id: 'builder',    label: 'Resume Created', icon: '📄', color: 'rose' },
    { id: 'top10',      label: 'Top 10 Leaderboard', icon: '🏆', color: 'yellow' },
];

const Profile = () => {
    const { user } = useAuth();
    const [progress, setProgress] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [applications, setApplications] = useState([]);
    const [skills, setSkills] = useState(() => {
        try { return JSON.parse(localStorage.getItem('cf_skills') || '["Java","React","DSA"]'); } catch { return ['Java','React','DSA']; }
    });
    const [bio, setBio] = useState(() => localStorage.getItem('cf_bio') || 'Aspiring Software Engineer | Passionate about DSA, Full Stack Development & System Design.');
    const [goal, setGoal] = useState(() => localStorage.getItem('cf_goal') || 'Land a role at a top-tier tech company');
    const [github, setGithub] = useState(() => localStorage.getItem('cf_github') || '');
    const [linkedin, setLinkedin] = useState(() => localStorage.getItem('cf_linkedin') || '');
    const [website, setWebsite] = useState(() => localStorage.getItem('cf_website') || '');
    const [location, setLocation] = useState(() => localStorage.getItem('cf_location') || 'Bangalore, India');
    const [college, setCollege] = useState(() => localStorage.getItem('cf_college') || '');
    const [editing, setEditing] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get('/api/domains/progress').catch(() => ({ data: [] })),
            axios.get('/api/mock-tests/leaderboard').catch(() => ({ data: [] })),
            axios.get('/api/jobs/applications').catch(() => ({ data: [] }))
        ]).then(([progressRes, lbRes, appRes]) => {
            setProgress(progressRes.data || []);
            setLeaderboard(lbRes.data || []);
            setApplications(appRes.data || []);
        }).finally(() => setLoading(false));
    }, []);

    const save = () => {
        localStorage.setItem('cf_bio', bio);
        localStorage.setItem('cf_goal', goal);
        localStorage.setItem('cf_skills', JSON.stringify(skills));
        localStorage.setItem('cf_github', github);
        localStorage.setItem('cf_linkedin', linkedin);
        localStorage.setItem('cf_website', website);
        localStorage.setItem('cf_location', location);
        localStorage.setItem('cf_college', college);
        setEditing(false);
    };

    const addSkill = (s) => {
        const sk = (s || newSkill).trim();
        if (sk && !skills.includes(sk)) setSkills(prev => [...prev, sk]);
        setNewSkill('');
    };
    const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

    const coursesCompleted = progress.filter(p => p.entityType === 'COURSE' && p.status === 'COMPLETED').length;
    const testsCompleted   = progress.filter(p => p.entityType === 'MOCK_TEST' && p.status === 'COMPLETED').length;
    const codingSolved     = progress.filter(p => p.entityType === 'CODING_PROBLEM' && p.status === 'COMPLETED').length;
    const myRank = leaderboard.find(r => r.username === user?.username)?.rank;
    const earnedBadges = BADGE_LIST.filter(b => {
        if (b.id === 'first_test')    return testsCompleted >= 1;
        if (b.id === 'coder')         return codingSolved >= 10;
        if (b.id === 'learner')       return coursesCompleted >= 1;
        if (b.id === 'interviewer')   return !!localStorage.getItem('careerforge_interview_history');
        if (b.id === 'top10')         return myRank && myRank <= 10;
        return false;
    });

    const statCards = [
        { label: 'Courses Done',  value: coursesCompleted, icon: BookOpen, color: 'primary' },
        { label: 'Tests Taken',   value: testsCompleted,   icon: Trophy,   color: 'amber' },
        { label: 'Code Solved',   value: codingSolved,     icon: Code2,    color: 'cyan' },
        { label: 'Global Rank',   value: myRank ? `#${myRank}` : 'N/A', icon: BarChart2, color: 'emerald' },
    ];

    const colorMap = { primary:'from-primary-500 to-primary-600', violet:'from-violet-500 to-purple-500', amber:'from-amber-500 to-orange-500', cyan:'from-cyan-500 to-teal-500', emerald:'from-emerald-500 to-green-500' };
    const badgeColor = { primary:'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300', violet:'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300', cyan:'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300', emerald:'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300', amber:'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300', rose:'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300', yellow:'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' };

    return (
        <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-accent-500 to-primary-500 bg-clip-text text-transparent">My Profile</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">Showcase your skills, track achievements, and manage your career profile.</p>
                </div>
                <button onClick={() => editing ? save() : setEditing(true)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${editing ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/20'}`}>
                    {editing ? <><Save size={16} /> Save Profile</> : <><Edit3 size={16} /> Edit Profile</>}
                </button>
            </div>

            {/* Profile Hero */}
            <div className="glass-card p-8 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 border border-primary-500/20">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <div className="relative group shrink-0">
                        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-primary-500/30">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md cursor-pointer hover:bg-emerald-600 transition-colors">
                            <Camera size={13} className="text-white" />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-3">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{user?.username}</h2>
                            <p className="text-sm text-violet-500 font-bold">{user?.email}</p>
                        </div>

                        {editing ? (
                            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-violet-200 dark:border-violet-800 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-violet-500"
                                placeholder="Write your bio..." />
                        ) : (
                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{bio}</p>
                        )}

                        {/* Meta row */}
                        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                            {editing ? (
                                <>
                                    <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="bg-slate-100 dark:bg-slate-800 rounded-lg px-2.5 py-1 text-xs w-36 focus:outline-none" />
                                    <input value={college} onChange={e => setCollege(e.target.value)} placeholder="College / Company" className="bg-slate-100 dark:bg-slate-800 rounded-lg px-2.5 py-1 text-xs w-44 focus:outline-none" />
                                </>
                            ) : (
                                <>
                                    {location && <span className="flex items-center gap-1"><MapPin size={12} className="text-violet-500" />{location}</span>}
                                    {college && <span className="flex items-center gap-1"><Briefcase size={12} className="text-cyan-500" />{college}</span>}
                                </>
                            )}
                            <span className="flex items-center gap-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2.5 py-1 rounded-full font-black uppercase text-[10px] tracking-wider">
                                {user?.role}
                            </span>
                        </div>

                        {/* Social links */}
                        {editing ? (
                            <div className="flex flex-wrap gap-2">
                                <input value={github} onChange={e => setGithub(e.target.value)} placeholder="GitHub URL" className="bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 text-xs w-52 focus:outline-none" />
                                <input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="LinkedIn URL" className="bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 text-xs w-52 focus:outline-none" />
                                <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="Portfolio URL" className="bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 text-xs w-44 focus:outline-none" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                {github && <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-violet-600 transition-colors"><GitBranch size={14} />GitHub</a>}
                                {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"><Link2 size={14} />LinkedIn</a>}
                                {website && <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-cyan-600 transition-colors"><Globe size={14} />Portfolio</a>}
                            </div>
                        )}
                    </div>

                    {/* Goal Card */}
                    <div className="shrink-0 w-full sm:w-64 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-5 text-white shadow-lg shadow-primary-500/20">
                        <div className="flex items-center gap-2 mb-3"><Target size={16} /><span className="font-black text-xs uppercase tracking-wider">Career Goal</span></div>
                        {editing ? (
                            <input value={goal} onChange={e => setGoal(e.target.value)}
                                className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm font-bold text-white placeholder-white/60 focus:outline-none border border-white/20" />
                        ) : (
                            <p className="text-sm font-bold leading-relaxed">{goal}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <motion.div key={i} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}
                            className="glass-card p-5 text-center hover:shadow-lg transition-shadow">
                            <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${colorMap[s.color]} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                                <Icon size={18} className="text-white" />
                            </div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</div>
                            <div className="text-xs text-slate-500 font-semibold mt-0.5">{s.label}</div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skills */}
                <div className="glass-card p-6 space-y-4">
                    <h3 className="font-extrabold text-sm flex items-center gap-2"><Zap size={16} className="text-violet-500" />Tech Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map(sk => (
                            <span key={sk} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold rounded-full">
                                {sk}
                                {editing && <button onClick={() => removeSkill(sk)} className="ml-0.5 hover:text-rose-500"><X size={11} /></button>}
                            </span>
                        ))}
                        {editing && (
                            <div className="flex items-center gap-2">
                                <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key==='Enter' && addSkill()}
                                    placeholder="Add skill..." className="bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1.5 text-xs w-28 focus:outline-none" />
                                <button onClick={() => addSkill()} className="h-7 w-7 rounded-full bg-violet-600 text-white flex items-center justify-center"><Plus size={13} /></button>
                            </div>
                        )}
                    </div>
                    {editing && (
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Quick Add</p>
                            <div className="flex flex-wrap gap-1.5">
                                {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 10).map(s => (
                                    <button key={s} onClick={() => addSkill(s)} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Achievements / Badges */}
                <div className="glass-card p-6 space-y-4">
                    <h3 className="font-extrabold text-sm flex items-center gap-2"><Award size={16} className="text-amber-500" />Achievements & Badges</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {BADGE_LIST.map(b => {
                            const earned = earnedBadges.find(e => e.id === b.id);
                            return (
                                <div key={b.id} className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all ${earned ? `${badgeColor[b.color]} border-transparent` : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-40 grayscale'}`}>
                                    <span className="text-xl">{b.icon}</span>
                                    <div>
                                        <p className="text-[10px] font-black">{b.label}</p>
                                        {earned && <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={9} />Earned</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Progress Bar Section */}
            <div className="glass-card p-6">
                <h3 className="font-extrabold text-sm mb-5 flex items-center gap-2"><BarChart2 size={16} className="text-cyan-500" />Platform Activity</h3>
                <div className="space-y-4">
                    {[
                        { label: 'Courses Completed', value: coursesCompleted, max: 20, color: 'bg-gradient-to-r from-primary-500 to-primary-600' },
                        { label: 'Tests Completed',   value: testsCompleted,   max: 30, color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
                        { label: 'Problems Solved',   value: codingSolved,     max: 100, color: 'bg-gradient-to-r from-cyan-500 to-teal-500' },
                    ].map(item => (
                        <div key={item.label}>
                            <div className="flex justify-between mb-1.5">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                                <span className="text-xs font-black text-slate-600 dark:text-slate-400">{item.value} / {item.max}</span>
                            </div>
                            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                                    style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Applied Jobs Section */}
            <div className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm flex items-center gap-2">
                        <Briefcase size={16} className="text-violet-500" />
                        Applied Jobs ({applications.length})
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Real-time Official application status
                    </span>
                </div>

                {applications.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-2xl">
                        <Briefcase size={24} className="mx-auto text-slate-400 mb-2 opacity-50" />
                        <p className="text-xs text-slate-500 font-semibold">No job applications submitted yet.</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Browse hiring companies to apply via their portals.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {applications.map((app) => (
                            <div key={app.id} className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-3 shadow-sm hover:border-violet-500/20 transition-all">
                                <div className="space-y-1">
                                    <div className="font-black text-sm text-slate-800 dark:text-white leading-tight">
                                        {app.jobTitle}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-505">
                                        {app.companyName} • Code: {app.jobCode || 'N/A'}
                                    </div>
                                    <div className="text-[9px] text-slate-400 font-medium">
                                        Applied on: {new Date(app.appliedAt).toLocaleString(undefined, {month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                    </div>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                                    app.status === 'APPROVED' || app.status === 'SELECTED'
                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                        : app.status === 'REJECTED'
                                        ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                        : 'bg-primary-500/10 text-primary-600 border-primary-500/20'
                                }`}>
                                    {app.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
