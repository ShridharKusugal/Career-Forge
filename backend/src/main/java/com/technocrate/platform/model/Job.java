package com.technocrate.platform.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Job {
    private Integer id;
    private Integer companyId;
    private String companyName;
    private String title;
    private String jobCode;
    private String applicationUrl;
    private String description;
    private String eligibility;
    private String location;
    private String salaryRange;
    private String hiringStatus;
    private LocalDate deadline;
    private String experienceLevel;
    private String skillsRequired;
    private String source;
    private LocalDateTime createdAt;

    // Constructors
    public Job() {}

    public Job(Integer id, Integer companyId, String companyName, String title, String jobCode, String applicationUrl,
               String description, String eligibility, String location, String salaryRange, String hiringStatus,
               LocalDate deadline, String experienceLevel, String skillsRequired, String source, LocalDateTime createdAt) {
        this.id = id;
        this.companyId = companyId;
        this.companyName = companyName;
        this.title = title;
        this.jobCode = jobCode;
        this.applicationUrl = applicationUrl;
        this.description = description;
        this.eligibility = eligibility;
        this.location = location;
        this.salaryRange = salaryRange;
        this.hiringStatus = hiringStatus;
        this.deadline = deadline;
        this.experienceLevel = experienceLevel;
        this.skillsRequired = skillsRequired;
        this.source = source;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getCompanyId() { return companyId; }
    public void setCompanyId(Integer companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getJobCode() { return jobCode; }
    public void setJobCode(String jobCode) { this.jobCode = jobCode; }

    public String getApplicationUrl() { return applicationUrl; }
    public void setApplicationUrl(String applicationUrl) { this.applicationUrl = applicationUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }

    public String getHiringStatus() { return hiringStatus; }
    public void setHiringStatus(String hiringStatus) { this.hiringStatus = hiringStatus; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getSkillsRequired() { return skillsRequired; }
    public void setSkillsRequired(String skillsRequired) { this.skillsRequired = skillsRequired; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
