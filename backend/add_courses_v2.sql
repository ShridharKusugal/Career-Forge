-- ============================================================
-- CareerForge: 30 Additional Courses with Full Roadmap Coverage
-- Run AFTER schema.sql has been applied
-- ============================================================
USE careerforge_db;

-- Add a new logo_url column to domains if not exists
-- ALTER TABLE domains ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255);

-- Insert additional domains for richer coverage
INSERT IGNORE INTO domains (name, description, roadmap, logo_url) VALUES 
('Data Structures & Algorithms', 
'Master essential data structures (arrays, linked lists, trees, graphs, heaps) and algorithmic paradigms (recursion, DP, greedy, divide & conquer) for top tech company interviews.',
'[{"milestone":"Arrays & Strings","skills":["Two Pointers","Sliding Window","Prefix Sum","Sorting"]},{"milestone":"Linked Lists & Stacks","skills":["Singly/Doubly LL","Stack Applications","Queue & Deque"]},{"milestone":"Trees & Heaps","skills":["Binary Tree","BST","Heap/Priority Queue","Segment Tree"]},{"milestone":"Graphs","skills":["BFS/DFS","Dijkstra","Topological Sort","Union Find"]},{"milestone":"Advanced Algorithms","skills":["Dynamic Programming","Backtracking","Greedy","Bit Manipulation"]}]',
'https://cdn-icons-png.flaticon.com/512/1005/1005141.png'),

('System Design',
'Learn to design scalable, distributed systems. Covers databases, caching, message queues, load balancing, microservices, and cloud architecture patterns.',
'[{"milestone":"Foundations","skills":["Client-Server Model","DNS & CDN","Load Balancers","Horizontal vs Vertical Scaling"]},{"milestone":"Databases","skills":["SQL vs NoSQL","Indexing & Sharding","ACID Transactions","CAP Theorem"]},{"milestone":"Caching & Queuing","skills":["Redis Caching","CDN Caching","Message Queues (Kafka)","Rate Limiting"]},{"milestone":"Microservices","skills":["Service Discovery","API Gateway","Circuit Breaker","Containerization (Docker)"]},{"milestone":"Real World Case Studies","skills":["Design Twitter","Design Uber","Design Netflix","Design WhatsApp"]}]',
'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'),

('Cloud Computing & DevOps',
'Learn cloud fundamentals (AWS/Azure/GCP), containerization (Docker/Kubernetes), CI/CD pipelines, infrastructure as code, and monitoring for modern software deployment.',
'[{"milestone":"Cloud Fundamentals","skills":["IaaS/PaaS/SaaS","AWS EC2, S3, RDS","Azure VMs, Blob Storage","GCP Compute Engine"]},{"milestone":"Containerization","skills":["Docker Images & Containers","Docker Compose","Kubernetes Pods & Services","Helm Charts"]},{"milestone":"CI/CD Pipelines","skills":["GitHub Actions","Jenkins","GitLab CI","Blue-Green Deployment"]},{"milestone":"Infrastructure as Code","skills":["Terraform","AWS CloudFormation","Ansible","Monitoring with Prometheus"]},{"milestone":"Security & Cost Optimization","skills":["IAM Roles","VPC & Security Groups","Cost Dashboards","Auto-scaling"]}]',
'https://cdn-icons-png.flaticon.com/512/919/919853.png'),

('Quantitative Aptitude & Reasoning',
'Systematic preparation for placement aptitude tests (TCS NQT, Infosys, Wipro, Accenture). Covers quantitative math, logical reasoning, verbal ability, and pseudo-code analysis.',
'[{"milestone":"Quantitative Math","skills":["Time, Speed & Distance","Percentages & Ratios","Permutations & Combinations","Profit & Loss"]},{"milestone":"Logical Reasoning","skills":["Syllogisms","Blood Relations","Seating Arrangements","Data Interpretation"]},{"milestone":"Verbal Ability","skills":["Reading Comprehension","Error Spotting","Sentence Completion","Para Jumbles"]},{"milestone":"Pseudo-code & Programming Logic","skills":["Trace the code","Find the output","Flowchart analysis","Time complexity basics"]}]',
'https://cdn-icons-png.flaticon.com/512/3281/3281289.png');

-- ============================================================
-- COURSES for Full Stack Development (domain_id=1)
-- ============================================================
INSERT INTO courses (domain_id, title, description, difficulty, video_url, assignment, project) VALUES 

(1, 'JavaScript ES6+ Deep Dive', 
'Master modern JavaScript: Arrow functions, Promises, async/await, destructuring, modules, closures, and event loop mechanics.',
'INTERMEDIATE', 'https://www.youtube.com/embed/NCwa_xi0Uuc',
'Implement a custom Promise-based HTTP client from scratch. Handle request queuing and retry logic.',
'Real-time Chat App - build a Node.js/Socket.io chat application with message history and user rooms.'),

(1, 'CSS3 Advanced Techniques',
'CSS Grid mastery, custom properties (CSS variables), keyframe animations, pseudo-elements, and building a full design system from scratch.',
'INTERMEDIATE', 'https://www.youtube.com/embed/jx5jmI0UlXU',
'Build a responsive card grid with hover flip animations and a sticky animated navbar.',
'Design System Library - create a reusable component library with consistent typography, spacing, and color tokens.'),

(1, 'Node.js & Express Backend',
'Build RESTful backends using Node.js and Express. Middleware, routing, authentication with JWT, and MySQL/MongoDB integration.',
'INTERMEDIATE', 'https://www.youtube.com/embed/Oe421EPjeBE',
'Build a complete CRUD REST API for a blog platform with JWT authentication and Mongoose validation.',
'E-Commerce API - product listings, cart management, order processing, and payment gateway integration.'),

(1, 'MongoDB & NoSQL Databases',
'Schema design, CRUD operations, aggregation pipeline, indexes, relationships, and performance tuning in MongoDB.',
'INTERMEDIATE', 'https://www.youtube.com/embed/ExcRbA7fy5A',
'Model a social media schema in MongoDB supporting posts, comments, likes, and nested replies with aggregations.',
'Task Management Dashboard - full MERN stack app with real-time updates using MongoDB Change Streams.'),

(1, 'React Advanced Patterns',
'Context API, Redux Toolkit, React Query, custom hooks, compound components, render props, and performance optimization.',
'ADVANCED', 'https://www.youtube.com/embed/zM_ZiSl2n2E',
'Refactor a shopping cart app using Redux Toolkit with async thunks for API calls.',
'AI Job Board - React frontend consuming live job APIs with infinite scroll, filters, and saved jobs feature.'),

(1, 'Docker & Containerization',
'Dockerize full-stack applications. Create multi-stage builds, Docker Compose for local development, and deploy to cloud.',
'ADVANCED', 'https://www.youtube.com/embed/fqMOX6JJhGo',
'Create a Docker Compose setup for a React + Node.js + MySQL app with networking between services.',
'CI/CD Pipeline - automate build, test, and Docker image push to Docker Hub using GitHub Actions.'),

(1, 'TypeScript for Full Stack',
'TypeScript types, interfaces, generics, decorators, and integrating TypeScript with React and Node.js projects.',
'ADVANCED', 'https://www.youtube.com/embed/BwuLxPH8IDs',
'Migrate an existing JavaScript Express REST API to TypeScript with full interface definitions.',
'Type-safe CMS - build a headless CMS using TypeScript, Express, and PostgreSQL with complete type safety.');

-- ============================================================
-- COURSES for Software Engineering / Core CS (domain_id=2)
-- ============================================================
INSERT INTO courses (domain_id, title, description, difficulty, video_url, assignment, project) VALUES 

(2, 'Data Structures Foundations',
'Arrays, strings, linked lists, stacks, queues — foundational patterns with Java/Python implementations and time complexity analysis.',
'BEGINNER', 'https://www.youtube.com/embed/zg9ih6SVACc',
'Implement a Stack using two Queues in Java with full test coverage.',
'Text Editor Buffer - implement an undo/redo feature for a text editor using a Stack data structure.'),

(2, 'Trees, Heaps & Tries',
'Binary Trees, BST, AVL Trees, Segment Trees, Heaps (Min/Max), and Tries — with traversal algorithms and interview problems.',
'INTERMEDIATE', 'https://www.youtube.com/embed/oSWTXtMglKE',
'Implement a Min Heap from scratch and use it to find the K-th largest element in a stream.',
'Auto-Complete System - build a Trie-based autocomplete engine that supports prefix search with ranked results.'),

(2, 'Graph Algorithms',
'BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, Topological Sort, Union-Find, and Minimum Spanning Trees.',
'INTERMEDIATE', 'https://www.youtube.com/embed/tWVWeAqZ0WU',
'Solve course schedule problem using Topological Sort and detect cycles in directed graphs.',
'Social Network Analyzer - find shortest path, mutual friends, and friend clusters using BFS/DFS on a graph.'),

(2, 'Dynamic Programming Mastery',
'Bottom-up and top-down DP, memoization, knapsack patterns, LCS, LIS, matrix chain, and DP on trees and graphs.',
'ADVANCED', 'https://www.youtube.com/embed/oBt53YbR9Kk',
'Implement Longest Common Subsequence with path reconstruction and apply it to a diff tool.',
'Optimal Investment Planner - use DP to maximize stock portfolio returns across multiple time windows.'),

(2, 'Operating Systems Deep Dive',
'Processes vs threads, memory management (paging, segmentation, virtual memory), CPU scheduling, deadlocks, and I/O systems.',
'INTERMEDIATE', 'https://www.youtube.com/embed/26QPDBe-NB8',
'Simulate Round Robin CPU scheduling with a time quantum of 3 and calculate average waiting time.',
'Mini-Shell - implement a UNIX-like shell in C that supports pipes, redirection, and background processes.'),

(2, 'Database Management Systems',
'Relational model, ER diagrams, normalization (1NF to BCNF), SQL queries (joins, subqueries, window functions), and transactions (ACID).',
'INTERMEDIATE', 'https://www.youtube.com/embed/7S_tz1z_5bA',
'Design a normalized schema for a hospital management system and write complex join queries.',
'Online Examination System - complete DBMS-backed system with entity relationships, triggers, and stored procedures.'),

(2, 'Computer Networks Essentials',
'OSI model, TCP/IP stack, DNS, HTTP/HTTPS, TLS/SSL, routing protocols (OSPF, BGP), sockets, and network security basics.',
'INTERMEDIATE', 'https://www.youtube.com/embed/qiQR5rTSshw',
'Write a Python TCP socket server that echoes client messages with concurrent multi-client support.',
'HTTP Proxy Server - implement a caching HTTP proxy that intercepts, logs, and forwards HTTP requests.');

-- ============================================================
-- COURSES for Data Structures & Algorithms (new domain, id=5)
-- ============================================================
INSERT INTO courses (domain_id, title, description, difficulty, video_url, assignment, project) VALUES 

((SELECT id FROM domains WHERE name='Data Structures & Algorithms'), 
'Arrays, Strings & Two Pointers',
'Master array manipulation, string algorithms, two-pointer and sliding window techniques — the foundation of 40% of interview questions.',
'BEGINNER', 'https://www.youtube.com/embed/A2sysCrbA2s',
'Solve: Longest substring without repeating characters using the sliding window approach.',
'String Search Engine - implement KMP / Rabin-Karp string matching in a searchable document index.'),

((SELECT id FROM domains WHERE name='Data Structures & Algorithms'), 
'Recursion & Backtracking',
'Understand recursive call stacks, memoization basics, and solve complex backtracking problems (N-Queens, Sudoku, Permutations).',
'INTERMEDIATE', 'https://www.youtube.com/embed/gBC_Fd8EE8A',
'Solve N-Queens problem and generate all valid Sudoku solutions using backtracking.',
'Word Search Puzzle Generator - generate and solve word search grids using recursive DFS backtracking.'),

((SELECT id FROM domains WHERE name='Data Structures & Algorithms'), 
'Sorting & Searching Algorithms',
'All major sorting algorithms (Merge Sort, Heap Sort, Quick Sort) with complexity analysis, binary search variants, and search on rotated arrays.',
'INTERMEDIATE', 'https://www.youtube.com/embed/MZaf_9IZCrc',
'Implement Merge Sort iteratively and apply binary search on a rotated sorted array.',
'Competitive Ranker - sort and rank 10,000 student records efficiently using optimized sorting.');

-- ============================================================
-- COURSES for System Design (new domain, id=6)
-- ============================================================
INSERT INTO courses (domain_id, title, description, difficulty, video_url, assignment, project) VALUES 

((SELECT id FROM domains WHERE name='System Design'),
'System Design Fundamentals',
'Learn the basics: scalability trade-offs, CAP theorem, load balancing strategies, horizontal vs vertical scaling, and designing for reliability.',
'BEGINNER', 'https://www.youtube.com/embed/xpDnVSmNFX0',
'Design a simple URL shortener with capacity estimations, API design, and database schema.',
'Scalable Blog Platform - architect a blogging system that can handle 1M users with caching and CDN.'),

((SELECT id FROM domains WHERE name='System Design'),
'Database Design & Sharding',
'SQL vs NoSQL decision framework, database indexing strategies, consistent hashing, horizontal sharding, and master-replica setups.',
'INTERMEDIATE', 'https://www.youtube.com/embed/W2Z7fbCLSTw',
'Design the database architecture for Instagram with user profiles, posts, follows, and timelines.',
'Multi-tenant SaaS Database - design schema isolation strategy for a B2B SaaS platform at scale.'),

((SELECT id FROM domains WHERE name='System Design'),
'Microservices & API Design',
'Microservices decomposition, RESTful API design principles, API Gateway patterns, service mesh, gRPC, and event-driven architecture.',
'ADVANCED', 'https://www.youtube.com/embed/rv4LlmLmVWk',
'Design the microservice architecture for an e-commerce platform with 5+ independent services.',
'Food Delivery System - full system design for Swiggy-like app with real-time tracking microservices.');

-- ============================================================
-- COURSES for Cloud Computing & DevOps (new domain, id=7)
-- ============================================================
INSERT INTO courses (domain_id, title, description, difficulty, video_url, assignment, project) VALUES 

((SELECT id FROM domains WHERE name='Cloud Computing & DevOps'),
'AWS Cloud Foundations',
'EC2, S3, RDS, IAM, VPC, CloudFront, Route 53 — the essential AWS services every developer must know.',
'BEGINNER', 'https://www.youtube.com/embed/ulprqHHWlng',
'Deploy a static React website on S3 with CloudFront CDN distribution and HTTPS configuration.',
'Serverless Image Processor - AWS Lambda + S3 trigger to auto-resize uploaded images in real-time.'),

((SELECT id FROM domains WHERE name='Cloud Computing & DevOps'),
'Docker & Kubernetes Production',
'Container orchestration with Kubernetes: Pods, Deployments, Services, ConfigMaps, Secrets, Ingress, and Helm chart packaging.',
'ADVANCED', 'https://www.youtube.com/embed/X48VuDVv0do',
'Deploy a 3-tier web application on Kubernetes with persistent storage and HPA auto-scaling.',
'Production K8s Cluster - deploy CareerForge platform to a local Kubernetes cluster using Helm charts.'),

((SELECT id FROM domains WHERE name='Cloud Computing & DevOps'),
'CI/CD with GitHub Actions',
'Build full CI/CD pipelines: run tests, build Docker images, push to registry, and deploy to Kubernetes or cloud services automatically.',
'INTERMEDIATE', 'https://www.youtube.com/embed/R8_veQiYBjI',
'Write a GitHub Actions workflow that builds, tests, and deploys a Node.js app to AWS EC2.',
'Automated Deployment Pipeline - complete blue-green deployment setup for zero-downtime releases.');

-- ============================================================
-- COURSES for Quantitative Aptitude (new domain, id=8)
-- ============================================================
INSERT INTO courses (domain_id, title, description, difficulty, video_url, assignment, project) VALUES 

((SELECT id FROM domains WHERE name='Quantitative Aptitude & Reasoning'),
'Number Systems & Arithmetic',
'LCM, HCF, number bases (binary, octal, hex), divisibility rules, prime factorization, and modular arithmetic for competitive exams.',
'BEGINNER', 'https://www.youtube.com/embed/0kD3fA4x6yA',
'Solve 20 practice problems on LCM/HCF and number system conversions in 30 minutes.',
'Aptitude Quiz Builder - create an automated quiz generator for number system problems with difficulty grading.'),

((SELECT id FROM domains WHERE name='Quantitative Aptitude & Reasoning'),
'Time, Speed, Work & Mixtures',
'Train problems, boats & streams, pipes & cisterns, work efficiency, mixture & alligation — formula derivation and shortcut methods.',
'INTERMEDIATE', 'https://www.youtube.com/embed/OmJ-4B-mS-Y',
'Solve 15 train-crossing problems with varying speeds and directions using relative velocity formula.',
'Exam Simulator - simulate a real TCS NQT aptitude section with timer, scoring, and solution explanations.'),

((SELECT id FROM domains WHERE name='Quantitative Aptitude & Reasoning'),
'Permutations, Combinations & Probability',
'Factorial fundamentals, nPr, nCr, circular permutations, conditional probability, Bayes theorem, and expected value problems.',
'INTERMEDIATE', 'https://www.youtube.com/embed/XqQTXW7XfYA',
'Calculate probabilities for card drawing, dice rolling, and word arrangement problems.',
'Probability Calculator Tool - interactive tool that visualizes sample spaces and calculates exact probabilities.'),

((SELECT id FROM domains WHERE name='Quantitative Aptitude & Reasoning'),
'Logical Reasoning & Data Interpretation',
'Coding-decoding, blood relations, puzzles, seating arrangements, direction sense, charts, bar graphs, and table-based DI sets.',
'INTERMEDIATE', 'https://www.youtube.com/embed/1XhJ1KRPHYQ',
'Complete a full DI set from a mock test paper with 5 graphs and 25 questions in 40 minutes.',
'Reasoning Flashcard System - spaced repetition flashcard app for all reasoning question types with explanations.');
