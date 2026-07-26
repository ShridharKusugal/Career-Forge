-- Migration V11: Seed additional courses for Full Stack Development (domain_id=1)
-- Ensures >24 courses are available in the Learning Center
INSERT IGNORE INTO courses (domain_id, title, description, difficulty, video_url, assignment, project) VALUES
(1, 'Advanced Java', 'Deep dive into Java streams, concurrency, and JVM tuning.', 'ADVANCED', 'https://www.youtube.com/embed/example101', 'Profile a Java application with VisualVM.', 'N/A'),
(1, 'Machine Learning Basics', 'Intro to ML concepts, models, and Python libraries.', 'BEGINNER', 'https://www.youtube.com/embed/example102', 'Train a simple linear regression model.', 'N/A'),
(1, 'Cloud Architecture', 'Design scalable cloud solutions using AWS and Azure.', 'INTERMEDIATE', 'https://www.youtube.com/embed/example103', 'Deploy a 3-tier architecture on AWS.', 'N/A'),
(1, 'Data Structures in Go', 'Explore slices, maps, channels, and concurrency patterns.', 'INTERMEDIATE', 'https://www.youtube.com/embed/example104', 'Implement a concurrent web scraper.', 'N/A'),
(1, 'Kubernetes Fundamentals', 'Deploy and manage apps on Kubernetes clusters.', 'INTERMEDIATE', 'https://www.youtube.com/embed/example105', 'Create a K8s deployment manifest.', 'Deploy a microservices app on Minikube.'),
(1, 'React Native', 'Build cross-platform mobile apps with React Native.', 'INTERMEDIATE', 'https://www.youtube.com/embed/example106', 'Build a to-do list app.', 'N/A'),
(1, 'Cybersecurity Essentials', 'Learn fundamentals of security, encryption, and threat modeling.', 'BEGINNER', 'https://www.youtube.com/embed/example107', 'Perform a basic vulnerability scan.', 'N/A'),
(1, 'DevOps CI/CD', 'Implement CI/CD pipelines using GitHub Actions and Jenkins.', 'INTERMEDIATE', 'https://www.youtube.com/embed/example108', 'Set up a GitHub Actions workflow.', 'N/A'),
(1, 'Python for Data Science', 'Pandas, NumPy, and visualization for data analysis.', 'BEGINNER', 'https://www.youtube.com/embed/example109', 'Analyze a CSV dataset with Pandas.', 'N/A'),
(1, 'Rust Programming', 'Safe systems programming with Rust ownership model.', 'ADVANCED', 'https://www.youtube.com/embed/example110', 'Build a CLI tool in Rust.', 'N/A'),
(1, 'Angular Advanced', 'Advanced components, RxJS, and performance optimization.', 'ADVANCED', 'https://www.youtube.com/embed/example111', 'Build a reactive dashboard.', 'N/A'),
(1, 'SQL Optimization', 'Write efficient queries, indexes, and query plans.', 'INTERMEDIATE', 'https://www.youtube.com/embed/example112', 'Optimize slow queries with EXPLAIN.', 'N/A'),
(1, 'Blockchain Basics', 'Understand blockchain concepts and smart contracts.', 'BEGINNER', 'https://www.youtube.com/embed/example113', 'Deploy a smart contract on a testnet.', 'N/A'),
(1, 'AI Prompt Engineering', 'Craft effective prompts for LLMs and chatbots.', 'BEGINNER', 'https://www.youtube.com/embed/example114', 'Write 10 structured prompts.', 'N/A'),
(1, 'Full-Stack Project', 'Build a complete MERN stack application.', 'ADVANCED', 'https://www.youtube.com/embed/example115', 'Set up the project scaffold.', 'Full-stack blog platform.'),
(1, 'Design Patterns', 'Apply classic design patterns in JavaScript and Java.', 'ADVANCED', 'https://www.youtube.com/embed/example116', 'Implement the Observer pattern.', 'N/A'),
(1, 'Testing Strategies', 'Unit, integration, and E2E testing with Jest and Cypress.', 'INTERMEDIATE', 'https://www.youtube.com/embed/example117', 'Write tests for a REST API.', 'N/A'),
(1, 'Performance Tuning', 'Profile and optimize web app performance.', 'ADVANCED', 'https://www.youtube.com/embed/example118', 'Use Lighthouse to audit a web page.', 'N/A'),
(1, 'Serverless Architecture', 'Deploy functions on AWS Lambda and Azure Functions.', 'INTERMEDIATE', 'https://www.youtube.com/embed/example119', 'Create a Lambda function for image resizing.', 'N/A'),
(1, 'Ethical Hacking', 'Pen-testing fundamentals and tools.', 'ADVANCED', 'https://www.youtube.com/embed/example120', 'Perform an OWASP Top 10 audit.', 'N/A');
