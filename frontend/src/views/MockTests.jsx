import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
    Timer, 
    CheckCircle, 
    XCircle, 
    Trophy, 
    BarChart2, 
    Loader2, 
    ArrowRight, 
    BookOpen,
    Building2,
    Check,
    X,
    RotateCcw,
    FileText,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MockTests = () => {
    const [tests, setTests] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [activeTest, setActiveTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('tests'); // tests | leaderboard
    const [selectedCategory, setSelectedCategory] = useState('ALL'); // ALL | COMPETITIVE | INTERVIEW | DOMAIN
    
    // Pagination & navigation for active test
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [reviewFilter, setReviewFilter] = useState('ALL'); // ALL | CORRECT | INCORRECT

    const timerRef = useRef(null);

    useEffect(() => {
        Promise.all([
            axios.get('/api/mock-tests'),
            axios.get('/api/mock-tests/leaderboard'),
            axios.get('/api/companies')
        ])
        .then(([testsRes, lbRes, companiesRes]) => {
            setTests(testsRes.data);
            setLeaderboard(lbRes.data);
            setCompanies(companiesRes.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);

    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(console.error);
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen().catch(console.error);
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen().catch(console.error);
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen().catch(console.error);
            }
        }
    };

    const startTest = (test) => {
        try {
            const parsed = JSON.parse(test.questions);
            setQuestions(parsed);
            setActiveTest(test);
            setAnswers({});
            setResult(null);
            setCurrentQuestionIndex(0);
            setTimeLeft(test.durationMinutes * 60);

            // Request browser native fullscreen
            const el = document.documentElement;
            if (el.requestFullscreen) {
                el.requestFullscreen().catch(err => console.log("Fullscreen request declined", err));
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen().catch(err => console.log("Fullscreen request declined", err));
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen().catch(err => console.log("Fullscreen request declined", err));
            } else if (el.msRequestFullscreen) {
                el.msRequestFullscreen().catch(err => console.log("Fullscreen request declined", err));
            }
        } catch (e) {
            console.error("Failed to parse test questions", e);
        }
    };

    useEffect(() => {
        if (activeTest && timeLeft > 0 && !result) {
            timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0 && activeTest && !result) {
            handleSubmit();
        }
        return () => clearTimeout(timerRef.current);
    }, [timeLeft, activeTest, result]);

    const handleSubmit = async () => {
        if (!activeTest || submitting) return;
        setSubmitting(true);
        clearTimeout(timerRef.current);
        try {
            const res = await axios.post(`/api/mock-tests/${activeTest.id}/submit`, answers);
            setResult(res.data);
            exitFullscreen();
            // Refresh leaderboard
            const lbRes = await axios.get('/api/mock-tests/leaderboard');
            setLeaderboard(lbRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const categoryFilters = [
        { label: 'All Assessments', value: 'ALL' },
        { label: 'Competitive (OA)', value: 'COMPETITIVE' },
        { label: 'Interview Prep', value: 'INTERVIEW' },
        { label: 'Domain Core', value: 'DOMAIN' }
    ];

    const filteredTests = tests.filter(test => {
        if (selectedCategory === 'ALL') return true;
        return test.category === selectedCategory || (test.type && test.type.toUpperCase() === selectedCategory);
    });

    const getCompanyInfo = (companyId) => {
        if (!companyId) return null;
        return companies.find(c => c.id === companyId) || null;
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 size={32} className="animate-spin text-primary-500" />
            </div>
        );
    }

    // Active test session
    if (activeTest && !result) {
        const currentQuestion = questions[currentQuestionIndex];
        return (
            <div className="fixed inset-0 z-[9999] h-screen w-screen bg-slate-50 dark:bg-[#080B14] overflow-y-auto p-4 md:p-8 animate-fadeIn flex flex-col">
                <div className="max-w-6xl w-full mx-auto space-y-6 flex flex-col min-h-full pb-12">
                    {/* Header status bar */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 glass-card px-6 py-4 sticky top-0 z-50 bg-slate-50/95 dark:bg-[#080B14]/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-sm rounded-2xl">
                        <div>
                            <h2 className="font-extrabold text-lg text-slate-800 dark:text-white">{activeTest.title}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{questions.length} Questions</span>
                                {activeTest.companyId && (
                                    <span className="text-[9px] font-extrabold bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded">
                                        {getCompanyInfo(activeTest.companyId)?.name}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-500">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </span>
                            <div className={`flex items-center gap-2 font-mono text-2xl font-black ${timeLeft < 120 ? 'text-rose-500 animate-pulse' : 'text-primary-500'}`}>
                                <Timer size={22} /> {formatTime(timeLeft)}
                            </div>
                        </div>
                    </div>

                    {/* Main panel layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
                        {/* Left Panel: Navigation Grid */}
                        <div className="lg:col-span-4 glass-card p-6 space-y-4 lg:order-last">
                            <h3 className="font-extrabold text-sm text-slate-700 dark:text-slate-350 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-850">
                                Assessment Progress
                            </h3>
                            
                            {/* Question Selector Grid */}
                            <div className="grid grid-cols-5 gap-2">
                                {questions.map((q, idx) => {
                                    const isAnswered = answers[q.id] !== undefined;
                                    const isActive = currentQuestionIndex === idx;

                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => setCurrentQuestionIndex(idx)}
                                            className={`h-10 w-full rounded-xl text-xs font-bold transition-all border flex items-center justify-center ${
                                                isActive 
                                                    ? 'bg-primary-500 border-primary-500 text-white ring-4 ring-primary-500/15'
                                                    : isAnswered
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-350'
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Progress Stats Summary */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs font-bold text-slate-400">
                                <span>Answered: {Object.keys(answers).length}</span>
                                <span>Unanswered: {questions.length - Object.keys(answers).length}</span>
                            </div>
                        </div>

                        {/* Right Panel: Active Question Display */}
                        <div className="lg:col-span-8 space-y-6">
                            {currentQuestion && (
                                <div className="glass-card p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-extrabold text-primary-500 uppercase tracking-wider">
                                            Active Question {currentQuestionIndex + 1}
                                        </span>
                                    </div>

                                    <p className="font-bold text-base text-slate-800 dark:text-white leading-relaxed">
                                        {currentQuestion.question}
                                    </p>

                                    <div className="grid gap-3 pt-2">
                                        {currentQuestion.options?.map((opt) => {
                                            const isSelected = answers[currentQuestion.id] === opt;
                                            return (
                                                <label 
                                                    key={opt} 
                                                    className={`flex items-center gap-3.5 px-5 py-4 rounded-xl border cursor-pointer text-xs font-bold transition-all duration-200 ${
                                                        isSelected 
                                                            ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400 ring-4 ring-primary-500/5' 
                                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-750 bg-slate-50/20 dark:bg-slate-950/20'
                                                    }`}
                                                >
                                                    <input 
                                                        type="radio" 
                                                        className="hidden" 
                                                        name={`q-${currentQuestion.id}`} 
                                                        value={opt} 
                                                        checked={isSelected}
                                                        onChange={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: opt }))} 
                                                    />
                                                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-primary-500' : 'border-slate-300 dark:border-slate-700'}`}>
                                                        {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary-500" />}
                                                    </div>
                                                    <span>{opt}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Panel */}
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentQuestionIndex === 0}
                                        className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-30"
                                    >
                                        <ChevronLeft size={16} className="inline mr-1" /> Prev
                                    </button>
                                    <button
                                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                        disabled={currentQuestionIndex === questions.length - 1}
                                        className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-30"
                                    >
                                        Next <ChevronRight size={16} className="inline ml-1" />
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => { 
                                            if(window.confirm("Exit test? Your progress will not be saved.")) { 
                                                setActiveTest(null); 
                                                clearTimeout(timerRef.current); 
                                                exitFullscreen();
                                            } 
                                        }} 
                                        className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-250 dark:border-slate-800 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                                    >
                                        Exit
                                    </button>
                                    <button 
                                        onClick={handleSubmit} 
                                        disabled={submitting}
                                        className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                        Submit Test
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Result & Review view
    if (result) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn px-4">
                {/* Result Summary Card */}
                <div className="glass-card p-8 text-center space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 12 }}
                    className="flex justify-center"
                >
                    <div className={`h-32 w-32 rounded-full flex items-center justify-center text-4xl font-black border-4 shadow-xl ${
                        result.scorePercentage >= 70 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-400/40 shadow-emerald-500/10' 
                            : result.scorePercentage >= 50 
                            ? 'bg-amber-500/10 text-amber-500 border-amber-400/40 shadow-amber-500/10' 
                            : 'bg-rose-500/10 text-rose-500 border-rose-400/40 shadow-rose-500/10'
                    }`}>
                        {result.scorePercentage}%
                    </div>
                </motion.div>
                    <div>
                        <h2 className="font-extrabold text-2xl">
                            {result.scorePercentage >= 70 ? '🎉 Exceptional Performance!' : result.scorePercentage >= 50 ? '👍 Standard Attempt!' : '💪 Keep Practicing!'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                            You scored <strong>{result.correctCount}</strong> out of <strong>{result.totalQuestions}</strong> correct.
                        </p>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 max-w-sm mx-auto">
                        <div className={`h-3 rounded-full transition-all duration-1000 ${result.scorePercentage >= 70 ? 'bg-emerald-500' : result.scorePercentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${result.scorePercentage}%` }} />
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <button 
                            onClick={() => { setActiveTest(null); setResult(null); }}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all"
                        >
                            Return to Test Center
                        </button>
                        <button 
                            onClick={() => startTest(activeTest)}
                            className="border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 px-6 py-2.5 rounded-xl font-bold text-xs transition-all"
                        >
                            Retake Assessment
                        </button>
                    </div>
                </div>

                {/* Review Mode Selector Filter */}
                <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-150 dark:border-slate-850">
                        <h3 className="font-extrabold text-base flex items-center gap-2">
                            <FileText size={18} className="text-primary-500" />
                            Detailed Review
                        </h3>
                        <div className="flex gap-1.5">
                            {['ALL', 'CORRECT', 'INCORRECT'].map((filterVal) => (
                                <button
                                    key={filterVal}
                                    onClick={() => setReviewFilter(filterVal)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                                        reviewFilter === filterVal
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    {filterVal}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Questions List */}
                    <div className="space-y-5">
                        {questions.map((q, idx) => {
                            const userAns = answers[q.id];
                            const correctAns = q.answer;
                            const isCorrect = userAns === correctAns;

                            // Filter condition
                            if (reviewFilter === 'CORRECT' && !isCorrect) return null;
                            if (reviewFilter === 'INCORRECT' && isCorrect) return null;

                            return (
                                <div 
                                    key={q.id} 
                                    className={`glass-card p-6 border-l-4 space-y-4 ${
                                        isCorrect 
                                            ? 'border-l-emerald-500 shadow-sm' 
                                            : 'border-l-rose-500 shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-405 font-bold">Question {idx + 1}</span>
                                        {isCorrect ? (
                                            <span className="text-emerald-500 flex items-center gap-1 text-[10px] font-bold">
                                                <Check size={14} /> Correct
                                            </span>
                                        ) : (
                                            <span className="text-rose-500 flex items-center gap-1 text-[10px] font-bold">
                                                <X size={14} /> Incorrect
                                            </span>
                                        )}
                                    </div>

                                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{q.question}</p>

                                    <div className="grid gap-2.5 sm:grid-cols-2 pt-1">
                                        {q.options?.map((opt) => {
                                            const isUserSelected = userAns === opt;
                                            const isCorrectOpt = correctAns === opt;

                                            let styleClass = 'border-slate-200 dark:border-slate-800';
                                            if (isCorrectOpt) {
                                                styleClass = 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-extrabold';
                                            } else if (isUserSelected && !isCorrect) {
                                                styleClass = 'border-rose-500 bg-rose-500/5 text-rose-600 dark:text-rose-450 font-extrabold';
                                            }

                                            return (
                                                <div 
                                                    key={opt} 
                                                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold ${styleClass}`}
                                                >
                                                    <div className="shrink-0">
                                                        {isCorrectOpt ? (
                                                            <CheckCircle size={14} className="text-emerald-500" />
                                                        ) : isUserSelected ? (
                                                            <XCircle size={14} className="text-rose-500" />
                                                        ) : (
                                                            <div className="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-slate-700" />
                                                        )}
                                                    </div>
                                                    <span>{opt}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation panel */}
                                    {q.explanation && (
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850/80 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                            <span className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">Explanation:</span>
                                            {q.explanation}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
            {/* Title Block */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-accent-500 to-primary-500 dark:from-primary-400 dark:via-accent-300 dark:to-primary-300 bg-clip-text text-transparent tracking-tight">Assessments</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-medium text-sm">
                        Test your conceptual depth and track placement readiness.
                    </p>
                </div>
                <div className="flex gap-2">
                    {['tests', 'leaderboard'].map(tab => (
                        <motion.button
                            key={tab}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                activeTab === tab 
                                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/20' 
                                    : 'bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-655 dark:text-slate-400 hover:bg-slate-50'
                            }`}
                        >
                            {tab === 'tests' ? 'Practice Tests' : '🏆 Leaderboard'}
                        </motion.button>
                    ))}
                </div>
            </div>

            {activeTab === 'tests' && (
                <div className="space-y-6">
                    {/* Category Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                        {categoryFilters.map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setSelectedCategory(filter.value)}
                                className={`text-xs font-bold px-5 py-2.5 rounded-full border transition-all ${
                                    selectedCategory === filter.value
                                        ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900'
                                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-650 hover:bg-slate-50'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Test Grid */}
                    {filteredTests.length === 0 ? (
                        <div className="text-center py-16 glass-card">
                            <AlertCircle size={40} className="mx-auto text-slate-350 dark:text-slate-650 mb-3" />
                            <h3 className="font-extrabold text-sm text-slate-600 dark:text-slate-400">No mock tests found for this category</h3>
                            <p className="text-[10px] text-slate-455 mt-0.5">Please check back later or try other filters.</p>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredTests.map((test, tIdx) => {
                                const company = getCompanyInfo(test.companyId);
                                const isApt = test.category === 'COMPETITIVE';

                                return (
                                    <motion.div
                                        key={test.id}
                                        initial={{ opacity: 0, y: 18 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, delay: Math.min(tIdx * 0.04, 0.6) }}
                                        whileHover={{ y: -4, scale: 1.015 }}
                                        className="glass-card p-6 flex flex-col justify-between transition-all duration-300 group hover:border-primary-400/30 hover:shadow-lg hover:shadow-primary-500/5"
                                    >
                                        <div className="space-y-4">
                                            {/* Badges */}
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                                    isApt 
                                                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                                                        : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                                                }`}>
                                                    {test.category || 'Domain'}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                    <Timer size={12} /> {test.durationMinutes} min
                                                </span>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-1">
                                                <h3 className="font-extrabold text-base leading-snug group-hover:text-primary-500 transition-colors">
                                                    {test.title}
                                                </h3>
                                                {company ? (
                                                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-450 font-bold">
                                                        <Building2 size={12} className="text-primary-500" />
                                                        <span>Targets {company.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-450 font-bold">
                                                        <BookOpen size={12} className="text-emerald-500" />
                                                        <span>General Prep</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => startTest(test)}
                                            className="mt-6 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-xl py-2.5 text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                                        >
                                            Start Assessment <ArrowRight size={14} />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'leaderboard' && (
                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Trophy size={20} className="text-amber-500" />
                            <h3 className="font-extrabold text-base">Global Leaderboard Rankings</h3>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full">
                            Top 10 Students
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-6 py-3.5 text-left font-bold">Rank</th>
                                    <th className="px-6 py-3.5 text-left font-bold">Student Name</th>
                                    <th className="px-6 py-3.5 text-right font-bold">Total Score</th>
                                    <th className="px-6 py-3.5 text-right font-bold">Tests Completed</th>
                                    <th className="px-6 py-3.5 text-right font-bold">Coding Solved</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {leaderboard.map((row) => (
                                    <tr key={row.rank} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-black ${row.rank === 1 ? 'text-amber-500' : row.rank === 2 ? 'text-slate-400' : row.rank === 3 ? 'text-amber-700' : 'text-slate-500'}`}>
                                                #{row.rank}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-705 dark:text-slate-305">{row.username}</td>
                                        <td className="px-6 py-4 text-right font-black text-primary-600 dark:text-primary-450">{row.score} pts</td>
                                        <td className="px-6 py-4 text-right text-slate-500 font-semibold">{row.testsCompleted}</td>
                                        <td className="px-6 py-4 text-right text-slate-500 font-semibold">{row.codingCompleted}</td>
                                    </tr>
                                ))}
                                {leaderboard.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-400">
                                            No scores submitted yet. Be the first to secure a rank!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MockTests;
