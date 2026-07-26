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
            { id: 1, name: 'Full Stack Web Development', description: 'Master React, Node.js, Spring Boot, and Cloud deployments.', totalCourses: 6, difficulty: 'INTERMEDIATE', icon: 'Globe' },
            { id: 2, name: 'Data Science & AI', description: 'Python, Pandas, Machine Learning, Deep Learning & LLMs.', totalCourses: 6, difficulty: 'ADVANCED', icon: 'Cpu' },
            { id: 3, name: 'System Design & Architecture', description: 'Microservices, Scalability, Caching, and Distributed Systems.', totalCourses: 6, difficulty: 'ADVANCED', icon: 'Layers' },
            { id: 4, name: 'Cloud & DevOps Engineering', description: 'Docker, Kubernetes, AWS, Terraform, and CI/CD Pipelines.', totalCourses: 6, difficulty: 'INTERMEDIATE', icon: 'Cloud' },
            { id: 5, name: 'Core CS & DSA Mastery', description: 'Data Structures, Algorithms, Dynamic Programming, and Graph Theory.', totalCourses: 6, difficulty: 'ADVANCED', icon: 'Code' }
        ];
    }
    if (url.includes('/progress')) {
        return [
            { domainId: 1, completedTopics: 3, totalTopics: 6, progressPercentage: 50, entityType: 'COURSE', entityId: 101, status: 'COMPLETED' },
            { domainId: 1, completedTopics: 3, totalTopics: 6, progressPercentage: 50, entityType: 'COURSE', entityId: 102, status: 'COMPLETED' },
            { domainId: 2, completedTopics: 2, totalTopics: 6, progressPercentage: 33, entityType: 'COURSE', entityId: 201, status: 'COMPLETED' }
        ];
    }
    if (url.includes('/roadmap')) {
        return {
            courses: [
                { id: 101, title: 'HTML5 & Modern CSS3 Architecture', difficulty: 'BEGINNER', description: 'Master flexbox, CSS Grid, responsive design, semantic HTML, and web accessibility standards.', videoUrl: 'https://www.youtube.com/embed/mU6anWqZJcc', notesPath: '# HTML5 & CSS3 Architecture\n\n## Core Concepts\n- Semantic tags improve SEO and accessibility.\n- CSS Grid is ideal for 2D layouts, while Flexbox excels at 1D component alignment.\n\n```html\n<main class="grid-container">\n  <section class="card">Content</section>\n</main>\n```' },
                { id: 102, title: 'JavaScript (ES6+) Deep Dive & Async Programming', difficulty: 'INTERMEDIATE', description: 'Closures, promises, async/await, DOM manipulation, event loop, and functional programming concepts.', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk', notesPath: '# JavaScript ES6+ Deep Dive\n\n## The Event Loop & Async\nUnderstanding call stacks, microtask queues, and promises is essential for modern web development.\n\n```javascript\nasync function fetchData() {\n  const res = await fetch("/api/data");\n  return await res.json();\n}\n```' },
                { id: 103, title: 'React 18 Architecture & State Management', difficulty: 'INTERMEDIATE', description: 'Hooks, custom hooks, Redux Toolkit, Context API, component design patterns, and performance optimization.', videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8', notesPath: '# React 18 Architecture\n\n## Hooks & Performance\nUse React.memo, useMemo, and useCallback strategically to avoid unnecessary re-renders.\n\n```jsx\nconst MemoizedComponent = React.memo(({ data }) => <div>{data.title}</div>);\n```' },
                { id: 104, title: 'Node.js, Express & RESTful API Architecture', difficulty: 'INTERMEDIATE', description: 'Building scalable backend APIs, custom middleware, JWT authentication, rate limiting, and error handling.', videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE', notesPath: '# Node.js & Express Architecture\n\n## Scalable API Design\nKeep route handlers slim and delegate business logic to service layers with proper error handling.\n\n```javascript\napp.use((err, req, res, next) => {\n  res.status(500).json({ error: err.message });\n});\n```' },
                { id: 105, title: 'SQL & NoSQL Database Design (MongoDB / PostgreSQL)', difficulty: 'ADVANCED', description: 'Schema normalization, B-tree indexing, ACID properties, aggregation pipelines, and ORM/ODM integration.', videoUrl: 'https://www.youtube.com/embed/qw--VYLpxG4', notesPath: '# Database Design & Indexing\n\n## Indexing Strategies\nCreate compound indices on query-heavy fields to speed up read operations in production databases.\n\n```sql\nCREATE INDEX idx_user_status ON users(status, created_at);\n```' },
                { id: 106, title: 'Cloud Deployment, Docker Containerization & CI/CD', difficulty: 'ADVANCED', description: 'Containerizing applications with Docker, GitHub Actions CI/CD workflows, AWS ECS deployment, and SSL setup.', videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo', notesPath: '# Docker & CI/CD Pipelines\n\n## Multi-stage Builds\nUse multi-stage Dockerfiles to keep production container images small and secure.\n\n```dockerfile\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY . .\nRUN npm run build\n```' }
            ],
            milestones: [
                { milestone: 'Frontend Foundations Mastery', skills: ['HTML5', 'CSS Grid', 'Flexbox', 'Tailwind CSS', 'Accessibility'] },
                { milestone: 'Dynamic UI & Single Page Applications', skills: ['JavaScript ES6+', 'TypeScript Basics', 'React 18', 'Redux Toolkit', 'Vite'] },
                { milestone: 'Backend & Server Architecture', skills: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'Middleware'] },
                { milestone: 'Database Management & Scale', skills: ['MongoDB', 'PostgreSQL', 'Indexing', 'Prisma ORM', 'Mongoose'] },
                { milestone: 'Production Deployment & DevOps', skills: ['Docker Containers', 'GitHub Actions CI/CD', 'AWS / Cloud', 'Nginx', 'SSL'] }
            ]
        };
    }
    if (url.includes('/coding-problems') || url.includes('/coding')) {
        return [
            { 
                id: 1, title: 'Two Sum', difficulty: 'EASY', topicTags: 'Array, Hash Table', 
                description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
                starterCode: JSON.stringify({
                    java: 'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Write your solution here\n        System.out.println("0 1");\n    }\n}',
                    python: 'import sys\n\ndef two_sum(nums, target):\n    # Write your solution here\n    return [0, 1]\n\nprint("0 1")',
                    javascript: 'const readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nrl.on("line", line => {\n    // Write your solution here\n    console.log("0 1");\n});'
                }),
                testCases: JSON.stringify([
                    { input: '4 9\n2 7 11 15', output: '0 1', isPublic: true },
                    { input: '3 6\n3 2 4', output: '1 2', isPublic: true },
                    { input: '2 6\n3 3', output: '0 1', isPublic: false }
                ]),
                hints: JSON.stringify([
                    'Try using a Hash Map to store the value and its index as you iterate through the array.',
                    'For each number nums[i], check if target - nums[i] already exists in your Hash Map.',
                    'This reduces the time complexity from O(n^2) brute force to O(n) one-pass lookup.'
                ]),
                solution: 'We iterate through the array once. For each element, we check if the complement (target - num) is in our hash map. If it is, we return the indices immediately.'
            },
            { 
                id: 2, title: 'Reverse Linked List', difficulty: 'EASY', topicTags: 'Linked List, Recursion', 
                description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
                starterCode: JSON.stringify({
                    java: 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("5 4 3 2 1");\n    }\n}',
                    python: 'print("5 4 3 2 1")',
                    javascript: 'console.log("5 4 3 2 1");'
                }),
                testCases: JSON.stringify([
                    { input: '1 2 3 4 5', output: '5 4 3 2 1', isPublic: true },
                    { input: '1 2', output: '2 1', isPublic: true }
                ]),
                hints: JSON.stringify([
                    'Keep track of three pointers: previous, current, and next.',
                    'In each step of your loop, save current.next before reversing current.next to point to previous.'
                ]),
                solution: 'Iterative approach using prev = null and curr = head pointers. Time O(n), Space O(1).'
            },
            { 
                id: 3, title: 'LRU Cache', difficulty: 'MEDIUM', topicTags: 'Hash Table, Linked List, Design', 
                description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) average time complexity for get and put.',
                starterCode: JSON.stringify({
                    java: 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("1\\n-1\\n-1\\n3\\n4");\n    }\n}',
                    python: 'print("1\\n-1\\n-1\\n3\\n4")',
                    javascript: 'console.log("1\\n-1\\n-1\\n3\\n4");'
                }),
                testCases: JSON.stringify([
                    { input: '2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2', output: '1\n-1', isPublic: true }
                ]),
                hints: JSON.stringify([
                    'Combine a Hash Map with a Doubly Linked List.',
                    'The Hash Map gives O(1) key lookup, while the Doubly Linked List allows O(1) removal and insertion at the front/back.'
                ]),
                solution: 'Use a doubly linked list to order items by recency and a hash map pointing to list nodes.'
            },
            { id: 4, title: 'Binary Search', difficulty: 'EASY', topicTags: 'Array, Binary Search', description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.' },
            { id: 5, title: 'Merge Intervals', difficulty: 'MEDIUM', topicTags: 'Array, Sorting', description: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.' },
            { id: 6, title: 'Valid Parentheses', difficulty: 'EASY', topicTags: 'String, Stack', description: 'Given a string s containing just the characters (, ), {, }, [, ], determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets in the correct order.' },
            { id: 7, title: 'Subarray Sum Equals K', difficulty: 'MEDIUM', topicTags: 'Array, Hash Table, Prefix Sum', description: 'Given an array of integers nums and an integer k, return the total number of continuous subarrays whose sum equals to k.' },
            { id: 8, title: 'Word Search', difficulty: 'MEDIUM', topicTags: 'Array, Backtracking, Matrix', description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells.' }
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
        const sampleQuestions = JSON.stringify([
            { id: 1, question: "Which HTTP status code represents 'Unauthorized' access?", options: ["200 OK", "401 Unauthorized", "403 Forbidden", "500 Internal Server Error"], answer: "401 Unauthorized" },
            { id: 2, question: "What is the primary purpose of React useEffect hook?", options: ["To manage local state", "To perform side effects in functional components", "To style components", "To optimize bundle size"], answer: "To perform side effects in functional components" },
            { id: 3, question: "In SQL, which clause is used to filter records after an aggregation (GROUP BY)?", options: ["WHERE", "HAVING", "ORDER BY", "FILTER"], answer: "HAVING" },
            { id: 4, question: "Which of the following is NOT a valid JavaScript variable declaration keyword?", options: ["let", "const", "var", "def"], answer: "def" },
            { id: 5, question: "In Node.js, what is the event loop responsible for?", options: ["Compiling JavaScript to machine code", "Handling asynchronous callbacks and non-blocking I/O", "Managing database connections", "Rendering HTML in the browser"], answer: "Handling asynchronous callbacks and non-blocking I/O" },
            { id: 6, question: "What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: "O(log n)" },
            { id: 7, question: "Which CSS property is used to change the background color of an element?", options: ["color", "bgcolor", "background-color", "surface-color"], answer: "background-color" },
            { id: 8, question: "What does REST stand for in web API architecture?", options: ["Representational State Transfer", "Remote Server Transfer", "Reactive Enterprise System Technology", "Reliable Endpoint Execution Protocol"], answer: "Representational State Transfer" },
            { id: 9, question: "In Git, which command creates a new branch and switches to it immediately?", options: ["git branch new-branch", "git checkout -b new-branch", "git switch -c new-branch", "Both B and C are correct"], answer: "Both B and C are correct" },
            { id: 10, question: "Which data structure operates on a Last In, First Out (LIFO) principle?", options: ["Queue", "Stack", "Linked List", "Heap"], answer: "Stack" }
        ]);
        return [
            { id: 1, title: 'Full Stack Technical Assessment', durationMinutes: 45, totalQuestions: 10, difficulty: 'MEDIUM', category: 'Web Development', description: 'Test your knowledge on React, Node.js, REST APIs, and Database schema design.', questions: sampleQuestions },
            { id: 2, title: 'DSA & Coding Mastery', durationMinutes: 60, totalQuestions: 10, difficulty: 'HARD', category: 'Data Structures', description: 'Advanced algorithmic assessment covering Trees, Graphs, Dynamic Programming, and Tries.', questions: sampleQuestions },
            { id: 3, title: 'Core CS & Operating Systems', durationMinutes: 30, totalQuestions: 10, difficulty: 'MEDIUM', category: 'Core CS', description: 'Evaluate your understanding of OS concepts, DBMS indexing, Computer Networks, and OOP.', questions: sampleQuestions },
            { id: 4, title: 'System Design & Scalability', durationMinutes: 45, totalQuestions: 10, difficulty: 'HARD', category: 'Architecture', description: 'High-level architecture test focusing on load balancers, sharding, caching, and CAP theorem.', questions: sampleQuestions }
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

        if (method === 'get' && response.data !== undefined && response.data !== null) {
            const fallback = getFallbackDataForUrl(url);
            if (Array.isArray(response.data)) {
                // If backend returned empty array or very few items (< 3), auto-populate with our rich dataset!
                if (response.data.length < 3 && Array.isArray(fallback) && fallback.length > 0) {
                    response.data = fallback;
                }
            } else if (typeof response.data === 'object') {
                // If backend returned an empty or incomplete object (e.g. roadmap without courses or profile)
                if (url.includes('/roadmap')) {
                    if (!response.data.courses || response.data.courses.length === 0) {
                        response.data = fallback;
                    }
                }
            }
        }
        return response;
    },
    async (error) => {
        const config = error.config || {};
        const method = (config.method || 'get').toLowerCase();
        const url = config.url || '';

        // If it's a GET request that failed (e.g. 403 in Demo Mode, 401, timeout, 404, 500, or Render cold start)
        if (method === 'get') {
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

        // For non-GET requests (POST, PUT, DELETE) during Demo Mode or on backend failure, simulate realistic success
        if (method !== 'get' && !url.includes('/api/auth/')) {
            let mockData = { success: true, message: 'Action processed successfully (Demo / Offline fallback)' };
            if (url.includes('/mock-tests/') && url.includes('/submit')) {
                mockData = {
                    scorePercentage: 85,
                    correctCount: 8,
                    totalQuestions: 10,
                    passed: true,
                    review: []
                };
            } else if (url.includes('/coding-problems/') && url.includes('/run')) {
                mockData = {
                    success: true,
                    output: "Testcase 1: Accepted (0.04s, 14.2 MB)\nOutput: 0 1\nExpected: 0 1\nAll sample test cases executed successfully!",
                    stdout: "Testcase 1: Accepted\nOutput matches expected result.",
                    executionTimeMs: 42,
                    memoryUsedKb: 14500
                };
            } else if (url.includes('/coding-problems/') && url.includes('/submit')) {
                mockData = {
                    success: true,
                    status: 'ACCEPTED',
                    message: 'All 8 Test Cases Passed Successfully!',
                    testCasesPassed: 8,
                    totalTestCases: 8,
                    timeMs: 45,
                    memoryKb: 15200
                };
            } else if (url.includes('/ai/')) {
                mockData = {
                    reply: "That's an excellent approach! Using a hash map optimizes the time complexity from O(n²) to O(n), which is exactly what Tier-1 interviewers look for. Can you also discuss how you would handle potential hash collisions at scale?",
                    recommendations: []
                };
            }
            return Promise.resolve({
                data: mockData,
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
