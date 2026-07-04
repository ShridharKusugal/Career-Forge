package com.technocrate.platform.model;

public class LinkedInProfile {
    private Integer id;
    private Integer userId;
    private String linkedinUrl;
    private Integer profileScore;
    private String skillsExtracted; // JSON or text list of skills
    private String missingSkills; // JSON or text list
    private String certificationsSuggested; // JSON or text list
    private String projectsSuggested; // JSON or text list
    private String jobMatches; // JSON or text list
    
    // New metrics and structured data fields
    private Integer atsScore;
    private String salaryPrediction;
    private Integer hiringReadinessScore;
    private Integer interviewReadinessScore;
    private String roadmapJson;
    private String optimizationJson;
    private String recruiterViewJson;
    private String radarDataJson;
    private String roleMatchesJson;
    private String profileDataJson;

    public LinkedInProfile() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public Integer getProfileScore() { return profileScore; }
    public void setProfileScore(Integer profileScore) { this.profileScore = profileScore; }

    public String getSkillsExtracted() { return skillsExtracted; }
    public void setSkillsExtracted(String skillsExtracted) { this.skillsExtracted = skillsExtracted; }

    public String getMissingSkills() { return missingSkills; }
    public void setMissingSkills(String missingSkills) { this.missingSkills = missingSkills; }

    public String getCertificationsSuggested() { return certificationsSuggested; }
    public void setCertificationsSuggested(String certificationsSuggested) { this.certificationsSuggested = certificationsSuggested; }

    public String getProjectsSuggested() { return projectsSuggested; }
    public void setProjectsSuggested(String projectsSuggested) { this.projectsSuggested = projectsSuggested; }

    public String getJobMatches() { return jobMatches; }
    public void setJobMatches(String jobMatches) { this.jobMatches = jobMatches; }

    // Getters and setters for new fields
    public Integer getAtsScore() { return atsScore; }
    public void setAtsScore(Integer atsScore) { this.atsScore = atsScore; }

    public String getSalaryPrediction() { return salaryPrediction; }
    public void setSalaryPrediction(String salaryPrediction) { this.salaryPrediction = salaryPrediction; }

    public Integer getHiringReadinessScore() { return hiringReadinessScore; }
    public void setHiringReadinessScore(Integer hiringReadinessScore) { this.hiringReadinessScore = hiringReadinessScore; }

    public Integer getInterviewReadinessScore() { return interviewReadinessScore; }
    public void setInterviewReadinessScore(Integer interviewReadinessScore) { this.interviewReadinessScore = interviewReadinessScore; }

    public String getRoadmapJson() { return roadmapJson; }
    public void setRoadmapJson(String roadmapJson) { this.roadmapJson = roadmapJson; }

    public String getOptimizationJson() { return optimizationJson; }
    public void setOptimizationJson(String optimizationJson) { this.optimizationJson = optimizationJson; }

    public String getRecruiterViewJson() { return recruiterViewJson; }
    public void setRecruiterViewJson(String recruiterViewJson) { this.recruiterViewJson = recruiterViewJson; }

    public String getRadarDataJson() { return radarDataJson; }
    public void setRadarDataJson(String radarDataJson) { this.radarDataJson = radarDataJson; }

    public String getRoleMatchesJson() { return roleMatchesJson; }
    public void setRoleMatchesJson(String roleMatchesJson) { this.roleMatchesJson = roleMatchesJson; }

    public String getProfileDataJson() { return profileDataJson; }
    public void setProfileDataJson(String profileDataJson) { this.profileDataJson = profileDataJson; }
}

