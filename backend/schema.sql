CREATE DATABASE IF NOT EXISTS careerforge_db;
USE careerforge_db;

-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS job_applications;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS progress_tracking;
DROP TABLE IF EXISTS linkedin_profiles;
DROP TABLE IF EXISTS resumes;
DROP TABLE IF EXISTS coding_problems;
DROP TABLE IF EXISTS mock_tests;
DROP TABLE IF EXISTS interview_questions;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS domains;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;

-- 1. Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Companies table
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(255),
    hiring_roles TEXT,
    eligibility TEXT,
    required_skills TEXT,
    hiring_rounds TEXT,
    salary_package VARCHAR(100),
    job_location VARCHAR(100),
    application_link VARCHAR(255),
    last_date DATE,
    experience_level VARCHAR(50),
    hiring_trends TEXT
);

-- 3. Domains table
CREATE TABLE domains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    roadmap TEXT
);

-- 4. Courses (Learning Materials) table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) NOT NULL,
    video_url VARCHAR(255),
    notes_path TEXT,
    assignment TEXT,
    project TEXT,
    FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE
);

-- 5. Interview Questions table
CREATE TABLE interview_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    type VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 6. Mock Tests table
CREATE TABLE mock_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    duration_minutes INT NOT NULL,
    questions TEXT NOT NULL
);

-- 7. Coding Problems table
CREATE TABLE coding_problems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) NOT NULL,
    company_id INT,
    test_cases TEXT NOT NULL,
    starter_code TEXT,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
);

-- 8. Resumes table
CREATE TABLE resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    education TEXT,
    experience TEXT,
    projects TEXT,
    skills TEXT,
    ats_score INT DEFAULT 0,
    suggestions TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. LinkedIn Profiles table
CREATE TABLE linkedin_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    linkedin_url VARCHAR(255) NOT NULL,
    profile_score INT DEFAULT 0,
    skills_extracted TEXT,
    missing_skills TEXT,
    certifications_suggested TEXT,
    projects_suggested TEXT,
    job_matches TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Progress Tracking table
CREATE TABLE progress_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    score INT DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_progress (user_id, entity_type, entity_id)
);

-- 11. Notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. Jobs table
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    job_code VARCHAR(100) UNIQUE NOT NULL,
    application_url VARCHAR(2083) NOT NULL,
    description TEXT,
    eligibility TEXT,
    location VARCHAR(255),
    salary_range VARCHAR(255),
    hiring_status VARCHAR(50) DEFAULT 'ACTIVE',
    deadline DATE,
    experience_level VARCHAR(100),
    skills_required TEXT,
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 13. Job Applications table (updated to link to jobs and include clicked_at)
CREATE TABLE job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company_id INT NOT NULL,
    job_id INT DEFAULT NULL,
    job_title VARCHAR(150) NOT NULL,
    job_code VARCHAR(50),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    resume_text TEXT,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'STARTED',
    clicked_at TIMESTAMP NULL DEFAULT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
);

-- 14. Application Status History table
CREATE TABLE application_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE
);

-- 15. Interviews table
CREATE TABLE interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    user_id INT NOT NULL,
    round_name VARCHAR(100) NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    meeting_link VARCHAR(500),
    notes TEXT,
    FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 16. Assessments table
CREATE TABLE assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    user_id INT NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deadline TIMESTAMP NULL DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'RECEIVED',
    test_url VARCHAR(500),
    score INT DEFAULT NULL,
    FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 17. Email Integrations table
CREATE TABLE email_integrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_synced_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 18. ATS Integrations table
CREATE TABLE ats_integrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    api_key VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 19. Skills table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 20. Job Skills mapping table
CREATE TABLE job_skills (
    job_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (job_id, skill_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Seed Default Users (Passwords hashed using BCrypt. Default is 'password123' for student/mentor, 'admin123' for admin)
-- student/password123 -> $2a$10$vI8aWBndw.VqO3Z0bYF1K.1hXW.bM42mHjM25n.K8N3QyB/8mX58e
-- mentor/password123 -> $2a$10$vI8aWBndw.VqO3Z0bYF1K.1hXW.bM42mHjM25n.K8N3QyB/8mX58e
-- admin/admin123 -> $2a$10$vF3U4Zt7kU3aT7vI8aWBnuvWv2d5d8o2y2n.K8N3QyB/8mX58e123 (let's use $2a$10$dUpZk/q6k9X.f9.5o6y.VODN0z/Kz/gI.o8bS.Rz9vB/hM9mD6H/S for admin123)
-- Actually, let's use a standard bcrypt hash of 'password123' for all: $2a$10$3z2pT1Sve2QWzQjNfSgYeuS5fQ0j8nJ8g5G3C4eX/w/Lz.wW06lX6
INSERT INTO users (username, email, password_hash, role) VALUES 
('student', 'student@careerforge.com', '$2a$10$1/dINBkF.zQ2C.4W7SjPvebGHopWoUFm.xMu79gRwTuqThDpEZvm6', 'STUDENT'),
('mentor', 'mentor@careerforge.com', '$2a$10$1/dINBkF.zQ2C.4W7SjPvebGHopWoUFm.xMu79gRwTuqThDpEZvm6', 'MENTOR'),
('admin', 'admin@careerforge.com', '$2a$10$6jid/f70oNzd1quyDD7ak.uD84EJ0RcpFePJcie1zDVleGuCzKVR.', 'ADMIN');

-- Seed Companies
INSERT INTO companies (name, logo_url, hiring_roles, eligibility, required_skills, hiring_rounds, salary_package, job_location, application_link, last_date, experience_level, hiring_trends) VALUES 
('Google', 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg', 
'Software Engineer, Associate Product Manager, Site Reliability Engineer', 
'B.Tech/M.Tech in CS/IT, MCA or equivalent; Minimum 7.5 CGPA; No active backlogs.', 
'Data Structures, Algorithms, System Design, Java/Go/C++, Problem Solving', 
'1. Online Assessment (Coding)\n2. Technical Round 1 (DS/Algo)\n3. Technical Round 2 (System Design)\n4. Googliness & Leadership Round', 
'25 - 45 LPA', 'Bangalore, Hyderabad', 'https://careers.google.com', '2026-06-30', 'Fresher / Experienced', 
'Steady growth in AI/ML, Cloud Infrastructure, and Core Systems engineering roles.'),

('TCS', 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg', 
'TCS Ninja, TCS Digital, TCS Prime', 
'B.E/B.Tech/M.E/M.Tech/MCA/M.Sc; Min 60% in X, XII, UG, PG; Max 1 active backlog.', 
'Java/Python, C, SQL, Quantitative Aptitude, Verbal Ability, Coding basics', 
'1. TCS NQT (National Qualifier Test) - Aptitude & Coding\n2. Technical Interview\n3. Managerial & HR Interview', 
' Ninja: 3.36 LPA, Digital: 7.0 LPA, Prime: 9.0 LPA', 'PAN India', 'https://nextstep.tcs.com', '2026-07-15', 'Fresher', 
'Transitioning focus from Ninja to digital/niche skills like Cloud, Security, and GenAI.'),

('Microsoft', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', 
'Software Engineering Intern, Software Engineer (SWE-1), Cloud Solution Architect', 
'B.E/B.Tech/M.Tech/MS/MCA in CS/IT or related fields; Minimum 70% or 7.0 CGPA.', 
'Algorithms, Object Oriented Design, C#/Java/C++, Operating Systems, Azure Cloud', 
'1. Resume Screening & Codility Online Test\n2. Technical Round (Coding & OS)\n3. Technical Round (System Design & Projects)\n4. AA (As-Appropriate) Interview', 
'20 - 35 LPA', 'Noida, Bangalore, Hyderabad', 'https://careers.microsoft.com', '2026-06-15', 'Fresher / Experienced', 
'Aggressive hiring in Azure Cloud Solutions, OpenAI services integrations, and Edge computing.'),

('Accenture', 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg', 
'Associate Software Engineer (ASE), Advanced ASE (AASE)', 
'B.E/B.Tech/M.E/M.Tech/MCA/M.Sc (CS/IT); Min 65% aggregate; No active backlogs.', 
'C/C++/Java/Python, SQL, Cloud Basics, Logical Reasoning, Pseudo-code solving', 
'1. Cognitive & Technical Assessment\n2. Coding Assessment\n3. Communication Assessment\n4. Technical & HR Interview', 
'ASE: 4.5 LPA, AASE: 6.5 LPA', 'Bangalore, Pune, Hyderabad, Gurgaon', 'https://www.accenture.com/careers', '2026-08-01', 'Fresher', 
'High volume hiring for full stack development, cloud migration, and Salesforce/SAP functional roles.'),

('Infosys', 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', 
'Systems Engineer (SE), Specialist Programmer (SP), Digital Specialist Engineer (DSE)', 
'B.E/B.Tech/M.Tech/MCA; Min 60% in academic record.', 
'Java, Python, DBMS, Algorithms, Aptitude, Web Technologies', 
'1. Infosys Certification Exam / InfyTQ / HackWithInfy\n2. Technical Interview\n3. HR Interview', 
'SE: 3.6 LPA, DSE: 6.25 LPA, SP: 9.5 LPA', 'Mysore, Bangalore, Pune, Hyderabad', 'https://www.infosys.com/careers', '2026-07-20', 'Fresher', 
'Niche hiring through HackWithInfy for specialized coding and full stack roles.'),

('Amazon', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', 
'Software Development Engineer I (SDE-1), Cloud Support Associate, Quality Assurance Engineer', 
'B.Tech/M.Tech/MCA/MS in Computer Science or related fields; Minimum 7.0 CGPA; No active backlogs.', 
'Data Structures, Algorithms, Java, C++, System Design, OOPs, DBMS, Operating Systems', 
'1. Online Assessment (Coding & Work Style Simulation), 2. Technical Interview 1 (DS/Algo), 3. Technical Interview 2 (Coding & Low-Level Design), 4. Bar Raiser (High-Level Design & Leadership Principles)', 
'18 - 32 LPA', 'Bangalore, Hyderabad, Chennai', 'https://careers.amazon.jobs', '2026-09-30', 'Fresher / Experienced', 
'Heavy emphasis on Amazon Leadership Principles (like Customer Obsession and Bias for Action) during all technical and behavioral rounds. Algorithmic problem-solving is standard.'),

('Meta', 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', 
'Software Engineer (SWE), Production Engineer, Solutions Engineer', 
'B.S./M.S./Ph.D. in Computer Science or quantitative field; proven high-level algorithmic coding capability.', 
'Data Structures, Algorithms, Systems Programming, Python, C++, Distributed Systems', 
'1. Technical Phone Screening (2 Coding Questions), 2. Technical Onsite 1 (Coding & Algorithms), 3. Technical Onsite 2 (System Design & Scale), 4. Behavioral & Culture Fit Round', 
'30 - 55 LPA', 'Remote / Bangalore', 'https://www.metacareers.com', '2026-10-15', 'Experienced', 
'Expect extreme speed and accuracy in coding tests. Focus heavily on recursive back-tracking, dynamic programming, and scaling systems to billions of active users.'),

('Netflix', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', 
'Senior Software Engineer, UI Engineer (React), Cloud Systems Engineer', 
'3+ years of professional software development experience; B.Tech/M.Tech degree or equivalent outstanding expertise.', 
'React.js, Node.js, Distributed Systems, Cloud Architecture, Java, JavaScript, AWS', 
'1. Initial Technical Screening, 2. Technical Panel Interview (System Design), 3. Practical Coding / Architecture Review, 4. Netflix Culture Fit Interview (Freedom & Responsibility)', 
'40 - 75 LPA', 'Mumbai, Bangalore', 'https://jobs.netflix.com', '2026-08-31', 'Experienced', 
'Hires highly self-driven professionals. Core focus on system resilience, low latency streaming, large scale API design, and cultural alignment with the Netflix Culture Memo.'),

('Apple', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', 
'Software QA Engineer, iOS Developer, System Software Engineer', 
'B.Tech/M.Tech/MCA/MS in CS or Electrical Engineering; strong understanding of operating systems and memory.', 
'Swift, Objective-C, C, C++, Operating Systems, Computer Architecture, System Design', 
'1. Initial HackerRank Coding Test, 2. Technical Screening (Swift & OS), 3. In-depth Design & Performance Interview, 4. Core Values & Hiring Manager Interview', 
'22 - 42 LPA', 'Hyderabad, Bangalore', 'https://www.apple.com/careers', '2026-09-15', 'Fresher / Experienced', 
'Extreme focus on memory management, hardware-software integration, low-level OS internals, and UI fluidness.'),

('Salesforce', 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg', 
'Associate Member of Technical Staff (AMTS), Software Engineer, Cloud Developer', 
'B.E/B.Tech/MCA/M.Sc; CGPA 8.0+; strict check on active backlogs.', 
'Java, Apex, JavaScript, React, OOPs, DBMS, System Design, REST APIs', 
'1. Online Cognitive & Coding Assessment, 2. Technical Interview 1 (Java & OOPs), 3. Technical Interview 2 (System Design & Web Technologies), 4. HR & Managerial Interview', 
'14 - 22 LPA', 'Hyderabad, Bangalore', 'https://careers.salesforce.com', '2026-08-15', 'Fresher', 
'Hiring heavily for enterprise cloud scale, multi-tenant databases, API security, and AI-driven CRM integration.'),

('Adobe', 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Adobe_Systems_logo_and_wordmark.svg', 
'Member of Technical Staff I (MTS-1), Frontend Engineer, Research Engineer', 
'B.Tech/M.Tech/MCA in Computer Science/IT; CGPA 7.5+ or top 10% in academic record.', 
'C++, Java, JavaScript, Data Structures, OOPs, Computer Graphics, REST APIs', 
'1. Online Programming Assessment (Hard DS/Algo), 2. Technical Round 1 (C++ OOPs & Core DS), 3. Technical Round 2 (System Design & Concurrency), 4. HR Interview', 
'16 - 28 LPA', 'Noida, Bangalore', 'https://careers.adobe.com', '2026-09-30', 'Fresher / Experienced', 
'Heavy emphasis on core computer science foundations, multithreading, advanced C++ concepts, and design patterns.'),

('Oracle', 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg', 
'Associate Software Engineer, Cloud Engineer, Database Administrator', 
'B.E/B.Tech/M.Tech; 60% and above throughout all academics (10th, 12th, UG/PG).', 
'Java, SQL, Database Management Systems, PL/SQL, Oracle Cloud Infrastructure (OCI)', 
'1. Online Aptitude & Coding Assessment (MCQs + 2 Code snippets), 2. Technical Panel Interview (Java & Database), 3. Cloud Architecture / PLSQL Interview, 4. Behavioral Round', 
'9 - 16 LPA', 'Bangalore, Hyderabad, Noida', 'https://careers.oracle.com', '2026-07-31', 'Fresher / Experienced', 
'Hiring leans towards database performance tuning, transaction management, indexing, and cloud platform engineering.'),

('SAP', 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg', 
'Developer Associate, Support Engineer, ABAP Consultant', 
'B.Tech/M.Tech/MCA; Minimum 7.0 CGPA or 70% in graduation.', 
'Java, ABAP, JavaScript, Cloud Platform, SQL, Spring Boot', 
'1. Technical & Coding Online Test, 2. Technical Interview 1 (Algorithms & OOPS), 3. Technical Interview 2 (System Design & Projects), 4. Managerial & HR', 
'8 - 14 LPA', 'Bangalore, Pune', 'https://jobs.sap.com', '2026-07-28', 'Fresher', 
'Focusing on migrating enterprise architectures to cloud, in-memory databases (HANA), and standard REST service development.'),

('IBM', 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', 
'Associate System Engineer, Cloud Application Developer, Mainframe Specialist', 
'B.Tech/MCA/M.Sc in CS/IT; 60% or 6.0 CGPA; no active backlogs.', 
'Java, Python, Cloud Computing, Linux, SQL, Docker', 
'1. IBM Cognitive Ability & English Assessment, 2. Online Technical Test, 3. Technical Interview (OS, DBMS, DSA), 4. HR Interview', 
'4.5 - 8 LPA', 'PAN India', 'https://www.ibm.com/careers', '2026-08-30', 'Fresher', 
'Mass hiring for hybrid cloud architectures, containerization (Docker, OpenShift), and legacy system maintenance.'),

('Capgemini', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Capgemini_logo.svg', 
'Analyst, Senior Analyst, Cloud Architect', 
'B.E/B.Tech/MCA/M.Sc (CS/IT); 60% aggregate in 10th, 12th, and UG.', 
'Java, Cloud Technologies, SQL, HTML/CSS, Communication Skills', 
'1. Pseudo Code Test & English Assessment, 2. Game-Based Aptitude Round, 3. Technical & System Interview, 4. HR Interview', 
'4 - 7.5 LPA', 'PAN India', 'https://www.capgemini.com/careers', '2026-09-10', 'Fresher', 
'Evaluating strongly on logical troubleshooting skills, communication ability, and willingness to learn diverse tech stacks.'),

('Wipro', 'https://upload.wikimedia.org/wikipedia/commons/d/da/Wipro_Logo.svg', 
'Project Engineer (Elite), Project Engineer (Turbo), Graduate Engineer Trainee', 
'B.E/B.Tech/M.E/M.Tech/MCA; 60% throughout academics; maximum 1 active backlog.', 
'Java, Python, C++, SQL, Web Technologies, Logical Reasoning', 
'1. Online Aptitude & Programming Test, 2. Technical Panel Interview (Coding & DBMS), 3. HR & Managerial Discussion', 
'3.5 - 6.5 LPA', 'PAN India', 'https://careers.wipro.com', '2026-08-20', 'Fresher', 
'Large-scale recruitment for cloud migrations, basic web technologies, and standard object-oriented programming tasks.'),

('HCLTech', 'https://upload.wikimedia.org/wikipedia/commons/f/ff/HCL_Technologies_logo.svg', 
'Graduate Engineer Trainee, Software Engineer, Support Analyst', 
'B.E/B.Tech/MCA/M.Sc; 60% or above in 10th, 12th and Graduation.', 
'C++, Java, .NET, Database Management, Computer Networks, SQL', 
'1. Aptitude, Technical MCQ & Coding Assessment, 2. Technical Panel Interview, 3. HR Discussion', 
'3.6 - 6 LPA', 'Noida, Chennai, Bangalore', 'https://www.hcltech.com/careers', '2026-09-05', 'Fresher', 
'Evaluates candidate basic networking protocols, systems troubleshooting, SQL queries, and Object-Oriented design.'),

('Cognizant', 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Cognizant_logo_2022.svg', 
'GenC Programmer, GenC Elevate (Developer), GenC Pro (Specialist)', 
'B.E/B.Tech/MCA/M.Sc (CS/IT); 60% aggregate in UG/PG; No active backlogs.', 
'Java, Python, RDBMS, Cloud Basics, Web Development, JavaScript', 
'1. Aptitude & Automata (Coding) Online Assessment, 2. Technical Interview (DSA & Coding), 3. HR Interview', 
'4 - 6.75 LPA', 'PAN India', 'https://careers.cognizant.com', '2026-08-25', 'Fresher', 
'Focus on candidate programming basics, understanding of database schemas, basic HTML/CSS/JS, and cloud infrastructure.'),

('Tech Mahindra', 'https://upload.wikimedia.org/wikipedia/commons/4/46/Tech_Mahindra_New_Logo.svg', 
'Associate Software Engineer, Telecom Network Engineer', 
'B.E/B.Tech/MCA; 60% or above in 10th, 12th, and Graduation.', 
'Java, C#, SQL, HTML/CSS, Quantitative Aptitude, Networking', 
'1. Online Aptitude & Technical Test, 2. Coding Round (Basic), 3. Technical Interview, 4. HR Interview', 
'3.25 - 5.5 LPA', 'Pune, Noida, Bangalore', 'https://careers.techmahindra.com', '2026-09-12', 'Fresher', 
'Hiring heavily for Telecom sector software integration, basic .NET/C# structures, and database administration.'),

('LTIMindtree', 'https://upload.wikimedia.org/wikipedia/commons/b/b3/LTIMindtree_logo.svg', 
'Graduate Engineer Trainee, Cloud Security Specialist', 
'B.E/B.Tech/MCA; 60% throughout academics; maximum 1 active backlog.', 
'Java, C#, SQL, Data Warehousing, Cloud Computing, Spring Boot', 
'1. Online Assessment (Aptitude, Tech MCQs & Coding), 2. Technical Interview, 3. Behavioral & HR Interview', 
'4 - 6.5 LPA', 'Mumbai, Bangalore, Pune', 'https://www.ltimindtree.com/careers', '2026-08-18', 'Fresher', 
'Consistent hiring for Enterprise Data management, cloud migration, and standard Java Spring development projects.'),

('Goldman Sachs', 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg', 
'New Analyst (Software Engineering), Quantitative Analyst, Cloud Engineer', 
'B.Tech/M.Tech/MCA/MS; top-tier academic records; exceptional problem solving ability.', 
'Algorithms, Advanced Mathematics, Java, C++, System Design, OOPs, Data Structures', 
'1. Online Assessment (Aptitude & Hard Programming questions), 2. CoderPad Interview (Live Coding), 3. Technical Panel 1 (DS/Algo & Math), 4. Technical Panel 2 (System Design & Low-level Design), 5. Fitment Round', 
'20 - 30 LPA', 'Bangalore, Hyderabad', 'https://www.goldmansachs.com/careers', '2026-09-22', 'Fresher / Experienced', 
'Expect intense math-based logic and extremely optimized database/system structures. Focus on memory safety and multithreading.'),

('J.P. Morgan', 'https://upload.wikimedia.org/wikipedia/commons/d/db/J_P_Morgan_Logo_2008_1.svg', 
'Software Engineer Program (SEP) Analyst, Application Developer', 
'B.E/B.Tech/MCA/M.Tech; CGPA 7.0+ or equivalent; no backlogs.', 
'Java, Python, Spring Boot, React.js, SQL, REST APIs', 
'1. HackerRank Coding Challenge, 2. Code for Good Hackathon (24-hour development & evaluation), 3. Technical Panel Interview (OOPs, SQL, Systems), 4. HR & Leadership Interview', 
'12 - 18 LPA', 'Mumbai, Bangalore, Hyderabad', 'https://careers.jpmorgan.com', '2026-07-30', 'Fresher', 
'Hiring focuses highly on the Code for Good Hackathon. Collaboration, clean coding practices, version control (Git), and agile working styles are heavily evaluated.'),

('Morgan Stanley', 'https://upload.wikimedia.org/wikipedia/commons/3/34/Morgan_Stanley_Logo_1.svg', 
'Technology Analyst, Associate Software Engineer', 
'B.Tech/M.Tech/MCA; Minimum 7.0+ CGPA throughout academics.', 
'Java, C++, Data Structures, Multi-threading, Operating Systems, SQL, UNIX', 
'1. Online Technical Assessment (MCQs + Coding), 2. Technical Interview 1 (Deep DSA & OS Internals), 3. Technical Interview 2 (Low Level & High Level System Design), 4. HR Interview', 
'15 - 25 LPA', 'Mumbai, Bangalore', 'https://www.morganstanley.com/about-us/careers', '2026-08-12', 'Fresher / Experienced', 
'Tests multi-threading, concurrency locks, Operating System memory models, and standard transactional SQL features very strictly.'),

('PayPal', 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', 
'Software Engineer 1, MTS - Cloud Platforms, Security Analyst', 
'B.Tech/M.Tech/MCA in CS/IT or similar quantitative fields; CGPA 8.0+.', 
'Java, Node.js, REST APIs, Cryptography, Database Management, SQL', 
'1. Online Coding Challenge (HackerRank), 2. Technical Interview 1 (DSA & Code Optimization), 3. Technical Interview 2 (System Design & Cryptography/Security), 4. Managerial & Culture Fit Round', 
'16 - 24 LPA', 'Bangalore, Chennai', 'https://careers.paypal.com', '2026-09-18', 'Fresher / Experienced', 
'Core evaluation around financial transaction security, distributed databases, web encryption methods, and system reliability.'),

('Paytm', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo.svg', 
'Software Engineer (Backend), Software Engineer (Frontend)', 
'B.E/B.Tech/MCA/M.Sc; solid foundational understanding of web architectures and SQL.', 
'Node.js, React.js, MongoDB, SQL, Java, Redis, REST APIs', 
'1. Coding Assessment (Aptitude & Coding), 2. Technical Interview 1 (Data Structures), 3. Technical Interview 2 (System Design & DB), 4. HR Round', 
'8 - 14 LPA', 'Noida, Bangalore', 'https://jobs.paytm.com', '2026-07-25', 'Fresher / Experienced', 
'Expects strong web development concepts, practical system design (scaling web servers, using cache), and database queries optimization.'),

('PhonePe', 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg', 
'Software Engineer (SDE-1), Systems Engineer, Devops Associate', 
'B.Tech/M.Tech in CS/IT or similar quantitative disciplines; 7.5+ CGPA.', 
'Java, Distributed Systems, Multi-threading, Data Structures, Algorithms, SQL', 
'1. Online Programming Test, 2. Machine Coding Round (Develop functional code in 2 hours), 3. Technical Interview (Problem Solving & Design), 4. Hiring Manager & HR Round', 
'18 - 26 LPA', 'Bangalore, Pune', 'https://www.phonepe.com/careers', '2026-09-24', 'Fresher / Experienced', 
'The machine coding round is highly competitive. Candidate code must compile, have valid class architectures, handle exceptions, and pass test cases.'),

('Razorpay', 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Razorpay_logo.svg', 
'Software Development Engineer I (SDE-1), Associate Frontend Engineer', 
'B.E/B.Tech/MCA/M.Sc; CGPA 7.0+ or equivalent; strong logical thinking.', 
'Node.js, PHP, React.js, MySQL, Redis, AWS, REST APIs', 
'1. HackerRank Coding Assessment, 2. Machine Coding Round (Develop basic backend API/LLD), 3. Technical Interview (System Architecture & Security), 4. Bar Raiser Round', 
'12 - 20 LPA', 'Bangalore', 'https://razorpay.com/careers', '2026-08-28', 'Fresher / Experienced', 
'Hiring leans towards high familiarity with REST protocols, SQL database normalization, transactional isolation, and clean software architecture.'),

('Uber', 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.svg', 
'Software Engineer - SDE 1, Reliability Engineer', 
'B.E/B.Tech/M.Tech/MCA; strong problem solving skills with large scale databases.', 
'Go, Java, Python, System Design, Distributed Systems, Concurrency, Algorithms', 
'1. Online Coding Assessment, 2. Technical Interview 1 (DS/Algo - hard level), 3. Technical Interview 2 (Concurrency & LLD), 4. Onsite System Design, 5. Managerial Round', 
'25 - 40 LPA', 'Bangalore, Hyderabad', 'https://www.uber.com/careers', '2026-10-05', 'Fresher / Experienced', 
'Questions heavily focus on concurrent systems, distributed locking mechanisms, real-time geofencing algorithms, and microservices.'),

('Ola', 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Ola_Cabs_logo.svg', 
'Software Development Engineer, iOS/Android Developer', 
'B.Tech/M.Tech/MCA; 70% or 7.0 CGPA throughout academic history.', 
'Java, Node.js, Spring Boot, Microservices, C++, SQL, Algorithms', 
'1. Coding Assessment (HackerRank), 2. Technical Interview 1 (DS/Algo), 3. Technical Interview 2 (Low Level Design & Microservices), 4. HR Interview', 
'10 - 18 LPA', 'Bangalore, Pune', 'https://www.olacabs.com/careers', '2026-08-16', 'Fresher / Experienced', 
'Looking for candidates who can quickly build and scale REST APIs. Heavy evaluation on queue systems (Kafka) and caching.'),

('Swiggy', 'https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.svg', 
'SDE-1, Associate Android/iOS Developer, DevOps Analyst', 
'B.E/B.Tech/MCA; CGPA 6.5+; strong grasp of algorithms and systems.', 
'Java, Kotlin, Node.js, React.js, System Design, Microservices, Redis', 
'1. Online Coding & LLD Test, 2. Machine Coding Round (Functional Code design), 3. Technical Problem Solving (DSA), 4. System Architecture Round, 5. HR Round', 
'12 - 22 LPA', 'Bangalore', 'https://careers.swiggy.com', '2026-08-30', 'Fresher / Experienced', 
'Evaluates scalability, proper design patterns, use of standard collection libraries, and candidate general coding speed.'),

('Zomato', 'https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png', 
'Software Engineer, Frontend Developer, Mobile App Developer', 
'B.Tech/MCA/Self-taught developers; exceptional coding capacity & project building history.', 
'React.js, React Native, Node.js, PostgreSQL, Go, REST APIs', 
'1. Offline Hackathon/Take-home Coding Assignment, 2. Technical Interview 1 (Low-level Web standards), 3. Technical Interview 2 (System Design & Scale), 4. Zomato Culture & Founder Round', 
'12 - 24 LPA', 'Gurgaon, Bangalore', 'https://www.zomato.com/careers', '2026-09-02', 'Fresher / Experienced', 
'Hires based on projects built. Candidate must understand how the web works from scratch (cookies, localstorage, caching, network requests, CSS engine).'),

('Flipkart', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Flipkart_logo.svg', 
'Software Development Engineer-1, Associate QA Engineer', 
'B.E/B.Tech/M.Tech/MCA; CGPA 7.5+ or equivalent.', 
'Java, C++, Data Structures, Algorithms, OOPs, Low Level Design', 
'1. Online Coding Test (3 Questions), 2. Machine Coding Round (Class diagram and functional execution), 3. Technical Interview (Data Structures & Systems), 4. Hiring Manager Round', 
'16 - 28 LPA', 'Bangalore', 'https://www.flipkartcareers.com', '2026-09-18', 'Fresher', 
'Focuses heavily on low-level design patterns (like Strategy, Factory, Singleton) and algorithmic data structures during interviews.'),

('NVIDIA', 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo_2016.svg', 
'System Software Engineer, ASIC Design Engineer, AI Platform SWE', 
'B.Tech/M.Tech/MS/Ph.D. in CS/EE/EC; deep analytical understanding of computers.', 
'C, C++, Operating Systems, Computer Architecture, CUDA, Python', 
'1. Technical Phone Screening (OS/C concepts), 2. Technical Panel Interview 1 (Memory management & Pointer arithmetic), 3. Technical Panel Interview 2 (CPU/GPU Architecture & Algorithms), 4. Hiring Director Round', 
'22 - 38 LPA', 'Bangalore, Hyderabad, Pune', 'https://www.nvidia.com/en-us/about-nvidia/careers', '2026-10-20', 'Fresher / Experienced', 
'Tests deep understanding of multi-core processing, threads vs processes, virtual memory, pointers, and memory fragmentation in C/C++.'),

('Intel', 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg', 
'Software Engineer, Firmware Engineer, Validation Engineer', 
'B.E/B.Tech/M.Tech/MCA in Computer Science, Electrical or Electronics Engineering.', 
'C, C++, Embedded Systems, Linux Kernel, Python, Computer Networks', 
'1. Online Technical MCQ Test (C/C++ & OS), 2. Technical Interview 1 (Operating Systems & Embedded Concepts), 3. Technical Interview 2 (Data Structures & Algorithms), 4. HR Round', 
'10 - 18 LPA', 'Bangalore, Hyderabad', 'https://www.intel.com/content/www/us/en/jobs/locations/india.html', '2026-08-14', 'Fresher', 
'Candidates must possess solid knowledge in Linux system programming, assembly language, CPU caches, and firmware design.'),

('Cisco', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg', 
'Consulting Engineer, Software Developer, Network Engineer', 
'B.Tech/M.Tech/MCA; 70% or 7.0+ CGPA; no active backlogs.', 
'C, C++, Python, Networking (TCP/IP), Operating Systems, DBMS', 
'1. Online Aptitude & Technical Assessment, 2. Technical Interview 1 (Computer Networks & Routing Protocols), 3. Technical Interview 2 (Coding & Low-Level Design), 4. Managerial & HR Discussion', 
'12 - 20 LPA', 'Bangalore, Chennai', 'https://jobs.cisco.com', '2026-08-26', 'Fresher', 
'Must have strong knowledge of Computer Networks (TCP/IP layer, DNS, HTTP, routing) and systems programming in C/C++.');

-- Seed Domains
INSERT INTO domains (name, description, roadmap) VALUES 
('Full Stack Development', 
'Design, build, and deploy end-to-end web applications. Learn Frontend (HTML/CSS/JS/React), Backend (Spring Boot/Node.js), and Databases (MySQL/MongoDB).', 
'[{"milestone": "Frontend Basics", "skills": ["HTML5", "CSS3", "JavaScript ES6"]}, {"milestone": "Frontend Frameworks", "skills": ["React.js", "State Management", "Tailwind CSS"]}, {"milestone": "Backend Foundations", "skills": ["Node.js/Express" , "Java Spring Boot"]}, {"milestone": "Databases & APIs", "skills": ["SQL/MySQL", "REST APIs", "NoSQL"]}, {"milestone": "Deployment & DevOps", "skills": ["Docker", "AWS/Vercel", "CI/CD"]}]'),

('Software Engineering', 
'Focus on software construction, core computer science concepts, object-oriented design, operating systems, and building robust, maintainable programs.', 
'[{"milestone": "Core Programming", "skills": ["Java", "C++", "OOPs Concepts"]}, {"milestone": "Data Structures", "skills": ["Arrays", "Linked Lists", "Stacks & Queues"]}, {"milestone": "Advanced Algorithms", "skills": ["Recursion", "DP", "Trees & Graphs"]}, {"milestone": "Computer Science Core", "skills": ["Operating Systems", "DBMS", "Computer Networks"]}, {"milestone": "System Design", "skills": ["Low Level Design", "High Level Design", "Design Patterns"]}]'),

('Data Analytics', 
'Analyze datasets to identify trends, create visualizations, and help organizations make data-informed decisions. Key tools include Python, SQL, Tableau, and Excel.', 
'[{"milestone": "SQL & Data Extraction", "skills": ["Joins", "Aggregations", "Window Functions"]}, {"milestone": "Python for Data Analysis", "skills": ["Pandas", "NumPy", "Matplotlib/Seaborn"]}, {"milestone": "Business Intelligence", "skills": ["Excel Dashboarding", "Tableau/Power BI"]}, {"milestone": "Statistical Analysis", "skills": ["Probability", "Hypothesis Testing", "Regression"]}, {"milestone": "Data Warehousing", "skills": ["ETL Pipelines", "Data Modeling"]}]'),

('Cyber Security', 
'Protect networks, systems, and programs from digital attacks. Learn cryptography, ethical hacking, network defense, and system auditing.', 
'[{"milestone": "Networking & System Security", "skills": ["TCP/IP", "Linux Administration", "Firewalls"]}, {"milestone": "Vulnerability Assessment", "skills": ["Ethical Hacking", "Metasploit", "Nmap"]}, {"milestone": "Cryptography", "skills": ["Symmetric/Asymmetric Encryption", "Hashing", "PKI"]}, {"milestone": "Defensive Security", "skills": ["SIEM Tools", "Incident Response", "Threat Hunting"]}]');

-- Seed Courses (Learning Materials)
INSERT INTO courses (domain_id, title, description, difficulty, video_url, notes_path, assignment, project) VALUES 
(1, 'HTML5 & CSS3 Masterclass', 'Learn the building blocks of web design. Build responsive websites using Flexbox, CSS Grid, and custom animations.', 'BEGINNER', 
'https://www.youtube.com/embed/Dp6lbcAD9Hg', 
'# HTML5 & CSS3 Notes\n- HTML elements and semantic tags\n- CSS Box Model, Flexbox, Grid layout\n- Media queries for responsive layouts', 
'Create a responsive landing page for a fictional SaaS startup. Utilize Flexbox and CSS Grid.', 
'Personal Portfolio Website - design and deploy a responsive portfolio website using semantic HTML and CSS.'),

(1, 'React JS Core concepts', 'Understand components, props, state, hooks (useState, useEffect), and consuming REST APIs in React.', 'INTERMEDIATE', 
'https://www.youtube.com/embed/Ke90Tje7VS0', 
'# React Core Concepts\n- Virtual DOM & JSX\n- Functional Components & Hook lifecycle\n- Fetching data with Axios and rendering lists', 
'Build a Todo application that fetches mock tasks from a public API, with add/delete/update functionality.', 
'Career Guidance Portal - implement authentication, route guards, and charts using React and Recharts.'),

(1, 'Java Spring Boot REST APIs', 'Learn to build enterprise-ready REST APIs. Configure security, database access with JDBC, and build REST controllers.', 'ADVANCED', 
'https://www.youtube.com/embed/35EQXmHKZYs', 
'# Spring Boot REST APIs\n- Spring Framework Core (IoC, DI)\n- Spring Boot Starters, application.properties\n- Controller, Service, and Repository patterns using JdbcTemplate', 
'Create a REST controller for Company CRUD operations using JDBC, including validations.', 
'Placement Ecosystem Backend - develop a complete backend with JWT auth, MySQL schema, and connection pooling.'),

(2, 'Mastering Java & OOPs', 'Deep dive into Object Oriented Programming. Learn Inheritance, Polymorphism, Abstraction, and Encapsulation with Java.', 'BEGINNER', 
'https://www.youtube.com/embed/grEKMHGYyns', 
'# OOPs in Java\n- Classes & Objects\n- The 4 Pillars of OOPs\n- Interfaces, Abstract Classes, and Access Modifiers', 
'Design a Library Management system class structure using Abstract classes and interfaces.', 
'Console-based Banking System - implement accounts, transactions, and statements using Java collections.');

-- Seed Interview Questions
INSERT INTO interview_questions (company_id, question, answer, type, difficulty) VALUES 
(1, 'Explain how Virtual Memory works in Operating Systems.', 
'Virtual memory is a memory management capability of an OS that uses hardware and software to allow a computer to compensate for physical memory shortages by temporarily transferring data from random access memory (RAM) to disk storage. It maps virtual addresses used by a program into physical addresses in computer memory.', 
'TECHNICAL', 'MEDIUM'),

(1, 'Design a URL Shortener like bit.ly.', 
'A URL Shortener requires: 1) A service to generate unique short IDs (Base62 encoding of an auto-incrementing ID). 2) A database to store mapping of short URL to long URL (SQL for transactional safety, or NoSQL for scalability). 3) Redirection handling (HTTP 301 Permanent Redirect). 4) Caching layer (Redis) for fast lookups.', 
'TECHNICAL', 'HARD'),

(2, 'What are the differences between primary key and unique key?', 
'1. A primary key uniquely identifies each record in a table. A unique key uniquely identifies each row too.\n2. A table can have only one primary key, but multiple unique keys.\n3. A primary key cannot accept NULL values, whereas a unique key can accept one NULL value.', 
'TECHNICAL', 'EASY'),

(2, 'Why do you want to join TCS?', 
'Highlight TCS''s global presence, its status as a top employer, the learning opportunities available through platforms like TCS iON, and your desire to start your career in a structured, growth-oriented IT services ecosystem.', 
'HR', 'EASY'),

(3, 'Explain polymorphism and dynamic method dispatch in Java.', 
'Polymorphism is the capability of a method to do different things based on the object it is acting upon. Dynamic method dispatch is the mechanism by which a call to an overridden method is resolved at runtime rather than compile-time. This is achieved using interfaces or inheritance, where a superclass reference variable refers to a subclass object.', 
'TECHNICAL', 'MEDIUM');

-- Seed Mock Tests
INSERT INTO mock_tests (title, type, duration_minutes, questions) VALUES 
('Aptitude Assessment - Quant & Logical', 'APTITUDE', 15, 
'[{"id":1, "question":"A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?", "options":["120m", "150m", "180m", "324m"], "answer":"150m"}, {"id":2, "question":"If A increases by 10% and then decreases by 10%, what is the net change?", "options":["No change", "1% increase", "1% decrease", "2% decrease"], "answer":"1% decrease"}, {"id":3, "question":"Pointing to a photograph, Vipul said, ''She is the daughter of my grandfather''s only son.'' How is Vipul related to the girl in the photograph?", "options":["Brother", "Uncle", "Cousin", "Father"], "answer":"Brother"}]'),

('Core Java & Database Quiz', 'TECHNICAL', 20, 
'[{"id":1, "question":"Which of the following is NOT a fundamental concept of OOPs?", "options":["Polymorphism", "Compilation", "Inheritance", "Abstraction"], "answer":"Compilation"}, {"id":2, "question":"What is connection pooling in JDBC?", "options":["A database table collection", "A cache of database connections maintained so that connections can be reused", "A method to encrypt SQL queries", "A tool for auto-generating schemas"], "answer":"A cache of database connections maintained so that connections can be reused"}, {"id":3, "question":"Which SQL clause is used to filter group results after grouping?", "options":["WHERE", "HAVING", "GROUP BY", "ORDER BY"], "answer":"HAVING"}]');

-- Seed Coding Problems
INSERT INTO coding_problems (title, description, difficulty, company_id, test_cases, starter_code) VALUES 
('Two Sum', 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.', 'EASY', 1, 
'[{"input":"[2,7,11,15], 9", "output":"[0,1]"}, {"input":"[3,2,4], 6", "output":"[1,2]"}]', 
'{"java":"class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write code here\n        return new int[]{};\n    }\n}", "python":"def twoSum(nums, target):\n    # Write code here\n    return []", "cpp":"class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write code here\n        return {};\n    }\n};", "javascript":"function twoSum(nums, target) {\n    // Write code here\n    return [];\n}"}'),

('Reverse Linked List', 'Given the `head` of a singly linked list, reverse the list, and return its reversed list.', 'MEDIUM', 3, 
'[{"input":"[1,2,3,4,5]", "output":"[5,4,3,2,1]"}, {"input":"[1,2]", "output":"[2,1]"}]', 
'{"java":"class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write code here\n        return null;\n    }\n}", "python":"def reverseList(head):\n    # Write code here\n    return None", "cpp":"class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write code here\n        return nullptr;\n    }\n};", "javascript":"function reverseList(head) {\n    // Write code here\n    return null;\n}"}');
