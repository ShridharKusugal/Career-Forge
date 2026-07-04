package com.technocrate.platform.service;

import com.technocrate.platform.model.Job;
import com.technocrate.platform.repository.JobRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class JobAggregationService {

    private final JobRepository jobRepository;
    private final JdbcTemplate jdbcTemplate;
    private final Random random = new Random();

    public JobAggregationService(JobRepository jobRepository, JdbcTemplate jdbcTemplate) {
        this.jobRepository = jobRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void init() {
        // Automatically clear and re-aggregate jobs to apply updated, DNS-resolvable subdomains
        try {
            jdbcTemplate.update("DELETE FROM jobs");
        } catch (Exception e) {
            // Ignore if table doesn't exist yet
        }
        aggregateAllJobs();
    }

    public synchronized int aggregateAllJobs() {
        // Fetch all active companies from database
        String sql = "SELECT id, name, required_skills, job_location, salary_package FROM companies";
        List<Map<String, Object>> companies = jdbcTemplate.queryForList(sql);
        int jobsAdded = 0;

        for (Map<String, Object> company : companies) {
            Integer companyId = (Integer) company.get("id");
            String companyName = (String) company.get("name");
            String requiredSkills = (String) company.get("required_skills");
            String location = (String) company.get("job_location");
            String salary = (String) company.get("salary_package");

            // Generate 2-3 jobs per company
            int jobCount = 2 + random.nextInt(2);
            for (int i = 0; i < jobCount; i++) {
                Job job = generateMockJob(companyId, companyName, requiredSkills, location, salary, i);
                try {
                    jobRepository.save(job);
                    jobsAdded++;
                } catch (Exception e) {
                    // Ignore duplicate job codes during re-runs
                }
            }
        }
        return jobsAdded;
    }

    private Job generateMockJob(Integer companyId, String companyName, String requiredSkills, String location, String salaryPackage, int index) {
        String[] roles = {
            "Software Development Engineer (SDE-1)",
            "Frontend Developer",
            "Backend Systems Engineer",
            "SDE Intern",
            "Cloud Solutions Associate",
            "Data Engineer",
            "Quality Assurance Specialist"
        };
        
        String[] sources = {"Greenhouse", "Lever", "Workday", "SmartRecruiters", "iCIMS", "Official Career Page"};
        String source = sources[random.nextInt(sources.length)];
        
        String role = roles[random.nextInt(roles.length)];
        if (index == 0) {
            role = "Software Development Engineer (SDE-1)";
        } else if (index == 1) {
            role = "Frontend Developer";
        }

        String jobCode = companyName.toUpperCase().replace(" ", "") + "-" + role.replaceAll("[^a-zA-Z0-9]", "").substring(0, Math.min(6, role.length())).toUpperCase() + "-" + (1000 + random.nextInt(9000));
        
        // Build unique official job link
        String applicationUrl = buildOfficialJobUrl(companyName, source, jobCode, role);

        String description = "Join our team at " + companyName + " to build next-generation platforms. "
                + "You will collaborate with cross-functional teams to design, develop, and deploy scalable features, "
                + "optimize performance, and write clean, robust code. This role offers high ownership and opportunities "
                + "to solve hard engineering problems.";

        String eligibility = "B.E./B.Tech/MCA/M.Tech in CS/IT or equivalent branches. "
                + "Minimum 7.0 CGPA (or 70% equivalent). No active backlogs. Strong problem-solving aptitude.";

        String expLevel = "Fresher / Entry Level (0-2 years)";
        if (role.contains("Intern")) {
            expLevel = "Internship";
        } else if (random.nextBoolean()) {
            expLevel = "Associate (1-3 years)";
        }

        String skills = requiredSkills;
        if (role.contains("Frontend") && !skills.contains("React") && !skills.contains("JavaScript")) {
            skills = "HTML, CSS, JavaScript, React, Tailwind CSS, " + skills;
        } else if (role.contains("Backend") && !skills.contains("Java") && !skills.contains("Spring")) {
            skills = "Java, Spring Boot, MySQL, REST APIs, Redis, " + skills;
        }

        Job job = new Job();
        job.setCompanyId(companyId);
        job.setCompanyName(companyName);
        job.setTitle(role);
        job.setJobCode(jobCode);
        job.setApplicationUrl(applicationUrl);
        job.setDescription(description);
        job.setEligibility(eligibility);
        
        // Randomize location from seeded options
        String[] locList = location.split(",");
        job.setLocation(locList[random.nextInt(locList.length)].trim());
        
        job.setSalaryRange(salaryPackage);
        job.setHiringStatus("ACTIVE");
        job.setDeadline(LocalDate.now().plusDays(30 + random.nextInt(60)));
        job.setExperienceLevel(expLevel);
        job.setSkillsRequired(skills);
        job.setSource(source);

        return job;
    }

    private String buildOfficialJobUrl(String company, String source, String jobCode, String role) {
        String slug = role.toLowerCase().replaceAll("[^a-z0-9]", "-");
        String compLower = company.toLowerCase().trim();
        
        if (compLower.contains("adobe")) {
            if ("Workday".equalsIgnoreCase(source)) {
                return "https://adobe.wd5.myworkdayjobs.com/external_experienced/job/Noida/" + slug + "_" + jobCode;
            }
            return "https://careers.adobe.com/us/en/job/" + jobCode + "/" + slug;
        } else if (compLower.contains("google")) {
            return "https://www.google.com/about/careers/applications/jobs/results/" + jobCode;
        } else if (compLower.contains("microsoft")) {
            return "https://careers.microsoft.com/us/en/job/" + jobCode + "/" + slug;
        } else if (compLower.contains("amazon")) {
            return "https://www.amazon.jobs/en/jobs/" + jobCode + "/" + slug;
        } else if (compLower.contains("flipkart")) {
            return "https://www.flipkartcareers.com/#!/job-view/" + slug + "-" + jobCode;
        } else if (compLower.contains("meta") || compLower.contains("facebook")) {
            return "https://www.metacareers.com/jobs/" + jobCode;
        }
        
        String compDomain = company.toLowerCase().replace(" ", "") + ".com";
        switch (source) {
            case "Greenhouse":
                return "https://boards.greenhouse.io/" + company.toLowerCase().replace(" ", "") + "/jobs/" + jobCode.toLowerCase();
            case "Lever":
                return "https://jobs.lever.co/" + company.toLowerCase().replace(" ", "") + "/" + jobCode.toLowerCase();
            case "Workday":
                return "https://workday.wd5.myworkdayjobs.com/Careers/job/us/en/" + jobCode;
            case "SmartRecruiters":
                return "https://jobs.smartrecruiters.com/" + company.toLowerCase().replace(" ", "") + "/" + jobCode.toLowerCase();
            case "iCIMS":
                return "https://careers.icims.com/jobs/" + jobCode;
            default:
                return "https://careers." + compDomain + "/jobs/" + slug + "-id-" + jobCode;
        }
    }
}
