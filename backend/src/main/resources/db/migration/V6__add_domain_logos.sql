-- V6: Add logo_url column to domains and populate existing data

ALTER TABLE domains ADD COLUMN logo_url VARCHAR(255);

UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' WHERE name = 'Full Stack Development';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg' WHERE name = 'Software Engineering';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg' WHERE name = 'Data Analytics';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Kali-dragon-icon.svg' WHERE name = 'Cyber Security';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg' WHERE name = 'Machine Learning & AI';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' WHERE name = 'Cloud Computing & DevOps';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg' WHERE name = 'Mobile App Development';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Pandas_logo.svg' WHERE name = 'Data Science';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/1/19/Unity_Technologies_logo.svg' WHERE name = 'Game Development';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg' WHERE name = 'UI/UX Design';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg' WHERE name = 'Blockchain & Web3';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/en/c/cb/Raspberry_Pi_Logo.svg' WHERE name = 'Internet of Things (IoT)';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg' WHERE name = 'Database Administration';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Selenium_Logo.png' WHERE name = 'Quality Assurance & Automation';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/8/87/Arduino_Logo.svg' WHERE name = 'Embedded Systems';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' WHERE name = 'Natural Language Processing';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Hadoop_logo.svg' WHERE name = 'Big Data Engineering';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' WHERE name = 'AR/VR Development';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/1/1b/R_logo.svg' WHERE name = 'Quantitative Finance & Trading';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/8/82/Jira_%28Software%29_logo.svg' WHERE name = 'Product Management';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg' WHERE name = 'Site Reliability Engineering';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/4/48/Markdown-mark.svg' WHERE name = 'Technical Writing';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg' WHERE name = 'E-commerce Development';
UPDATE domains SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Ros_logo.svg' WHERE name = 'Robotics & Automation';
