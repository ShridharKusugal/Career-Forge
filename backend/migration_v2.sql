USE careerforge_db;

-- Add new columns to companies table
ALTER TABLE companies ADD COLUMN job_posts_count INT DEFAULT 0;
ALTER TABLE companies ADD COLUMN total_applicants INT DEFAULT 0;
ALTER TABLE companies ADD COLUMN company_description TEXT;
ALTER TABLE companies ADD COLUMN industry VARCHAR(100);
ALTER TABLE companies ADD COLUMN founded_year INT;
ALTER TABLE companies ADD COLUMN headquarters VARCHAR(100);
ALTER TABLE companies ADD COLUMN employee_count VARCHAR(50);

-- Update existing companies with new data
UPDATE companies SET job_posts_count=45, total_applicants=28500, company_description='Alphabet subsidiary specializing in Internet services, cloud computing, AI, and consumer electronics.', industry='Technology', founded_year=1998, headquarters='Mountain View, CA', employee_count='180,000+' WHERE name='Google';
UPDATE companies SET job_posts_count=120, total_applicants=95000, company_description='India''s largest IT services company and a global leader in consulting, technology, and digital solutions.', industry='IT Services', founded_year=1968, headquarters='Mumbai, India', employee_count='600,000+' WHERE name='TCS';
UPDATE companies SET job_posts_count=55, total_applicants=42000, company_description='Global technology leader in software, cloud services, gaming, and enterprise solutions.', industry='Technology', founded_year=1975, headquarters='Redmond, WA', employee_count='220,000+' WHERE name='Microsoft';
UPDATE companies SET job_posts_count=80, total_applicants=65000, company_description='Global professional services and consulting firm specializing in IT strategy.', industry='IT Consulting', founded_year=1989, headquarters='Dublin, Ireland', employee_count='740,000+' WHERE name='Accenture';
UPDATE companies SET job_posts_count=90, total_applicants=72000, company_description='Global digital services and consulting company with AI-powered solutions.', industry='IT Services', founded_year=1981, headquarters='Bangalore, India', employee_count='340,000+' WHERE name='Infosys';
UPDATE companies SET job_posts_count=60, total_applicants=52000, company_description='E-commerce and cloud computing giant, world leader in AWS cloud services.', industry='E-Commerce/Cloud', founded_year=1994, headquarters='Seattle, WA', employee_count='1,500,000+' WHERE name='Amazon';
UPDATE companies SET job_posts_count=25, total_applicants=18000, company_description='Social technology company building products for virtual and augmented reality.', industry='Social Media', founded_year=2004, headquarters='Menlo Park, CA', employee_count='67,000+' WHERE name='Meta';
UPDATE companies SET job_posts_count=15, total_applicants=12000, company_description='Entertainment streaming platform and production company.', industry='Entertainment', founded_year=1997, headquarters='Los Gatos, CA', employee_count='13,000+' WHERE name='Netflix';
UPDATE companies SET job_posts_count=30, total_applicants=22000, company_description='Consumer electronics, software, and services company known for iPhone, Mac, and iOS.', industry='Consumer Electronics', founded_year=1976, headquarters='Cupertino, CA', employee_count='160,000+' WHERE name='Apple';
UPDATE companies SET job_posts_count=35, total_applicants=25000, company_description='Cloud CRM platform and enterprise software leader.', industry='Cloud/SaaS', founded_year=1999, headquarters='San Francisco, CA', employee_count='79,000+' WHERE name='Salesforce';
UPDATE companies SET job_posts_count=28, total_applicants=20000, company_description='Software company specializing in creative tools, digital media, and document solutions.', industry='Software', founded_year=1982, headquarters='San Jose, CA', employee_count='29,000+' WHERE name='Adobe';
UPDATE companies SET job_posts_count=40, total_applicants=32000, company_description='Enterprise software, database, and cloud infrastructure leader.', industry='Enterprise Software', founded_year=1977, headquarters='Austin, TX', employee_count='143,000+' WHERE name='Oracle';
UPDATE companies SET job_posts_count=30, total_applicants=24000, company_description='Enterprise application software for business operations and intelligence.', industry='Enterprise Software', founded_year=1972, headquarters='Walldorf, Germany', employee_count='107,000+' WHERE name='SAP';
UPDATE companies SET job_posts_count=50, total_applicants=40000, company_description='Multinational technology and consulting corporation.', industry='Technology', founded_year=1911, headquarters='Armonk, NY', employee_count='280,000+' WHERE name='IBM';
UPDATE companies SET job_posts_count=70, total_applicants=55000, company_description='IT consulting and digital transformation services company.', industry='IT Consulting', founded_year=1967, headquarters='Paris, France', employee_count='360,000+' WHERE name='Capgemini';
UPDATE companies SET job_posts_count=85, total_applicants=68000, company_description='IT services and business process outsourcing company.', industry='IT Services', founded_year=1945, headquarters='Bangalore, India', employee_count='250,000+' WHERE name='Wipro';
UPDATE companies SET job_posts_count=65, total_applicants=48000, company_description='IT services and consulting company focused on engineering and R&D.', industry='IT Services', founded_year=1991, headquarters='Noida, India', employee_count='220,000+' WHERE name='HCLTech';
UPDATE companies SET job_posts_count=75, total_applicants=58000, company_description='IT services, consulting, and BPO company.', industry='IT Services', founded_year=1994, headquarters='Teaneck, NJ', employee_count='350,000+' WHERE name='Cognizant';
UPDATE companies SET job_posts_count=55, total_applicants=42000, company_description='IT services company focused on telecom and enterprise solutions.', industry='IT Services', founded_year=1986, headquarters='Pune, India', employee_count='155,000+' WHERE name='Tech Mahindra';
UPDATE companies SET job_posts_count=45, total_applicants=35000, company_description='Technology consulting and digital transformation company.', industry='IT Services', founded_year=2022, headquarters='Mumbai, India', employee_count='82,000+' WHERE name='LTIMindtree';
UPDATE companies SET job_posts_count=20, total_applicants=15000, company_description='Global investment banking and financial services firm.', industry='Finance', founded_year=1869, headquarters='New York, NY', employee_count='45,000+' WHERE name='Goldman Sachs';
UPDATE companies SET job_posts_count=25, total_applicants=18000, company_description='Global financial services and investment banking firm.', industry='Finance', founded_year=1799, headquarters='New York, NY', employee_count='310,000+' WHERE name='J.P. Morgan';
UPDATE companies SET job_posts_count=18, total_applicants=14000, company_description='Global financial services firm in investment banking and wealth management.', industry='Finance', founded_year=1935, headquarters='New York, NY', employee_count='82,000+' WHERE name='Morgan Stanley';
UPDATE companies SET job_posts_count=22, total_applicants=16000, company_description='Digital payments platform and financial technology company.', industry='FinTech', founded_year=1998, headquarters='San Jose, CA', employee_count='30,000+' WHERE name='PayPal';
UPDATE companies SET job_posts_count=18, total_applicants=14000, company_description='Digital payments and financial services platform in India.', industry='FinTech', founded_year=2010, headquarters='Noida, India', employee_count='10,000+' WHERE name='Paytm';
UPDATE companies SET job_posts_count=15, total_applicants=12000, company_description='Digital payments platform and financial services company.', industry='FinTech', founded_year=2015, headquarters='Bangalore, India', employee_count='8,000+' WHERE name='PhonePe';
UPDATE companies SET job_posts_count=12, total_applicants=9000, company_description='Payment gateway and financial software provider for businesses.', industry='FinTech', founded_year=2014, headquarters='Bangalore, India', employee_count='3,000+' WHERE name='Razorpay';
UPDATE companies SET job_posts_count=30, total_applicants=22000, company_description='Ride-sharing and delivery technology platform.', industry='Transportation', founded_year=2009, headquarters='San Francisco, CA', employee_count='32,000+' WHERE name='Uber';
UPDATE companies SET job_posts_count=20, total_applicants=16000, company_description='Ride-hailing and mobility platform.', industry='Transportation', founded_year=2010, headquarters='Bangalore, India', employee_count='5,000+' WHERE name='Ola';
UPDATE companies SET job_posts_count=18, total_applicants=14000, company_description='Food delivery and quick commerce platform.', industry='Food Tech', founded_year=2014, headquarters='Bangalore, India', employee_count='6,000+' WHERE name='Swiggy';
UPDATE companies SET job_posts_count=15, total_applicants=11000, company_description='Food delivery, dining, and restaurant discovery platform.', industry='Food Tech', founded_year=2008, headquarters='Gurgaon, India', employee_count='4,500+' WHERE name='Zomato';
UPDATE companies SET job_posts_count=22, total_applicants=18000, company_description='E-commerce marketplace and technology company.', industry='E-Commerce', founded_year=2007, headquarters='Bangalore, India', employee_count='35,000+' WHERE name='Flipkart';
UPDATE companies SET job_posts_count=20, total_applicants=15000, company_description='GPU and AI computing technology company.', industry='Semiconductors', founded_year=1993, headquarters='Santa Clara, CA', employee_count='30,000+' WHERE name='NVIDIA';
UPDATE companies SET job_posts_count=35, total_applicants=28000, company_description='Semiconductor chip maker and computing technology corporation.', industry='Semiconductors', founded_year=1968, headquarters='Santa Clara, CA', employee_count='130,000+' WHERE name='Intel';
UPDATE companies SET job_posts_count=25, total_applicants=20000, company_description='Networking technology and cybersecurity solutions company.', industry='Networking', founded_year=1984, headquarters='San Jose, CA', employee_count='84,000+' WHERE name='Cisco';

-- Add new columns to mock_tests table
ALTER TABLE mock_tests ADD COLUMN company_id INT DEFAULT NULL;
ALTER TABLE mock_tests ADD COLUMN category VARCHAR(50) DEFAULT 'DOMAIN';

-- Update existing mock tests
UPDATE mock_tests SET category='DOMAIN' WHERE id=1;
UPDATE mock_tests SET category='DOMAIN' WHERE id=2;

-- Add new columns to coding_problems table
ALTER TABLE coding_problems ADD COLUMN topic_tags VARCHAR(255);
ALTER TABLE coding_problems ADD COLUMN hints TEXT;
ALTER TABLE coding_problems ADD COLUMN solution_explanation TEXT;
ALTER TABLE coding_problems ADD COLUMN time_complexity VARCHAR(50);
ALTER TABLE coding_problems ADD COLUMN space_complexity VARCHAR(50);

-- Update existing coding problems
UPDATE coding_problems SET topic_tags='Arrays, HashMap', time_complexity='O(n)', space_complexity='O(n)', hints='["Use a hash map to store complement values","For each element, check if target - element exists in the map"]' WHERE title='Two Sum';
UPDATE coding_problems SET topic_tags='Linked List, Recursion', time_complexity='O(n)', space_complexity='O(1)', hints='["Use three pointers: prev, curr, next","Iterate and reverse links one by one"]' WHERE title='Reverse Linked List';

-- Expand resumes table
ALTER TABLE resumes ADD COLUMN phone VARCHAR(20);
ALTER TABLE resumes ADD COLUMN email VARCHAR(100);
ALTER TABLE resumes ADD COLUMN linkedin_url VARCHAR(255);
ALTER TABLE resumes ADD COLUMN github_url VARCHAR(255);
ALTER TABLE resumes ADD COLUMN summary TEXT;
ALTER TABLE resumes ADD COLUMN certifications TEXT;
ALTER TABLE resumes ADD COLUMN achievements TEXT;
ALTER TABLE resumes ADD COLUMN template_id VARCHAR(50);
ALTER TABLE resumes ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
