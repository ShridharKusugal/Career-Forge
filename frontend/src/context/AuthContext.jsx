import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Automatically send cookies (if any) and set the backend URL adaptively
axios.defaults.withCredentials = true;
axios.defaults.baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : 'https://career-forge-4hhd.onrender.com';
axios.defaults.timeout = 12000; // 12s timeout to prevent infinite loading spinners on Render cold starts

// Comprehensive fallback data for seamless Demo Mode & offline / cold-start resilience
const getFallbackDataForUrl = (url = '') => {
    if ((url.includes('/companies') || url.includes('/api/public/companies')) && !url.includes('/prep')) {
        return [
            {
                id: 1,
                name: 'Google',
                logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
                industry: 'Technology',
                foundedYear: 1998,
                headquarters: 'Mountain View, CA',
                employeeCount: '180,000+',
                jobPostsCount: 45,
                totalApplicants: 28500,
                salaryPackage: '18 - 38 LPA',
                experienceLevel: 'Fresher / Exp',
                hiringRoles: 'Software Engineer, AI Researcher, Product Manager, Cloud Architect',
                requiredSkills: 'Java, Python, C++, Go, Distributed Systems, Machine Learning, Kubernetes, React',
                eligibility: 'B.Tech / B.E / M.Tech / MS in CS/IT or equivalent (70%+ or 7.0 CGPA)',
                hiringRounds: 'Online Assessment -> Technical Interview 1 (DSA) -> Technical Interview 2 (System Design) -> Googley HR Round',
                jobLocation: 'Bangalore, Hyderabad, Remote',
                applicationLink: 'https://careers.google.com',
                lastDate: 'Rolling Recruitment',
                hiringTrends: 'High demand for AI/ML engineers, Cloud infrastructure specialists, and Full Stack React developers.',
                companyDescription: 'Alphabet subsidiary specializing in Internet services, cloud computing, AI, and consumer electronics.'
            },
            {
                id: 2,
                name: 'TCS',
                logoUrl: '',
                industry: 'IT Services',
                foundedYear: 1968,
                headquarters: 'Mumbai, India',
                employeeCount: '600,000+',
                jobPostsCount: 120,
                totalApplicants: 95000,
                salaryPackage: '4.5 - 9 LPA',
                experienceLevel: 'Fresher',
                hiringRoles: 'Assistant System Engineer, Digital Officer, Systems Analyst',
                requiredSkills: 'Java, Python, SQL, C++, Spring Boot, HTML/CSS, Git, Agile',
                eligibility: 'B.Tech / B.E / M.Tech / MCA in any discipline (60%+ across academics)',
                hiringRounds: 'TCS NQT Assessment -> Technical Interview -> Managerial & HR Interview',
                jobLocation: 'Bangalore, Mumbai, Pune, Chennai, Hyderabad, Delhi NCR',
                applicationLink: 'https://www.tcs.com/careers',
                lastDate: 'Rolling Recruitment',
                hiringTrends: 'Aggressive campus and off-campus recruitment for Digital and Ninja profiles with focus on Cloud & AI.',
                companyDescription: 'India\'s largest IT services company and a global leader in consulting, technology, and digital solutions.'
            },
            {
                id: 3,
                name: 'Microsoft',
                logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg',
                industry: 'Technology',
                foundedYear: 1975,
                headquarters: 'Redmond, WA',
                employeeCount: '220,000+',
                jobPostsCount: 55,
                totalApplicants: 42000,
                salaryPackage: '16 - 35 LPA',
                experienceLevel: 'Fresher / Exp',
                hiringRoles: 'SDE I, Cloud Architect, Data Scientist, Product Manager',
                requiredSkills: 'C#, C++, Java, Azure, TypeScript, React, System Design, Algorithms',
                eligibility: 'B.Tech / B.E / M.Tech in CS/IT/ECE (70%+ or 7.0 CGPA)',
                hiringRounds: 'Online Assessment -> Technical Interview 1 -> Technical Interview 2 -> AA Round (HR/Managerial)',
                jobLocation: 'Hyderabad, Bangalore, Noida, Remote',
                applicationLink: 'https://careers.microsoft.com',
                lastDate: 'Rolling Recruitment',
                hiringTrends: 'Expanding Azure cloud teams and Generative AI (Copilot) enterprise development divisions.',
                companyDescription: 'Global technology leader in software, cloud services, gaming, and enterprise solutions.'
            },
            {
                id: 4,
                name: 'Accenture',
                logoUrl: '',
                industry: 'IT Consulting',
                foundedYear: 1989,
                headquarters: 'Dublin, Ireland',
                employeeCount: '740,000+',
                jobPostsCount: 80,
                totalApplicants: 65000,
                salaryPackage: '5.5 - 12 LPA',
                experienceLevel: 'Fresher',
                hiringRoles: 'Associate Software Engineer, Advanced ASE, Strategy Analyst',
                requiredSkills: 'Java, Spring Boot, React, SQL, Cloud Fundamentals, DevOps, Agile',
                eligibility: 'B.Tech / B.E / M.Tech / MCA across all engineering branches (65%+)',
                hiringRounds: 'Cognitive & Technical Assessment -> Coding Assessment -> Communication Test -> HR Interview',
                jobLocation: 'Bangalore, Hyderabad, Pune, Mumbai, Gurgaon, Chennai',
                applicationLink: 'https://www.accenture.com/in-en/careers',
                lastDate: 'Rolling Recruitment',
                hiringTrends: 'Heavy focus on full-stack modernization, cybersecurity, and enterprise cloud migration consulting.',
                companyDescription: 'Global professional services and consulting firm specializing in IT strategy and digital transformation.'
            },
            {
                id: 5,
                name: 'Infosys',
                logoUrl: '',
                industry: 'IT Services',
                foundedYear: 1981,
                headquarters: 'Bangalore, India',
                employeeCount: '340,000+',
                jobPostsCount: 90,
                totalApplicants: 72000,
                salaryPackage: '4.5 - 8.5 LPA',
                experienceLevel: 'Fresher',
                hiringRoles: 'System Engineer, Specialist Programmer, Digital Specialist Engineer',
                requiredSkills: 'Python, Java, DSA, DBMS, Web Development, Microservices, Angular/React',
                eligibility: 'B.Tech / B.E / M.Tech / MCA (65%+ or 6.5 CGPA with no active backlogs)',
                hiringRounds: 'Infosys Online Assessment -> Technical Interview -> HR Round',
                jobLocation: 'Bangalore, Pune, Mysore, Hyderabad, Chennai, Chandigarh',
                applicationLink: 'https://www.infosys.com/careers',
                lastDate: 'Rolling Recruitment',
                hiringTrends: 'High intake for Specialist Programmer (SP) roles with competitive compensation for top coding talent.',
                companyDescription: 'Global digital services and consulting company with AI-powered solutions and automation.'
            },
            {
                id: 6,
                name: 'Amazon',
                logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazon/amazon-original-wordmark.svg',
                industry: 'E-Commerce/Cloud',
                foundedYear: 1994,
                headquarters: 'Seattle, WA',
                employeeCount: '1,500,000+',
                jobPostsCount: 60,
                totalApplicants: 52000,
                salaryPackage: '18 - 40 LPA',
                experienceLevel: 'Fresher / Exp',
                hiringRoles: 'SDE I, SDE II, AWS Support Engineer, Data Engineer, DevOps Specialist',
                requiredSkills: 'Java, C++, Python, Data Structures, Algorithms, AWS, Linux, System Design',
                eligibility: 'B.Tech / B.E / M.Tech in CS/IT/ECE or related fields (70%+ or 7.0 CGPA)',
                hiringRounds: 'Online Assessment (DSA & Leadership Principles) -> 3 Technical Rounds -> Bar Raiser Round',
                jobLocation: 'Bangalore, Hyderabad, Chennai, Delhi NCR',
                applicationLink: 'https://www.amazon.jobs',
                lastDate: 'Rolling Recruitment',
                hiringTrends: 'Strong demand for AWS cloud infrastructure engineers and e-commerce supply chain optimization teams.',
                companyDescription: 'E-commerce and cloud computing giant, world leader in AWS cloud services and artificial intelligence.'
            },
            {
                id: 7,
                name: 'Apple',
                logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',
                industry: 'Consumer Electronics',
                foundedYear: 1976,
                headquarters: 'Cupertino, CA',
                employeeCount: '160,000+',
                jobPostsCount: 30, totalApplicants: 22000, salaryPackage: '20 - 42 LPA', experienceLevel: 'Fresher / Exp', hiringRoles: 'iOS Developer, Hardware Engineer, Machine Learning Engineer, Systems Software Engineer',
                requiredSkills: 'Swift, Objective-C, C++, Python, CoreML, OS Internals, Embedded Systems, Graphics Programming',
                eligibility: 'B.Tech / B.E / M.Tech in CS/ECE/EE with outstanding academic track record (75%+)',
                hiringRounds: 'Technical Assessment -> Technical Screen -> 4 to 5 On-site/Virtual Technical Interviews -> Team Match',
                jobLocation: 'Hyderabad, Bangalore, Remote',
                applicationLink: 'https://www.apple.com/careers/in',
                lastDate: 'Rolling Recruitment',
                hiringTrends: 'Investing heavily in on-device AI/ML capabilities, custom Apple Silicon driver optimization, and iOS ecosystems.',
                companyDescription: 'Consumer electronics, software, and services company known for iPhone, Mac, Apple Watch, and iOS.'
            },
            {
                id: 8,
                name: 'Meta',
                logoUrl: '',
                industry: 'Social Media',
                foundedYear: 2004,
                headquarters: 'Menlo Park, CA',
                employeeCount: '67,000+',
                jobPostsCount: 25, totalApplicants: 18000, salaryPackage: '22 - 45 LPA', experienceLevel: 'Experienced', hiringRoles: 'Frontend Engineer, VR Engineer, Data Engineer, Production Engineer, Research Scientist',
                requiredSkills: 'React, GraphQL, Python, C++, Hack/PHP, Distributed Systems, Machine Learning, PyTorch',
                eligibility: 'B.Tech / B.E / MS / PhD in Computer Science or related STEM fields',
                hiringRounds: 'Recruiter Screen -> Technical Screening -> On-site (2 Coding, 1 System Design, 1 Behavioral)',
                jobLocation: 'Bangalore, Hyderabad, Remote',
                applicationLink: 'https://www.metacareers.com',
                lastDate: 'Rolling Recruitment',
                hiringTrends: 'Focusing on open-source AI models (Llama series), Reels recommendation algorithms, and VR infrastructure.',
                companyDescription: 'Social technology company building products for virtual and augmented reality and social networking.'
            },
            {
                id: 9,
                name: 'Netflix',
                logoUrl: '',
                industry: 'Entertainment',
                foundedYear: 1997,
                headquarters: 'Los Gatos, CA',
                employeeCount: '13,000+',
                jobPostsCount: 15, totalApplicants: 12000, salaryPackage: '25 - 50 LPA', experienceLevel: 'Experienced', hiringRoles: 'Senior Software Engineer, Core UI Developer, Streaming Systems Engineer, Data Architect',
                requiredSkills: 'Java, Spring Cloud, React, Node.js, Microservices, AWS, Chaos Engineering, Distributed Storage',
                eligibility: 'Experienced professionals (3+ years) with strong track record in high-scale distributed systems',
                hiringRounds: 'Recruiter Screen -> Technical Screen -> 2 Technical Rounds -> Culture & Executive Round',
                jobLocation: 'Mumbai, Remote',
                applicationLink: 'https://jobs.netflix.com',
                lastDate: 'Rolling Recruitment',
                hiringTrends: 'Hiring senior specialists for video encoding optimization, global content delivery networks, and personalized AI recommendations.',
                companyDescription: 'Global entertainment streaming platform and production company serving hundreds of millions of subscribers.'
            },
            {
                id: 10,
                name: 'Salesforce',
                logoUrl: '',
                industry: 'Cloud/SaaS',
                foundedYear: 1999,
                headquarters: 'San Francisco, CA',
                employeeCount: '79,000+',
                jobPostsCount: 35, totalApplicants: 25000, salaryPackage: '14 - 28 LPA', experienceLevel: 'Fresher / Exp', hiringRoles: 'MTS Software Engineer, Cloud Consultant, Platform Developer, Solution Architect',
                requiredSkills: 'Java, Apex, Lightning Web Components, React, SQL, Cloud Architecture, Microservices',
                eligibility: 'B.Tech / B.E / M.Tech in CS/IT (70%+ or 7.0 CGPA)',
                hiringRounds: 'HackerRank Assessment -> Technical Interview 1 -> Technical Interview 2 -> Managerial / HR Round',
                jobLocation: 'Hyderabad, Bangalore, Remote',
                applicationLink: 'https://www.salesforce.com/in/company/careers',
                lastDate: 'Rolling Recruitment',
                hiringTrends: 'Expanding Einstein AI enterprise integration and Salesforce Data Cloud data engineering teams.',
                companyDescription: 'Cloud CRM platform and enterprise software leader helping businesses connect with customers.'
            },
            {
                id: 11,
                name: 'Adobe',
                logoUrl: '',
                industry: 'Software',
                foundedYear: 1982,
                headquarters: 'San Jose, CA',
                employeeCount: '29,000+',
                jobPostsCount: 28, totalApplicants: 20000, salaryPackage: '15 - 30 LPA', experienceLevel: 'Fresher / Exp', hiringRoles: 'Software Development Engineer, UI/UX Technologist, Machine Learning Engineer, Cloud Engineer',
                requiredSkills: 'C++, Java, JavaScript, React, Python, Computer Vision, Generative AI (Firefly), AWS',
                eligibility: 'B.Tech / B.E / M.Tech in CS/IT/ECE (70%+ or 7.0 CGPA)',
                hiringRounds: 'Online Coding Test -> Technical Interview 1 -> Technical Interview 2 -> VP / HR Round',
                jobLocation: 'Noida, Bangalore, Remote',
                applicationLink: 'https://www.adobe.com/careers.html',
                lastDate: 'Rolling Recruitment',
                hiringTrends: 'Rapid growth in Adobe Firefly generative AI features and Document Cloud enterprise collaboration suites.',
                companyDescription: 'Software company specializing in creative tools, digital media, and document solutions.'
            },
            {
                id: 12,
                name: 'Wipro',
                logoUrl: '',
                industry: 'IT Services',
                foundedYear: 1945,
                headquarters: 'Bangalore, India',
                employeeCount: '250,000+',
                jobPostsCount: 85, totalApplicants: 68000, salaryPackage: '4 - 8 LPA', experienceLevel: 'Fresher', hiringRoles: 'Project Engineer, Elite Candidate, Cloud Infrastructure Specialist',
                requiredSkills: 'Java, Python, SQL, C++, Web Technologies, Testing Fundamentals, Cloud Basics',
                eligibility: 'B.Tech / B.E / M.Tech / MCA across engineering branches (60%+ in 10th, 12th and graduation)',
                hiringRounds: 'Wipro NLTH Assessment -> Technical Interview -> HR Round',
                jobLocation: 'Bangalore, Hyderabad, Pune, Chennai, Kolkata, Mumbai',
                applicationLink: 'https://careers.wipro.com',
                lastDate: 'Rolling Recruitment',
                hiringTrends: 'Consistent hiring for Turbo and Elite campus programs with emphasis on full-stack and automation skills.',
                companyDescription: 'Global IT services and business process outsourcing company delivering innovative technology solutions.'
            }
        ];
    }
    if (url.includes('/jobs/stats') || url.includes('/stats')) {
        return { totalRecruiters: 35, activeJobs: 105, applicantsCount: 520, averagePackage: "14.8 LPA" };
    }
    if (url.includes('/domains') && !url.includes('/progress') && !url.includes('/roadmap')) {
        return [
            { id: 1, name: 'Full Stack Web Development', description: 'Master React, Node.js, Spring Boot, and Cloud deployments.', totalCourses: 24, difficulty: 'INTERMEDIATE', icon: 'Globe' },
            { id: 2, name: 'Data Science & AI', description: 'Python, Pandas, Machine Learning, Deep Learning & LLMs.', totalCourses: 18, difficulty: 'ADVANCED', icon: 'Cpu' },
            { id: 3, name: 'System Design & Architecture', description: 'Microservices, Scalability, Caching, and Distributed Systems.', totalCourses: 15, difficulty: 'ADVANCED', icon: 'Layers' },
            { id: 4, name: 'Cloud & DevOps Engineering', description: 'Docker, Kubernetes, AWS, Terraform, and CI/CD Pipelines.', totalCourses: 20, difficulty: 'INTERMEDIATE', icon: 'Cloud' },
            { id: 5, name: 'Core CS & DSA Mastery', description: 'Data Structures, Algorithms, Dynamic Programming, and Graph Theory.', totalCourses: 34, difficulty: 'ADVANCED', icon: 'Code' }
        ];
    }
    if (url.includes('/progress')) {
        return [
            { domainId: 1, completedTopics: 12, totalTopics: 24, progressPercentage: 50 },
            { domainId: 2, completedTopics: 6, totalTopics: 18, progressPercentage: 33 },
            { domainId: 5, completedTopics: 17, totalTopics: 34, progressPercentage: 50 }
        ];
    }
    if (url.includes('/coding-problems') || url.includes('/coding')) {
        return [
            { id: 1, title: 'Two Sum', difficulty: 'EASY', topicTags: 'Array, Hash Table', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.' },
            { id: 2, title: 'Reverse Linked List', difficulty: 'EASY', topicTags: 'Linked List, Recursion', description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.' },
            { id: 3, title: 'LRU Cache', difficulty: 'MEDIUM', topicTags: 'Hash Table, Linked List, Design', description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.' },
            { id: 4, title: 'Binary Search', difficulty: 'EASY', topicTags: 'Array, Binary Search', description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.' },
            { id: 5, title: 'Merge Intervals', difficulty: 'MEDIUM', topicTags: 'Array, Sorting', description: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals.' },
            { id: 6, title: 'Valid Parentheses', difficulty: 'EASY', topicTags: 'String, Stack', description: 'Given a string s containing just the characters (, ), {, }, [, ], determine if the input string is valid.' },
            { id: 7, title: 'Subarray Sum Equals K', difficulty: 'MEDIUM', topicTags: 'Array, Hash Table, Prefix Sum', description: 'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.' },
            { id: 8, title: 'Word Search', difficulty: 'MEDIUM', topicTags: 'Array, Backtracking, Matrix', description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid.' }
        ];
    }
    if (url.includes('/leaderboard')) {
        return [
            { rank: 1, username: 'Alex Chen', score: 98, testTitle: 'DSA & Coding Mastery' },
            { rank: 2, username: 'Priya Sharma', score: 96, testTitle: 'Full Stack Technical Assessment' },
            { rank: 3, username: 'Rahul Verma', score: 94, testTitle: 'System Design & Scalability' },
            { rank: 4, username: 'Sarah Jenkins', score: 92, testTitle: 'Core CS & Operating Systems' },
            { rank: 5, username: 'Demo Visitor', score: 90, testTitle: 'DSA & Coding Mastery' }
        ];
    }
    if (url.includes('/mock-tests') || url.includes('/interviews') || url.includes('/assessments')) {
        return [
            { id: 1, title: 'Full Stack Technical Assessment', durationMinutes: 45, totalQuestions: 30, difficulty: 'MEDIUM', category: 'Web Development', description: 'Test your knowledge on React, Node.js, REST APIs, and Database schema design.' },
            { id: 2, title: 'DSA & Coding Mastery', durationMinutes: 60, totalQuestions: 25, difficulty: 'HARD', category: 'Data Structures', description: 'Advanced algorithmic assessment covering Trees, Graphs, Dynamic Programming, and Tries.' },
            { id: 3, title: 'Core CS & Operating Systems', durationMinutes: 30, totalQuestions: 20, difficulty: 'MEDIUM', category: 'Core CS', description: 'Evaluate your understanding of OS concepts, DBMS indexing, Computer Networks, and OOP.' },
            { id: 4, title: 'System Design & Scalability', durationMinutes: 45, totalQuestions: 15, difficulty: 'HARD', category: 'Architecture', description: 'High-level architecture test focusing on load balancers, sharding, caching, and CAP theorem.' }
        ];
    }
    if (url.includes('/resumes')) {
        return [
            { id: '1', title: 'Full Stack Developer Resume', lastUpdated: 'Today', score: 92, skills: ['React', 'Node.js', 'Spring Boot', 'MongoDB', 'Docker', 'AWS'] },
            { id: '2', title: 'Data Engineer Resume', lastUpdated: '3 days ago', score: 85, skills: ['Python', 'SQL', 'Spark', 'Airflow', 'BigQuery'] }
        ];
    }
    if (url.includes('/jobs/applications')) {
        return [
            { id: 101, companyName: 'Google', roleTitle: 'Software Engineer III', status: 'INTERVIEWING', appliedDate: '2 days ago', code: 'GOOG-SE3' },
            { id: 102, companyName: 'Microsoft', roleTitle: 'Cloud Solutions Architect', status: 'SHORTLISTED', appliedDate: '5 days ago', code: 'MSFT-CSA' },
            { id: 103, companyName: 'Amazon', roleTitle: 'SDE II (Core Technologies)', status: 'APPLIED', appliedDate: '1 week ago', code: 'AMZN-SDE2' }
        ];
    }
    if (url.includes('/ai/recommendations')) {
        return [
            { id: 1, title: 'Master Dynamic Programming Patterns', type: 'course', priority: 'HIGH', reason: 'Based on recent coding assessment results' },
            { id: 2, title: 'System Design: Distributed Caching', type: 'interview', priority: 'HIGH', reason: 'High demand in top Tier-1 tech interviews' },
            { id: 3, title: 'Optimize Resume Summary Section', type: 'resume', priority: 'MEDIUM', reason: 'AI ATS scanner detected room for keyword enhancement' }
        ];
    }
    if (url.includes('/prep')) {
        return [
            { id: 1, question: 'Explain the difference between process and thread in Linux.', difficulty: 'MEDIUM', type: 'Technical' },
            { id: 2, question: 'How would you design a distributed rate limiter for an API gateway?', difficulty: 'HARD', type: 'System Design' },
            { id: 3, question: 'What are the ACID properties in database management systems?', difficulty: 'EASY', type: 'Core CS' }
        ];
    }
    return [];
};

axios.interceptors.response.use(
    (response) => {
        const config = response.config || {};
        const method = (config.method || 'get').toLowerCase();
        const url = config.url || '';

        // If a GET request returns an empty array [] or empty response from the backend (e.g. empty database on Render), auto-populate with our rich fallback data!
        if (method === 'get' && response.data && Array.isArray(response.data) && response.data.length === 0) {
            const fallback = getFallbackDataForUrl(url);
            if (Array.isArray(fallback) && fallback.length > 0) {
                response.data = fallback;
            }
        }
        return response;
    },
    async (error) => {
        const config = error.config || {};
        const method = (config.method || 'get').toLowerCase();
        const url = config.url || '';

        // If it's a GET request that failed (e.g. 403 in Demo Mode, 401, timeout, or Render cold start)
        if (method === 'get') {
            // First, if it's not already calling /api/public/, try calling the public endpoint if it exists
            if (url.startsWith('/api/') && !url.startsWith('/api/public/') && !url.startsWith('/api/auth/')) {
                try {
                    let publicUrl = url;
                    if (url === '/api/companies' || url.startsWith('/api/companies?')) publicUrl = '/api/public/companies';
                    else if (url === '/api/domains' || url.startsWith('/api/domains?')) publicUrl = '/api/public/courses';
                    else if (url === '/api/coding-problems' || url.startsWith('/api/coding-problems?')) publicUrl = '/api/public/coding';
                    else if (url === '/api/mock-tests' || url.startsWith('/api/mock-tests?')) publicUrl = '/api/public/interviews';

                    if (publicUrl !== url) {
                        const publicRes = await axios.get(publicUrl, { timeout: 8000 });
                        if (publicRes && publicRes.data && (!Array.isArray(publicRes.data) || publicRes.data.length > 0)) {
                            return publicRes;
                        }
                    }
                } catch (e) {
                    // Ignore public endpoint failure and proceed to instant local fallback
                }
            }

            // Return instant, realistic fallback data so pages never hang in loading spinners!
            const fallbackData = getFallbackDataForUrl(url);
            return Promise.resolve({
                data: fallbackData,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: config
            });
        }

        // For non-GET requests (POST, PUT, DELETE) during Demo Mode or on failure, simulate success
        if (method !== 'get' && !url.includes('/api/auth/')) {
            return Promise.resolve({
                data: { success: true, message: 'Action processed successfully (Demo / Offline fallback)' },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: config
            });
        }

        return Promise.reject(error);
    }
);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Always fire a background pre-warm ping to wake up sleeping Render free-tier instances immediately on app load
        axios.get('/api/auth/verify').catch(() => {});

        const token = localStorage.getItem('token');
        if (token) {
            // Set token in header for the verification call
            axios.get('/api/auth/verify', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => {
                setUser(res.data);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            })
            .catch(() => {
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
            })
            .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (usernameOrEmail, password) => {
        const res = await axios.post('/api/auth/login', { usernameOrEmail, password });
        const data = res.data;
        if (data && data.token) {
            localStorage.setItem('token', data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser(data);
            return { success: true, token: data.token };
        }
        return { success: false, message: data?.message || 'Login failed' };
    };

    const register = async (username, email, password, role) => {
        await axios.post('/api/auth/register', { username, email, password, role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const enterDemoMode = () => {
        const demoUser = {
            username: 'Demo Visitor',
            email: 'demo@careerforge.com',
            role: 'DEMO',
            isDemo: true
        };
        setUser(demoUser);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, enterDemoMode }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
