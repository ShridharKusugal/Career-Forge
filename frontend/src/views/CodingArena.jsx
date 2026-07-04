import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Editor, { loader } from '@monaco-editor/react';
import { 
    Code, 
    Play, 
    CheckCircle, 
    XCircle, 
    Loader2, 
    ChevronRight, 
    BookOpen,
    HelpCircle,
    Info,
    Sparkles,
    Settings,
    Layers,
    List,
    Lock,
    Unlock,
    Terminal,
    Send,
    AlertTriangle,
    RefreshCw
} from 'lucide-react';

// Configure Monaco Editor loader to use JSdelivr CDN for fast, reliable loading
loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });

const LANGUAGES = [
    { id: 'java',       label: 'Java',       icon: '☕', monacoLang: 'java' },
    { id: 'python',     label: 'Python',     icon: '🐍', monacoLang: 'python' },
    { id: 'javascript', label: 'JavaScript', icon: '🟨', monacoLang: 'javascript' },
    { id: 'cpp',        label: 'C++',        icon: '⚡', monacoLang: 'cpp' },
    { id: 'c',          label: 'C',          icon: '🔵', monacoLang: 'c' },
    { id: 'typescript', label: 'TypeScript', icon: '🔷', monacoLang: 'typescript' },
    { id: 'go',         label: 'Go',         icon: '🩵', monacoLang: 'go' },
    { id: 'rust',       label: 'Rust',       icon: '🦀', monacoLang: 'rust' },
    { id: 'php',        label: 'PHP',        icon: '🐘', monacoLang: 'php' },
    { id: 'ruby',       label: 'Ruby',       icon: '💎', monacoLang: 'ruby' },
    { id: 'kotlin',     label: 'Kotlin',     icon: '🟣', monacoLang: 'kotlin' },
    { id: 'swift',      label: 'Swift',      icon: '🍎', monacoLang: 'swift' },
];

const starterTemplates = {
    java: `import java.util.*;\nimport java.io.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String input = sc.nextLine();\n        System.out.println(input);\n    }\n}`,
    python: `import sys\n\ndef solve():\n    data = sys.stdin.read().strip()\n    print(data)\n\nsolve()`,
    javascript: `const readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on('line', l => lines.push(l.trim()));\nrl.on('close', () => {\n    // Your solution here\n    console.log(lines[0]);\n});`,
    cpp: `#include<bits/stdc++.h>\nusing namespace std;\n\nint main(){\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    string s;\n    getline(cin, s);\n    cout << s << endl;\n    return 0;\n}`,
    c: `#include<stdio.h>\n#include<string.h>\n\nint main(){\n    char line[1000];\n    fgets(line, sizeof(line), stdin);\n    printf("%s", line);\n    return 0;\n}`,
    typescript: `import * as readline from 'readline';\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines: string[] = [];\nrl.on('line', (l: string) => lines.push(l.trim()));\nrl.on('close', () => {\n    console.log(lines[0]);\n});`,
    go: `package main\n\nimport (\n    "bufio"\n    "fmt"\n    "os"\n)\n\nfunc main() {\n    reader := bufio.NewReader(os.Stdin)\n    line, _ := reader.ReadString('\\n')\n    fmt.Print(line)\n}`,
    rust: `use std::io::{self, BufRead};\n\nfn main() {\n    let stdin = io::stdin();\n    let line = stdin.lock().lines().next().unwrap().unwrap();\n    println!("{}", line);\n}`,
    php: `<?php\n$line = trim(fgets(STDIN));\necho $line . "\\n";\n?>`,
    ruby: `line = gets.chomp\nputs line`,
    kotlin: `import java.util.Scanner\n\nfun main() {\n    val sc = Scanner(System.\`in\`)\n    val line = sc.nextLine()\n    println(line)\n}`,
    swift: `import Foundation\n\nif let line = readLine() {\n    print(line)\n}`,
};

const CodingArena = () => {
    const [problems, setProblems] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selected, setSelected] = useState(null);
    const [language, setLanguage] = useState('java');
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [code, setCode] = useState('');
    const [customInput, setCustomInput] = useState('');
    
    // Console / Testcase States
    const [consoleTab, setConsoleTab] = useState('testcase'); // 'testcase' | 'custom' | 'result' | 'submission'
    const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);
    const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);
    
    // Result states
    const [runResult, setRunResult] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const [runningCode, setRunningCode] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    // Fallback editor states
    const [useFallback, setUseFallback] = useState(false);
    const [monacoLoading, setMonacoLoading] = useState(true);

    // Hints state
    const [unlockedHints, setUnlockedHints] = useState({});
    const [showExplanation, setShowExplanation] = useState(false);

    // Editor settings
    const [editorTheme, setEditorTheme] = useState('vs-dark');
    const [fontSize, setFontSize] = useState(14);

    const fallbackTextareaRef = useRef(null);

    useEffect(() => {
        Promise.all([
            axios.get('/api/coding-problems'),
            axios.get('/api/companies')
        ])
        .then(([problemsRes, companiesRes]) => {
            setProblems(problemsRes.data);
            setCompanies(companiesRes.data);
            if (problemsRes.data.length > 0) {
                selectProblem(problemsRes.data[0]);
            }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);

    // Monitor Monaco Editor loading state
    useEffect(() => {
        let timer;
        if (selected && !useFallback) {
            setMonacoLoading(true);
            // If Monaco isn't ready in 3.5 seconds, show option or auto-fallback
            timer = setTimeout(() => {
                setMonacoLoading(false);
            }, 3500);
        }
        return () => clearTimeout(timer);
    }, [selected, useFallback]);

    const getStarterCode = (problem, lang) => {
        if (!problem) return starterTemplates[lang] || '';
        if (problem.starterCode) {
            if (problem.starterCode.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(problem.starterCode);
                    if (parsed[lang]) return parsed[lang];
                } catch (e) {
                    console.error("Failed to parse starter code JSON", e);
                }
            } else if (lang === 'java') {
                return problem.starterCode;
            }
        }
        return starterTemplates[lang] || '';
    };

    const selectProblem = (problem) => {
        setSelected(problem);
        setRunResult(null);
        setSubmitResult(null);
        setCode(getStarterCode(problem, language));
        setUnlockedHints({});
        setShowExplanation(false);
        setConsoleTab('testcase');
        setSelectedTestCaseIdx(0);
        setIsConsoleCollapsed(false);
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
        setCode(getStarterCode(selected, lang));
        setRunResult(null);
        setSubmitResult(null);
        setShowLangDropdown(false);
    };
    const currentLang = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

    // Helper to parse compilation or runtime errors from stderr
    const parseErrorDetails = (stderr, compilationError, codeText) => {
        if (!stderr) return null;
        
        const lines = stderr.split('\n');
        let lineNumber = null;
        let errorMessage = '';
        
        // Match standard language error trace indicators
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Look for error line indicators for various languages
            if (line.includes('solution.py') || line.includes('Solution.java') || line.includes('solution.js') || 
                line.includes('solution.cpp') || line.includes('solution.c') || line.includes('solution.ts') ||
                line.includes('solution.swift') || line.includes('solution.rb') || line.includes('solution.php') ||
                line.includes('solution.kts')) {
                
                const colonMatch = line.match(/:(\d+)/);
                if (colonMatch) {
                    lineNumber = parseInt(colonMatch[1], 10);
                } else {
                    const lineMatch = line.match(/line (\d+)/i);
                    if (lineMatch) {
                        lineNumber = parseInt(lineMatch[1], 10);
                    }
                }
            }
        }
        
        // Find the main message of the exception/error
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i].trim();
            if (line && 
                !line.includes('at ') && 
                !line.includes('Traceback') && 
                !line.includes('File "') &&
                !line.includes('^') &&
                !line.includes('~~~')
            ) {
                errorMessage = line;
                break;
            }
        }
        
        if (!errorMessage) {
            errorMessage = lines[lines.length - 1] || lines[0] || 'Execution Error';
        }
        
        // Clean paths for premium look
        errorMessage = errorMessage.replace(/C:\\.*\\temp\\cf_\w+\\/gi, '');
        errorMessage = errorMessage.replace(/\/tmp\/cf_\w+\//gi, '');
        
        let codeLine = '';
        let codeLines = [];
        if (codeText) {
            codeLines = codeText.split('\n');
            if (lineNumber && lineNumber >= 1 && lineNumber <= codeLines.length) {
                codeLine = codeLines[lineNumber - 1];
            }
        }
        
        return {
            lineNumber,
            errorMessage,
            codeLine,
            codeLines
        };
    };

    // Separate "Run Code" with Custom Input (stdin)
    const handleRunCode = async () => {
        if (!selected || runningCode) return;
        setRunningCode(true);
        setRunResult(null);
        setSubmitResult(null);
        setIsConsoleCollapsed(false);

        let testCases = [];
        try {
            testCases = JSON.parse(selected.testCases || '[]');
        } catch (e) {}

        const isCustom = consoleTab === 'custom';
        const stdinVal = isCustom 
            ? customInput 
            : (testCases[selectedTestCaseIdx]?.input || '');

        try {
            const res = await axios.post(`/api/coding-problems/${selected.id}/run`, {
                language,
                code,
                stdin: stdinVal
            });
            
            const expectedOutput = isCustom ? null : (testCases[selectedTestCaseIdx]?.output || '');
            
            setRunResult({
                ...res.data,
                expectedOutput,
                inputUsed: stdinVal
            });
            setConsoleTab('result');
        } catch (err) {
            console.error(err);
            setRunResult({
                success: false,
                compilationError: true,
                stderr: "Network / System Connection Timeout.",
                inputUsed: stdinVal
            });
            setConsoleTab('result');
        } finally {
            setRunningCode(false);
        }
    };

    // Separate "Submit Code" against all test cases
    const handleSubmit = async () => {
        if (!selected || submitting) return;
        setSubmitting(true);
        setRunResult(null);
        setSubmitResult(null);
        setIsConsoleCollapsed(false);
        try {
            const res = await axios.post(`/api/coding-problems/${selected.id}/submit`, { 
                language, 
                code 
            });
            setSubmitResult(res.data);
            setConsoleTab('submission');
        } catch (err) { 
            console.error(err);
            setSubmitResult({
                success: false,
                compilationError: true,
                message: "Connection Error: Failed to contact compilation server."
            });
            setConsoleTab('submission');
        } finally { 
            setSubmitting(false); 
        }
    };

    const MAX_ALLOWED_UNLOCKS = 2;
    const unlockHint = (index) => {
        const unlockedCount = Object.keys(unlockedHints).length;
        if (unlockedCount >= MAX_ALLOWED_UNLOCKS) return;
        setUnlockedHints(prev => ({ ...prev, [index]: true }));
    };

    const getCompanyInfo = (companyId) => {
        if (!companyId) return null;
        return companies.find(c => c.id === companyId) || null;
    };

    // Support Tab Key in standard textarea editor fallback
    const handleFallbackKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const newValue = code.substring(0, start) + '    ' + code.substring(end);
            setCode(newValue);
            // Put caret at right position
            setTimeout(() => {
                if (fallbackTextareaRef.current) {
                    fallbackTextareaRef.current.selectionStart = 
                    fallbackTextareaRef.current.selectionEnd = start + 4;
                }
            }, 0);
        }
    };

    const difficultyMeta = {
        EASY: { color: 'emerald', label: 'Easy' },
        MEDIUM: { color: 'amber', label: 'Medium' },
        HARD: { color: 'rose', label: 'Hard' },
    };

    const filtered = filter === 'ALL' ? problems : problems.filter(p => p.difficulty === filter);
    const MAX_HINTS = 3;

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 size={32} className="animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn max-w-[90rem] mx-auto px-4">
            {/* Title & Top Options */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-rose-600 via-violet-500 to-cyan-500 bg-clip-text text-transparent">Coding Arena</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        12 languages · 100 DSA problems · Real compiler execution environment.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 min-h-[82vh] items-stretch">
                {/* Left Pane - Problem list & selection */}
                <div className="w-full lg:w-80 shrink-0 space-y-4 flex flex-col">
                    <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-3">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Complexity Filters</span>
                        <div className="flex flex-wrap gap-1.5">
                            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map(f => (
                                <button 
                                    key={f} 
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                                        filter === f 
                                            ? 'bg-primary-500 text-white shadow-md' 
                                            : 'bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-550 hover:bg-slate-50'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 overflow-y-auto max-h-[60vh] lg:max-h-[68vh] flex-1 scrollbar-thin">
                        {filtered.map((p, pIdx) => {
                            const dm = difficultyMeta[p.difficulty] || { color: 'sky', label: p.difficulty };
                            const comp = getCompanyInfo(p.companyId);
                            const isSelected = selected?.id === p.id;

                            return (
                                <motion.button 
                                    key={p.id} 
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: pIdx * 0.02, duration: 0.25 }}
                                    onClick={() => selectProblem(p)}
                                    className={`w-full text-left glass-card p-4 flex items-center justify-between group transition-all duration-300 ${
                                        isSelected 
                                            ? 'border-primary-500 bg-primary-500/[0.03] shadow-md shadow-primary-500/5' 
                                            : 'hover:border-slate-350 dark:hover:border-slate-800'
                                    }`}
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-extrabold text-slate-800 dark:text-slate-150 group-hover:text-primary-500 transition-colors">
                                            {p.title}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] font-extrabold uppercase tracking-wider text-${dm.color}-500 bg-${dm.color}-500/10 px-2 py-0.5 rounded border border-${dm.color}-500/10`}>
                                                {dm.label}
                                            </span>
                                            {comp && (
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                    • {comp.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className={`text-slate-400 group-hover:text-primary-500 transition-colors ${isSelected ? 'text-primary-500 translate-x-0.5' : ''}`} />
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Pane - IDE Workspace */}
                <div className="flex-1 flex flex-col gap-6">
                    {!selected ? (
                        <div className="glass-card flex-1 flex items-center justify-center text-center p-12">
                            <div className="max-w-xs space-y-4">
                                <div className="h-16 w-16 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center mx-auto">
                                    <Code size={32} />
                                </div>
                                <h3 className="font-extrabold text-base text-slate-700 dark:text-slate-300">Ready to Code?</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Select an algorithmic challenge from the left pane to initialize your development workspace.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch flex-1">
                            
                            {/* Problem details panel */}
                            <div className="glass-card p-6 flex flex-col justify-between overflow-y-auto max-h-[85vh] scrollbar-thin space-y-6">
                                <div className="space-y-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="font-black text-xl text-slate-800 dark:text-white">{selected.title}</h2>
                                            {selected.topicTags && (
                                                <div className="flex flex-wrap gap-1 mt-2.5">
                                                    {selected.topicTags.split(',').map((tag, idx) => (
                                                        <span key={idx} className="bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg text-slate-650 dark:text-slate-400">
                                                            {tag.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-${difficultyMeta[selected.difficulty]?.color}-500/10 text-${difficultyMeta[selected.difficulty]?.color}-600 border border-${difficultyMeta[selected.difficulty]?.color}-500/10 shrink-0`}>
                                            {selected.difficulty}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-2">Problem Description</span>
                                        <div className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-semibold bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-900">
                                            {selected.description}
                                        </div>
                                    </div>

                                    {/* Complexities */}
                                    {(selected.timeComplexity || selected.spaceComplexity) && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {selected.timeComplexity && (
                                                <div className="bg-sky-500/5 p-3 rounded-xl border border-sky-500/10">
                                                    <span className="text-[9px] text-sky-500 font-bold block uppercase tracking-wider">Time Complexity</span>
                                                    <code className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">{selected.timeComplexity}</code>
                                                </div>
                                            )}
                                            {selected.spaceComplexity && (
                                                <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                                                    <span className="text-[9px] text-emerald-500 font-bold block uppercase tracking-wider">Space Complexity</span>
                                                    <code className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{selected.spaceComplexity}</code>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Hints Accordion - max 3 hints */}
                                    {selected.hints && (
                                        <div className="space-y-2">
                                            {(() => {
                                                const unlockedCount = Object.keys(unlockedHints).length;
                                                const isLimitReached = unlockedCount >= MAX_ALLOWED_UNLOCKS;
                                                return (
                                                    <>
                                                        <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                            <HelpCircle size={13} className="text-amber-500" /> Hints & Strategy
                                                            <span className="text-[9px] text-amber-500 font-black ml-auto bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/15">
                                                                Limit: {unlockedCount} / {MAX_ALLOWED_UNLOCKS} Unlocked
                                                            </span>
                                                        </span>
                                                        {(() => {
                                                            try {
                                                                const hintsList = JSON.parse(selected.hints).slice(0, MAX_HINTS);
                                                                return hintsList.map((hint, idx) => {
                                                                    const isUnlocked = unlockedHints[idx];
                                                                    return (
                                                                        <div key={idx} className="bg-amber-50/60 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30 rounded-xl p-3.5 flex items-center justify-between gap-4">
                                                                            {isUnlocked ? (
                                                                                <p className="text-xs font-semibold text-slate-650 dark:text-slate-350 leading-relaxed">
                                                                                    <span className="text-amber-600 dark:text-amber-400 font-extrabold mr-1">Hint {idx + 1}:</span> {hint}
                                                                                </p>
                                                                            ) : (
                                                                                <>
                                                                                    <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
                                                                                        <Lock size={12} className={isLimitReached ? "text-slate-400" : "text-amber-500"} /> Hint {idx + 1} locked
                                                                                    </span>
                                                                                    {isLimitReached ? (
                                                                                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200/40 dark:border-slate-800/40">
                                                                                            Locked
                                                                                            </span>
                                                                                    ) : (
                                                                                        <button 
                                                                                            onClick={() => unlockHint(idx)}
                                                                                            className="text-[10px] font-extrabold text-amber-500 hover:text-amber-600 flex items-center gap-1 shrink-0 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/15 transition-all"
                                                                                        >
                                                                                            <Unlock size={11} /> Reveal
                                                                                        </button>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                });
                                                            } catch (e) {
                                                                return <p className="text-xs text-slate-450 italic">No hints loaded</p>;
                                                            }
                                                        })()}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>

                                {/* Solution Explanation */}
                                {selected.solutionExplanation && (
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-900">
                                        {!showExplanation ? (
                                            <button 
                                                onClick={() => setShowExplanation(true)}
                                                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 text-xs font-extrabold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5"
                                            >
                                                <Sparkles size={14} className="text-amber-500 animate-pulse" />
                                                Reveal Optimal Solution Strategy
                                            </button>
                                        ) : (
                                            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                        <Sparkles size={14} /> Solution Strategy
                                                    </h4>
                                                    <button 
                                                        onClick={() => setShowExplanation(false)}
                                                        className="text-[10px] text-slate-400 font-extrabold hover:text-slate-600 dark:hover:text-slate-300"
                                                    >
                                                        Hide
                                                    </button>
                                                </div>
                                                <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                                                    {selected.solutionExplanation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* IDE Panel */}
                            <div className="glass-card flex flex-col h-[85vh] overflow-hidden bg-slate-950 border border-slate-900 rounded-2xl relative">
                                
                                {/* Editor Header controls */}
                                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-900 bg-slate-950/80 z-10 shrink-0">
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowLangDropdown(p => !p)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-violet-600 text-white shadow-sm hover:bg-violet-700 transition-all"
                                        >
                                            <span>{currentLang.icon}</span>
                                            <span>{currentLang.label}</span>
                                            <span className="text-white/60">▾</span>
                                        </button>
                                        {showLangDropdown && (
                                            <div className="absolute top-9 left-0 z-30 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 grid grid-cols-3 gap-1 w-64">
                                                {LANGUAGES.map(lang => (
                                                    <button
                                                        key={lang.id}
                                                        onClick={() => changeLanguage(lang.id)}
                                                        className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-bold transition-all ${
                                                            language === lang.id
                                                                ? 'bg-violet-600 text-white'
                                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                        }`}
                                                    >
                                                        <span>{lang.icon}</span> {lang.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Fallback Switch */}
                                        <button
                                            onClick={() => setUseFallback(!useFallback)}
                                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded border transition-colors flex items-center gap-1 ${
                                                useFallback 
                                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                                                    : 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                                            }`}
                                            title="Toggle between Monaco advanced editor and standard text editor"
                                        >
                                            <Settings size={10} />
                                            {useFallback ? 'Using Text Editor' : 'Use Text Editor'}
                                        </button>

                                        {/* Font Size Selector */}
                                        {!useFallback && (
                                            <div className="flex items-center gap-1">
                                                <select 
                                                    value={fontSize} 
                                                    onChange={e => setFontSize(parseInt(e.target.value))}
                                                    className="bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 rounded px-1.5 py-0.5 focus:outline-none"
                                                >
                                                    <option value={12}>12px</option>
                                                    <option value={14}>14px</option>
                                                    <option value={16}>16px</option>
                                                    <option value={18}>18px</option>
                                                </select>
                                            </div>
                                        )}

                                        {/* Theme Toggle */}
                                        {!useFallback && (
                                            <button
                                                onClick={() => setEditorTheme(theme => theme === 'vs-dark' ? 'light' : 'vs-dark')}
                                                className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 rounded px-2 py-0.5 hover:text-slate-200"
                                            >
                                                {editorTheme === 'vs-dark' ? 'Dark theme' : 'Light theme'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Editor Canvas Area */}
                                <div className="flex-1 flex flex-col min-h-[200px] overflow-hidden">
                                    {/* Standard Text Editor (resilient fallback if CDN hangs / offline) */}
                                    {useFallback ? (
                                        <div className="flex-1 flex font-mono bg-slate-955 text-slate-200 p-2 overflow-hidden border-t border-slate-900 select-none">
                                            {/* Line Numbers Strip */}
                                            <div className="w-10 text-right pr-3 select-none text-slate-650 border-r border-slate-900 flex flex-col text-xs leading-relaxed py-1">
                                                {code.split('\n').map((_, idx) => (
                                                    <div key={idx}>{idx + 1}</div>
                                                ))}
                                            </div>
                                            {/* Text Area Input */}
                                            <textarea
                                                ref={fallbackTextareaRef}
                                                value={code}
                                                onChange={e => setCode(e.target.value)}
                                                onKeyDown={handleFallbackKeyDown}
                                                spellCheck="false"
                                                className="flex-1 bg-transparent text-xs leading-relaxed outline-none border-none resize-none pl-3 font-mono text-emerald-400 dark:text-emerald-300 w-full h-full py-1 focus:ring-0"
                                                style={{ fontFamily: 'Fira Code, monospace', tabSize: 4 }}
                                            />
                                        </div>
                                    ) : (
                                        /* Advanced Monaco Editor component */
                                        <div className="flex-1 relative h-full">
                                            {monacoLoading && (
                                                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center z-20 text-center p-6 space-y-4">
                                                    <Loader2 className="animate-spin text-primary-500" size={32} />
                                                    <div className="space-y-1.5">
                                                        <p className="text-xs font-bold text-slate-350">Initializing Development Environment...</p>
                                                        <p className="text-[10px] text-slate-500 max-w-xs">
                                                            If Monaco takes too long, you can instantly toggle the standard text editor above.
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => setUseFallback(true)}
                                                        className="text-xs font-extrabold bg-slate-900 hover:bg-slate-850 text-slate-300 px-4 py-2 rounded-xl border border-slate-800"
                                                    >
                                                        Switch to Standard Text Editor
                                                    </button>
                                                </div>
                                            )}
                                            <Editor
                                                height="100%"
                                                language={currentLang.monacoLang}
                                                theme={editorTheme}
                                                value={code}
                                                onChange={value => setCode(value || '')}
                                                loading={<div className="text-slate-400 text-xs font-bold text-center py-12">Loading compiler assets...</div>}
                                                options={{
                                                    fontSize: fontSize,
                                                    fontFamily: 'Fira Code, monospace',
                                                    minimap: { enabled: false },
                                                    automaticLayout: true,
                                                    padding: { top: 16, bottom: 16 },
                                                    tabSize: 4,
                                                    cursorBlinking: 'smooth',
                                                    renderLineHighlight: 'all'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Consolidated Interactive Console */}
                                {!isConsoleCollapsed && (() => {
                                    let testCases = [];
                                    try {
                                        testCases = JSON.parse(selected.testCases || '[]');
                                    } catch (e) {}
                                    
                                    return (
                                        <div className="border-t border-slate-900 bg-slate-950 flex flex-col h-[280px] shrink-0">
                                            {/* Console Header Tabs */}
                                            <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-900 flex items-center justify-between gap-4 shrink-0">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => setConsoleTab('testcase')}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                                                            consoleTab === 'testcase'
                                                                ? 'bg-slate-805 dark:bg-slate-800 text-slate-200'
                                                                : 'text-slate-400 hover:text-slate-200'
                                                        }`}
                                                    >
                                                        Test Cases
                                                    </button>
                                                    <button
                                                        onClick={() => setConsoleTab('custom')}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                                                            consoleTab === 'custom'
                                                                ? 'bg-slate-805 dark:bg-slate-800 text-slate-200'
                                                                : 'text-slate-400 hover:text-slate-200'
                                                        }`}
                                                    >
                                                        Custom Input
                                                    </button>
                                                    {runResult && (
                                                        <button
                                                            onClick={() => setConsoleTab('result')}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                                                                consoleTab === 'result'
                                                                    ? 'bg-slate-805 dark:bg-slate-800 text-slate-200'
                                                                    : 'text-slate-400 hover:text-slate-200'
                                                            }`}
                                                        >
                                                            <span className={`h-1.5 w-1.5 rounded-full ${runResult.success ? 'bg-sky-500' : 'bg-rose-500'}`} />
                                                            Run Result
                                                        </button>
                                                    )}
                                                    {submitResult && (
                                                        <button
                                                            onClick={() => setConsoleTab('submission')}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                                                                consoleTab === 'submission'
                                                                    ? 'bg-slate-805 dark:bg-slate-800 text-slate-200'
                                                                    : 'text-slate-400 hover:text-slate-200'
                                                            }`}
                                                        >
                                                            <span className={`h-1.5 w-1.5 rounded-full ${submitResult.success ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                            Submission
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Console Content Body */}
                                            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin bg-slate-950/20">
                                                
                                                {/* TEST CASES TAB */}
                                                {consoleTab === 'testcase' && (
                                                    <div className="space-y-4">
                                                        {testCases.length === 0 ? (
                                                            <p className="text-xs text-slate-400 italic">No sample test cases available.</p>
                                                        ) : (
                                                            <>
                                                                <div className="flex gap-2">
                                                                    {testCases.map((tc, idx) => (
                                                                        <button
                                                                            key={idx}
                                                                            onClick={() => setSelectedTestCaseIdx(idx)}
                                                                            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                                                                                selectedTestCaseIdx === idx
                                                                                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                                                                                    : 'text-slate-400 hover:text-slate-205 bg-slate-900 border border-transparent'
                                                                            }`}
                                                                        >
                                                                            Case {idx + 1}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                
                                                                {testCases[selectedTestCaseIdx] && (
                                                                    <div className="space-y-3 mt-1">
                                                                        <div>
                                                                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1">Input</span>
                                                                            <pre className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-350 whitespace-pre-wrap select-all">
                                                                                {testCases[selectedTestCaseIdx].input || '(empty input)'}
                                                                            </pre>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1">Expected Output</span>
                                                                            <pre className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-350 whitespace-pre-wrap select-all">
                                                                                {testCases[selectedTestCaseIdx].output || '(empty output)'}
                                                                            </pre>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                {/* CUSTOM INPUT TAB */}
                                                {consoleTab === 'custom' && (
                                                    <div className="space-y-2">
                                                        <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                            <Terminal size={12} className="text-primary-500" /> Custom Stdin Console Input
                                                        </span>
                                                        <textarea
                                                            value={customInput}
                                                            onChange={e => setCustomInput(e.target.value)}
                                                            placeholder="Provide standard input lines for your program..."
                                                            className="w-full h-36 bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs focus:outline-none focus:border-primary-500/40 text-slate-300 resize-none"
                                                        />
                                                    </div>
                                                )}

                                                {/* RUN RESULTS TAB */}
                                                {consoleTab === 'result' && runResult && (
                                                    <div className="space-y-4">
                                                        {/* Status Block */}
                                                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                                            <div className="flex items-center gap-2">
                                                                {runResult.success ? (
                                                                    (() => {
                                                                        const isCustomRun = runResult.expectedOutput === null;
                                                                        const match = !isCustomRun && runResult.stdout && runResult.stdout.trim() === runResult.expectedOutput.trim();
                                                                        
                                                                        if (isCustomRun) {
                                                                            return (
                                                                                <>
                                                                                    <CheckCircle size={18} className="text-sky-500 animate-pulse" />
                                                                                    <span className="font-extrabold text-sm text-sky-500">Run Finished</span>
                                                                                </>
                                                                            );
                                                                        } else if (match) {
                                                                            return (
                                                                                <>
                                                                                    <CheckCircle size={18} className="text-emerald-500 animate-pulse" />
                                                                                    <span className="font-extrabold text-sm text-emerald-500">Accepted</span>
                                                                                </>
                                                                            );
                                                                        } else {
                                                                            return (
                                                                                <>
                                                                                    <XCircle size={18} className="text-rose-500 animate-pulse" />
                                                                                    <span className="font-extrabold text-sm text-rose-500">Wrong Answer</span>
                                                                                </>
                                                                            );
                                                                        }
                                                                    })()
                                                                ) : (
                                                                    <>
                                                                        <AlertTriangle size={18} className="text-rose-500 animate-pulse" />
                                                                        <span className="font-extrabold text-sm text-rose-500">
                                                                            {runResult.compilationError ? 'Compilation Error' : 'Runtime Error'}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] text-slate-400 font-mono">
                                                                Input Source: {runResult.expectedOutput === null ? 'Custom Input' : `Sample Case ${selectedTestCaseIdx + 1}`}
                                                            </span>
                                                        </div>

                                                        {/* Error diagnostic visualization */}
                                                        {!runResult.success && (() => {
                                                            const errText = runResult.stderr || runResult.stdout || '';
                                                            const errDetails = parseErrorDetails(errText, runResult.compilationError, code);
                                                            
                                                            return (
                                                                <div className="space-y-3">
                                                                    <div className="bg-rose-500/10 border border-rose-500/15 rounded-xl p-4 text-xs font-semibold text-rose-250 leading-relaxed whitespace-pre-wrap font-mono">
                                                                        {errText}
                                                                    </div>
                                                                    
                                                                    {errDetails && errDetails.lineNumber && (
                                                                        <div className="bg-rose-95/20 border border-rose-500/20 rounded-xl p-4 font-mono text-xs text-rose-200">
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <span className="font-extrabold text-rose-400 text-sm">Line Diagnostic</span>
                                                                                <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded text-[10px] font-bold">Line {errDetails.lineNumber}</span>
                                                                            </div>
                                                                            
                                                                            <div className="bg-slate-950 rounded-lg p-3 space-y-1 mt-2 border border-slate-900">
                                                                                {/* Previous line */}
                                                                                {errDetails.lineNumber > 1 && (
                                                                                    <div className="text-slate-500 opacity-60 flex">
                                                                                        <span className="w-8 select-none text-right pr-3">{errDetails.lineNumber - 1}</span>
                                                                                        <span className="truncate">{errDetails.codeLines[errDetails.lineNumber - 2]}</span>
                                                                                    </div>
                                                                                )}
                                                                                {/* Error line */}
                                                                                <div className="bg-rose-500/15 text-rose-200 border-l-2 border-rose-500 flex py-1">
                                                                                    <span className="w-8 select-none text-right pr-3 text-rose-400 font-bold">{errDetails.lineNumber}</span>
                                                                                    <span className="font-bold truncate">{errDetails.codeLines[errDetails.lineNumber - 1]}</span>
                                                                                </div>
                                                                                {/* Next line */}
                                                                                {errDetails.lineNumber < errDetails.codeLines.length && (
                                                                                    <div className="text-slate-500 opacity-60 flex">
                                                                                        <span className="w-8 select-none text-right pr-3">{errDetails.lineNumber + 1}</span>
                                                                                        <span className="truncate">{errDetails.codeLines[errDetails.lineNumber]}</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })()}

                                                        {/* Normal output visualizer */}
                                                        {runResult.success && (
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1">Input Used</span>
                                                                    <pre className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-350 whitespace-pre-wrap select-all">
                                                                        {runResult.inputUsed || '(empty input)'}
                                                                    </pre>
                                                                </div>
                                                                <div>
                                                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1">Your Output</span>
                                                                    <pre className="bg-slate-955 border border-slate-900 rounded-xl p-3 font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                                                                        {runResult.stdout || '(no output captured)'}
                                                                    </pre>
                                                                </div>
                                                                {runResult.expectedOutput !== null && (
                                                                    <div>
                                                                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1">Expected Output</span>
                                                                        <pre className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-400 whitespace-pre-wrap">
                                                                            {runResult.expectedOutput}
                                                                        </pre>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* SUBMISSIONS TAB */}
                                                {consoleTab === 'submission' && submitResult && (
                                                    <div className="space-y-4">
                                                        {/* Submit Status Header */}
                                                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                                            <div className="flex items-center gap-2">
                                                                {submitResult.success ? (
                                                                    <>
                                                                        <CheckCircle size={18} className="text-emerald-500" />
                                                                        <span className="font-extrabold text-sm text-emerald-500">All Test Cases Passed</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <XCircle size={18} className="text-rose-500" />
                                                                        <span className="font-extrabold text-sm text-rose-500">
                                                                            {submitResult.compilationError ? 'Compilation Error' : 'Some Test Cases Failed'}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-slate-400 font-extrabold">
                                                                Score: {submitResult.passedCount || 0} / {submitResult.totalCount || 0}
                                                            </span>
                                                        </div>

                                                        <p className="text-xs font-semibold text-slate-350">
                                                            {submitResult.message}
                                                        </p>

                                                        {submitResult.compilationError ? (
                                                            <pre className="bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-xs text-rose-500 whitespace-pre-wrap">
                                                                {submitResult.message || 'Compiler execution error.'}
                                                            </pre>
                                                        ) : submitResult.testCases && (
                                                            <div className="grid gap-3 sm:grid-cols-2">
                                                                {submitResult.testCases.map(tc => (
                                                                    <div 
                                                                        key={tc.testCaseIndex} 
                                                                        className={`text-xs rounded-xl p-3 border ${
                                                                            tc.status === 'Passed' 
                                                                                ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-350' 
                                                                                : 'bg-rose-500/5 border-rose-500/20 text-slate-300'
                                                                        } font-mono`}
                                                                    >
                                                                        <div className="flex justify-between font-bold mb-1.5">
                                                                            <span>Test Case #{tc.testCaseIndex + 1}</span>
                                                                            <span className={tc.status === 'Passed' ? 'text-emerald-500' : 'text-rose-500'}>
                                                                                {tc.status}
                                                                            </span>
                                                                        </div>
                                                                        <div className="space-y-0.5 text-[10px] text-slate-500">
                                                                            <div className="truncate">Input: <span className="font-bold text-slate-400">{tc.input}</span></div>
                                                                            <div className="truncate">Expected: <span className="font-bold text-slate-400">{tc.expectedOutput}</span></div>
                                                                            <div className="truncate">Actual: <span className={`font-bold ${tc.status === 'Passed' ? 'text-emerald-500' : 'text-rose-500'}`}>{tc.actualOutput}</span></div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Action Bar (Run vs Submit) at the bottom */}
                                <div className="p-3 border-t border-slate-900 bg-slate-950/90 flex justify-between items-center gap-3 shrink-0">
                                    <button 
                                        onClick={() => setIsConsoleCollapsed(prev => !prev)}
                                        className="text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all text-slate-400 hover:bg-slate-900 hover:text-slate-350"
                                    >
                                        <Terminal size={12} />
                                        Console {isConsoleCollapsed ? '▲' : '▼'}
                                    </button>
                                    
                                    <div className="flex items-center gap-2.5">
                                        <button
                                            onClick={handleRunCode}
                                            disabled={runningCode || submitting}
                                            className="bg-slate-900 hover:bg-slate-850 text-slate-350 px-5 py-2 rounded-xl text-xs font-bold transition-all border border-slate-800 flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {runningCode ? <Loader2 size={13} className="animate-spin text-slate-400" /> : <Play size={12} />}
                                            Run Code
                                        </button>
                                        <button 
                                            onClick={handleSubmit} 
                                            disabled={runningCode || submitting}
                                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 disabled:opacity-50 shadow-md shadow-emerald-500/10 transition-all hover:scale-[1.01]"
                                        >
                                            {submitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={12} />}
                                            Submit Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                            </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodingArena;
