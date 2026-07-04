USE careerforge_db;

SET @google_id = (SELECT id FROM companies WHERE name='Google' LIMIT 1);
SET @amazon_id = (SELECT id FROM companies WHERE name='Amazon' LIMIT 1);
SET @microsoft_id = (SELECT id FROM companies WHERE name='Microsoft' LIMIT 1);
SET @tcs_id = (SELECT id FROM companies WHERE name='TCS' LIMIT 1);
SET @wipro_id = (SELECT id FROM companies WHERE name='Wipro' LIMIT 1);
SET @infosys_id = (SELECT id FROM companies WHERE name='Infosys' LIMIT 1);
SET @accenture_id = (SELECT id FROM companies WHERE name='Accenture' LIMIT 1);
SET @zoho_id = (SELECT id FROM companies WHERE name='Zoho' LIMIT 1);

-- 11. Computer Networks Assessment
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('Computer Networks Domain Test', 'TECHNICAL', 20, 
'[{"id":"1","question":"Which layer of the OSI model handles routing and packet forwarding?","options":["Physical Layer","Data Link Layer","Network Layer","Transport Layer"],"answer":"Network Layer"},
 {"id":"2","question":"What protocol is used to map an IP address to a physical MAC address?","options":["DHCP","ARP","DNS","ICMP"],"answer":"ARP"},
 {"id":"3","question":"What is the size of an IPv6 address?","options":["32 bits","64 bits","128 bits","256 bits"],"answer":"128 bits"},
 {"id":"4","question":"Which TCP/IP protocol is connectionless and does not guarantee packet delivery?","options":["TCP","UDP","FTP","HTTP"],"answer":"UDP"}]', NULL, 'DOMAIN');

-- 12. OOPs Concepts Assessment
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('OOPs Design Patterns Test', 'TECHNICAL', 20, 
'[{"id":"1","question":"Which OOP pillar hiding internal details and showing only functionality?","options":["Encapsulation","Abstraction","Inheritance","Polymorphism"],"answer":"Abstraction"},
 {"id":"2","question":"What is it called when a subclass provides a specific implementation of a method already defined in its parent class?","options":["Method Overloading","Method Overriding","Multiple Inheritance","Encapsulation"],"answer":"Method Overriding"},
 {"id":"3","question":"Which design pattern ensures a class has only one instance and provides a global point of access to it?","options":["Factory Pattern","Singleton Pattern","Observer Pattern","Builder Pattern"],"answer":"Singleton Pattern"},
 {"id":"4","question":"Which type of inheritance is NOT supported directly in Java through classes?","options":["Single Inheritance","Multilevel Inheritance","Multiple Inheritance","Hierarchical Inheritance"],"answer":"Multiple Inheritance"}]', NULL, 'DOMAIN');

-- 13. Goldman Sachs Technical Assessment
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('Goldman Sachs Aptitude & Coding', 'TECHNICAL', 30, 
'[{"id":"1","question":"A bag contains 5 red and 7 blue balls. Two balls are drawn at random. What is the probability that both are red?","options":["5/33","10/33","5/22","7/22"],"answer":"5/33"},
 {"id":"2","question":"What is the time complexity of searching an element in a Hash Table in the best/average case?","options":["O(1)","O(log N)","O(N)","O(N log N)"],"answer":"O(1)"},
 {"id":"3","question":"Which mathematical algorithm is used to find the Greatest Common Divisor (GCD) of two numbers efficiently?","options":["Euclidean Algorithm","Sieve of Eratosthenes","Newton-Raphson","Primality Test"],"answer":"Euclidean Algorithm"},
 {"id":"4","question":"What is the value of 1010 in binary converted to decimal?","options":["8","10","12","14"],"answer":"10"}]', (SELECT id FROM companies WHERE name='Goldman Sachs' LIMIT 1), 'COMPETITIVE');

-- 14. Qualcomm VLSI & Embedded Test
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('Qualcomm C & Systems Test', 'TECHNICAL', 30, 
'[{"id":"1","question":"What does the volatile keyword indicate to the C compiler?","options":["The variable value can change outside the program control","The variable should be stored in register memory","The variable is constant","The variable can only be accessed by one thread"],"answer":"The variable value can change outside the program control"},
 {"id":"2","question":"Which operator is used to perform bitwise XOR in C/C++?","options":["&","|","^","~"],"answer":"^"},
 {"id":"3","question":"What is the output of 5 << 2 in C?","options":["10","20","25","40"],"answer":"20"},
 {"id":"4","question":"Which interrupt has the highest priority in a standard microprocessor?","options":["TRAP","RST 7.5","INTR","NMI"],"answer":"TRAP"}]', @qualcomm_id, 'INTERVIEW');

-- 15. Deloitte Consultant Case Study Trivia
INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES
('Deloitte Logical Case-Study', 'APTITUDE', 20, 
'[{"id":"1","question":"A company wants to increase its profits by 20%. If sales volume cannot be increased, what should they do?","options":["Reduce fixed costs","Increase variable cost per unit","Increase employee count","Increase advertising budget"],"answer":"Reduce fixed costs"},
 {"id":"2","question":"Which framework is commonly used to analyze the competitive environment of an industry?","options":["Porter''s Five Forces","BCG Matrix","SWOT Analysis","PESTEL Framework"],"answer":"Porter''s Five Forces"},
 {"id":"3","question":"What does the term ''MECE'' stand for in McKinsey consulting methodology?","options":["Mutually Exclusive, Collectively Exhaustive","Most Effective, Cost Efficient","Market Entry, Competitor Evaluation","Mutual Agreement, Customer Engagement"],"answer":"Mutually Exclusive, Collectively Exhaustive"},
 {"id":"4","question":"If production costs decrease by 10% and selling price remains the same, what happens to the break-even point?","options":["It increases","It decreases","It remains the same","It drops to zero"],"answer":"It decreases"}]', (SELECT id FROM companies WHERE name='Deloitte' LIMIT 1), 'INTERVIEW');
