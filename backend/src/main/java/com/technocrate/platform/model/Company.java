package com.technocrate.platform.model;

import java.time.LocalDate;

public class Company {
    private Integer id;
    private String name;
    private String logoUrl;
    private String hiringRoles;
    private String eligibility;
    private String requiredSkills;
    private String hiringRounds;
    private String salaryPackage;
    private String jobLocation;
    private String applicationLink;
    private LocalDate lastDate;
    private String experienceLevel;
    private String hiringTrends;
    private Integer jobPostsCount;
    private Integer totalApplicants;
    private String companyDescription;
    private String industry;
    private Integer foundedYear;
    private String headquarters;
    private String employeeCount;

    // Constructors
    public Company() {}

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getHiringRoles() { return hiringRoles; }
    public void setHiringRoles(String hiringRoles) { this.hiringRoles = hiringRoles; }

    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getHiringRounds() { return hiringRounds; }
    public void setHiringRounds(String hiringRounds) { this.hiringRounds = hiringRounds; }

    public String getSalaryPackage() { return salaryPackage; }
    public void setSalaryPackage(String salaryPackage) { this.salaryPackage = salaryPackage; }

    public String getJobLocation() { return jobLocation; }
    public void setJobLocation(String jobLocation) { this.jobLocation = jobLocation; }

    public String getApplicationLink() { return applicationLink; }
    public void setApplicationLink(String applicationLink) { this.applicationLink = applicationLink; }

    public LocalDate getLastDate() { return lastDate; }
    public void setLastDate(LocalDate lastDate) { this.lastDate = lastDate; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getHiringTrends() { return hiringTrends; }
    public void setHiringTrends(String hiringTrends) { this.hiringTrends = hiringTrends; }

    public Integer getJobPostsCount() { return jobPostsCount; }
    public void setJobPostsCount(Integer jobPostsCount) { this.jobPostsCount = jobPostsCount; }

    public Integer getTotalApplicants() { return totalApplicants; }
    public void setTotalApplicants(Integer totalApplicants) { this.totalApplicants = totalApplicants; }

    public String getCompanyDescription() { return companyDescription; }
    public void setCompanyDescription(String companyDescription) { this.companyDescription = companyDescription; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public Integer getFoundedYear() { return foundedYear; }
    public void setFoundedYear(Integer foundedYear) { this.foundedYear = foundedYear; }

    public String getHeadquarters() { return headquarters; }
    public void setHeadquarters(String headquarters) { this.headquarters = headquarters; }

    public String getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(String employeeCount) { this.employeeCount = employeeCount; }
}
