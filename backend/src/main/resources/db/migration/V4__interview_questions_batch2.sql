-- V4: Interview Questions for companies 19-35 (by ID from schema.sql seed order)
-- Tech Mahindra=19, LTIMindtree=20, Goldman Sachs=21, JP Morgan=22, Morgan Stanley=23
-- PayPal=24, Paytm=25, PhonePe=26, Razorpay=27, Uber=28, Ola=29, Swiggy=30, Zomato=31
-- Flipkart=32, NVIDIA=33, Intel=34, Cisco=35

INSERT INTO interview_questions (company_id, question, answer, type, difficulty) VALUES
-- Tech Mahindra (19)
(19,'What is the difference between C# and Java?','Both are OOP languages with GC. C# has properties, events, LINQ, async/await natively. Java is platform-independent via JVM. C# is tightly integrated with .NET/Windows. Java has broader open-source ecosystem. Both support generics, interfaces, and exception handling.','TECHNICAL','MEDIUM'),
(19,'What is a deadlock and how do you prevent it?','Deadlock occurs when two or more threads wait for each other to release resources. Four conditions: mutual exclusion, hold and wait, no preemption, circular wait. Prevention: acquire locks in consistent order, use timeouts, avoid nested locks, use tryLock.','TECHNICAL','MEDIUM'),

-- LTIMindtree (20)
(20,'What is Spring Boot and why use it?','Spring Boot simplifies Spring application setup with auto-configuration, embedded servers (Tomcat), and starter dependencies. Benefits: rapid development, production-ready defaults, no XML config, built-in actuator for monitoring. Ideal for microservices and REST APIs.','TECHNICAL','EASY'),
(20,'Explain the concept of data warehousing.','A data warehouse is a centralized repository for integrated data from multiple sources. Used for reporting and analysis (OLAP). Key concepts: ETL (Extract, Transform, Load), Star/Snowflake schema, fact and dimension tables. Tools: Snowflake, Redshift, BigQuery.','TECHNICAL','MEDIUM'),

-- Goldman Sachs (21)
(21,'Find the median of two sorted arrays in O(log(m+n)) time.','Use binary search on the smaller array. Partition both arrays such that left halves contain (m+n+1)/2 elements. Adjust partition using binary search until maxLeft1 <= minRight2 and maxLeft2 <= minRight1. Median is derived from the boundary elements.','CODING','HARD'),
(21,'Explain how a hash map handles collisions.','Collision occurs when two keys hash to the same bucket. Separate Chaining: each bucket stores a linked list (or tree in Java 8+). Open Addressing: probe for next empty slot (linear, quadratic, double hashing). Good hash functions and load factor management minimize collisions.','TECHNICAL','MEDIUM'),
(21,'What is amortized time complexity?','Amortized analysis averages the cost of operations over a sequence. Example: ArrayList add is O(1) amortized — most adds are O(1) but occasional resize is O(n). Techniques: aggregate analysis, accounting method, potential method. Differs from average case (no probability).','TECHNICAL','HARD'),

-- JP Morgan (22)
(22,'What is Git branching strategy? Explain GitFlow.','GitFlow uses: main (production), develop (integration), feature/* (new features), release/* (release prep), hotfix/* (production fixes). Feature branches merge to develop, release branches merge to both main and develop. Enables parallel development and stable releases.','TECHNICAL','MEDIUM'),
(22,'Design a stock trading system.','Components: Order Service (place/cancel orders), Matching Engine (match buy/sell by price-time priority), Market Data Service (real-time price feeds via WebSocket), Portfolio Service, Risk Engine (pre-trade checks). Use message queues (Kafka) for event-driven architecture. Low-latency is critical.','TECHNICAL','HARD'),

-- Morgan Stanley (23)
(23,'Explain multi-threading in Java with an example.','Create threads by extending Thread class or implementing Runnable. Use ExecutorService for thread pools. Synchronization prevents race conditions using synchronized keyword or ReentrantLock. Volatile ensures visibility. ConcurrentHashMap for thread-safe collections. CompletableFuture for async programming.','TECHNICAL','HARD'),
(23,'What is the difference between optimistic and pessimistic locking?','Pessimistic: lock resource before access, prevents concurrent modification (SELECT FOR UPDATE). Optimistic: no locks, check version/timestamp before commit, retry on conflict. Pessimistic suits high contention. Optimistic suits read-heavy workloads. JPA supports both via @Version annotation.','TECHNICAL','MEDIUM'),

-- PayPal (24)
(24,'What is OAuth 2.0 and how does it work?','OAuth 2.0 is an authorization framework. Flow: Client requests authorization from Resource Owner, receives authorization code, exchanges it for access token with Authorization Server, uses token to access Resource Server. Grant types: Authorization Code, Client Credentials, Implicit, PKCE.','TECHNICAL','MEDIUM'),
(24,'What is SQL injection and how do you prevent it?','SQL injection inserts malicious SQL through user input. Example: input of OR 1=1 bypasses login. Prevention: parameterized queries (PreparedStatement), ORM frameworks, input validation, least privilege DB accounts, WAF (Web Application Firewall).','TECHNICAL','MEDIUM'),

-- Paytm (25)
(25,'Explain the difference between Redis and MySQL.','Redis is an in-memory key-value store optimized for speed (sub-millisecond). MySQL is a relational database optimized for durability and complex queries. Redis: caching, sessions, rate limiting. MySQL: transactional data, complex joins. Often used together — Redis as cache layer in front of MySQL.','TECHNICAL','MEDIUM'),
(25,'What is a REST API vs GraphQL?','REST uses multiple endpoints with fixed response structures. GraphQL uses a single endpoint where clients specify exactly what data they need. REST: simpler, cacheable, standardized. GraphQL: flexible, reduces over/under-fetching, requires resolver logic. Choose based on client needs and API complexity.','TECHNICAL','MEDIUM'),

-- PhonePe (26)
(26,'Design a payment processing system.','Components: API Gateway, Payment Service (orchestrates flow), Payment Gateway Integration, Fraud Detection (ML-based risk scoring), Ledger Service (double-entry bookkeeping), Settlement Service (batch reconciliation), Notification Service. Use idempotency keys to prevent duplicate charges. Saga pattern for distributed transactions.','TECHNICAL','HARD'),
(26,'What is the CAP theorem?','CAP states a distributed system can guarantee at most 2 of 3: Consistency (all nodes see same data), Availability (every request gets a response), Partition Tolerance (system works despite network failures). Since partitions are inevitable, choose CP (strong consistency) or AP (high availability).','TECHNICAL','MEDIUM'),

-- Razorpay (27)
(27,'Design a webhook delivery system.','Components: Event Producer, Webhook Registry (stores subscriber URLs), Delivery Queue (Kafka/SQS), Delivery Worker (HTTP POST with retry), Dead Letter Queue (failed deliveries). Implement exponential backoff with jitter for retries. Verify webhooks with HMAC signatures. Idempotency via event IDs.','TECHNICAL','HARD'),
(27,'What is database sharding?','Sharding horizontally partitions data across multiple databases. Each shard holds a subset of data (e.g., by user_id range or hash). Benefits: horizontal scalability, improved performance. Challenges: cross-shard queries, rebalancing, distributed transactions. Strategies: hash-based, range-based, directory-based.','TECHNICAL','MEDIUM'),

-- Uber (28)
(28,'Design a ride-matching system.','Use geospatial indexing (Geohash or S2 cells) to find nearby drivers. Match algorithm considers distance, ETA, driver rating, surge pricing. Components: Location Service (real-time GPS updates via WebSocket), Matching Service, Pricing Service, ETA Service (using road network graph). Use Kafka for real-time event streaming.','TECHNICAL','HARD'),
(28,'Explain consistent hashing.','Consistent hashing maps both servers and keys to a ring (0 to 2^32). Keys are assigned to the next server clockwise. Adding/removing a server only affects neighboring keys. Use virtual nodes for better distribution. Used in distributed caches (Memcached), CDNs, and load balancers.','TECHNICAL','HARD'),

-- Ola (29)
(29,'What is Kafka and when do you use it?','Apache Kafka is a distributed event streaming platform. Key concepts: Topics (categories), Partitions (parallelism), Producers, Consumers, Consumer Groups. Use cases: real-time analytics, event sourcing, log aggregation, microservice communication. Provides durability, ordering within partitions, and horizontal scalability.','TECHNICAL','MEDIUM'),
(29,'Explain the difference between monolithic and microservice architectures.','Monolithic: single deployable unit, shared database, simpler development but harder to scale. Microservices: independent services, own databases, independent deployment but complex orchestration. Migrate when team grows, deployment frequency increases, or different components need different scaling.','TECHNICAL','MEDIUM'),

-- Swiggy (30)
(30,'Design a food delivery ETA prediction system.','Inputs: restaurant prep time (historical average), distance (road graph), traffic (real-time), rider availability. ML model trained on historical delivery data. Features: time of day, weather, restaurant load, distance. Update ETA in real-time as rider progresses. Use gradient boosting or neural networks.','TECHNICAL','HARD'),
(30,'What is the difference between horizontal and vertical scaling?','Vertical scaling: add more CPU/RAM to existing server (simpler, has limits). Horizontal scaling: add more servers (complex but unlimited). Horizontal requires load balancing, distributed data, stateless services. Most production systems use horizontal scaling with auto-scaling groups.','TECHNICAL','EASY'),

-- Zomato (31)
(31,'How does browser caching work?','Browser caches responses using HTTP headers. Cache-Control (max-age, no-cache, no-store), ETag (content hash for validation), Last-Modified, Expires. On repeat request, browser sends If-None-Match/If-Modified-Since. Server returns 304 Not Modified if unchanged. Reduces latency and bandwidth.','TECHNICAL','MEDIUM'),
(31,'Explain the event loop in JavaScript.','JS is single-threaded. The event loop processes: Call Stack (synchronous code), Microtask Queue (Promises, queueMicrotask), Macrotask Queue (setTimeout, setInterval, I/O). After call stack empties, microtasks run first, then one macrotask. This enables non-blocking async behavior.','TECHNICAL','MEDIUM'),

-- Flipkart (32)
(32,'Design an e-commerce cart and checkout system.','Cart Service: stores items per user (Redis for speed + DB for persistence). Inventory Service: reserves stock on add-to-cart with TTL. Checkout: validates cart, applies coupons, calculates tax/shipping, creates order. Payment integration with retry. Use eventual consistency between cart and inventory.','TECHNICAL','HARD'),
(32,'Implement a LLD for a parking lot system.','Classes: ParkingLot, Floor, ParkingSpot (Small, Medium, Large), Vehicle (Bike, Car, Truck), Ticket, EntryGate, ExitGate. Strategy pattern for spot assignment. Observer pattern for availability updates. Fee calculation based on duration and vehicle type. Use enums for spot types.','CODING','MEDIUM'),

-- NVIDIA (33)
(33,'What is the difference between CPU and GPU architectures?','CPU: few powerful cores optimized for sequential tasks, complex control logic, large caches. GPU: thousands of simple cores optimized for parallel tasks, high throughput. CPU handles branch-heavy code. GPU handles data-parallel workloads (graphics, ML, scientific computing). CUDA enables GPU programming.','TECHNICAL','MEDIUM'),
(33,'Explain virtual memory and page replacement algorithms.','Virtual memory maps virtual addresses to physical frames via page table. Page fault occurs when accessed page is not in RAM. Replacement algorithms: FIFO (simple), LRU (best performance), Optimal (theoretical), Clock (practical approximation of LRU). TLB caches recent translations for speed.','TECHNICAL','HARD'),

-- Intel (34)
(34,'What are the differences between RISC and CISC architectures?','RISC (ARM): simple fixed-length instructions, more registers, load-store architecture, pipelining-friendly. CISC (x86): complex variable-length instructions, fewer registers, memory-to-memory operations. Modern x86 CPUs translate CISC to micro-ops (RISC-like) internally. RISC dominates mobile; CISC dominates desktop/server.','TECHNICAL','MEDIUM'),
(34,'Explain cache coherence in multi-core processors.','When multiple cores cache the same memory location, coherence protocols ensure consistency. MESI protocol: Modified, Exclusive, Shared, Invalid states. When one core writes, other copies are invalidated (write-invalidate) or updated (write-update). Snooping-based for small systems, directory-based for large systems.','TECHNICAL','HARD'),

-- Cisco (35)
(35,'Explain how DNS resolution works.','Client queries recursive resolver. Resolver checks cache, then queries root server (returns TLD server), TLD server (returns authoritative NS), authoritative server (returns IP). Response is cached at each level with TTL. Types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (nameserver).','TECHNICAL','MEDIUM'),
(35,'What is the difference between a switch, router, and hub?','Hub: broadcasts to all ports (Layer 1, no intelligence). Switch: forwards to specific port using MAC address table (Layer 2, reduces collisions). Router: forwards between networks using IP addresses and routing tables (Layer 3, enables inter-network communication). Modern L3 switches combine switch and router functionality.','TECHNICAL','EASY');
