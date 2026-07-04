import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, LogOut, UserCircle, Check, Zap, ShieldCheck, Palette } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { darkMode, toggleTheme, themeName, setThemeName } = useTheme();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showThemeDropdown, setShowThemeDropdown] = useState(false);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await axios.get('/api/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error('Error fetching notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const markAllRead = async () => {
        try {
            await axios.post('/api/notifications/read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking read', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <header className="sticky top-0 z-40 w-full border-b border-primary-200/30 dark:border-primary-900/30 bg-white/85 dark:bg-[#080B14]/90 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-6">
                {/* Brand */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-primary-500/30">
                        CF
                    </div>
                    <div className="leading-none">
                        <span className="font-black text-xl tracking-tight bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                            CareerForge
                        </span>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Career Platform</p>
                    </div>
                </div>

                {/* Center — search hint */}
                <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-xl px-4 py-2 text-xs text-slate-400 cursor-pointer hover:border-primary-400/40 transition-colors">
                    <Zap size={12} className="text-primary-500" />
                    <span className="font-medium">AI-Powered · Placement Ready</span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    {/* Theme switcher dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowThemeDropdown(p => !p)}
                            className="rounded-xl p-2 text-slate-500 hover:bg-primary-50 dark:text-slate-400 dark:hover:bg-primary-950/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                            title="Change Website Template/Theme"
                        >
                            <Palette size={18} />
                        </button>

                        {showThemeDropdown && (
                            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-primary-200/50 dark:border-primary-900/50 bg-white dark:bg-slate-900 p-2 shadow-2xl shadow-primary-500/10 z-50">
                                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    Choose Theme
                                </div>
                                <div className="space-y-0.5 py-1">
                                    {[
                                        { id: 'amethyst', name: 'Royal Amethyst', primary: 'bg-violet-500', accent: 'bg-cyan-550 dark:bg-cyan-500' },
                                        { id: 'cyberpunk', name: 'Cyberpunk Neon', primary: 'bg-pink-500', accent: 'bg-emerald-500' },
                                        { id: 'emerald', name: 'Emerald Forest', primary: 'bg-emerald-500', accent: 'bg-teal-500' },
                                        { id: 'sunset', name: 'Sunset Horizon', primary: 'bg-orange-500', accent: 'bg-rose-500' },
                                        { id: 'ocean', name: 'Deep Ocean', primary: 'bg-blue-500', accent: 'bg-cyan-550 dark:bg-cyan-500' },
                                        { id: 'rosegold', name: 'Rose Gold', primary: 'bg-pink-500', accent: 'bg-rose-600' }
                                    ].map(themeOpt => (
                                        <button
                                            key={themeOpt.id}
                                            onClick={() => {
                                                setThemeName(themeOpt.id);
                                                setShowThemeDropdown(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                                themeName === themeOpt.id
                                                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                            }`}
                                        >
                                            <span>{themeOpt.name}</span>
                                            <div className="flex items-center gap-1">
                                                <span className={`h-2.5 w-2.5 rounded-full ${themeOpt.primary}`} />
                                                <span className={`h-2.5 w-2.5 rounded-full ${themeOpt.accent}`} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dark Mode toggle */}
                    <button
                        onClick={toggleTheme}
                        className="rounded-xl p-2 text-slate-500 hover:bg-primary-50 dark:text-slate-400 dark:hover:bg-primary-950/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(prev => !prev)}
                            className="relative rounded-xl p-2 text-slate-500 hover:bg-primary-50 dark:text-slate-400 dark:hover:bg-primary-950/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-[#080B14]">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-primary-200/50 dark:border-primary-900/50 bg-white dark:bg-slate-900 p-2 shadow-2xl shadow-primary-500/10 z-50">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-3 py-2">
                                    <span className="font-bold text-sm">Notifications</span>
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={markAllRead}
                                            className="text-xs text-primary-500 hover:underline flex items-center gap-1 font-semibold"
                                        >
                                            <Check size={12} /> Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-64 overflow-y-auto py-1">
                                    {notifications.length === 0 ? (
                                        <div className="py-8 text-center text-xs text-slate-400">
                                            No notifications yet.
                                        </div>
                                    ) : (
                                        notifications.map(n => (
                                            <div 
                                                key={n.id} 
                                                className={`px-3 py-2 text-xs rounded-lg transition-colors my-1 ${n.isRead ? 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'bg-primary-50/50 dark:bg-primary-950/20 text-slate-800 dark:text-slate-200 font-medium'}`}
                                            >
                                                <div className="font-bold">{n.title}</div>
                                                <div className="mt-0.5 text-[11px] leading-relaxed">{n.message}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User info */}
                    {user && (
                        <div className="flex items-center gap-3 pl-3 border-l border-primary-200/40 dark:border-primary-900/40">
                            <div className="hidden sm:flex flex-col text-right">
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.username}</span>
                                <span className="text-[10px] font-black text-primary-500 uppercase tracking-wider">{user.role}</span>
                            </div>
                            <button
                                onClick={() => navigate('/profile')}
                                className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm shadow-primary-500/20 hover:scale-105 transition-transform"
                                title="View Profile"
                            >
                                {user.username?.[0]?.toUpperCase() || <UserCircle size={18} />}
                            </button>
                            {user.role === 'ADMIN' && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 dark:text-rose-400 hover:bg-rose-500/20 transition-colors text-[11px] font-black uppercase tracking-wider"
                                    title="Open Admin Console"
                                >
                                    <ShieldCheck size={13} />
                                    Admin
                                </button>
                            )}
                            <button
                                onClick={logout}
                                className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 transition-colors"
                                title="Log Out"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
