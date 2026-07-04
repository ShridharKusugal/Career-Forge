import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bot, 
    MessageCircle, 
    Send, 
    User, 
    Loader2, 
    Star, 
    RotateCcw, 
    Mic, 
    Sparkles, 
    Download, 
    Compass, 
    Award, 
    HelpCircle, 
    CheckCircle2, 
    AlertCircle, 
    ChevronRight,
    Play,
    Clock,
    Volume2,
    Calendar,
    History,
    FileText,
    ArrowLeft
} from 'lucide-react';
import { 
    ResponsiveContainer, 
    RadarChart, 
    PolarGrid, 
    PolarAngleAxis, 
    PolarRadiusAxis, 
    Radar 
} from 'recharts';

// Advanced Client-side Question Bank — 10 domains × 4 rounds
const QUESTION_BANK = {
    'Data Structures & Algorithms': {
        1: [
            "Explain the difference between an Array and a Linked List, and when you would use one over the other.",
            "Describe how a Hash Map operates internally, and what occurs during a collision."
        ],
        2: [
            "How does Binary Search work, and what is its time complexity? Can it be applied to an unsorted list?",
            "What is the difference between Depth First Search (DFS) and Breadth First Search (BFS)? When is BFS preferred?"
        ],
        3: [
            "Explain the concept of Dynamic Programming and how it differs from a simple divide-and-conquer strategy.",
            "What is a priority queue, and how is it implemented? What is the complexity of insert/extract operations?"
        ],
        4: [
            "Why do you want to specialize in Algorithm design? Describe your approach when facing a brand-new LeetCode challenge."
        ]
    },
    'System Design': {
        1: [
            "What is Horizontal Scaling vs Vertical Scaling, and how do you decide which one to use?",
            "What is the role of a Load Balancer in a distributed system? List three load balancing algorithms."
        ],
        2: [
            "Explain the CAP Theorem and its implications on designing highly-available databases.",
            "What is Database Sharding, and what are the major challenges associated with it?"
        ],
        3: [
            "How would you design a rate limiter for a public API? What data structure would you use to track client requests?",
            "Explain how CDN (Content Delivery Network) caching works and how it improves latency."
        ],
        4: [
            "Imagine you are the Lead Architect for a high-traffic e-commerce system. How do you handle sudden traffic spikes during a flash sale?"
        ]
    },
    'Full Stack Development': {
        1: [
            "Explain how client-server communication works. What is the difference between REST APIs and GraphQL?",
            "What is JWT (JSON Web Token) authentication, and how do you secure it on the frontend and backend?"
        ],
        2: [
            "What is the Virtual DOM in React, and how does React optimize rendering updates using it?",
            "Explain CORS (Cross-Origin Resource Sharing) and how a developer should resolve CORS issues on a Spring Boot server."
        ],
        3: [
            "What is the difference between SQL and NoSQL databases? When would you choose MongoDB over MySQL?",
            "What is a State Management library (like Redux or Zustand)? Why and when should you use one in React?"
        ],
        4: [
            "Describe a full-stack project you built recently. What was the tech stack, what challenges did you face, and how did you resolve them?"
        ]
    },
    'Core Java': {
        1: [
            "Explain the memory regions in Java (Heap vs Stack) and how Java's Garbage Collection mechanism works.",
            "What is the difference between '==' and '.equals()' in Java? Provide an example."
        ],
        2: [
            "What are Java Interfaces vs Abstract Classes? When should you choose one over the other in Java 8+?",
            "Explain Exception Handling in Java. What is the difference between checked and unchecked exceptions?"
        ],
        3: [
            "What is a thread pool in Java? Explain the Executor framework and how multithreading is managed.",
            "What is Java Reflection API, and what are some common use cases or security concerns with it?"
        ],
        4: [
            "Why is Java preferred for heavy enterprise applications, and how do OOPs principles help maintain scalability?"
        ]
    },
    'Google SWE Interview': {
        1: [
            "Introduce yourself. Why do you want to join Google, and what technology area are you most passionate about?",
            "Explain your understanding of Google's culture and how you demonstrate 'Googliness' in collaborative projects."
        ],
        2: [
            "Let's write an algorithm to find the shortest path in a dynamic grid. Which algorithm is best, and why?",
            "Explain how you would implement an autocomplete search suggestion engine with billions of queries per day."
        ],
        3: [
            "How do you ensure your code is highly performant and free of memory leaks? Describe your debugging workflow.",
            "Describe the internal working of Google File System (GFS) or MapReduce at a high level."
        ],
        4: [
            "Tell me about a time you had a technical disagreement with a team member. How did you handle it to ensure project success?"
        ]
    },
    'TCS NQT Preparation': {
        1: [
            "Introduce yourself and tell us why you want to start your professional career with TCS.",
            "What is your final year project about? Explain the technology stack and your specific contribution."
        ],
        2: [
            "What is the difference between compiler and interpreter? Which one does Java use?",
            "Explain static variables and methods in Java. Can a static method access non-static variables?"
        ],
        3: [
            "What is DBMS, and what are normalizations? Why do we normalize database tables?",
            "What is Cloud Computing, and what is the difference between IaaS, PaaS, and SaaS?"
        ],
        4: [
            "TCS values integrity, excellence, and respect. How do you handle work-related pressure or tight deadlines?"
        ]
    }
};

// Extend question bank with more advanced domains
Object.assign(QUESTION_BANK, {
    'Machine Learning & AI': {
        1: [
            "Explain the difference between supervised, unsupervised, and reinforcement learning with real-world examples.",
            "What is overfitting, and how do you prevent it using regularization techniques?"
        ],
        2: [
            "Describe the architecture of a Transformer model. How does the self-attention mechanism work?",
            "What is gradient descent? Explain variants: SGD, Adam, and RMSProp."
        ],
        3: [
            "How would you design an end-to-end ML pipeline for a fraud detection system at scale?",
            "Explain Bias-Variance tradeoff and how you balance it when tuning a model."
        ],
        4: [
            "Walk me through a real ML project you built. What data preprocessing challenges did you face?"
        ]
    },
    'Cloud & DevOps': {
        1: [
            "What is the difference between IaaS, PaaS, and SaaS? Give examples of each.",
            "Explain the concept of containerization. Why is Docker preferred over VMs?"
        ],
        2: [
            "What is Kubernetes, and how does it manage container orchestration?",
            "Describe a CI/CD pipeline. What tools have you used to automate deployment?"
        ],
        3: [
            "How would you design a zero-downtime blue-green deployment strategy on AWS?",
            "Explain auto-scaling in AWS. What metrics trigger scale-out events?"
        ],
        4: [
            "You inherit a production system with no documentation. How do you approach understanding and improving its reliability?"
        ]
    },
    'Cyber Security': {
        1: [
            "What is the CIA Triad in information security? Explain each component.",
            "Explain the difference between symmetric and asymmetric encryption with examples."
        ],
        2: [
            "What is SQL Injection, and how do you prevent it in a Spring Boot application?",
            "Describe how HTTPS works. What role does TLS handshake play?"
        ],
        3: [
            "How would you perform a penetration test on a web application? List the phases.",
            "What is a zero-day vulnerability? How do organizations respond to them?"
        ],
        4: [
            "A major data breach occurs at your company. Walk me through your incident response plan."
        ]
    },
    'Database Engineering': {
        1: [
            "What is normalization? Explain 1NF, 2NF, and 3NF with an example.",
            "Explain ACID properties in database transactions."
        ],
        2: [
            "What is the difference between clustered and non-clustered indexes?",
            "Explain database connection pooling and why it improves performance."
        ],
        3: [
            "Design a database schema for a multi-tenant SaaS application. What are the trade-offs?",
            "How would you optimize a slow JOIN query on a table with 100 million rows?"
        ],
        4: [
            "Our production database is hitting 95% CPU. Walk me through your immediate and long-term remediation steps."
        ]
    }
});

const SUGGESTIONS = [
    "What are the OWASP Top 10 security vulnerabilities?",
    "Explain the four pillars of Java OOPs with examples.",
    "How do I optimize my resume ATS score?",
    "Give me tips for passing a Google SWE coding round.",
    "What is the difference between REST and GraphQL?",
    "How does Kubernetes manage container orchestration?",
    "Explain Transformer architecture in deep learning.",
    "What is database sharding and when should I use it?"
];

// Helper to provide detailed simulated text answers when speaking is finished
const getSimulatedSpeechAnswer = (q) => {
    const text = q.toLowerCase();
    if (text.includes("array") && text.includes("linked list")) {
        return "Arrays store elements in contiguous memory locations, offering O(1) index-based access but O(N) resizing and shifting cost. Linked lists use pointers, enabling O(1) insertions/deletions but O(N) traversal. I would choose arrays for random access and linked lists for dynamic queue applications.";
    }
    if (text.includes("hash map") || text.includes("collision")) {
        return "A Hash Map computes a key hash to map it to a bucket index. On collision, it implements separate chaining using linked lists (which upgrade to red-black trees in Java 8 if threshold exceeds 8) or open addressing methods like quadratic probing.";
    }
    if (text.includes("binary search")) {
        return "Binary Search is a divide-and-conquer algorithm with O(log N) time complexity. It works by repeatedly halving the search interval. It requires the collection to be sorted beforehand, so it cannot be applied directly to unsorted arrays.";
    }
    if (text.includes("dfs") || text.includes("bfs")) {
        return "DFS uses a stack (or recursion) to explore paths deeply before backtracking. BFS uses a queue to visit neighbors layer-by-layer. BFS is preferred for finding the shortest path on unweighted graphs.";
    }
    if (text.includes("dynamic programming")) {
        return "Dynamic Programming solves complex problems by breaking them down into overlapping subproblems, solving them once, and storing results using memoization or tabulation. Divide-and-conquer, by contrast, solves independent subproblems.";
    }
    if (text.includes("priority queue")) {
        return "A priority queue is typically implemented using a binary heap, where insert and extract-min/max operations run in O(log N) time. It retrieves the element with the highest priority first rather than FIFO order.";
    }
    if (text.includes("horizontal scaling")) {
        return "Horizontal scaling means adding more machines/nodes to your pool to share load, while vertical scaling adds resources like CPU/RAM to a single server. I would choose horizontal scaling for high-availability systems.";
    }
    if (text.includes("load balancer")) {
        return "A load balancer distributes incoming network traffic across multiple servers. Common algorithms include Round Robin, Least Connections, and IP Hashing, which prevent any single server from becoming a bottleneck.";
    }
    if (text.includes("cap theorem")) {
        return "The CAP Theorem states that a distributed system can guarantee at most two out of three properties: Consistency (every read receives the most recent write), Availability (every request receives a non-error response), and Partition Tolerance.";
    }
    if (text.includes("sharding")) {
        return "Database sharding is horizontal partitioning of data across multiple database instances. Challenges include handling cross-shard queries, maintaining joins, re-sharding hot keys, and distributed transaction management.";
    }
    if (text.includes("rate limiter")) {
        return "A rate limiter restricts the number of requests a client can make in a given timeframe. Common implementations use token bucket, sliding window counter, or leaky bucket algorithms stored in Redis.";
    }
    if (text.includes("cdn")) {
        return "CDNs cache static assets (like images, JS, CSS) at edge servers globally, closer to users. This reduces server latency, prevents backend load, and increases availability.";
    }
    if (text.includes("client-server")) {
        return "REST APIs are stateless, using standard HTTP methods and resource endpoints. GraphQL is a query language where clients specify exactly what fields they want in a single request, preventing over-fetching and under-fetching.";
    }
    if (text.includes("jwt")) {
        return "JWT is a stateless token containing a header, payload, and signature. On the frontend, it should be stored in secure HttpOnly cookies. On the backend, we verify the signature filter on incoming requests.";
    }
    if (text.includes("virtual dom")) {
        return "The Virtual DOM is an in-memory representation of the real DOM. React uses a reconciliation diffing algorithm to compare changes, then batch-updates only the modified nodes to optimize performance.";
    }
    if (text.includes("cors")) {
        return "CORS is a browser security mechanism that restricts resources requested from another domain. To solve it in Spring Boot, we add the @CrossOrigin annotation or configure a WebMvcConfigurer with allowed origins.";
    }
    if (text.includes("sql") && text.includes("nosql")) {
        return "SQL databases are relational and structured with strict schemas, ideal for ACID transactions. NoSQL databases are document-oriented or key-value based, optimized for horizontal scale and unstructured data.";
    }
    if (text.includes("redux") || text.includes("zustand")) {
        return "State management libraries provide a centralized store for shared state, preventing prop-drilling. Zustand uses simple hooks, while Redux uses actions and reducers. Use them when state is shared widely across distant views.";
    }
    if (text.includes("heap vs stack") || text.includes("garbage collection")) {
        return "The stack stores method calls, local variables, and primitive types in LIFO order. The heap stores dynamic objects. Garbage collection runs in the heap, scanning roots to free unreachable objects.";
    }
    if (text.includes("==") && text.includes(".equals()")) {
        return "'==' compares reference equality (whether objects point to the same memory location). '.equals()' compares structural value equality. For strings, '.equals()' must always be used.";
    }
    if (text.includes("interfaces vs abstract classes")) {
        return "Interfaces define contracts (fully abstract before Java 8 default methods). Abstract classes can store instance state and non-abstract methods. Classes can implement multiple interfaces but inherit only one class.";
    }
    if (text.includes("exception handling")) {
        return "Checked exceptions must be declared in throws or caught at compile time. Unchecked exceptions extend RuntimeException and occur during execution (like NullPointerException). We use try-catch-finally blocks.";
    }
    if (text.includes("thread pool")) {
        return "A thread pool manages a queue of worker threads. The Executor framework manages thread pools, reducing the overhead of creating new threads for every task and preventing server resource exhaustion.";
    }
    if (text.includes("reflection api")) {
        return "Java Reflection allows analyzing and mutating classes, constructors, methods, and fields at runtime, bypassing access controls. It is used in frameworks like Spring but can impact performance and security.";
    }
    if (text.includes("tcs") && text.includes("career")) {
        return "I wish to start my career with TCS due to its massive scale, outstanding learning resources, and career progression avenues. I want to apply my technical knowledge in Java and web development to solve real-world problems.";
    }
    if (text.includes("googliness")) {
        return "Googliness means doing the right thing, valuing diversity, intellectual humility, thriving in ambiguity, and showing collaborative teamwork. I demonstrate this by helping team members and maintaining open communication.";
    }
    return "To answer this question, we must look at the key requirements, examine trade-offs, choose the right technology framework, and structure our logic to cover both edge cases and optimal performance configurations.";
};

const MockInterview = () => {
    // Chatbot State
    const [messages, setMessages] = useState([
        { from: 'bot', text: "Welcome to the CareerForge Placement Assistant! I'm here to help you prep for coding rounds, resume building, and technical interviews. Click any suggestion below or type your queries!" }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [typing, setTyping] = useState(false);

    // Mock Interview State
    const [interviewActive, setInterviewActive] = useState(false);
    const [interviewField, setInterviewField] = useState('Data Structures & Algorithms');
    const [stage, setStage] = useState(0); // 0: Config, 1: Intro, 2: Tech 1, 3: Tech 2, 4: HR, 5: Done
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [interviewLoading, setInterviewLoading] = useState(false);
    const [transcript, setTranscript] = useState([]); // Array of { stageName, question, answer, feedback, score }
    const [chartData, setChartData] = useState([]);
    const [overallEval, setOverallEval] = useState('');
    const [overallScore, setOverallScore] = useState(0);
    const [activeTab, setActiveTab] = useState('chat'); // chat | interview

    // Timer constraints per question (120s limit)
    const [timeLeft, setTimeLeft] = useState(120);
    const timerIntervalRef = useRef(null);

    // Voice simulation simulator
    const [speakingMode, setSpeakingMode] = useState(false);
    const [speakingTime, setSpeakingTime] = useState(0);
    const speakingIntervalRef = useRef(null);
    const [simulatedTranscript, setSimulatedTranscript] = useState('');

    // Session History Logs
    const [historyLogs, setHistoryLogs] = useState([]);
    const [viewingHistorySession, setViewingHistorySession] = useState(null);

    const messageEndRef = useRef(null);
    const userAnswerRef = useRef('');

    useEffect(() => {
        userAnswerRef.current = userAnswer;
    }, [userAnswer]);

    // Load History logs on mount
    useEffect(() => {
        const logs = JSON.parse(localStorage.getItem('careerforge_interview_history') || '[]');
        setHistoryLogs(logs);
    }, []);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            stopAllTimers();
        };
    }, []);

    const stopAllTimers = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (speakingIntervalRef.current) clearInterval(speakingIntervalRef.current);
    };

    // Starts countdown timer for the current question
    const startQuestionTimer = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setTimeLeft(120);
        
        timerIntervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerIntervalRef.current);
                    autoSubmitAnswer();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Auto submit response when 120s countdown reaches zero
    const autoSubmitAnswer = () => {
        const finalAns = userAnswerRef.current.trim() || "(No response recorded within the 120-second time constraint)";
        submitAnswerDirect(finalAns);
    };

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    // Send a message via custom pattern matcher + backend assistant
    const sendChatMessage = async (customMsg = null) => {
        const msg = (customMsg || chatInput).trim();
        if (!msg || chatLoading) return;

        setMessages(prev => [...prev, { from: 'user', text: msg }]);
        setChatInput('');
        setChatLoading(true);
        setTyping(true);

        try {
            await new Promise(r => setTimeout(r, 600));
            const clean = msg.toLowerCase();
            let reply = "";

            if (clean.includes("tcs") || clean.includes("nqt")) {
                reply = "TCS NQT hiring checks Quantitative Aptitude, Logical Reasoning, Coding, and behavioral compatibility. I highly recommend practicing our 30-question assessments to evaluate your readiness!";
            } else if (clean.includes("resume") || clean.includes("cv") || clean.includes("ats")) {
                reply = "To pass Applicant Tracking Systems (ATS), construct your profile in our Resume Builder to evaluate keyword density matches in real-time, get placement suggestions, and download PDF outputs.";
            } else if (clean.includes("java") || clean.includes("oops") || clean.includes("encapsulation")) {
                reply = "Java OOPs features Abstraction, Encapsulation, Inheritance, and Polymorphism. Try compiling Java code in our Coding Arena or taking our structured Core Java Mock Test!";
            } else if (clean.includes("google") || clean.includes("swe") || clean.includes("faang")) {
                reply = "Google SWE interviews check algorithmic competence and distributed system architectures. Use our Coding Arena to solve challenges under Python, Java, or JavaScript, and test with custom inputs.";
            } else if (clean.includes("rest") || clean.includes("graphql") || clean.includes("api")) {
                reply = "REST APIs expose resource endpoints via standard HTTP methods (GET, POST, etc.). GraphQL allows customized query demands, avoiding over-fetching client payloads.";
            } else if (clean.includes("mock") || clean.includes("interview") || clean.includes("practice")) {
                reply = "Our AI Interview Suite provides technical mock sessions. Switch to the 'Mock Interview' tab, select a domain, and practice under 120-second answer limits!";
            } else if (clean.includes("wipro") || clean.includes("accenture") || clean.includes("infosys")) {
                reply = "Wipro Elite, Infosys, and Accenture ASC candidates are tested on coding fundamentals, cognitive tasks, and core technical MCQs. Practice our Domain Core and Interview Prep assessments to build your speed.";
            } else {
                const res = await axios.post('/api/ai/chat', { message: msg });
                reply = res.data.reply;
            }

            setMessages(prev => [...prev, { from: 'bot', text: reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, I encountered an issue. Let me reset my circuits and try again!' }]);
        } finally {
            setChatLoading(false);
            setTyping(false);
        }
    };

    // Dynamic Mock Interview initialization
    const startInterview = () => {
        setInterviewActive(true);
        setStage(1);
        setUserAnswer('');
        setTranscript([]);
        setOverallEval('');
        setOverallScore(0);
        setViewingHistorySession(null);
        
        // Pick first question from selected field
        const questionsList = QUESTION_BANK[interviewField]?.[1] || ["Explain how you align your technical strengths with our core placement streams."];
        const randomQ = questionsList[Math.floor(Math.random() * questionsList.length)];
        setCurrentQuestion(randomQ);
        startQuestionTimer();
    };

    // Starts Speech Simulator / Voice Simulation
    const handleStartSpeaking = () => {
        if (speakingIntervalRef.current) clearInterval(speakingIntervalRef.current);
        setSpeakingMode(true);
        setSpeakingTime(0);
        setSimulatedTranscript("Configuring placement microphone... Speak clearly.");

        speakingIntervalRef.current = setInterval(() => {
            setSpeakingTime(prev => {
                const next = prev + 1;
                if (next === 2) setSimulatedTranscript("Listening... (Analyzing sentence structures)");
                if (next === 6) setSimulatedTranscript("Listening... (Extracting domain vocabulary keywords)");
                if (next === 12) setSimulatedTranscript("Listening... (Assessing confidence frequencies and cadence)");
                return next;
            });
        }, 1000);
    };

    // Stops speaking & populates answer with simulated speech-to-text response
    const handleStopSpeaking = () => {
        if (speakingIntervalRef.current) clearInterval(speakingIntervalRef.current);
        setSpeakingMode(false);
        const finalGeneratedSpeech = getSimulatedSpeechAnswer(currentQuestion);
        setUserAnswer(finalGeneratedSpeech);
    };

    const submitAnswer = async () => {
        if (interviewLoading) return;
        submitAnswerDirect(userAnswer);
    };

    // Core Submit Answer execution logic — Advanced 7-Competency Scoring
    const submitAnswerDirect = async (answerText) => {
        stopAllTimers();
        setInterviewLoading(true);
        const currentStageNum = stage;

        try {
            await new Promise(r => setTimeout(r, 900));

            const words = answerText.trim().split(/\s+/).filter(Boolean);
            const wordCount = words.length;
            const lc = answerText.toLowerCase();

            // === 7-Competency Scoring Engine ===
            const TECH_KEYWORDS = ['algorithm','complexity','cache','database','api','rest','spring','docker','kubernetes','microservice','thread','concurrency','heap','stack','queue','tree','graph','hash','sql','nosql','redis','kafka','aws','load balancer','sharding','index','transaction','acid','cap theorem','polymorphism','encapsulation','inheritance','abstraction','jvm','garbage collection','tcp','http','jwt'];
            const STRUCT_KEYWORDS = ['first','second','third','because','therefore','for example','in conclusion','to summarize','specifically','additionally','furthermore','approach','steps','process','method','technique'];
            const CONF_PHRASES  = ['i have worked on','i implemented','in my project','i built','i designed','i used','my experience','we deployed','i solved'];

            const techHits   = TECH_KEYWORDS.filter(k => lc.includes(k)).length;
            const structHits  = STRUCT_KEYWORDS.filter(k => lc.includes(k)).length;
            const confHits    = CONF_PHRASES.filter(k => lc.includes(k)).length;
            const sentenceCount = (answerText.match(/[.!?]+/g) || []).length || 1;
            const avgSentLen  = wordCount / sentenceCount;

            // Dimension scores (0–100)
            const technicalAccuracy = Math.min(100, Math.round(15 + techHits * 9 + (wordCount > 40 ? 15 : 0)));
            const communication     = Math.min(100, Math.round(30 + (avgSentLen > 8 && avgSentLen < 30 ? 25 : 10) + structHits * 5 + (wordCount > 30 ? 10 : 0)));
            const problemSolving    = Math.min(100, Math.round(20 + techHits * 7 + (wordCount > 50 ? 20 : 5)));
            const confidence        = Math.min(100, Math.round(35 + confHits * 12 + (wordCount > 25 ? 15 : 0)));
            const structureClarity  = Math.min(100, Math.round(25 + structHits * 10 + (sentenceCount > 2 ? 20 : 0)));
            const domainExpertise   = Math.min(100, Math.round(10 + techHits * 10 + (wordCount > 60 ? 20 : 0)));
            const responseDepth     = Math.min(100, Math.round(Math.min(wordCount * 1.2, 60) + (techHits > 3 ? 20 : 5) + (structHits > 2 ? 15 : 0)));

            const score = Math.round((technicalAccuracy + communication + problemSolving + confidence + structureClarity + domainExpertise + responseDepth) / 7);

            // Personalized feedback
            let feedback = "";
            if (score >= 80) {
                feedback = `Excellent answer — you scored ${score}%. Strong technical vocabulary (${techHits} key terms). Your structured delivery is interview-ready. For perfection, add one real-world example or edge-case mention.`;
            } else if (score >= 60) {
                feedback = `Good response — ${score}%. You covered core concepts but lacked technical depth (only ${techHits} domain terms detected). Add specific tool names, complexity analysis, or an example scenario.`;
            } else if (score >= 40) {
                feedback = `Average — ${score}%. Your answer was too brief (${wordCount} words). Use the STAR format: Situation → Task → Action → Result. Mention ${techHits > 0 ? 'more' : 'specific'} technical keywords.`;
            } else {
                feedback = `Needs improvement — ${score}%. Only ${wordCount} words provided. A complete answer needs 40–100 words with concrete technical references. Review domain fundamentals in the Learning Center.`;
            }

            const stageLabels = {
                1: 'Aptitude / Introduction',
                2: 'Core Technical Round',
                3: 'Advanced Technical Round',
                4: 'HR / Leadership / Behavioral'
            };

            const roundData = {
                stageName: stageLabels[currentStageNum],
                question: currentQuestion,
                answer: answerText,
                feedback,
                score,
                dimensions: { technicalAccuracy, communication, problemSolving, confidence, structureClarity, domainExpertise, responseDepth }
            };

            const updatedTranscript = [...transcript, roundData];
            setTranscript(updatedTranscript);

            if (currentStageNum < 4) {
                const nextStageNum = currentStageNum + 1;
                const nextQuestions = QUESTION_BANK[interviewField]?.[nextStageNum] || ["Tell me about your placement readiness and targets."];
                const randomNextQ = nextQuestions[Math.floor(Math.random() * nextQuestions.length)];
                setUserAnswer('');
                setStage(nextStageNum);
                setCurrentQuestion(randomNextQ);
                startQuestionTimer();
            } else {
                setStage(5);
                const allDims = updatedTranscript.map(r => r.dimensions || {});
                const avg = (key) => Math.round(allDims.reduce((s, d) => s + (d[key] || 0), 0) / allDims.length);
                const finalAvg = Math.round(updatedTranscript.reduce((acc, curr) => acc + curr.score, 0) / 4);
                setOverallScore(finalAvg);

                setChartData([
                    { subject: 'Technical Accuracy', A: avg('technicalAccuracy'), fullMark: 100 },
                    { subject: 'Communication',       A: avg('communication'),    fullMark: 100 },
                    { subject: 'Problem Solving',      A: avg('problemSolving'),   fullMark: 100 },
                    { subject: 'Confidence',           A: avg('confidence'),       fullMark: 100 },
                    { subject: 'Structure & Clarity',  A: avg('structureClarity'), fullMark: 100 },
                    { subject: 'Domain Expertise',     A: avg('domainExpertise'),  fullMark: 100 },
                    { subject: 'Response Depth',       A: avg('responseDepth'),    fullMark: 100 }
                ]);

                let evaluationText = "";
                if (finalAvg >= 80) {
                    evaluationText = `Outstanding performance (${finalAvg}%). You demonstrated strong technical depth, structured communication, and domain confidence. You are ready for top-tier product company interviews. Focus on practicing system design at scale and live coding under pressure.`;
                } else if (finalAvg >= 65) {
                    evaluationText = `Competent performance (${finalAvg}%). Your technical knowledge is solid but responses need more depth. Practice using the STAR method, increase domain keyword usage, and solve 10+ Medium DSA problems in the Coding Arena.`;
                } else if (finalAvg >= 50) {
                    evaluationText = `Developing (${finalAvg}%). Responses were brief and lacked technical vocabulary. Revisit core concepts in the Learning Center, complete the Interview Prep assessment (30 questions), and practice mock interviews daily.`;
                } else {
                    evaluationText = `Needs significant preparation (${finalAvg}%). Start with the Assessments section, complete at least 3 domain courses, and use the AI Chatbot to build foundational concepts before retrying the mock interview.`;
                }
                setOverallEval(evaluationText);

                const newSession = {
                    id: Date.now(),
                    domain: interviewField,
                    date: new Date().toLocaleString(),
                    score: finalAvg,
                    overallEval: evaluationText,
                    transcript: updatedTranscript
                };
                const updatedLogs = [newSession, ...historyLogs];
                setHistoryLogs(updatedLogs);
                localStorage.setItem('careerforge_interview_history', JSON.stringify(updatedLogs));

                // Save mock interview progress to the backend database
                try {
                    await axios.post('/api/ai/mock-interview/save', {
                        score: finalAvg,
                        domain: interviewField
                    });
                } catch (saveErr) {
                    console.error("Failed to save mock interview progress to backend", saveErr);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setInterviewLoading(false);
        }
    };

    // Download session transcripts helper
    const downloadTranscript = (sess = null) => {
        const target = sess || {
            domain: interviewField,
            score: overallScore,
            overallEval: overallEval,
            transcript: transcript
        };

        let content = `CAREERFORGE CAREER PLATFORM - AI MOCK INTERVIEW TRANSCRIPT\n`;
        content += `========================================================\n`;
        content += `Interview Focus: ${target.domain}\n`;
        content += `Overall Score: ${target.score}%\n`;
        content += `AI Evaluation: ${target.overallEval}\n\n`;

        target.transcript.forEach((round, i) => {
            content += `--------------------------------------------------------\n`;
            content += `ROUND ${i + 1}: ${round.stageName} (Score: ${round.score}%)\n`;
            content += `--------------------------------------------------------\n`;
            content += `Question: ${round.question}\n`;
            content += `Your Answer: ${round.answer}\n`;
            content += `Interviewer Feedback: ${round.feedback}\n\n`;
        });

        const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const element = document.createElement("a");
        element.href = URL.createObjectURL(file);
        element.download = `${target.domain.replace(/\s+/g, '_')}_Interview_Transcript.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const resetInterview = () => {
        stopAllTimers();
        setInterviewActive(false);
        setStage(0);
        setCurrentQuestion('');
        setUserAnswer('');
        setTranscript([]);
        setOverallScore(0);
        setOverallEval('');
        setViewingHistorySession(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 max-w-6xl mx-auto px-4"
        >
            {/* Title Block */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-500 to-sky-500 bg-clip-text text-transparent tracking-tight">AI Interview Suite</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-1.5 font-medium text-sm">
                        Practice with AI chatbot guidance or run full multi-round mock interviews with real-time scoring.
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    {[{ id: 'chat', label: '💬 AI Career Guide' }, { id: 'interview', label: '🎤 Mock Interview' }].map(tab => (
                        <motion.button 
                            key={tab.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                                stopAllTimers();
                                setViewingHistorySession(null);
                                setActiveTab(tab.id);
                            }}
                            className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all ${
                                activeTab === tab.id 
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20' 
                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            {tab.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* === CHAT TAB === */}
            {activeTab === 'chat' && (
                <div className="flex flex-col justify-between overflow-hidden relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xl" style={{ height: '65vh' }}>
                    
                    {/* Message Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex items-start gap-3.5 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`h-8.5 w-8.5 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                    msg.from === 'bot' 
                                        ? 'bg-gradient-to-tr from-sky-500 to-indigo-500 text-white' 
                                        : 'bg-slate-100 dark:bg-slate-850 text-slate-650 dark:text-slate-350 border border-slate-200/50'
                                }`}>
                                    {msg.from === 'bot' ? <Bot size={16} /> : <User size={16} />}
                                </div>
                                <div className={`max-w-[75%] px-4.5 py-3 rounded-2xl text-xs leading-relaxed font-semibold ${
                                    msg.from === 'bot' 
                                        ? 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/30' 
                                        : 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-tr-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Typing / Loading state */}
                        {typing && (
                            <div className="flex items-start gap-3.5">
                                <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900 px-4.5 py-3 rounded-2xl rounded-tl-none border border-slate-200/30">
                                    <span className="flex gap-1.5 items-center py-1">
                                        <span className="h-1.5 w-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-1.5 w-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-1.5 w-1.5 bg-primary-500 rounded-full animate-bounce"></span>
                                    </span>
                                </div>
                            </div>
                        )}
                        <div ref={messageEndRef} />
                    </div>

                    {/* Suggestions Chips & Input Section */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-850 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
                            {SUGGESTIONS.map((chip, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => sendChatMessage(chip)}
                                    className="text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-550 hover:border-primary-500/50 transition-all hover:scale-[1.01]"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <input
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                                placeholder="Query about TCS interviews, OOPs, system architectures..."
                                className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary-500"
                            />
                            <button 
                                onClick={() => sendChatMessage()} 
                                disabled={chatLoading || !chatInput.trim()}
                                className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-650 text-white rounded-xl px-5 py-3 flex items-center justify-center disabled:opacity-50 shadow-md shadow-sky-500/10"
                            >
                                <Send size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* === INTERVIEW TAB === */}
            {activeTab === 'interview' && (
                <div className="space-y-6 animate-fadeIn">
                    
                    {/* Setup / Configuration Screen + History Log Split View */}
                    {!interviewActive && stage === 0 && !viewingHistorySession && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            
                            {/* Simulator Init Configuration Card */}
                            <div className="lg:col-span-7 glass-card p-6 md:p-8 space-y-6">
                                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-4">
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                        <Mic size={24} />
                                    </div>
                                    <div>
                                        <h2 className="font-extrabold text-lg">AI Mock Interview Simulator</h2>
                                        <p className="text-xs text-slate-450 font-bold uppercase tracking-wider mt-0.5">Evaluate technical and behavioral competencies</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Choose Interview Domain</label>
                                    <select 
                                        value={interviewField} 
                                        onChange={e => setInterviewField(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-xs focus:outline-none focus:border-primary-500 font-extrabold text-slate-700 dark:text-slate-300"
                                    >
                                        {Object.keys(QUESTION_BANK).map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2.5 bg-slate-550/[0.02] dark:bg-slate-900/40 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-850">
                                    <span className="text-[10px] text-slate-450 font-extrabold uppercase tracking-wider block">Timed Round Schedule</span>
                                    <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-slate-550">
                                        <div className="flex items-center gap-2"><div className="h-5 w-5 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center text-[9px]">1</div> Candidate Intro</div>
                                        <div className="flex items-center gap-2"><div className="h-5 w-5 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center text-[9px]">2</div> Technical Q1</div>
                                        <div className="flex items-center gap-2"><div className="h-5 w-5 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center text-[9px]">3</div> Technical Q2</div>
                                        <div className="flex items-center gap-2"><div className="h-5 w-5 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center text-[9px]">4</div> Behavioral HR</div>
                                    </div>
                                    <p className="text-[9px] text-slate-400 mt-2.5 flex items-center gap-1">
                                        <Clock size={11} className="text-amber-500" /> Each question has a strict 120-second countdown constraint.
                                    </p>
                                </div>

                                <button 
                                    onClick={startInterview}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-650 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl py-3.5 font-extrabold text-xs shadow-md shadow-indigo-500/15 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                                >
                                    <Play size={14} /> Initialize Dynamic Simulator
                                </button>
                            </div>

                            {/* Session History Log Panel */}
                            <div className="lg:col-span-5 glass-card p-6 space-y-5">
                                <h3 className="font-extrabold text-sm flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-3">
                                    <History size={16} className="text-primary-500" />
                                    Session History Logs
                                </h3>

                                {historyLogs.length === 0 ? (
                                    <div className="text-center py-12 space-y-2">
                                        <FileText size={32} className="text-slate-300 dark:text-slate-800 mx-auto" />
                                        <p className="text-xs text-slate-450 font-bold">No interview sessions recorded yet.</p>
                                        <p className="text-[10px] text-slate-500">Complete a simulator session to persist transcripts.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5 max-h-[350px] overflow-y-auto scrollbar-thin pr-1">
                                        {historyLogs.map(log => (
                                            <div 
                                                key={log.id}
                                                className="border border-slate-150 dark:border-slate-900 rounded-xl p-3.5 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors flex items-center justify-between gap-3 group"
                                            >
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black text-slate-800 dark:text-slate-205">{log.domain}</p>
                                                    <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold">
                                                        <span className="flex items-center gap-0.5"><Calendar size={9} /> {log.date.split(',')[0]}</span>
                                                        <span className="text-slate-300">•</span>
                                                        <span className="flex items-center gap-0.5 text-indigo-500"><Award size={9} /> Score: {log.score}%</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setViewingHistorySession(log)}
                                                    className="bg-slate-100 hover:bg-primary-500 hover:text-white dark:bg-slate-800 dark:hover:bg-primary-500 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all"
                                                >
                                                    Inspect
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Historical Log Inspector Detail Mode */}
                    {viewingHistorySession && (
                        <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
                            <div className="flex flex-wrap items-center justify-between gap-4 glass-card px-6 py-4">
                                <button
                                    onClick={() => setViewingHistorySession(null)}
                                    className="text-xs font-extrabold text-slate-500 hover:text-slate-700 flex items-center gap-1.5"
                                >
                                    <ArrowLeft size={14} /> Back to Dashboard
                                </button>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => downloadTranscript(viewingHistorySession)}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
                                    >
                                        <Download size={14} /> Download Transcript
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                                <div className="md:col-span-5 glass-card p-6 flex flex-col justify-between items-center text-center space-y-6">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Historical Score</span>
                                        <div className="h-24 w-24 bg-primary-500/10 border-4 border-primary-500/20 text-primary-500 rounded-full flex items-center justify-center text-2xl font-black shadow-md mx-auto">
                                            {viewingHistorySession.score}%
                                        </div>
                                        <p className="font-extrabold text-sm mt-3 text-slate-800 dark:text-slate-100">{viewingHistorySession.domain}</p>
                                        <span className="text-[9px] text-slate-400 font-bold block mt-1">{viewingHistorySession.date}</span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl text-left w-full border border-slate-150 dark:border-slate-850">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase block">AI Rating Summary</span>
                                        <p className="text-xs text-slate-650 leading-relaxed font-semibold mt-1">
                                            {viewingHistorySession.overallEval}
                                        </p>
                                    </div>
                                </div>

                                <div className="md:col-span-7 glass-card p-5 space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin">
                                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-900 pb-2">Completed Transcripts</h4>
                                    <div className="space-y-4">
                                        {viewingHistorySession.transcript.map((round, idx) => (
                                            <div key={idx} className="space-y-2 text-xs font-semibold">
                                                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                                                    <span className="font-black text-indigo-500 text-[10px] uppercase">{round.stageName}</span>
                                                    <span className="text-[10px] font-bold text-slate-500">Score: {round.score}%</span>
                                                </div>
                                                <div className="space-y-1 pl-1">
                                                    <p className="text-slate-800 dark:text-slate-205 font-bold"><span className="text-slate-400 font-medium">Q:</span> {round.question}</p>
                                                    <p className="text-slate-500 italic"><span className="text-slate-400 font-medium">A:</span> {round.answer}</p>
                                                    <p className="text-emerald-500 bg-emerald-500/5 p-2 rounded-lg text-[11px]"><span className="font-bold">Feedback:</span> {round.feedback}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Active Question Screen (During Interview) */}
                    {interviewActive && stage >= 1 && stage <= 4 && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            {/* Visual Progress Steps */}
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/55 dark:border-slate-850">
                                {[
                                    { num: 1, label: 'Intro' },
                                    { num: 2, label: 'Tech Q1' },
                                    { num: 3, label: 'Tech Q2' },
                                    { num: 4, label: 'HR Round' }
                                ].map((step) => {
                                    const isCompleted = stage > step.num;
                                    const isActive = stage === step.num;
                                    
                                    return (
                                        <React.Fragment key={step.num}>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                                                    isCompleted 
                                                        ? 'bg-emerald-500 text-white' 
                                                        : isActive 
                                                        ? 'bg-primary-500 text-white shadow-md' 
                                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                                                }`}>
                                                    {isCompleted ? '✓' : step.num}
                                                </div>
                                                <span className={`text-[10px] font-bold ${
                                                    isActive ? 'text-primary-500' : isCompleted ? 'text-emerald-500' : 'text-slate-400'
                                                }`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                            {step.num < 4 && (
                                                <div className={`flex-1 h-0.5 transition-all ${
                                                    stage > step.num ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-900'
                                                }`} />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {/* Interviewer Question Prompt */}
                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.35 }}
                                className="glass-card p-6 space-y-4 border-l-4 border-l-indigo-500"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3.5">
                                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                                            <Bot size={20} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest">AI Technical Evaluator — 7-Dimension Scoring</p>
                                            <p className="text-base font-bold text-slate-800 dark:text-white leading-relaxed">
                                                {currentQuestion}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Timed Constraints Badge */}
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-extrabold ${
                                        timeLeft <= 20 
                                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 animate-pulse' 
                                            : 'bg-amber-500/10 border-amber-500/30 text-amber-600'
                                    }`}>
                                        <Clock size={13} />
                                        <span>{timeLeft}s</span>
                                    </div>
                                </div>

                                {/* Previous Round Feedback */}
                                {transcript.length > 0 && (
                                    <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                                Feedback on Round {transcript.length}
                                            </span>
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                                                Score: {transcript[transcript.length - 1].score}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                                            {transcript[transcript.length - 1].feedback}
                                        </p>
                                        {transcript[transcript.length - 1].dimensions && (
                                            <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-emerald-200/30 dark:border-emerald-900/30">
                                                {Object.entries(transcript[transcript.length - 1].dimensions).map(([key, val]) => (
                                                    <div key={key} className="text-center">
                                                        <div className="text-[9px] font-black text-slate-500 truncate">{key.replace(/([A-Z])/g,' $1').trim()}</div>
                                                        <div className={`text-[10px] font-black ${val >= 70 ? 'text-emerald-500' : val >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{val}%</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>

                            {/* Answer Input Pane */}
                            <div className="glass-card p-5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Draft Your Response *</label>
                                    
                                    {/* Speech Simulation toggle */}
                                    <button
                                        type="button"
                                        onClick={speakingMode ? handleStopSpeaking : handleStartSpeaking}
                                        className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                                            speakingMode 
                                                ? 'bg-rose-500 text-white animate-pulse' 
                                                : 'bg-indigo-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-100/50'
                                        }`}
                                    >
                                        <Mic size={12} />
                                        {speakingMode ? 'Stop & Transcribe' : 'Simulate Speaking'}
                                    </button>
                                </div>

                                {/* Interactive Voice simulation waveform */}
                                {speakingMode ? (
                                    <div className="bg-slate-950 border border-slate-900 rounded-xl p-6 flex flex-col items-center justify-center space-y-4 min-h-[140px]">
                                        <div className="flex items-center gap-1 justify-center h-8">
                                            {[...Array(9)].map((_, i) => (
                                                <span 
                                                    key={i} 
                                                    className="w-1 bg-gradient-to-t from-indigo-500 to-sky-400 rounded-full animate-bounce" 
                                                    style={{ 
                                                        height: `${Math.floor(Math.random() * 24) + 8}px`,
                                                        animationDuration: `${0.4 + (i % 3) * 0.2}s`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-xs text-sky-400 font-extrabold flex items-center justify-center gap-1.5">
                                                <Volume2 size={13} className="animate-pulse" />
                                                {simulatedTranscript}
                                            </p>
                                            <p className="text-[10px] text-slate-500 font-bold">Simulated recording: {speakingTime}s</p>
                                        </div>
                                    </div>
                                ) : (
                                    <textarea 
                                        rows={5} 
                                        value={userAnswer} 
                                        onChange={e => setUserAnswer(e.target.value)}
                                        placeholder="Draft a structured engineering response here..."
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary-500 font-semibold" 
                                    />
                                )}
                                
                                <div className="flex gap-3">
                                    <button 
                                        onClick={submitAnswer} 
                                        disabled={interviewLoading || (!userAnswer.trim() && !speakingMode)}
                                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-650 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl py-2.5 font-extrabold text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-indigo-500/10"
                                    >
                                        {interviewLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                        {interviewLoading ? 'Evaluating Answer...' : 'Submit Response'}
                                    </button>
                                    <button 
                                        onClick={resetInterview} 
                                        className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 flex items-center gap-1.5"
                                    >
                                        <RotateCcw size={13} /> Terminate
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results & Transcript view (End of Mock Interview session) */}
                    {stage === 5 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-4xl mx-auto space-y-8"
                        >
                            {/* Performance Grading Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                                
                                {/* Score Card */}
                                <div className="glass-card p-8 flex flex-col justify-between items-center text-center space-y-5">
                                    <div>
                                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-3">Overall Interview Rating</span>
                                        <div className={`h-32 w-32 border-4 rounded-full flex items-center justify-center text-4xl font-black shadow-xl mx-auto ${
                                            overallScore >= 75 ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-500 shadow-emerald-500/10'
                                            : overallScore >= 55 ? 'bg-amber-500/10 border-amber-400/40 text-amber-500 shadow-amber-500/10'
                                            : 'bg-rose-500/10 border-rose-400/40 text-rose-500 shadow-rose-500/10'
                                        }`}>
                                            {overallScore}%
                                        </div>
                                        <p className="font-extrabold text-lg mt-4 text-slate-800 dark:text-slate-100">Placement Assessment Score</p>
                                    </div>

                                    <div className="bg-slate-550/[0.02] dark:bg-slate-900/40 p-4.5 rounded-2xl border border-slate-150 dark:border-slate-850 text-left w-full space-y-2">
                                        <span className="text-[9px] font-bold text-slate-450 uppercase block">AI Performance Evaluation</span>
                                        <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                                            {overallEval}
                                        </p>
                                    </div>

                                    <div className="flex gap-3 w-full">
                                        <button 
                                            onClick={() => downloadTranscript()}
                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <Download size={14} /> Download Transcript
                                        </button>
                                        <button 
                                            onClick={resetInterview}
                                            className="flex-1 border border-slate-200 dark:border-slate-850 text-slate-655 hover:bg-slate-50 rounded-xl py-2.5 text-xs font-bold"
                                        >
                                            Take Another
                                        </button>
                                    </div>
                                </div>

                                {/* Recharts Competency Vector Radar Chart */}
                                <div className="glass-card p-6 flex flex-col justify-between">
                                    <div className="pb-2 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
                                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Placement Competency Chart</span>
                                        <span className="bg-primary-500/10 text-primary-500 text-[10px] font-bold px-2 py-0.5 rounded-full">5 Core Vectors</span>
                                    </div>
                                    
                                    <div className="h-64 w-full flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" radius="80%" data={chartData}>
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                                                <Radar name="Candidate" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.25} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Transcript Display */}
                            <div className="space-y-4">
                                <h3 className="font-extrabold text-base flex items-center gap-1.5">
                                    <Award size={18} className="text-primary-500" />
                                    Detailed Placement Evaluation Timeline
                                </h3>

                                <div className="space-y-4">
                                    {transcript.map((round, idx) => (
                                        <div key={idx} className="glass-card p-6 space-y-4 border-l-4 border-l-primary-500 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="bg-primary-500/10 text-primary-655 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                                                    Round {idx + 1}: {round.stageName}
                                                </span>
                                                <span className="text-xs font-bold text-slate-700 bg-slate-100 dark:bg-slate-850 px-2.5 py-1 rounded-lg">
                                                    Score: {round.score}%
                                                </span>
                                            </div>

                                            <div className="space-y-3 font-semibold text-xs leading-relaxed text-slate-700">
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-450 block uppercase">Question Asked</span>
                                                    <p className="text-slate-850 dark:text-slate-150 font-bold">{round.question}</p>
                                                </div>
                                                <div className="pl-3 border-l-2 border-slate-200 dark:border-slate-805">
                                                    <span className="text-[10px] font-bold text-slate-450 block uppercase">Your Response</span>
                                                    <p className="text-slate-655 dark:text-slate-400 italic">{round.answer}</p>
                                                </div>
                                                <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl p-3.5 space-y-1">
                                                    <span className="text-[9px] font-bold text-emerald-600 uppercase block">Evaluation Feedback</span>
                                                    <p className="text-slate-600 leading-relaxed font-semibold">{round.feedback}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default MockInterview;
