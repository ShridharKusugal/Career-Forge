USE careerforge_db;

-- Clear previous tests if needed to prevent duplicates or clean up
DELETE FROM mock_tests WHERE id > 2;

-- Helper variables for company IDs
SET @google_id = (SELECT id FROM companies WHERE name='Google' LIMIT 1);
SET @amazon_id = (SELECT id FROM companies WHERE name='Amazon' LIMIT 1);
SET @microsoft_id = (SELECT id FROM companies WHERE name='Microsoft' LIMIT 1);
SET @tcs_id = (SELECT id FROM companies WHERE name='TCS' LIMIT 1);
SET @wipro_id = (SELECT id FROM companies WHERE name='Wipro' LIMIT 1);
SET @infosys_id = (SELECT id FROM companies WHERE name='Infosys' LIMIT 1);
SET @accenture_id = (SELECT id FROM companies WHERE name='Accenture' LIMIT 1);
SET @zoho_id = (SELECT id FROM companies WHERE name='Zoho' LIMIT 1);

-- 1. TCS NQT Aptitude Assessment
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('TCS NQT Numerical Ability', 'TECHNICAL', 20, 
'[{"id":"1","question":"The average of 5 consecutive numbers is 20. What is the largest of these numbers?","options":["20","21","22","23"],"answer":"22"},
 {"id":"2","question":"A train crosses a pole in 15 seconds. If the speed of the train is 60 km/h, what is the length of the train?","options":["150m","200m","250m","300m"],"answer":"250m"},
 {"id":"3","question":"A shopkeeper offers 10% discount on a product marked at Rs. 500 and still makes a 25% profit. What was the cost price?","options":["Rs. 320","Rs. 350","Rs. 360","Rs. 380"],"answer":"Rs. 360"},
 {"id":"4","question":"Simplify: 240 / 8 + 5 * 12 - 25","options":["45","55","65","75"],"answer":"65"}]', @tcs_id, 'INTERVIEW');

-- 2. Google Online Assessment - DS & Algo
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('Google OA Code-Drill', 'TECHNICAL', 45, 
'[{"id":"1","question":"What is the time complexity of building a heap of size N from an unsorted array?","options":["O(N)","O(N log N)","O(log N)","O(N^2)"],"answer":"O(N)"},
 {"id":"2","question":"Which algorithm is used to find the shortest path in a graph with negative edge weights but no negative cycles?","options":["Dijkstra","Bellman-Ford","Floyd-Warshall","Kruskal"],"answer":"Bellman-Ford"},
 {"id":"3","question":"What data structure is optimal for executing Range Minimum Queries (RMQ) in O(log N) time with O(N log N) preprocessing?","options":["Segment Tree","Stack","Queue","Linked List"],"answer":"Segment Tree"},
 {"id":"4","question":"Which graph traversal technique uses a Queue data structure?","options":["DFS","BFS","Preorder","Postorder"],"answer":"BFS"}]', @google_id, 'COMPETITIVE');

-- 3. Amazon Online Assessment (SDE-1)
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('Amazon SDE-1 Coding Trivia', 'TECHNICAL', 30, 
'[{"id":"1","question":"Which data structure is typically used to implement a LRU (Least Recently Used) cache?","options":["HashMap","Doubly Linked List + HashMap","BST","Priority Queue"],"answer":"Doubly Linked List + HashMap"},
 {"id":"2","question":"What is the time complexity to search an element in a balanced Binary Search Tree?","options":["O(1)","O(N)","O(log N)","O(N log N)"],"answer":"O(log N)"},
 {"id":"3","question":"What is the default load factor of a HashMap in Java?","options":["0.5","0.75","0.8","1.0"],"answer":"0.75"},
 {"id":"4","question":"Which traversal of a BST yields sorted values in ascending order?","options":["Pre-order","In-order","Post-order","Level-order"],"answer":"In-order"}]', @amazon_id, 'COMPETITIVE');

-- 4. Wipro NLTH Assessment
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('Wipro Elite Quantitative Aptitude', 'APTITUDE', 25, 
'[{"id":"1","question":"If a sum of money doubles itself in 8 years at simple interest, what is the rate of interest per annum?","options":["10%","12.5%","15%","18.5%"],"answer":"12.5%"},
 {"id":"2","question":"A and B can complete a work in 12 days and 18 days respectively. In how many days can they complete it together?","options":["6.2 days","7.2 days","8 days","9.6 days"],"answer":"7.2 days"},
 {"id":"3","question":"Find the odd one out: 27, 64, 125, 144, 216","options":["27","64","144","216"],"answer":"144"},
 {"id":"4","question":"Find the probability of getting a sum of 7 when rolling two fair dice.","options":["1/6","1/12","1/36","5/36"],"answer":"1/6"}]', @wipro_id, 'INTERVIEW');

-- 5. Infosys InfyTQ Python Assessment
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('Infosys InfyTQ Python Test', 'TECHNICAL', 30, 
'[{"id":"1","question":"What is the output of print(type([1, 2])) in Python?","options":["list","tuple","dict","array"],"answer":"list"},
 {"id":"2","question":"Which of the following is mutable in Python?","options":["string","tuple","list","int"],"answer":"list"},
 {"id":"3","question":"How do you handle exceptions in Python?","options":["try-except","try-catch","throw-catch","exception-handle"],"answer":"try-except"},
 {"id":"4","question":"What is the maximum possible length of an identifier in Python?","options":["31","63","79","None of these"],"answer":"None of these"}]', @infosys_id, 'INTERVIEW');

-- 6. Accenture Cognitive & Technical Test
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('Accenture Cognitive Reasoning', 'APTITUDE', 25, 
'[{"id":"1","question":"Identify the next number in the series: 2, 6, 12, 20, 30, ?","options":["40","42","44","46"],"answer":"42"},
 {"id":"2","question":"If LION is coded as MJPB, then TIGER is coded as:","options":["UJHFS","UKHFS","UJHGT","UIHFT"],"answer":"UJHFS"},
 {"id":"3","question":"Pointing to a man, a woman said, ''His mother is the only daughter of my mother.'' How is the woman related to the man?","options":["Sister","Mother","Daughter","Grandmother"],"answer":"Mother"},
 {"id":"4","question":"Which word does NOT belong with the others?","options":["Leopard","Cougar","Lion","Cheetah"],"answer":"Lion"}]', @accenture_id, 'INTERVIEW');

-- 7. Zoho Programming Round (C/C++)
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('Zoho C Programming Concepts', 'TECHNICAL', 25, 
'[{"id":"1","question":"What is the output of printf(\"%d\", sizeof(''a'')); in a standard C compiler?","options":["1","2","4","Depends on architecture"],"answer":"4"},
 {"id":"2","question":"What is the default storage class for local variables in C?","options":["static","extern","register","auto"],"answer":"auto"},
 {"id":"3","question":"Which keyword is used to prevent any changes to a variable in C?","options":["static","const","volatile","register"],"answer":"const"},
 {"id":"4","question":"What does the malloc() function return if memory allocation fails?","options":["0","void pointer","NULL","Garbage value"],"answer":"NULL"}]', @zoho_id, 'INTERVIEW');

-- 8. Microsoft Codility Online Assessment
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('Microsoft Algorithms Prep', 'TECHNICAL', 40, 
'[{"id":"1","question":"Which algorithm is used to find the strongly connected components of a directed graph?","options":["Kruskal","Prim","Tarjan","Dijkstra"],"answer":"Tarjan"},
 {"id":"2","question":"What is the time complexity of the Floyd-Warshall all-pairs shortest path algorithm?","options":["O(V^2)","O(V log V)","O(V^3)","O(E log V)"],"answer":"O(V^3)"},
 {"id":"3","question":"Which sorting algorithm has a worst-case time complexity of O(N^2) but an average-case of O(N log N)?","options":["Merge Sort","Heap Sort","Quick Sort","Bubble Sort"],"answer":"Quick Sort"},
 {"id":"4","question":"Which pattern is used to solve the problem of finding the longest contiguous subarray with sum equal to K?","options":["Sliding Window","Two Pointers","Prefix Sum + HashMap","Binary Search"],"answer":"Prefix Sum + HashMap"}]', @microsoft_id, 'COMPETITIVE');

-- 9. Technical Core - Database Management Systems (DBMS)
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('DBMS Fundamental Assessment', 'TECHNICAL', 20, 
'[{"id":"1","question":"Which normal form deals with Transitive Dependency?","options":["1NF","2NF","3NF","BCNF"],"answer":"3NF"},
 {"id":"2","question":"What does the ACID property ''I'' stand for in database transactions?","options":["Integration","Isolation","Integrity","Index"],"answer":"Isolation"},
 {"id":"3","question":"Which SQL clause is used to filter records after grouping them with GROUP BY?","options":["WHERE","HAVING","FILTER","SELECT"],"answer":"HAVING"},
 {"id":"4","question":"Which index type physically reorders the records on disk according to index key?","options":["Clustered Index","Non-Clustered Index","Primary Index","Secondary Index"],"answer":"Clustered Index"}]', NULL, 'DOMAIN');

-- 10. Technical Core - Operating Systems (OS)
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('Operating Systems Assessment', 'TECHNICAL', 20, 
'[{"id":"1","question":"What is a condition that leads to deadlock where a resource cannot be shared?","options":["Mutual Exclusion","Hold and Wait","No Preemption","Circular Wait"],"answer":"Mutual Exclusion"},
 {"id":"2","question":"Which memory management scheme allows executing processes larger than physical memory?","options":["Paging","Segmentation","Virtual Memory","Fragmentation"],"answer":"Virtual Memory"},
 {"id":"3","question":"What is the state of a process when it is waiting for some event to occur (like I/O completion)?","options":["New","Ready","Blocked/Waiting","Terminated"],"answer":"Blocked/Waiting"},
 {"id":"4","question":"Which CPU scheduling algorithm is non-preemptive and selects the process with the shortest execution time first?","options":["Round Robin","Shortest Job First (SJF)","Priority Scheduling","First Come First Served"],"answer":"Shortest Job First (SJF)"}]', NULL, 'DOMAIN');
