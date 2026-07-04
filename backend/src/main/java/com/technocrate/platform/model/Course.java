package com.technocrate.platform.model;

public class Course {
    private Integer id;
    private Integer domainId;
    private String title;
    private String description;
    private String difficulty; // BEGINNER, INTERMEDIATE, ADVANCED
    private String videoUrl;
    private String notesPath;
    private String assignment;
    private String project;

    public Course() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getDomainId() { return domainId; }
    public void setDomainId(Integer domainId) { this.domainId = domainId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getNotesPath() { return notesPath; }
    public void setNotesPath(String notesPath) { this.notesPath = notesPath; }

    public String getAssignment() { return assignment; }
    public void setAssignment(String assignment) { this.assignment = assignment; }

    public String getProject() { return project; }
    public void setProject(String project) { this.project = project; }
}
