USE careerforge_db;

-- 1. Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    job_code VARCHAR(100) UNIQUE NOT NULL,
    application_url VARCHAR(2083) NOT NULL,
    description TEXT,
    eligibility TEXT,
    location VARCHAR(255),
    salary_range VARCHAR(255),
    hiring_status VARCHAR(50) DEFAULT 'ACTIVE',
    deadline DATE,
    experience_level VARCHAR(100),
    skills_required TEXT,
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 2. Modify job_applications table to link to jobs and add clicked_at
ALTER TABLE job_applications ADD COLUMN job_id INT DEFAULT NULL;
ALTER TABLE job_applications ADD COLUMN clicked_at TIMESTAMP NULL DEFAULT NULL;
ALTER TABLE job_applications ADD CONSTRAINT fk_job_applications_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL;

-- 3. Create application_status_history table
CREATE TABLE IF NOT EXISTS application_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE
);

-- 4. Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    user_id INT NOT NULL,
    round_name VARCHAR(100) NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    meeting_link VARCHAR(500),
    notes TEXT,
    FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    user_id INT NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deadline TIMESTAMP NULL DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'RECEIVED',
    test_url VARCHAR(500),
    score INT DEFAULT NULL,
    FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Create email_integrations table
CREATE TABLE IF NOT EXISTS email_integrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_synced_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Create ats_integrations table
CREATE TABLE IF NOT EXISTS ats_integrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    api_key VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 8. Create skills and job_skills table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS job_skills (
    job_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (job_id, skill_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);
