-- V7: Seed accurate roadmaps (courses) for the new domains
-- Using subqueries to ensure correct domain mapping regardless of auto_increment IDs.

INSERT INTO courses (domain_id, title, description, difficulty, video_url, assignment, project) VALUES 
-- 1. Machine Learning & AI
((SELECT id FROM domains WHERE name = 'Machine Learning & AI'), 'Applied Mathematics for AI', 'Learn essential Linear Algebra, Calculus, and Probability for ML.', 'BEGINNER', 'https://www.youtube.com/embed/jZ_yZ5b4IHM', 'Solve a set of gradient descent calculations.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Machine Learning & AI'), 'Scikit-Learn & Classical ML', 'Implement regressions, SVMs, and decision trees using Python.', 'INTERMEDIATE', 'https://www.youtube.com/embed/pqNCD_5r0IU', 'Build a spam classification model.', 'Predicting House Prices using Kaggle Dataset.'),
((SELECT id FROM domains WHERE name = 'Machine Learning & AI'), 'Deep Learning with TensorFlow', 'Understand and build CNNs and RNNs using Google''s TensorFlow library.', 'ADVANCED', 'https://www.youtube.com/embed/tPYj3fFJGjk', 'Train a custom image classifier.', 'Autonomous driving lane detection model.'),

-- 2. Cloud Computing & DevOps
((SELECT id FROM domains WHERE name = 'Cloud Computing & DevOps'), 'AWS Cloud Practitioner Essentials', 'Understand basic cloud concepts, AWS services, security, and architecture.', 'BEGINNER', 'https://www.youtube.com/embed/3hLmDS179YE', 'Set up a secure VPC and EC2 instance.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Cloud Computing & DevOps'), 'CI/CD Pipelines with GitHub Actions', 'Automate code testing and deployment processes natively in GitHub.', 'INTERMEDIATE', 'https://www.youtube.com/embed/R8_veQiYBjI', 'Create a workflow to test a Node.js app.', 'Automated Docker image build and push.'),
((SELECT id FROM domains WHERE name = 'Cloud Computing & DevOps'), 'Kubernetes & Helm', 'Manage containerized workloads and services at scale.', 'ADVANCED', 'https://www.youtube.com/embed/X48VuDVv0do', 'Write YAML manifests for a microservice.', 'Deploy a resilient highly-available web app on EKS.'),

-- 3. Mobile App Development
((SELECT id FROM domains WHERE name = 'Mobile App Development'), 'Android Kotlin Fundamentals', 'Learn the basics of Android development using Kotlin and Jetpack Compose.', 'BEGINNER', 'https://www.youtube.com/embed/EOfCEhWq8sg', 'Build a simple calculator app.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Mobile App Development'), 'React Native Crash Course', 'Build cross-platform mobile apps using JavaScript and React.', 'INTERMEDIATE', 'https://www.youtube.com/embed/0-S5a0eXPoc', 'Implement React Navigation.', 'Build a fully functional To-Do mobile app.'),
((SELECT id FROM domains WHERE name = 'Mobile App Development'), 'iOS Swift Architecture', 'Advanced iOS state management, CoreData, and SwiftUI architectures.', 'ADVANCED', 'https://www.youtube.com/embed/Ulp1Kimblg0', 'Integrate a REST API in Swift.', 'App Store ready social media feed app.'),

-- 4. Data Science
((SELECT id FROM domains WHERE name = 'Data Science'), 'Pandas & Data Wrangling', 'Clean, manipulate, and explore data using Pandas in Python.', 'BEGINNER', 'https://www.youtube.com/embed/vmEHCJofslg', 'Clean a dirty CSV dataset.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Data Science'), 'Data Visualization with Tableau', 'Create powerful, interactive dashboards for business intelligence.', 'INTERMEDIATE', 'https://www.youtube.com/embed/aHaOIvRvsB4', 'Create a sales dashboard.', 'End-to-end interactive COVID-19 tracker.'),
((SELECT id FROM domains WHERE name = 'Data Science'), 'Advanced A/B Testing', 'Statistical significance, experiment design, and measuring lift.', 'ADVANCED', 'https://www.youtube.com/embed/8H6zF7F4QGM', 'Calculate P-value for a simulated experiment.', 'Optimize an e-commerce checkout flow via A/B analysis.'),

-- 5. Game Development
((SELECT id FROM domains WHERE name = 'Game Development'), 'Unity C# Survival Guide', 'Learn the basics of C# programming strictly tailored for the Unity Engine.', 'BEGINNER', 'https://www.youtube.com/embed/gB1F9G0JXOo', 'Move a 3D cube using player input.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Game Development'), '2D Platformer Mechanics', 'Implement gravity, jumping, raycast collision, and sprite animations.', 'INTERMEDIATE', 'https://www.youtube.com/embed/Pw3c-53fBIE', 'Implement double jump mechanic.', 'Complete 2D Platformer level with enemies.'),
((SELECT id FROM domains WHERE name = 'Game Development'), 'Unreal Engine Blueprints to C++', 'Transition from visual scripting to highly optimized C++ in Unreal 5.', 'ADVANCED', 'https://www.youtube.com/embed/gQjDAiuF7-U', 'Convert a complex Blueprint actor to C++.', 'Multiplayer FPS framework setup.'),

-- 6. UI/UX Design
((SELECT id FROM domains WHERE name = 'UI/UX Design'), 'Figma Masterclass', 'Master interface design, auto-layout, and prototyping in Figma.', 'BEGINNER', 'https://www.youtube.com/embed/c9Wg6Cb_YlU', 'Design a mobile login screen.', 'N/A'),
((SELECT id FROM domains WHERE name = 'UI/UX Design'), 'User Research & Personas', 'Conduct effective user interviews and map user journeys.', 'INTERMEDIATE', 'https://www.youtube.com/embed/58n2qW4O-O0', 'Create 3 user personas for a fitness app.', 'End-to-end UX research report for a startup.'),
((SELECT id FROM domains WHERE name = 'UI/UX Design'), 'Design Systems & Micro-Interactions', 'Build scalable component libraries and advanced prototype animations.', 'ADVANCED', 'https://www.youtube.com/embed/2XQjD04y4Kk', 'Create an interactive button state component.', 'Fully prototyped E-commerce app with transitions.'),

-- 7. Blockchain & Web3
((SELECT id FROM domains WHERE name = 'Blockchain & Web3'), 'Cryptography & Blockchain Basics', 'Understand hashing, consensus, and how distributed ledgers work.', 'BEGINNER', 'https://www.youtube.com/embed/bBC-nXj3Ng4', 'Manually simulate a SHA-256 block hash.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Blockchain & Web3'), 'Solidity Smart Contracts', 'Write and deploy secure smart contracts on the Ethereum Virtual Machine.', 'INTERMEDIATE', 'https://www.youtube.com/embed/M576WGiDBdQ', 'Write a basic token standard (ERC20) contract.', 'Deploy a decentralized voting system.'),
((SELECT id FROM domains WHERE name = 'Blockchain & Web3'), 'Full Stack dApps with Hardhat', 'Connect React frontends to smart contracts using Ethers.js and Hardhat.', 'ADVANCED', 'https://www.youtube.com/embed/pZz-Oau4_eM', 'Read contract state from a React frontend.', 'Build a fully functional NFT Marketplace.'),

-- 8. Internet of Things (IoT)
((SELECT id FROM domains WHERE name = 'Internet of Things (IoT)'), 'Arduino & Sensor Basics', 'Read analog/digital signals and control basic hardware.', 'BEGINNER', 'https://www.youtube.com/embed/nL34zDTPkcs', 'Make an LED blink using a breadboard.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Internet of Things (IoT)'), 'Raspberry Pi & MQTT', 'Set up lightweight messaging protocols for edge devices.', 'INTERMEDIATE', 'https://www.youtube.com/embed/EHjkOpJ6Q7s', 'Send temperature data to a broker.', 'Smart Home hub connecting 3 different sensors.'),
((SELECT id FROM domains WHERE name = 'Internet of Things (IoT)'), 'AWS IoT Core Integration', 'Securely connect fleets of IoT devices to cloud analytics.', 'ADVANCED', 'https://www.youtube.com/embed/4yW7Ew2tC0o', 'Register a device shadow in AWS.', 'Real-time fleet tracking analytics dashboard.'),

-- 9. Database Administration
((SELECT id FROM domains WHERE name = 'Database Administration'), 'SQL & Relational Schemas', 'Learn data modeling, normalization, and advanced querying.', 'BEGINNER', 'https://www.youtube.com/embed/HXV3zeJZ1EQ', 'Normalize a flat CSV to 3NF.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Database Administration'), 'MySQL Performance Tuning', 'Master indexing, query execution plans, and caching strategies.', 'INTERMEDIATE', 'https://www.youtube.com/embed/9Pzj7Aj25lw', 'Optimize a slow JOIN query using EXPLAIN.', 'Database profiling report for a legacy app.'),
((SELECT id FROM domains WHERE name = 'Database Administration'), 'Database High Availability', 'Implement clustering, replication, and disaster recovery.', 'ADVANCED', 'https://www.youtube.com/embed/z58R5jO7_2Q', 'Setup master-slave replication.', 'Simulated failover recovery of a production DB.'),

-- 10. Quality Assurance & Automation
((SELECT id FROM domains WHERE name = 'Quality Assurance & Automation'), 'Software Testing Fundamentals', 'Learn test cases, bug lifecycles, and agile testing methodologies.', 'BEGINNER', 'https://www.youtube.com/embed/T4E-b2r3p40', 'Write 10 edge test cases for a login form.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Quality Assurance & Automation'), 'API Testing with Postman', 'Automate backend testing using Postman collections and scripts.', 'INTERMEDIATE', 'https://www.youtube.com/embed/vycdIFDbl4I', 'Write a test script for a 200 OK response.', 'Comprehensive API test suite with variables.'),
((SELECT id FROM domains WHERE name = 'Quality Assurance & Automation'), 'UI Automation with Cypress', 'Write reliable end-to-end browser tests in JavaScript.', 'ADVANCED', 'https://www.youtube.com/embed/7N63cMKosIE', 'Automate a user login flow in Cypress.', 'End-to-end test suite for an e-commerce checkout.'),

-- 11. Embedded Systems
((SELECT id FROM domains WHERE name = 'Embedded Systems'), 'C for Embedded Systems', 'Master bitwise operations, memory management, and pointers.', 'BEGINNER', 'https://www.youtube.com/embed/b00HsZvg-V0', 'Write a bitmasking function.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Embedded Systems'), 'Communication Protocols (I2C/SPI)', 'Interface microcontrollers with external peripherals and sensors.', 'INTERMEDIATE', 'https://www.youtube.com/embed/3T-c0c_wX7Y', 'Read data from an I2C accelerometer.', 'Build a custom digital weather station.'),
((SELECT id FROM domains WHERE name = 'Embedded Systems'), 'Real-Time Operating Systems (RTOS)', 'Manage tasks, interrupts, and concurrency using FreeRTOS.', 'ADVANCED', 'https://www.youtube.com/embed/F321087yYy4', 'Set up task scheduling in FreeRTOS.', 'Multi-threaded robotic arm controller.'),

-- 12. Natural Language Processing
((SELECT id FROM domains WHERE name = 'Natural Language Processing'), 'Text Processing Basics', 'Regex, Tokenization, Stemming, and TF-IDF using NLTK/Spacy.', 'BEGINNER', 'https://www.youtube.com/embed/fNxaJsNG3-s', 'Tokenize and clean a corpus of text.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Natural Language Processing'), 'Sequence Models (LSTM/GRU)', 'Train recurrent neural networks for sentiment analysis.', 'INTERMEDIATE', 'https://www.youtube.com/embed/WCUNPb-5EYI', 'Predict next word in a sequence.', 'Movie review sentiment classifier.'),
((SELECT id FROM domains WHERE name = 'Natural Language Processing'), 'Transformers & LLMs', 'Fine-tune BERT and leverage GPT architectures via Hugging Face.', 'ADVANCED', 'https://www.youtube.com/embed/SZorAJ4I-sA', 'Perform zero-shot classification.', 'Custom AI Chatbot fine-tuned on company docs.'),

-- 13. Big Data Engineering
((SELECT id FROM domains WHERE name = 'Big Data Engineering'), 'Hadoop & Distributed File Systems', 'Understand HDFS, MapReduce, and massive data storage concepts.', 'BEGINNER', 'https://www.youtube.com/embed/1vbXmCrkTy8', 'Run a basic MapReduce word count.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Big Data Engineering'), 'Apache Spark Data Processing', 'Process large datasets in-memory using PySpark DataFrames.', 'INTERMEDIATE', 'https://www.youtube.com/embed/5NWNjuqF-F4', 'Filter a 10GB dataset using Spark.', 'ETL pipeline converting raw logs to clean Parquet.'),
((SELECT id FROM domains WHERE name = 'Big Data Engineering'), 'Real-time Streaming with Kafka', 'Build low-latency event-driven architectures with Apache Kafka.', 'ADVANCED', 'https://www.youtube.com/embed/U4y2R3v9tlY', 'Create a Kafka producer/consumer in Java.', 'Real-time fraud detection streaming pipeline.'),

-- 14. AR/VR Development
((SELECT id FROM domains WHERE name = 'AR/VR Development'), '3D Spatial Design', 'Understand 3D space, coordinates, and basic modeling for VR.', 'BEGINNER', 'https://www.youtube.com/embed/p1b2N2_H8rE', 'Model a low-poly room.', 'N/A'),
((SELECT id FROM domains WHERE name = 'AR/VR Development'), 'Mobile AR with ARCore/ARKit', 'Place digital objects in the real world using mobile cameras.', 'INTERMEDIATE', 'https://www.youtube.com/embed/7V-w0K_J-M0', 'Spawn an object on plane detection.', 'Interactive AR furniture placement app.'),
((SELECT id FROM domains WHERE name = 'AR/VR Development'), 'Oculus VR Interaction Design', 'Implement grabbing, throwing, and spatial UI for VR headsets.', 'ADVANCED', 'https://www.youtube.com/embed/6Xv4K_gPjMw', 'Implement physics-based grabbing.', 'VR Escape Room Game.'),

-- 15. Quantitative Finance & Trading
((SELECT id FROM domains WHERE name = 'Quantitative Finance & Trading'), 'Financial Markets Primer', 'Understand equities, derivatives, and market microstructure.', 'BEGINNER', 'https://www.youtube.com/embed/9aJ6q_Gg8nI', 'Calculate ROI and Sharpe ratio.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Quantitative Finance & Trading'), 'Algorithmic Trading & Backtesting', 'Use Python to backtest moving average crossover strategies.', 'INTERMEDIATE', 'https://www.youtube.com/embed/xfzGZB4HhEE', 'Backtest a basic SMA strategy.', 'Mean-reversion trading bot backtest report.'),
((SELECT id FROM domains WHERE name = 'Quantitative Finance & Trading'), 'Quantitative Risk Management', 'Model volatility (GARCH) and calculate Value at Risk (VaR).', 'ADVANCED', 'https://www.youtube.com/embed/6wXQ18U9YwQ', 'Calculate historical VaR for a portfolio.', 'Automated portfolio optimization engine.'),

-- 16. Product Management
((SELECT id FROM domains WHERE name = 'Product Management'), 'Product Strategy & Vision', 'Learn to conduct market research and define a product vision.', 'BEGINNER', 'https://www.youtube.com/embed/0I1uE_UaBf0', 'Write a product vision board.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Product Management'), 'Agile & Scrum Execution', 'Manage backlogs, write user stories, and plan sprints.', 'INTERMEDIATE', 'https://www.youtube.com/embed/9TycLR0TqFA', 'Write 5 detailed user stories.', 'Complete PRD (Product Requirements Document).'),
((SELECT id FROM domains WHERE name = 'Product Management'), 'Data-Driven PM & A/B Testing', 'Make product decisions using KPIs, funnels, and experiment data.', 'ADVANCED', 'https://www.youtube.com/embed/5F_C2E5D0-E', 'Analyze a mock retention funnel.', 'Product launch strategy based on cohort data.'),

-- 17. Site Reliability Engineering
((SELECT id FROM domains WHERE name = 'Site Reliability Engineering'), 'SRE Fundamentals (SLIs/SLOs)', 'Understand Google''s SRE methodology and error budgets.', 'BEGINNER', 'https://www.youtube.com/embed/uTEL8Ff1Zvk', 'Define SLIs for a REST API.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Site Reliability Engineering'), 'Monitoring with Prometheus/Grafana', 'Collect metrics and build actionable observability dashboards.', 'INTERMEDIATE', 'https://www.youtube.com/embed/PDxcEwa62g', 'Export Node metrics to Prometheus.', 'Comprehensive cluster monitoring dashboard.'),
((SELECT id FROM domains WHERE name = 'Site Reliability Engineering'), 'Incident Management & Chaos Eng.', 'Write runbooks, conduct postmortems, and test system resilience.', 'ADVANCED', 'https://www.youtube.com/embed/9Gz_F6Ua8iE', 'Write a blameless postmortem.', 'Chaos Mesh experiment on a staging cluster.'),

-- 18. Technical Writing
((SELECT id FROM domains WHERE name = 'Technical Writing'), 'Docs as Code & Markdown', 'Use Markdown, Git, and SSGs to treat documentation like code.', 'BEGINNER', 'https://www.youtube.com/embed/6A5EpqqDOcg', 'Write a comprehensive README.md.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Technical Writing'), 'API Documentation (Swagger)', 'Document REST APIs clearly using OpenAPI/Swagger specs.', 'INTERMEDIATE', 'https://www.youtube.com/embed/pRS9LhQXVpo', 'Write a Swagger file for a login endpoint.', 'Complete developer portal for a mock API.'),
((SELECT id FROM domains WHERE name = 'Technical Writing'), 'Information Architecture', 'Structure complex documentation sites for maximum user success.', 'ADVANCED', 'https://www.youtube.com/embed/6b5L2O3V3V4', 'Restructure a poorly organized doc tree.', 'Complete user manual and onboarding flow.'),

-- 19. E-commerce Development
((SELECT id FROM domains WHERE name = 'E-commerce Development'), 'E-commerce Platforms Basics', 'Understand the differences between Shopify, Magento, and WooCommerce.', 'BEGINNER', 'https://www.youtube.com/embed/3k0b8oO0r5s', 'Set up a basic Shopify store.', 'N/A'),
((SELECT id FROM domains WHERE name = 'E-commerce Development'), 'Payment Gateway Integration', 'Securely implement Stripe and PayPal checkout flows.', 'INTERMEDIATE', 'https://www.youtube.com/embed/mI_-1tbZgI4', 'Create a Stripe Checkout session.', 'Custom Next.js storefront with Stripe payments.'),
((SELECT id FROM domains WHERE name = 'E-commerce Development'), 'Headless Commerce Architectures', 'Decouple frontend and backend using GraphQL and Next.js.', 'ADVANCED', 'https://www.youtube.com/embed/xNqM0R-1w50', 'Fetch products via Shopify Storefront API.', 'Lightning-fast Headless React E-commerce store.'),

-- 20. Robotics & Automation
((SELECT id FROM domains WHERE name = 'Robotics & Automation'), 'Kinematics & Coordinate Systems', 'Learn the math behind robot arm movement and joint spaces.', 'BEGINNER', 'https://www.youtube.com/embed/4yW7Ew2tC0o', 'Calculate forward kinematics for a 2-DOF arm.', 'N/A'),
((SELECT id FROM domains WHERE name = 'Robotics & Automation'), 'Robot Operating System (ROS)', 'Publish and subscribe to topics using ROS nodes in Python/C++.', 'INTERMEDIATE', 'https://www.youtube.com/embed/0BxVPCIQnwU', 'Write a ROS publisher node.', 'Simulated robot navigation in Gazebo.'),
((SELECT id FROM domains WHERE name = 'Robotics & Automation'), 'Computer Vision & SLAM', 'Enable robots to "see" and map their environments simultaneously.', 'ADVANCED', 'https://www.youtube.com/embed/SAz9c513k9w', 'Detect obstacles using OpenCV.', 'Autonomous obstacle-avoiding mobile robot simulation.');
