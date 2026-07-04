-- V5: Add 20 more domains to the Learning Center

INSERT INTO domains (name, description, roadmap) VALUES 
('Machine Learning & AI', 
'Build intelligent systems that learn from data. Learn Python, Scikit-learn, TensorFlow, and advanced mathematical concepts for AI.', 
'[{"milestone": "Mathematics", "skills": ["Linear Algebra", "Calculus", "Statistics"]}, {"milestone": "ML Foundations", "skills": ["Regression", "Classification", "Clustering"]}, {"milestone": "Deep Learning", "skills": ["Neural Networks", "CNNs", "RNNs"]}, {"milestone": "Model Deployment", "skills": ["Flask/FastAPI", "Docker", "MLflow"]}]'),

('Cloud Computing & DevOps', 
'Automate deployments, scale infrastructure, and manage continuous integration pipelines using cloud platforms and DevOps tools.', 
'[{"milestone": "Cloud Basics", "skills": ["AWS/Azure/GCP", "Virtualization", "Networking"]}, {"milestone": "CI/CD Pipelines", "skills": ["Jenkins", "GitHub Actions", "GitLab CI"]}, {"milestone": "Containerization", "skills": ["Docker", "Kubernetes", "Helm"]}, {"milestone": "Infrastructure as Code", "skills": ["Terraform", "Ansible", "CloudFormation"]}]'),

('Mobile App Development', 
'Create applications for iOS and Android devices using native or cross-platform frameworks.', 
'[{"milestone": "Fundamentals", "skills": ["UI/UX Basics", "Mobile Architecture", "State Management"]}, {"milestone": "Cross-Platform", "skills": ["Flutter", "React Native", "Dart"]}, {"milestone": "Native iOS", "skills": ["Swift", "XCode", "CoreData"]}, {"milestone": "Native Android", "skills": ["Kotlin", "Android Studio", "Jetpack Compose"]}]'),

('Data Science', 
'Extract insights and knowledge from structured and unstructured data using scientific methods, algorithms, and systems.', 
'[{"milestone": "Data Manipulation", "skills": ["Pandas", "NumPy", "SQL"]}, {"milestone": "Data Visualization", "skills": ["Matplotlib", "Seaborn", "Tableau"]}, {"milestone": "Advanced Stats", "skills": ["Hypothesis Testing", "A/B Testing", "Experiment Design"]}, {"milestone": "Predictive Modeling", "skills": ["Scikit-Learn", "XGBoost", "Time Series"]}]'),

('Game Development', 
'Design and program interactive video games for PC, console, and mobile platforms.', 
'[{"milestone": "Game Math & Physics", "skills": ["Vectors", "Trigonometry", "Collision Detection"]}, {"milestone": "Engine Basics", "skills": ["Unity", "Unreal Engine", "Godot"]}, {"milestone": "Programming", "skills": ["C#", "C++", "Scripting"]}, {"milestone": "Graphics & Audio", "skills": ["Shaders", "Lighting", "Sound Design"]}]'),

('UI/UX Design', 
'Design user interfaces and user experiences to create intuitive, accessible, and beautiful applications.', 
'[{"milestone": "Design Theory", "skills": ["Color Theory", "Typography", "Layout"]}, {"milestone": "Wireframing", "skills": ["Figma", "Sketch", "Adobe XD"]}, {"milestone": "User Research", "skills": ["Personas", "User Journeys", "Usability Testing"]}, {"milestone": "Prototyping", "skills": ["Interactive Prototypes", "Micro-interactions", "Design Systems"]}]'),

('Blockchain & Web3', 
'Develop decentralized applications (dApps), smart contracts, and understand cryptographic principles underlying blockchain technology.', 
'[{"milestone": "Cryptography Basics", "skills": ["Hashing", "Public Key Crypto", "Consensus Algorithms"]}, {"milestone": "Smart Contracts", "skills": ["Solidity", "Vyper", "EVM"]}, {"milestone": "Web3 Integration", "skills": ["Web3.js", "Ethers.js", "Hardhat"]}, {"milestone": "DeFi & NFTs", "skills": ["Token Standards", "DEXs", "Security Auditing"]}]'),

('Internet of Things (IoT)', 
'Connect and program physical devices to the internet to collect data and automate processes.', 
'[{"milestone": "Hardware Basics", "skills": ["Arduino", "Raspberry Pi", "Sensors"]}, {"milestone": "Networking Protocols", "skills": ["MQTT", "HTTP", "CoAP"]}, {"milestone": "Edge Computing", "skills": ["MicroPython", "C/C++", "Real-Time OS"]}, {"milestone": "Cloud Integration", "skills": ["AWS IoT", "Azure IoT", "Data Analytics"]}]'),

('Database Administration', 
'Install, configure, manage, and secure database systems to ensure data availability and performance.', 
'[{"milestone": "Database Setup", "skills": ["Installation", "Configuration", "User Management"]}, {"milestone": "Performance Tuning", "skills": ["Indexing", "Query Optimization", "Caching"]}, {"milestone": "High Availability", "skills": ["Replication", "Clustering", "Load Balancing"]}, {"milestone": "Backup & Recovery", "skills": ["Disaster Recovery", "Point-in-Time Recovery", "Monitoring"]}]'),

('Quality Assurance & Automation', 
'Ensure software quality through manual testing and automated test scripts across different environments.', 
'[{"milestone": "Testing Fundamentals", "skills": ["Test Cases", "Bug Reporting", "Agile Testing"]}, {"milestone": "API Testing", "skills": ["Postman", "REST Assured", "SoapUI"]}, {"milestone": "UI Automation", "skills": ["Selenium", "Cypress", "Playwright"]}, {"milestone": "Performance Testing", "skills": ["JMeter", "Gatling", "Load Testing"]}]'),

('Embedded Systems', 
'Design and program computing systems dedicated to specific tasks within larger mechanical or electrical systems.', 
'[{"milestone": "Microcontrollers", "skills": ["ARM Cortex", "AVR", "PIC"]}, {"milestone": "Low-Level Programming", "skills": ["C", "Assembly", "Memory Management"]}, {"milestone": "Communication Interfaces", "skills": ["I2C", "SPI", "UART"]}, {"milestone": "RTOS", "skills": ["FreeRTOS", "Task Scheduling", "Interrupts"]}]'),

('Natural Language Processing', 
'Enable computers to understand, interpret, and generate human language.', 
'[{"milestone": "Text Processing", "skills": ["Tokenization", "Stemming", "Lemmatization"]}, {"milestone": "Vectorization", "skills": ["TF-IDF", "Word2Vec", "GloVe"]}, {"milestone": "Sequence Models", "skills": ["RNNs", "LSTMs", "Transformers"]}, {"milestone": "LLMs & GenAI", "skills": ["BERT", "GPT", "Prompt Engineering"]}]'),

('Big Data Engineering', 
'Build robust data pipelines to process, transform, and store massive amounts of data.', 
'[{"milestone": "Hadoop Ecosystem", "skills": ["HDFS", "MapReduce", "YARN"]}, {"milestone": "Stream Processing", "skills": ["Apache Kafka", "Apache Flink", "Spark Streaming"]}, {"milestone": "Data Processing", "skills": ["Apache Spark", "Scala", "Data Lakes"]}, {"milestone": "Orchestration", "skills": ["Apache Airflow", "Luigi", "Dagster"]}]'),

('AR/VR Development', 
'Create immersive augmented and virtual reality experiences for various devices and headsets.', 
'[{"milestone": "3D Modeling Basics", "skills": ["Blender", "Maya", "Spatial Design"]}, {"milestone": "VR Development", "skills": ["Oculus SDK", "SteamVR", "Interaction Design"]}, {"milestone": "AR Development", "skills": ["ARCore", "ARKit", "Vuforia"]}, {"milestone": "Optimization", "skills": ["Performance Tuning", "Rendering", "Shader Graph"]}]'),

('Quantitative Finance & Trading', 
'Apply mathematical and statistical models to financial markets for algorithmic trading and risk management.', 
'[{"milestone": "Financial Markets", "skills": ["Equities", "Derivatives", "Market Microstructure"]}, {"milestone": "Time Series Analysis", "skills": ["ARIMA", "GARCH", "Volatility Modeling"]}, {"milestone": "Algorithmic Trading", "skills": ["Backtesting", "Order Execution", "HFT Basics"]}, {"milestone": "Risk Management", "skills": ["VaR", "Stress Testing", "Portfolio Optimization"]}]'),

('Product Management', 
'Guide the success of a product and lead the cross-functional team that is responsible for improving it.', 
'[{"milestone": "Product Strategy", "skills": ["Market Research", "Vision", "Roadmapping"]}, {"milestone": "User Centricity", "skills": ["User Interviews", "Jobs to be Done", "Prototyping"]}, {"milestone": "Agile & Execution", "skills": ["Scrum", "Sprint Planning", "Backlog Grooming"]}, {"milestone": "Metrics & Analytics", "skills": ["KPIs", "A/B Testing", "Data-Driven Decisions"]}]'),

('Site Reliability Engineering', 
'Apply software engineering practices to infrastructure and operations problems to create scalable and highly reliable software systems.', 
'[{"milestone": "Monitoring & Alerting", "skills": ["Prometheus", "Grafana", "Datadog"]}, {"milestone": "Incident Management", "skills": ["On-Call", "Postmortems", "Runbooks"]}, {"milestone": "SLAs, SLOs, SLIs", "skills": ["Error Budgets", "Reliability Metrics", "Capacity Planning"]}, {"milestone": "Automation", "skills": ["Scripting", "Chaos Engineering", "Toil Reduction"]}]'),

('Technical Writing', 
'Translate complex technical concepts into clear, accessible documentation for users, developers, and stakeholders.', 
'[{"milestone": "Writing Fundamentals", "skills": ["Grammar", "Style Guides", "Audience Analysis"]}, {"milestone": "API Documentation", "skills": ["Swagger/OpenAPI", "REST Basics", "Code Examples"]}, {"milestone": "Docs as Code", "skills": ["Markdown", "Git", "Static Site Generators"]}, {"milestone": "UX Writing", "skills": ["Microcopy", "User Flows", "Information Architecture"]}]'),

('E-commerce Development', 
'Build online storefronts, manage product catalogs, and integrate secure payment gateways.', 
'[{"milestone": "Platform Basics", "skills": ["Shopify", "WooCommerce", "Magento"]}, {"milestone": "Payment Integration", "skills": ["Stripe", "PayPal", "Razorpay"]}, {"milestone": "Performance Optimization", "skills": ["Caching", "CDN", "SEO"]}, {"milestone": "Headless Commerce", "skills": ["Next.js", "GraphQL", "Contentful"]}]'),

('Robotics & Automation', 
'Design, build, and program robots to perform tasks autonomously or semi-autonomously.', 
'[{"milestone": "Kinematics & Dynamics", "skills": ["Coordinate Systems", "Motion Planning", "Control Theory"]}, {"milestone": "Robot Operating System", "skills": ["ROS1/ROS2", "Nodes", "Topics"]}, {"milestone": "Computer Vision", "skills": ["OpenCV", "Object Detection", "SLAM"]}, {"milestone": "Hardware Integration", "skills": ["Actuators", "Sensors", "Microcontrollers"]}]');
