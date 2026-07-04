import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, Building2, Link2, BookOpen, 
    FileQuestion, Code2, FileText, Bot, ShieldCheck,
    Sparkles, Trophy, ChevronRight, UserCircle
} from 'lucide-react';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/',          label: 'Dashboard',          icon: LayoutDashboard, color: 'violet', badge: null },
        { path: '/profile',   label: 'My Profile',         icon: UserCircle,      color: 'pink',   badge: 'NEW' },
        { path: '/companies', label: 'Hiring Intel',        icon: Building2,       color: 'emerald', badge: '30+' },
        { path: '/linkedin',  label: 'LinkedIn Profiler',   icon: Link2,           color: 'blue',   badge: null },
        { path: '/learning',  label: 'Learning Center',     icon: BookOpen,        color: 'purple', badge: '111' },
        { path: '/tests',     label: 'Assessments',         icon: FileQuestion,    color: 'amber',  badge: '90Q' },
        { path: '/coding',    label: 'Coding Arena',        icon: Code2,           color: 'rose',   badge: '100' },
        { path: '/resume',    label: 'Resume Builder',      icon: FileText,        color: 'teal',   badge: null },
        { path: '/interview', label: 'AI Interview Suite',  icon: Bot,             color: 'indigo', badge: 'AI' },
    ];

    if (user?.role === 'ADMIN') {
        navItems.push({ path: '/admin', label: 'Admin Console', icon: ShieldCheck, color: 'rose', badge: 'ADMIN' });
    }

    const colorMap = {
        violet: 'bg-violet-500/10 text-violet-500 dark:text-violet-400',
        pink:   'bg-pink-500/10 text-pink-600 dark:text-pink-400',
        emerald:'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        blue:   'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        amber:  'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        rose:   'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        teal:   'bg-teal-500/10 text-teal-600 dark:text-teal-400',
        indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
        slate:  'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    };

    return (
        <aside className="w-64 border-r border-primary-200/30 dark:border-primary-900/30 bg-white dark:bg-[#080B14] flex flex-col h-[calc(100vh-4rem)] sticky top-16 shadow-sm">
            {/* Brand tagline */}
            <div className="px-4 pt-5 pb-3">
                <div className="flex items-center gap-2 bg-gradient-to-r from-primary-500/8 to-accent-500/8 border border-primary-500/15 dark:border-primary-800/30 rounded-2xl px-3.5 py-2.5">
                    <Sparkles size={14} className="text-primary-500 shrink-0" />
                    <div>
                        <p className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">AI-Powered</p>
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Career Ecosystem v3.0</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 pb-2 pt-1">Navigation</p>
                {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    const colors = colorMap[item.color] || colorMap.slate;

                    return (
                        <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04, duration: 0.3 }}
                        >
                            <NavLink
                                to={item.path}
                                className={({ isActive: active }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                                        active
                                            ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/20'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:text-slate-900 dark:hover:text-slate-100'
                                    }`
                                }
                            >
                                {/* Icon bubble */}
                                <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                    isActive ? 'bg-white/20 text-white' : colors
                                }`}>
                                    <Icon size={15} />
                                </div>

                                <span className="flex-1 truncate">{item.label}</span>

                                {/* Badge */}
                                {item.badge && (
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                                        isActive 
                                            ? 'bg-white/25 text-white' 
                                            : 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                    }`}>
                                        {item.badge}
                                    </span>
                                )}

                                {/* Active arrow */}
                                {isActive && (
                                    <ChevronRight size={13} className="shrink-0 text-white/70" />
                                )}
                            </NavLink>
                        </motion.div>
                    );
                })}
            </nav>

            {/* User card footer */}
            {user && (
                <div className="p-3 border-t border-primary-100/50 dark:border-primary-900/30">
                    <NavLink to="/profile" className="block">
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/40 hover:bg-primary-100/60 dark:hover:bg-primary-950/40 transition-colors cursor-pointer">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm shadow-primary-500/20">
                                {user.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{user.username}</p>
                                <p className="text-[10px] font-black text-primary-500 uppercase tracking-wider">{user.role}</p>
                            </div>
                            <Trophy size={13} className="text-amber-500 shrink-0" />
                        </div>
                    </NavLink>
                    <p className="text-center text-[9px] text-slate-300 dark:text-slate-700 mt-2 font-medium">CareerForge v3.0 · Made in India 🇮🇳</p>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
