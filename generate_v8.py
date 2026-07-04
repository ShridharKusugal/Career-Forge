import json

def generate_sql():
    tests = []
    
    # ---------------------------------------------------------
    # TEST 1: Frontend Mastery (React & Advanced JS)
    # ---------------------------------------------------------
    frontend_qs = []
    
    frontend_data = [
        ("Which of the following is true regarding React's reconciliation algorithm?", ["It compares the current DOM with the new DOM", "It compares the Virtual DOM with the real DOM", "It uses a heuristic O(n) algorithm to compare two React element trees", "It uses an O(n^3) algorithm for complete accuracy"], "It uses a heuristic O(n) algorithm to compare two React element trees"),
        ("What is the primary difference between useMemo and useCallback?", ["useMemo memoizes a function, useCallback memoizes a value", "useMemo memoizes a value, useCallback memoizes a function", "useMemo is for synchronous operations, useCallback for async", "There is no difference, they are aliases"], "useMemo memoizes a value, useCallback memoizes a function"),
        ("In JavaScript, how does the Event Loop handle Macrotasks and Microtasks?", ["It executes one Macrotask, then empties the Microtask queue", "It executes all Macrotasks, then all Microtasks", "Microtasks and Macrotasks are executed in random order based on priority", "It executes one Microtask, then empties the Macrotask queue"], "It executes one Macrotask, then empties the Microtask queue"),
        ("What does the 'use strict' directive do in JavaScript?", ["Enforces strict typing similar to TypeScript", "Eliminates some JavaScript silent errors by changing them to throw errors", "Prevents the use of async/await", "Forces all functions to be pure functions"], "Eliminates some JavaScript silent errors by changing them to throw errors"),
        ("How do you prevent a component from re-rendering in React if its props haven't changed?", ["Use React.PureComponent for class components or React.memo for functional components", "Use the usePreventRender hook", "Return false in the useEffect cleanup function", "Wrap the component in a Fragment"], "Use React.PureComponent for class components or React.memo for functional components"),
        ("What is the output of `typeof null` in JavaScript?", ["'null'", "'object'", "'undefined'", "'boolean'"], "'object'"),
        ("In React, what is the purpose of the 'key' prop when rendering lists?", ["To provide a unique id for styling in CSS", "To help React identify which items have changed, are added, or are removed during reconciliation", "To securely encrypt the list items", "To index the items for faster search"], "To help React identify which items have changed, are added, or are removed during reconciliation"),
        ("What is a closure in JavaScript?", ["A function that takes another function as an argument", "A function bundled together with references to its surrounding state (lexical environment)", "A block of code that executes immediately", "A method to close a database connection"], "A function bundled together with references to its surrounding state (lexical environment)"),
        ("Which React hook is used to access the context value without using a Context.Consumer?", ["useContext", "useReducer", "useRef", "useProvider"], "useContext"),
        ("What is the phenomenon called when variables declared with 'var' are moved to the top of their scope?", ["Hoisting", "Bubbling", "Capturing", "Shadowing"], "Hoisting"),
        ("In React 18, what new feature allows you to mark state updates as non-urgent?", ["useDeferredValue", "useTransition", "useId", "useMutableSource"], "useTransition"),
        ("How does JavaScript handle concurrency despite being single-threaded?", ["By creating multiple Web Workers implicitly", "Through the Event Loop and asynchronous callbacks", "By utilizing multiple CPU cores automatically", "It doesn't support concurrency"], "Through the Event Loop and asynchronous callbacks"),
        ("What is the purpose of 'forwardRef' in React?", ["To automatically forward props to child components", "To allow components to take a ref and pass it further down to a child", "To reference the previous state of a component", "To redirect routes in React Router"], "To allow components to take a ref and pass it further down to a child"),
        ("Which of the following methods mutates the original array in JavaScript?", ["Array.prototype.map()", "Array.prototype.filter()", "Array.prototype.splice()", "Array.prototype.slice()"], "Array.prototype.splice()"),
        ("What is 'prop drilling' in React?", ["A technique to optimize rendering speed", "The process of passing props deeply through a component tree to a child component", "A security vulnerability involving component props", "Extracting props into a separate file"], "The process of passing props deeply through a component tree to a child component"),
        ("How can you deeply clone an object in JavaScript without external libraries?", ["Object.assign({}, obj)", "{ ...obj }", "JSON.parse(JSON.stringify(obj))", "Object.create(obj)"], "JSON.parse(JSON.stringify(obj))"),
        ("What is the significance of the dependency array in useEffect?", ["It determines the rendering priority of the component", "It specifies the DOM elements the effect interacts with", "It controls when the effect runs by checking if listed values have changed", "It limits the memory usage of the effect"], "It controls when the effect runs by checking if listed values have changed"),
        ("What is a 'Promise' in JavaScript?", ["A guarantee that a function will not throw an error", "An object representing the eventual completion or failure of an asynchronous operation", "A synchronous method to pause execution until data is ready", "A design pattern for creating classes"], "An object representing the eventual completion or failure of an asynchronous operation"),
        ("In Redux, what is a 'reducer'?", ["A function that dispatches actions to the store", "A pure function that takes the previous state and an action, and returns the next state", "A middleware that intercepts API calls", "A component that connects React to the store"], "A pure function that takes the previous state and an action, and returns the next state"),
        ("What is the difference between '==' and '===' in JavaScript?", ["'==' compares references, '===' compares values", "'==' performs type coercion before comparison, '===' does not", "There is no difference, they are interchangeable", "'===' is used only for object comparison"], "'==' performs type coercion before comparison, '===' does not"),
        ("What is Server-Side Rendering (SSR) in the context of React (e.g., using Next.js)?", ["Rendering the HTML on the server and sending a fully populated page to the client", "Downloading all React components as a bundle before rendering", "Using a Node.js server to host the static build files", "Executing API calls solely on the client side"], "Rendering the HTML on the server and sending a fully populated page to the client"),
        ("What does the CSS property 'box-sizing: border-box' do?", ["Includes padding and border in the element's total width and height", "Adds a border around the entire layout box", "Calculates width and height exclusive of padding", "Transforms the element into a flexbox container"], "Includes padding and border in the element's total width and height"),
        ("Which array method is used to reduce the array to a single value?", ["map()", "filter()", "reduce()", "forEach()"], "reduce()"),
        ("In React, what happens when you call setState()?", ["React immediately updates the state and re-renders the component synchronously", "React merges the object into current state and schedules a re-render", "React overwrites the entire state object immediately", "React throws an error if called inside a functional component"], "React merges the object into current state and schedules a re-render"),
        ("What is 'event delegation' in JavaScript?", ["Assigning a single event listener to a parent element to handle events from its children", "Passing event objects as arguments to functions", "Using third-party libraries to manage events", "Delegating event processing to a Web Worker"], "Assigning a single event listener to a parent element to handle events from its children"),
        ("What is a 'Higher-Order Component' (HOC) in React?", ["A component that renders a complex UI", "A component that manages global state", "A function that takes a component and returns a new component", "A root component in the application tree"], "A function that takes a component and returns a new component"),
        ("What does 'NaN' stand for and what is its type in JavaScript?", ["Not a Number, type is 'string'", "Not a Null, type is 'object'", "Not a Number, type is 'number'", "Null and None, type is 'undefined'"], "Not a Number, type is 'number'"),
        ("How does 'useRef' differ from 'useState'?", ["useRef triggers a re-render when its value changes, useState does not", "useRef holds a mutable value that does not cause re-renders when changed", "useState is for DOM elements only, useRef is for data", "There is no functional difference"], "useRef holds a mutable value that does not cause re-renders when changed"),
        ("What is the purpose of a 'Service Worker' in a web application?", ["To handle database queries on the server", "To provide background sync and offline capabilities by intercepting network requests", "To serve CSS and image files faster", "To replace the main JavaScript thread"], "To provide background sync and offline capabilities by intercepting network requests"),
        ("In modern JavaScript, what is the syntax to import a default export from a module?", ["import { module } from 'file'", "import module from 'file'", "import * as module from 'file'", "require('file')"], "import module from 'file'")
    ]
    
    for i, data in enumerate(frontend_data):
        frontend_qs.append({
            "id": i + 1,
            "question": data[0],
            "options": data[1],
            "answer": data[2]
        })
        
    tests.append({
        "title": "Frontend Mastery (React & Advanced JS)",
        "type": "TECHNICAL",
        "duration_minutes": 45,
        "questions": json.dumps(frontend_qs)
    })

    # ---------------------------------------------------------
    # TEST 2: Backend & Architecture (Java, Spring, SQL)
    # ---------------------------------------------------------
    backend_qs = []
    
    backend_data = [
        ("In Java, what is the difference between a Checked and an Unchecked Exception?", ["Checked exceptions are evaluated at compile time; Unchecked exceptions occur at runtime", "Checked exceptions inherit from Error; Unchecked inherit from Exception", "Unchecked exceptions must be declared in a method's throws clause", "There is no difference in modern Java"], "Checked exceptions are evaluated at compile time; Unchecked exceptions occur at runtime"),
        ("What is the default scope of a Spring Bean?", ["Prototype", "Singleton", "Request", "Session"], "Singleton"),
        ("In SQL, what is the primary difference between a clustered and a non-clustered index?", ["A clustered index defines the physical sorting order of data rows; non-clustered creates a separate logical sorting structure", "A non-clustered index is faster for INSERT operations", "A table can have multiple clustered indexes but only one non-clustered", "Clustered indexes only apply to string columns"], "A clustered index defines the physical sorting order of data rows; non-clustered creates a separate logical sorting structure"),
        ("What does the 'volatile' keyword do in Java?", ["Makes a variable immutable", "Ensures that a variable's value is always read from and written to main memory, preventing thread caching", "Synchronizes an entire method", "Prevents a variable from being serialized"], "Ensures that a variable's value is always read from and written to main memory, preventing thread caching"),
        ("What is Dependency Injection in the context of Spring Framework?", ["A design pattern where an object receives other objects that it depends on from an external source (IoC container)", "A method to inject SQL commands into a database", "A technique to inject malicious code for security testing", "Downloading dependencies automatically via Maven"], "A design pattern where an object receives other objects that it depends on from an external source (IoC container)"),
        ("What is the ACID property that ensures a transaction is all-or-nothing?", ["Atomicity", "Consistency", "Isolation", "Durability"], "Atomicity"),
        ("In Java 8, what is an Optional used for?", ["To handle optional method parameters", "To encapsulate a value that may or may not be present, reducing NullPointerExceptions", "To denote that a class can be subclassed", "To optimize garbage collection for specific objects"], "To encapsulate a value that may or may not be present, reducing NullPointerExceptions"),
        ("Which Spring Boot annotation combines @Configuration, @EnableAutoConfiguration, and @ComponentScan?", ["@SpringBootApplication", "@SpringContext", "@EnableSpringBoot", "@ApplicationBootstrap"], "@SpringBootApplication"),
        ("What is a 'Deadlock' in multithreading?", ["When a thread terminates unexpectedly", "When two or more threads are blocked forever, waiting for each other to release resources", "When a thread is starved of CPU time", "When multiple threads execute the exact same instruction simultaneously"], "When two or more threads are blocked forever, waiting for each other to release resources"),
        ("In a relational database, what is normalization?", ["The process of organizing data to minimize redundancy and improve data integrity", "The process of converting all strings to lowercase", "Denormalizing tables for faster read performance", "Encrypting database columns"], "The process of organizing data to minimize redundancy and improve data integrity"),
        ("What is the purpose of the 'transient' keyword in Java?", ["To mark a variable to be ignored during serialization", "To create a short-lived thread", "To indicate a variable whose value changes frequently", "To prevent inheritance of a class"], "To mark a variable to be ignored during serialization"),
        ("In Spring MVC, what is the role of the DispatcherServlet?", ["It connects to the database", "It acts as the Front Controller, routing incoming HTTP requests to appropriate handlers", "It renders HTML views directly", "It manages Spring Security filters"], "It acts as the Front Controller, routing incoming HTTP requests to appropriate handlers"),
        ("What is an N+1 query problem in ORMs like Hibernate?", ["When an application executes N queries to fetch N rows, plus 1 initial query to fetch the list of IDs", "When a database requires N+1 seconds to execute a query", "When a table joins with N other tables", "When an index is missing on N+1 columns"], "When an application executes N queries to fetch N rows, plus 1 initial query to fetch the list of IDs"),
        ("How does the Java Garbage Collector handle circular references?", ["It leaks memory indefinitely", "It uses a mark-and-sweep algorithm starting from GC Roots, identifying unreachable cycles", "It throws a StackOverflowError", "It relies on reference counting to decrement them"], "It uses a mark-and-sweep algorithm starting from GC Roots, identifying unreachable cycles"),
        ("What is the difference between @RestController and @Controller in Spring?", ["@RestController includes @ResponseBody on all handler methods automatically", "@Controller is used for REST APIs, @RestController for HTML pages", "There is no difference", "@RestController cannot be used with JSON data"], "@RestController includes @ResponseBody on all handler methods automatically"),
        ("Which SQL JOIN returns all rows from the left table and matched rows from the right table?", ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "FULL OUTER JOIN"], "LEFT JOIN"),
        ("What is the difference between StringBuffer and StringBuilder in Java?", ["StringBuffer is thread-safe (synchronized), StringBuilder is not", "StringBuilder is thread-safe (synchronized), StringBuffer is not", "StringBuffer is used for numbers, StringBuilder for strings", "StringBuilder creates immutable objects"], "StringBuffer is thread-safe (synchronized), StringBuilder is not"),
        ("In Spring Boot, what is the purpose of the 'application.properties' or 'application.yml' file?", ["To write unit tests", "To define application configuration properties like server port, database URLs, and custom settings", "To store HTML templates", "To declare Maven dependencies"], "To define application configuration properties like server port, database URLs, and custom settings"),
        ("What is a Database Transaction Isolation Level?", ["A setting that controls the degree to which a transaction is isolated from the data and resource modifications made by other concurrent transactions", "A physical separation of database servers", "A security firewall for the database", "A method to backup data while it's being written"], "A setting that controls the degree to which a transaction is isolated from the data and resource modifications made by other concurrent transactions"),
        ("What does the 'final' keyword do when applied to a Java class?", ["Allows the class to have abstract methods", "Prevents the class from being subclassed (inherited)", "Makes all variables in the class static", "Ensures the class is a singleton"], "Prevents the class from being subclassed (inherited)"),
        ("What is a 'Bean' in Spring terminology?", ["A java bean component", "An object that is instantiated, assembled, and managed by a Spring IoC container", "A database connection object", "A unit test case"], "An object that is instantiated, assembled, and managed by a Spring IoC container"),
        ("What is the purpose of the 'GROUP BY' clause in SQL?", ["To sort the result set in ascending order", "To filter rows before they are grouped", "To arrange identical data into groups, often used with aggregate functions like COUNT, MAX, SUM", "To join multiple tables together"], "To arrange identical data into groups, often used with aggregate functions like COUNT, MAX, SUM"),
        ("In Java, what is Type Erasure?", ["The process where generic type information is removed at compile-time to ensure backward compatibility", "A feature to delete unused variables automatically", "A method to cast objects without compilation errors", "The clearing of memory allocated to specific types"], "The process where generic type information is removed at compile-time to ensure backward compatibility"),
        ("How do you handle transactions declaratively in Spring?", ["By manually calling connection.commit()", "Using the @Transactional annotation", "By implementing the TransactionManager interface", "Spring handles all methods transactionally by default"], "Using the @Transactional annotation"),
        ("What is a SQL View?", ["A physical copy of data stored on disk", "A graphical user interface for a database", "A virtual table based on the result-set of an SQL statement", "A trigger that executes after an INSERT"], "A virtual table based on the result-set of an SQL statement"),
        ("Which collection implements a FIFO (First-In, First-Out) data structure in Java?", ["Stack", "Queue", "HashSet", "TreeMap"], "Queue"),
        ("What is Cross-Origin Resource Sharing (CORS)?", ["A database replication strategy", "A security feature that allows restricted resources on a web page to be requested from another domain", "A method to share code between backend and frontend", "A load balancing technique"], "A security feature that allows restricted resources on a web page to be requested from another domain"),
        ("What is the 'HAVING' clause used for in SQL?", ["To filter records based on aggregate functions (used after GROUP BY)", "To replace the WHERE clause entirely", "To sort the final result set", "To specify columns to select"], "To filter records based on aggregate functions (used after GROUP BY)"),
        ("What is the main advantage of a Microservices architecture over a Monolith?", ["It is always faster to develop initially", "Independent deployment, scalability, and technology diversity of services", "Requires less network overhead", "It simplifies database transactions"], "Independent deployment, scalability, and technology diversity of services"),
        ("What does the 'equals()' method in the Object class check by default in Java?", ["Value equality", "Reference equality (memory address)", "Hash code equality", "Class type equality"], "Reference equality (memory address)")
    ]

    for i, data in enumerate(backend_data):
        backend_qs.append({
            "id": i + 1,
            "question": data[0],
            "options": data[1],
            "answer": data[2]
        })
        
    tests.append({
        "title": "Backend Architecture & Engineering",
        "type": "TECHNICAL",
        "duration_minutes": 45,
        "questions": json.dumps(backend_qs)
    })

    # ---------------------------------------------------------
    # TEST 3: Cloud & DevOps (AWS, Docker, Kubernetes)
    # ---------------------------------------------------------
    cloud_qs = []
    
    cloud_data = [
        ("In Docker, what is the difference between an Image and a Container?", ["An image is a running instance of a container", "An image is a read-only template, a container is a runnable instance of an image", "They are identical terms", "An image is used for Linux, a container for Windows"], "An image is a read-only template, a container is a runnable instance of an image"),
        ("What is the primary function of Kubernetes?", ["To compile source code into binaries", "To automate deployment, scaling, and management of containerized applications", "To provision virtual machines on AWS", "To act as a relational database"], "To automate deployment, scaling, and management of containerized applications"),
        ("In AWS, what is a VPC (Virtual Private Cloud)?", ["A physical server dedicated to a single customer", "A logically isolated virtual network where you can launch AWS resources", "A managed database service", "A content delivery network"], "A logically isolated virtual network where you can launch AWS resources"),
        ("What is the purpose of a Dockerfile?", ["To manage Kubernetes clusters", "A text document containing all the commands a user could call on the command line to assemble an image", "To store application logs", "To monitor container performance"], "A text document containing all the commands a user could call on the command line to assemble an image"),
        ("What is a Kubernetes 'Pod'?", ["A virtual machine managed by Kubernetes", "The smallest deployable computing unit in Kubernetes, consisting of one or more containers sharing network and storage", "A load balancer", "A persistent storage volume"], "The smallest deployable computing unit in Kubernetes, consisting of one or more containers sharing network and storage"),
        ("Which AWS service is specifically designed for serverless compute?", ["Amazon EC2", "AWS Lambda", "Amazon RDS", "Amazon S3"], "AWS Lambda"),
        ("What is Infrastructure as Code (IaC)?", ["Writing application logic directly on servers", "Managing and provisioning computing infrastructure through machine-readable definition files (e.g., Terraform)", "Using APIs to execute manual server updates", "Coding inside a cloud-based IDE"], "Managing and provisioning computing infrastructure through machine-readable definition files (e.g., Terraform)"),
        ("In CI/CD, what does 'CI' stand for and mean?", ["Continuous Integration: the practice of merging all developers' working copies to a shared mainline several times a day", "Cloud Infrastructure: provisioning servers automatically", "Continuous Iteration: writing code in sprints", "Constant Installation: installing software directly to production"], "Continuous Integration: the practice of merging all developers' working copies to a shared mainline several times a day"),
        ("What is an Amazon S3 bucket?", ["A block storage volume attached to an EC2 instance", "A fully managed relational database", "A highly available object storage service used to store and retrieve any amount of data", "A load balancer configuration"], "A highly available object storage service used to store and retrieve any amount of data"),
        ("How does Kubernetes ensure high availability if a node fails?", ["By automatically migrating the physical hardware", "By relying on AWS to reboot the node", "Through the ReplicaSet/Deployment controller which reschedules the failed Pods onto healthy nodes", "By storing a backup on S3"], "Through the ReplicaSet/Deployment controller which reschedules the failed Pods onto healthy nodes"),
        ("What is the purpose of a .dockerignore file?", ["To ignore certain containers from running", "To specify files and directories that should be excluded from the Docker build context, reducing image size", "To ignore build errors", "To hide source code from GitHub"], "To specify files and directories that should be excluded from the Docker build context, reducing image size"),
        ("Which AWS service acts as a Content Delivery Network (CDN)?", ["Amazon Route 53", "Amazon CloudFront", "Amazon API Gateway", "Amazon VPC"], "Amazon CloudFront"),
        ("What is a Kubernetes 'Service'?", ["A background process running on a node", "An abstract way to expose an application running on a set of Pods as a network service (e.g., providing a stable IP)", "A physical network router", "A billing tier in GCP"], "An abstract way to expose an application running on a set of Pods as a network service (e.g., providing a stable IP)"),
        ("What is Terraform used for?", ["Building Docker images", "Managing Infrastructure as Code across multiple cloud providers", "Application performance monitoring", "Continuous integration testing"], "Managing Infrastructure as Code across multiple cloud providers"),
        ("In AWS IAM, what is the principle of 'least privilege'?", ["Granting all users administrator access for efficiency", "Granting only the permissions required to perform a specific task", "Using the cheapest available EC2 instance", "Applying permissions only to root accounts"], "Granting only the permissions required to perform a specific task"),
        ("What does a Docker volume do?", ["Increases the container's RAM allocation", "Provides a mechanism for persisting data generated by and used by Docker containers, independent of the container lifecycle", "Manages network traffic between containers", "Encrypts container data automatically"], "Provides a mechanism for persisting data generated by and used by Docker containers, independent of the container lifecycle"),
        ("What is blue/green deployment?", ["A deployment strategy that gradually shifts traffic based on color preferences", "A technique that reduces downtime by running two identical environments (blue and green); only one serves live traffic at a time", "Deploying code without testing", "A database replication method"], "A technique that reduces downtime by running two identical environments (blue and green); only one serves live traffic at a time"),
        ("What is Amazon Route 53?", ["A managed message queue service", "A highly available and scalable cloud Domain Name System (DNS) web service", "A virtual private network (VPN) service", "A container orchestration service"], "A highly available and scalable cloud Domain Name System (DNS) web service"),
        ("In Kubernetes, what is a 'ConfigMap' used for?", ["Storing encrypted passwords and tokens", "Decoupling environment-specific configuration data from container images", "Routing external traffic into the cluster", "Scheduling Pods to specific nodes"], "Decoupling environment-specific configuration data from container images"),
        ("What is the main benefit of using a multi-stage Docker build?", ["It runs containers in multiple stages sequentially", "It creates smaller final images by separating the build environment from the runtime environment", "It bypasses network security checks", "It automatically pushes the image to multiple registries"], "It creates smaller final images by separating the build environment from the runtime environment"),
        ("What is an AWS EC2 Auto Scaling Group?", ["A feature that automatically scales the size of an S3 bucket", "A service that automatically adjusts the number of EC2 instances in a group based on demand or schedules", "A database scaling tool", "A method for automatically updating application code"], "A service that automatically adjusts the number of EC2 instances in a group based on demand or schedules"),
        ("What is Prometheus primarily used for in a DevOps ecosystem?", ["Storing container images", "Systems and service monitoring, specifically metrics collection and alerting", "Automated code formatting", "Managing DNS records"], "Systems and service monitoring, specifically metrics collection and alerting"),
        ("What is an Ingress in Kubernetes?", ["A node that processes external API requests", "An API object that manages external access to the services in a cluster, typically HTTP/HTTPS, providing load balancing and SSL termination", "A physical network cable connecting clusters", "A persistent storage volume"], "An API object that manages external access to the services in a cluster, typically HTTP/HTTPS, providing load balancing and SSL termination"),
        ("Which of the following describes AWS CloudFormation?", ["A service to monitor application logs", "AWS's native Infrastructure as Code service that models and sets up AWS resources", "A content delivery network", "A managed Kubernetes service"], "AWS's native Infrastructure as Code service that models and sets up AWS resources"),
        ("What is the role of the 'kubelet' in a Kubernetes cluster?", ["It acts as the primary datastore (etcd)", "It is an agent that runs on each node in the cluster and ensures containers are running in a Pod", "It exposes services to the external internet", "It schedules pods to nodes based on resource availability"], "It is an agent that runs on each node in the cluster and ensures containers are running in a Pod"),
        ("What does it mean when a Docker container is 'stateless'?", ["It has no IP address", "It does not save data or state locally across restarts; any persistent data must be stored externally (e.g., in a database or volume)", "It does not consume CPU resources", "It cannot connect to the internet"], "It does not save data or state locally across restarts; any persistent data must be stored externally (e.g., in a database or volume)"),
        ("What is 'GitOps'?", ["A version control system created by Ops teams", "A set of practices that uses Git repositories as the single source of truth to deliver infrastructure and application configurations declaratively", "A command-line tool for git", "A database management strategy"], "A set of practices that uses Git repositories as the single source of truth to deliver infrastructure and application configurations declaratively"),
        ("In AWS, what is a Security Group?", ["A team responsible for AWS compliance", "A virtual firewall that controls inbound and outbound traffic for EC2 instances", "An encryption key management service", "A load balancer configuration"], "A virtual firewall that controls inbound and outbound traffic for EC2 instances"),
        ("What is a Helm chart?", ["A dashboard for Kubernetes metrics", "A collection of files that describe a related set of Kubernetes resources, acting as a package manager for Kubernetes", "A network routing protocol", "A type of container image"], "A collection of files that describe a related set of Kubernetes resources, acting as a package manager for Kubernetes"),
        ("What is the primary difference between a Virtual Machine (VM) and a Container?", ["Containers run on physical hardware without an OS", "VMs virtualize the hardware (each needs a full guest OS); Containers virtualize the OS layer (sharing the host OS kernel)", "VMs are faster to start than containers", "Containers are only used for web servers"], "VMs virtualize the hardware (each needs a full guest OS); Containers virtualize the OS layer (sharing the host OS kernel)")
    ]

    for i, data in enumerate(cloud_data):
        cloud_qs.append({
            "id": i + 1,
            "question": data[0],
            "options": data[1],
            "answer": data[2]
        })
        
    tests.append({
        "title": "Cloud & DevOps Engineering",
        "type": "TECHNICAL",
        "duration_minutes": 45,
        "questions": json.dumps(cloud_qs)
    })

    # ---------------------------------------------------------
    # WRITE TO SQL FILE
    # ---------------------------------------------------------
    sql_statements = ["-- V8: Seed Advanced Mock Tests with highly specific questions\n"]
    
    for test in tests:
        # Escape single quotes in JSON string for SQL
        json_escaped = test["questions"].replace("'", "''")
        stmt = f"INSERT INTO mock_tests (title, type, duration_minutes, questions) VALUES ('{test['title']}', '{test['type']}', {test['duration_minutes']}, '{json_escaped}');\n"
        sql_statements.append(stmt)
        
    with open("backend/src/main/resources/db/migration/V8__seed_advanced_assessments.sql", "w", encoding="utf-8") as f:
        f.writelines(sql_statements)
        
    print("SQL generation complete.")

if __name__ == "__main__":
    generate_sql()
