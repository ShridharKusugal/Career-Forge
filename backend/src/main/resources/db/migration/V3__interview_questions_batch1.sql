-- V3: Interview Questions for companies 1-18 (by ID from schema.sql seed order)
-- Google=1, TCS=2, Microsoft=3, Accenture=4, Infosys=5, Amazon=6, Meta=7, Netflix=8, Apple=9, Salesforce=10
-- Adobe=11, Oracle=12, SAP=13, IBM=14, Capgemini=15, Wipro=16, HCLTech=17, Cognizant=18

INSERT INTO interview_questions (company_id, question, answer, type, difficulty) VALUES
-- Google (1) — already has 2 in schema, adding more
(1,'What is the difference between a process and a thread?','A process is an independent execution unit with its own memory space. A thread is a lightweight unit within a process sharing the same memory. Context switching between threads is faster than between processes.','TECHNICAL','EASY'),
(1,'How would you design Google Search autocomplete?','Use a Trie data structure to store queries by prefix. Rank suggestions by frequency. Cache top-K results per prefix in Redis. Use a distributed trie for scale with sharding by first character.','TECHNICAL','HARD'),

-- TCS (2) — already has 2 in schema
(2,'What is normalization in DBMS?','Normalization organizes data to reduce redundancy. 1NF eliminates repeating groups. 2NF removes partial dependencies. 3NF removes transitive dependencies. BCNF ensures every determinant is a candidate key.','TECHNICAL','MEDIUM'),
(2,'Explain the difference between abstract class and interface in Java.','Abstract classes can have constructors, instance variables, and both abstract and concrete methods. Interfaces (pre-Java 8) only have abstract methods. Java 8+ interfaces can have default/static methods. A class can implement multiple interfaces but extend only one abstract class.','TECHNICAL','MEDIUM'),

-- Microsoft (3) — already has 1 in schema
(3,'Explain the SOLID principles of OOP.','S-Single Responsibility: one class, one job. O-Open/Closed: open for extension, closed for modification. L-Liskov Substitution: subtypes must be substitutable. I-Interface Segregation: prefer small interfaces. D-Dependency Inversion: depend on abstractions.','TECHNICAL','MEDIUM'),
(3,'Design a file synchronization service like OneDrive.','Components: File Watcher (detects local changes), Chunking Service (splits files into blocks with hashes), Metadata DB (stores file tree and block references), Block Storage (S3/Azure Blob), Sync Engine (compares local vs remote metadata and transfers only changed blocks). Use conflict resolution with last-write-wins or manual merge.','TECHNICAL','HARD'),
(3,'Tell me about a time you failed and what you learned.','Use STAR method. Describe a specific project setback, your role, actions taken to recover, and the lesson learned about planning, communication, or technical debt.','HR','EASY'),

-- Accenture (4)
(4,'What is cloud computing and its service models?','Cloud computing delivers computing resources over the internet. IaaS provides infrastructure (VMs, storage). PaaS provides platforms (databases, app hosting). SaaS provides software (Gmail, Salesforce). Deployment models: public, private, hybrid.','TECHNICAL','EASY'),
(4,'What is Agile methodology?','Agile is an iterative software development approach. Work is divided into sprints (2-4 weeks). Key ceremonies: Sprint Planning, Daily Standup, Sprint Review, Retrospective. Frameworks include Scrum and Kanban. Emphasizes customer collaboration and responding to change.','TECHNICAL','EASY'),
(4,'Where do you see yourself in 5 years?','Express interest in growing technically (architect/lead role), contributing to enterprise projects, and aligning with the company mission of digital transformation.','HR','EASY'),

-- Infosys (5)
(5,'What is the difference between SQL and NoSQL databases?','SQL databases are relational, use structured schemas, and support ACID transactions (MySQL, PostgreSQL). NoSQL databases are non-relational, schema-flexible, and optimized for scale (MongoDB, Cassandra). Choose SQL for complex queries and NoSQL for high throughput and flexible data models.','TECHNICAL','MEDIUM'),
(5,'Explain REST API principles.','REST uses HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove). Key principles: Statelessness, Client-Server separation, Uniform Interface, Cacheable responses, Layered System. Resources are identified by URIs and represented as JSON/XML.','TECHNICAL','MEDIUM'),
(5,'Why should we hire you?','Highlight technical skills aligned with the role, passion for learning, relevant projects, and ability to work in teams. Mention specific Infosys programs like InfyTQ that demonstrate your preparation.','HR','EASY'),

-- Amazon (6)
(6,'Design a rate limiter for an API gateway.','Use Token Bucket or Sliding Window algorithm. Store request counts per user/IP in Redis with TTL. Return HTTP 429 when limit exceeded. For distributed systems, use a centralized Redis cluster. Consider different limits for different API tiers.','TECHNICAL','HARD'),
(6,'Describe a time you disagreed with a teammate (Leadership Principle: Have Backbone).','Use STAR. Describe the disagreement context, how you presented data-backed reasoning, listened to the other perspective, and reached a decision. Emphasize commitment to the final decision even if it differed from your initial stance.','HR','MEDIUM'),
(6,'What is the time complexity of HashMap operations in Java?','Average case: O(1) for get, put, remove. Worst case (hash collisions): O(n) with linked list chaining, O(log n) with tree bins (Java 8+). Load factor and initial capacity affect performance. Rehashing occurs when size exceeds capacity * load factor.','TECHNICAL','MEDIUM'),

-- Meta (7)
(7,'Solve: Given a binary tree, return its level-order traversal.','Use BFS with a queue. Initialize queue with root. For each level, process all nodes in queue, add their children. Collect values per level in a list of lists. Time: O(n), Space: O(n).','CODING','MEDIUM'),
(7,'How does the Facebook News Feed work at scale?','Fan-out-on-write for users with few friends: write posts to all followers feeds. Fan-out-on-read for celebrities: fetch and merge at read time. Use a ranked feed with ML model scoring posts by relevance, recency, engagement probability. Cache hot feeds in Redis.','TECHNICAL','HARD'),
(7,'What motivates you as an engineer?','Discuss passion for building products used by billions, solving complex technical challenges, continuous learning, and impact-driven engineering culture.','HR','EASY'),

-- Netflix (8)
(8,'How would you design a video streaming service?','Components: Video Ingestion (transcoding to multiple resolutions via FFmpeg), CDN (distribute content globally), Adaptive Bitrate Streaming (HLS/DASH), User Service, Recommendation Engine (collaborative filtering), and a Microservices Architecture with API Gateway. Use S3 for storage, CloudFront for CDN.','TECHNICAL','HARD'),
(8,'What is eventual consistency and when is it acceptable?','Eventual consistency means all replicas converge to the same state given enough time without new updates. Acceptable for: social media feeds, view counts, recommendation caches. Not acceptable for: financial transactions, inventory management. CAP theorem dictates the tradeoff.','TECHNICAL','MEDIUM'),

-- Apple (9)
(9,'Explain ARC (Automatic Reference Counting) in Swift.','ARC automatically manages memory by tracking strong references to class instances. When reference count drops to zero, memory is deallocated. Retain cycles (two objects strongly referencing each other) cause memory leaks. Use weak and unowned references to break cycles.','TECHNICAL','MEDIUM'),
(9,'What is the difference between value types and reference types in Swift?','Value types (structs, enums) are copied on assignment; each has independent data. Reference types (classes) share the same instance; changes affect all references. Value types are stack-allocated (faster), reference types are heap-allocated. Swift encourages value types for safety.','TECHNICAL','EASY'),

-- Salesforce (10)
(10,'What is multi-tenant architecture?','A single instance of software serves multiple tenants (customers). Each tenant data is logically isolated but shares the same physical infrastructure. Benefits: cost efficiency, easier maintenance. Challenges: data isolation, noisy neighbor, customization. Salesforce uses org-based isolation with shared metadata.','TECHNICAL','MEDIUM'),
(10,'Explain the MVC design pattern.','Model: manages data and business logic. View: displays data to users. Controller: handles user input and updates Model/View. Benefits: separation of concerns, testability, parallel development. In web apps: Model=DB entities, View=HTML/React, Controller=REST endpoints.','TECHNICAL','EASY'),

-- Adobe (11)
(11,'Implement an LRU Cache.','Use a HashMap for O(1) lookup and a Doubly Linked List for O(1) insertion/removal. On get: move node to front. On put: add to front, if capacity exceeded remove tail node and delete from map. Both operations are O(1).','CODING','HARD'),
(11,'What are design patterns? Name a few.','Design patterns are reusable solutions to common problems. Creational: Singleton, Factory, Builder. Structural: Adapter, Decorator, Proxy. Behavioral: Observer, Strategy, Command. Choose based on problem context.','TECHNICAL','MEDIUM'),

-- Oracle (12)
(12,'What is indexing in databases and how does it improve performance?','An index is a data structure (B-Tree or Hash) that speeds up data retrieval. It creates a sorted reference to rows. Benefits: faster SELECT queries. Tradeoffs: slower INSERT/UPDATE/DELETE, extra storage. Use indexes on frequently queried columns, foreign keys, and WHERE clause columns.','TECHNICAL','MEDIUM'),
(12,'Explain ACID properties in databases.','Atomicity: transactions are all-or-nothing. Consistency: DB moves from one valid state to another. Isolation: concurrent transactions dont interfere. Durability: committed data survives crashes. Implemented via write-ahead logging, locking, and MVCC.','TECHNICAL','MEDIUM'),

-- SAP (13)
(13,'What is ERP and why is it important?','ERP (Enterprise Resource Planning) integrates core business processes: finance, HR, supply chain, manufacturing into a single system. Benefits: real-time data, reduced redundancy, better decision-making. SAP S/4HANA is the leading ERP platform.','TECHNICAL','EASY'),
(13,'Explain the difference between OLTP and OLAP.','OLTP handles day-to-day transactions (INSERT/UPDATE), optimized for speed and concurrency. OLAP handles analytical queries (aggregations, reporting), optimized for read-heavy workloads. OLTP uses normalized schemas; OLAP uses star/snowflake schemas. SAP HANA supports both.','TECHNICAL','MEDIUM'),

-- IBM (14)
(14,'What is containerization and how does Docker work?','Containerization packages applications with their dependencies into isolated units. Docker uses OS-level virtualization (namespaces, cgroups) to run containers. Key concepts: Dockerfile (build instructions), Image (read-only template), Container (running instance), Registry (Docker Hub). Lighter than VMs.','TECHNICAL','MEDIUM'),
(14,'Explain microservices architecture.','Microservices decompose applications into small, independent services. Each service owns its data, communicates via APIs (REST/gRPC). Benefits: independent deployment, technology diversity, fault isolation. Challenges: distributed complexity, data consistency, network latency. Use API Gateway for routing.','TECHNICAL','MEDIUM'),

-- Capgemini (15)
(15,'What is the Software Development Life Cycle (SDLC)?','SDLC is a structured process: Requirements Analysis, System Design, Implementation (Coding), Testing, Deployment, Maintenance. Models include Waterfall (sequential), Agile (iterative), Spiral (risk-driven). Choose based on project size, risk, and flexibility needs.','TECHNICAL','EASY'),
(15,'What is the difference between TCP and UDP?','TCP is connection-oriented, reliable, ordered delivery with error checking and flow control. UDP is connectionless, faster, no guaranteed delivery. TCP: web browsing, email, file transfer. UDP: video streaming, gaming, DNS queries. TCP has higher overhead.','TECHNICAL','MEDIUM'),

-- Wipro (16)
(16,'What is the difference between stack and heap memory?','Stack: stores local variables and function calls, LIFO, automatically managed, fast, limited size. Heap: stores dynamically allocated objects, manually managed (or GC), slower, larger. Stack overflow occurs with deep recursion. Memory leaks occur when heap objects arent freed.','TECHNICAL','EASY'),
(16,'Explain the concept of garbage collection in Java.','GC automatically reclaims memory from unreachable objects. JVM uses generational GC: Young Gen (Eden, Survivor) for short-lived objects, Old Gen for long-lived. Minor GC cleans Young Gen; Major/Full GC cleans everything. Algorithms: Serial, Parallel, CMS, G1, ZGC.','TECHNICAL','MEDIUM'),

-- HCLTech (17)
(17,'What is DHCP and how does it work?','DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses to devices. Process: DISCOVER (client broadcasts), OFFER (server responds), REQUEST (client accepts), ACKNOWLEDGE (server confirms). Lease-based: IPs are assigned for a duration and can be renewed.','TECHNICAL','EASY'),
(17,'Explain the OSI model layers.','7 layers: Physical (bits), Data Link (frames, MAC), Network (packets, IP routing), Transport (segments, TCP/UDP), Session (connection management), Presentation (encryption, compression), Application (HTTP, FTP, DNS). Data flows down at sender, up at receiver with encapsulation/decapsulation.','TECHNICAL','MEDIUM'),

-- Cognizant (18)
(18,'What is the difference between method overloading and method overriding?','Overloading: same method name, different parameters, same class, compile-time polymorphism. Overriding: same method signature, parent-child class, runtime polymorphism. Overloading resolves by argument types; overriding resolves by object type at runtime via dynamic dispatch.','TECHNICAL','EASY'),
(18,'What is a JOIN in SQL? Explain types.','JOIN combines rows from two or more tables based on related columns. INNER JOIN: matching rows only. LEFT JOIN: all left rows + matching right. RIGHT JOIN: all right rows + matching left. FULL OUTER JOIN: all rows from both. CROSS JOIN: cartesian product. Use ON clause for join condition.','TECHNICAL','MEDIUM');
