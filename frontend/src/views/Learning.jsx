import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    BookOpen, 
    PlayCircle, 
    FileText, 
    CheckCircle, 
    Loader2, 
    ChevronRight, 
    Star, 
    Award, 
    Trophy, 
    Layers, 
    Clock, 
    CheckSquare, 
    ArrowLeft,
    Download,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Learning = () => {
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [roadmap, setRoadmap] = useState(null);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roadmapLoading, setRoadmapLoading] = useState(false);
    const [activeNotes, setActiveNotes] = useState(null);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [activeVideo, setActiveVideo] = useState(null); // { title, url }


    useEffect(() => {
        Promise.all([
            axios.get('/api/domains'),
            axios.get('/api/domains/progress')
        ]).then(([domainsRes, progressRes]) => {
            setDomains(domainsRes.data);
            setProgress(progressRes.data);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const selectDomain = async (domain) => {
        setSelectedDomain(domain);
        setRoadmapLoading(true);
        setRoadmap(null);
        try {
            const res = await axios.get(`/api/domains/${domain.id}/roadmap`);
            setRoadmap(res.data);
        } catch (err) { 
            console.error(err); 
        } finally { 
            setRoadmapLoading(false); 
        }
    };

    const markComplete = async (courseId) => {
        try {
            await axios.post('/api/domains/progress', { 
                entityType: 'COURSE', 
                entityId: courseId, 
                status: 'COMPLETED' 
            });
            setProgress(prev => {
                const exists = prev.find(p => p.entityType === 'COURSE' && p.entityId === courseId);
                if (exists) {
                    return prev.map(p => p.entityType === 'COURSE' && p.entityId === courseId ? { ...p, status: 'COMPLETED' } : p);
                }
                return [...prev, { entityType: 'COURSE', entityId: courseId, status: 'COMPLETED' }];
            });
        } catch (err) { 
            console.error(err); 
        }
    };

    const isCourseComplete = (courseId) => progress.some(p => p.entityType === 'COURSE' && p.entityId === courseId && p.status === 'COMPLETED');

    const difficultyBadgeStyle = { 
        BEGINNER: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20', 
        INTERMEDIATE: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20', 
        ADVANCED: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' 
    };

    const renderNotesContent = (notes) => {
        if (!notes) return null;
        const lines = notes.split('\n');
        const elements = [];
        let inCode = false;
        let codeLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim().startsWith('```')) {
                if (inCode) {
                    elements.push(
                        <pre key={`code-${i}`} className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-250 dark:border-slate-800/80 my-3">
                            <code>{codeLines.join('\n')}</code>
                        </pre>
                    );
                    inCode = false;
                    codeLines = [];
                } else {
                    inCode = true;
                }
            } else if (inCode) {
                codeLines.push(line);
            } else {
                if (line.startsWith('# ')) {
                    elements.push(<h1 key={i} className="text-xl font-black text-slate-900 dark:text-white mt-6 mb-3 border-b pb-2 border-slate-200 dark:border-slate-800">{line.replace('# ', '')}</h1>);
                } else if (line.startsWith('## ')) {
                    elements.push(<h2 key={i} className="text-base font-extrabold text-slate-900 dark:text-white mt-5 mb-2">{line.replace('## ', '')}</h2>);
                } else if (line.startsWith('- ')) {
                    elements.push(
                        <div key={i} className="flex items-start gap-2 my-1.5 pl-1">
                            <span className="text-primary-500 mt-2 shrink-0 h-1.5 w-1.5 rounded-full bg-primary-500" />
                            <p className="text-slate-700 dark:text-slate-300 text-xs font-semibold leading-relaxed">{line.replace('- ', '')}</p>
                        </div>
                    );
                } else if (/^\d+\.\s/.test(line)) {
                    const content = line.replace(/^\d+\.\s/, '');
                    const num = line.match(/^\d+/)[0];
                    elements.push(
                        <div key={i} className="flex items-start gap-2 my-1.5 pl-1">
                            <span className="text-primary-500 font-extrabold text-xs shrink-0">{num}.</span>
                            <p className="text-slate-700 dark:text-slate-300 text-xs font-semibold leading-relaxed">{content}</p>
                        </div>
                    );
                } else if (line.trim() === '') {
                    elements.push(<div key={i} className="h-2" />);
                } else {
                    elements.push(<p key={i} className="text-slate-750 dark:text-slate-300 text-xs font-semibold leading-relaxed my-1.5">{line}</p>);
                }
            }
        }
        return elements;
    };

    const downloadPdf = async (course) => {
        if (!course.notesPath) return;
        setDownloadingPdf(true);

        try {
            const { jsPDF } = await import('jspdf');
            const html2canvas = (await import('html2canvas')).default;
            
            const tempDiv = document.createElement('div');
            tempDiv.style.width = '750px';
            tempDiv.style.padding = '40px';
            tempDiv.style.backgroundColor = '#ffffff';
            tempDiv.style.color = '#0f172a';
            tempDiv.style.position = 'fixed';
            tempDiv.style.top = '-9999px';
            tempDiv.style.left = '-9999px';
            tempDiv.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            
            const markdownElements = renderNotesContent(course.notesPath);
            
            // Create DOM representation in clean print layout
            tempDiv.innerHTML = `
                <div style="border-bottom: 2px solid #0ea5e9; padding-bottom: 15px; margin-bottom: 25px;">
                    <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #0ea5e9; letter-spacing: 0.1em;">CareerForge Career Preparation Platform</div>
                    <h1 style="font-size: 26px; font-weight: 900; color: #0f172a; margin: 5px 0 0 0;">${course.title} Study Notes</h1>
                    <div style="font-size: 11px; color: #64748b; margin-top: 5px; font-weight: 600;">Placement Ready Study Guide & Concepts Summary</div>
                </div>
                <div id="notes-content-body" style="font-size: 13px; line-height: 1.6; color: #334155;"></div>
                <div style="margin-top: 50px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; font-weight: 600;">
                    Generated on ${new Date().toLocaleDateString()} | © CareerForge Career Platform
                </div>
            `;
            
            document.body.appendChild(tempDiv);
            
            // Render basic markdown translation for PDF html2canvas conversion
            const bodyContainer = tempDiv.querySelector('#notes-content-body');
            const lines = course.notesPath.split('\n');
            let inCode = false;
            let codeLines = [];
            
            lines.forEach((line) => {
                if (line.trim().startsWith('```')) {
                    if (inCode) {
                        const pre = document.createElement('pre');
                        pre.style.backgroundColor = '#f8fafc';
                        pre.style.color = '#0f172a';
                        pre.style.border = '1px solid #e2e8f0';
                        pre.style.padding = '12px';
                        pre.style.borderRadius = '8px';
                        pre.style.fontFamily = 'monospace';
                        pre.style.fontSize = '11px';
                        pre.style.overflowX = 'auto';
                        pre.style.margin = '15px 0';
                        pre.style.whiteSpace = 'pre-wrap';
                        pre.innerText = codeLines.join('\n');
                        bodyContainer.appendChild(pre);
                        inCode = false;
                        codeLines = [];
                    } else {
                        inCode = true;
                    }
                } else if (inCode) {
                    codeLines.push(line);
                } else {
                    if (line.startsWith('# ')) {
                        const h1 = document.createElement('h1');
                        h1.style.fontSize = '20px';
                        h1.style.fontWeight = '800';
                        h1.style.color = '#0f172a';
                        h1.style.marginTop = '25px';
                        h1.style.marginBottom = '12px';
                        h1.style.borderBottom = '1px solid #e2e8f0';
                        h1.style.paddingBottom = '5px';
                        h1.innerText = line.replace('# ', '');
                        bodyContainer.appendChild(h1);
                    } else if (line.startsWith('## ')) {
                        const h2 = document.createElement('h2');
                        h2.style.fontSize = '16px';
                        h2.style.fontWeight = '700';
                        h2.style.color = '#1e293b';
                        h2.style.marginTop = '20px';
                        h2.style.marginBottom = '10px';
                        h2.innerText = line.replace('## ', '');
                        bodyContainer.appendChild(h2);
                    } else if (line.startsWith('- ')) {
                        const li = document.createElement('div');
                        li.style.display = 'flex';
                        li.style.alignItems = 'flex-start';
                        li.style.margin = '8px 0';
                        li.innerHTML = `
                            <span style="color: #0ea5e9; font-weight: bold; margin-right: 8px; font-size: 14px; line-height: 1;">•</span>
                            <span style="color: #334155; font-size: 12px; font-weight: 550;">${line.replace('- ', '')}</span>
                        `;
                        bodyContainer.appendChild(li);
                    } else if (/^\d+\.\s/.test(line)) {
                        const content = line.replace(/^\d+\.\s/, '');
                        const num = line.match(/^\d+/)[0];
                        const li = document.createElement('div');
                        li.style.display = 'flex';
                        li.style.alignItems = 'flex-start';
                        li.style.margin = '8px 0';
                        li.innerHTML = `
                            <span style="color: #0ea5e9; font-weight: bold; margin-right: 8px; font-size: 12px;">${num}.</span>
                            <span style="color: #334155; font-size: 12px; font-weight: 550;">${content}</span>
                        `;
                        bodyContainer.appendChild(li);
                    } else if (line.trim() === '') {
                        const spacer = document.createElement('div');
                        spacer.style.height = '10px';
                        bodyContainer.appendChild(spacer);
                    } else {
                        const p = document.createElement('p');
                        p.style.color = '#334155';
                        p.style.fontSize = '12px';
                        p.style.margin = '8px 0';
                        p.style.fontWeight = '550';
                        p.innerText = line;
                        bodyContainer.appendChild(p);
                    }
                }
            });

            const canvas = await html2canvas(tempDiv, {
                scale: 2,
                useCORS: true
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
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
            
            pdf.save(`${course.title.toLowerCase().replace(/\s+/g, '_')}_study_notes.pdf`);
            document.body.removeChild(tempDiv);
        } catch (error) {
            console.error("PDF download execution failed", error);
        } finally {
            setDownloadingPdf(false);
        }
    };


    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 size={32} className="animate-spin text-primary-500" />
            </div>
        );
    }

    // Get milestones list from selected domain
    let milestones = [];
    if (roadmap && roadmap.domain && roadmap.domain.roadmap) {
        try {
            milestones = typeof roadmap.domain.roadmap === 'string' 
                ? JSON.parse(roadmap.domain.roadmap) 
                : roadmap.domain.roadmap;
        } catch (e) {
            console.error("Error parsing domain roadmap JSON", e);
        }
    }

    // Calculate progress stats
    const totalCourses = roadmap?.courses?.length || 0;
    const completedCourses = roadmap?.courses?.filter(c => isCourseComplete(c.id)).length || 0;
    const progressPercent = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

    // Language video alternatives (best curated multi-language playlists)
    const getLangVideos = (course) => [
        { lang: '🇺🇸 English', url: course.videoUrl },
        { lang: '🇮🇳 Hindi', url: course.videoUrl ? `https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + ' in hindi')}` : null },
        { lang: '🎓 Tamil', url: course.videoUrl ? `https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + ' in tamil')}` : null },
        { lang: '🎓 Telugu', url: course.videoUrl ? `https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + ' in telugu')}` : null },
        { lang: '🎓 Kannada', url: course.videoUrl ? `https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + ' in kannada')}` : null },
        { lang: '🎓 Playlist', url: course.videoUrl ? `https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + ' tutorial')}` : null },
    ].filter(v => v.url);

    return (
        <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-accent-500 to-primary-500 dark:from-primary-400 dark:via-accent-300 dark:to-primary-300 bg-clip-text text-transparent tracking-tight">
                        Learning Center
                    </h1>
                    <p className="text-slate-650 dark:text-slate-305 mt-2 font-semibold text-base">
                        Follow structured paths, watch curated videos, and achieve complete domain mastery.
                    </p>
                </div>
                {selectedDomain && (
                    <button 
                        onClick={() => { setSelectedDomain(null); setRoadmap(null); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black bg-gradient-to-r from-primary-500/10 to-accent-500/10 text-primary-600 dark:text-accent-400 hover:from-primary-500/20 hover:to-accent-500/20 transition-all w-fit border border-primary-500/20"
                    >
                        <ArrowLeft size={15} /> Back to Domains
                    </button>
                )}
            </div>

            {/* Grid of Domains */}
            {!selectedDomain && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {domains.map((domain, index) => {
                        return (
                            <motion.button 
                                key={domain.id} 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.04 }}
                                whileHover={{ y: -4, scale: 1.02 }}
                                onClick={() => selectDomain(domain)}
                                className="glass-card p-6 text-left group hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 relative flex flex-col justify-between min-h-[220px]"
                            >
                                <div>
                                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-tr from-primary-500/20 to-accent-500/20 text-primary-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 overflow-hidden border border-primary-500/20">
                                        {domain.logoUrl ? (
                                            <img src={domain.logoUrl} alt={domain.name} className="h-full w-full object-contain p-2" />
                                        ) : (
                                            <BookOpen size={22} />
                                        )}
                                    </div>
                                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-white group-hover:text-primary-400 transition-colors mb-2">
                                        {domain.name}
                                    </h3>
                                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold line-clamp-3">
                                        {domain.description}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-900 w-full">
                                    <span className="text-[10px] uppercase font-black text-slate-600 dark:text-slate-300 tracking-wider">
                                        Explore Pathway
                                    </span>
                                    <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            )}


            {/* Selected Domain View */}
            {selectedDomain && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Domain Stats / Roadmap Overview */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Summary Card */}
                        <div className="glass-card p-6 border-primary-500/20 bg-gradient-to-b from-primary-500/5 to-transparent">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary-500/20 to-accent-500/20 text-primary-500 flex items-center justify-center shrink-0 border border-primary-500/20">
                                    {selectedDomain.logoUrl ? (
                                        <img src={selectedDomain.logoUrl} alt={selectedDomain.name} className="h-full w-full object-contain p-2" />
                                    ) : (
                                        <Trophy size={26} />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 dark:text-white">{selectedDomain.name}</h2>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 font-bold mt-0.5">Mastery Path</p>
                                </div>
                            </div>
                        </div>

                            {/* Progress Ring & Stats */}
                            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900">
                                <div className="space-y-1.5">
                                    <span className="text-xs font-black text-slate-700 dark:text-slate-200">Total Completion</span>
                                    <div className="text-2xl font-black text-slate-800 dark:text-white">
                                        {progressPercent}%
                                    </div>
                                    <div className="text-[10px] text-slate-750 dark:text-slate-205 font-bold">
                                        {completedCourses} of {totalCourses} courses completed
                                    </div>
                                </div>
                                <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-slate-200 dark:text-slate-800"
                                            strokeWidth="3"
                                            stroke="currentColor"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-primary-500 transition-all duration-500"
                                            strokeDasharray={`${progressPercent}, 100`}
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <div className="absolute text-[11px] font-black text-slate-700 dark:text-slate-300">
                                        {progressPercent}%
                                    </div>
                                </div>
                            </div>

                        {/* Interactive Milestone Roadmap Timeline */}
                        <div className="glass-card p-6 space-y-5">
                            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-900">
                                <Layers size={18} className="text-primary-500" />
                                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Concept Milestones</h3>
                            </div>

                            {roadmapLoading ? (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="animate-spin text-primary-500" size={24} />
                                </div>
                            ) : (
                                <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-250 before:dark:bg-slate-800">
                                    {milestones.map((m, idx) => (
                                        <div key={idx} className="relative group">
                                            {/* Step Circle indicator */}
                                            <div className="absolute -left-6 top-1 h-4.5 w-4.5 rounded-full border-2 border-white dark:border-slate-950 bg-primary-500 ring-4 ring-primary-500/10 flex items-center justify-center z-10 transition-transform group-hover:scale-110" />
                                            <div>
                                                <span className="text-[9px] font-extrabold text-primary-500 uppercase tracking-widest block mb-0.5">
                                                    Phase {idx + 1}
                                                </span>
                                                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">
                                                    {m.milestone}
                                                </h4>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {m.skills?.map((skill, sIdx) => (
                                                        <span 
                                                            key={sIdx}
                                                            className="text-[9px] font-extrabold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg border border-slate-200/30 dark:border-slate-800/35"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {milestones.length === 0 && (
                                        <p className="text-xs text-slate-400 italic">No milestones defined for this path.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Course list / Learning Modules */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center justify-between pb-2">
                            <h3 className="font-black text-sm text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                                Learning Curriculum
                            </h3>
                            <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                                {totalCourses} Courses Available
                            </span>
                        </div>

                        {roadmapLoading && (
                            <div className="flex justify-center py-12">
                                <Loader2 size={32} className="animate-spin text-primary-500" />
                            </div>
                        )}

                        {roadmap && (
                            <div className="space-y-5">
                                {roadmap.courses?.map((course, idx) => {
                                    const done = isCourseComplete(course.id);
                                    const badgeClass = difficultyBadgeStyle[course.difficulty] || 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400';
                                    const langVideos = getLangVideos(course);
                                    return (
                                        <motion.div 
                                            key={course.id} 
                                            initial={{ opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.35, delay: idx * 0.04 }}
                                            whileHover={{ y: -3 }}
                                            className={`rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300 shadow-sm ${
                                                done 
                                                    ? 'border-emerald-450/40 bg-emerald-500/[0.03] dark:bg-emerald-950/15 shadow-emerald-500/5' 
                                                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-primary-400/40 hover:shadow-lg hover:shadow-primary-500/5'
                                            }`}
                                        >
                                            {/* Top Row */}
                                            <div className="flex items-start gap-4">
                                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-base font-black shrink-0 ${
                                                    done 
                                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                                        : 'bg-gradient-to-br from-primary-500/15 to-accent-500/15 text-primary-600 dark:text-primary-400 border border-primary-500/20'
                                                }`}>
                                                    {done ? <CheckCircle size={22} /> : idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight">
                                                            {course.title}
                                                        </h3>
                                                        <span className={`shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${badgeClass}`}>
                                                            {course.difficulty}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
                                                        {course.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Video Buttons Row */}
                                            {course.videoUrl && (
                                                <div className="flex flex-wrap gap-2 pl-16">
                                                    <button
                                                        onClick={() => setActiveVideo({ title: course.title, url: course.videoUrl })}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md shadow-red-500/20 hover:from-red-600 hover:to-rose-600 transition-all"
                                                    >
                                                        <PlayCircle size={16} /> Watch Tutorial
                                                    </button>
                                                    <a
                                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + ' tutorial in Hindi')}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-all"
                                                    >
                                                        🇮🇳 Hindi
                                                    </a>
                                                    <a
                                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + ' tutorial in Tamil')}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all"
                                                    >
                                                        🎓 Tamil
                                                    </a>
                                                    <a
                                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + ' tutorial in Telugu')}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                                                    >
                                                        📚 Telugu
                                                    </a>
                                                    <a
                                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + ' tutorial in Kannada')}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
                                                    >
                                                        🗣️ Kannada
                                                    </a>
                                                </div>
                                            )}

                                            {/* Assets Row */}
                                            <div className="flex flex-wrap items-center gap-3 pl-16 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                                                {course.notesPath && (
                                                    <button 
                                                        onClick={() => setActiveNotes(course)}
                                                        className="flex items-center gap-1.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:underline transition-colors"
                                                    >
                                                        <FileText size={15} /> Study Notes (PDF)
                                                    </button>
                                                )}
                                                {course.assignment && (
                                                    <span className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                                        <Award size={15} /> {course.assignment}
                                                    </span>
                                                )}
                                                {course.project && (
                                                    <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400">
                                                        <Star size={15} /> {course.project}
                                                    </span>
                                                )}
                                                <div className="ml-auto">
                                                    {!done ? (
                                                        <button 
                                                            onClick={() => markComplete(course.id)}
                                                            className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                                                        >
                                                            <CheckSquare size={15} /> Mark Complete
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-500">
                                                            <CheckCircle size={15} /> Completed
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* YouTube Video Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ duration: 0.22 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl border border-slate-800"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-slate-800">
                                <div>
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Video Tutorial</p>
                                    <h3 className="text-base font-black text-white">{activeVideo.title}</h3>
                                </div>
                                <button onClick={() => setActiveVideo(null)} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="aspect-video">
                                <iframe
                                    src={activeVideo.url + '?autoplay=1&rel=0'}
                                    title={activeVideo.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Study Notes Modal */}
            <AnimatePresence>
                {activeNotes && (
                    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800/80 animate-scaleIn"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                                <div>
                                    <span className="text-[9px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest block mb-0.5">Study Guide Material</span>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                        {activeNotes.title} Notes
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => downloadPdf(activeNotes)}
                                        disabled={downloadingPdf}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-colors disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {downloadingPdf ? (
                                            <>
                                                <Loader2 size={13} className="animate-spin" /> Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Download size={13} /> Download PDF
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        onClick={() => setActiveNotes(null)}
                                        className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div id="notes-printable-area" className="overflow-y-auto p-8 font-sans scrollbar max-h-[calc(85vh-7rem)]">
                                {renderNotesContent(activeNotes.notesPath)}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Learning;

