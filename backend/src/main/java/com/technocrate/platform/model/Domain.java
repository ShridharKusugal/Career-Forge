package com.technocrate.platform.model;

public class Domain {
    private Integer id;
    private String name;
    private String description;
    private String roadmap; // JSON list of milestones
    private String logoUrl;

    public Domain() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRoadmap() { return roadmap; }
    public void setRoadmap(String roadmap) { this.roadmap = roadmap; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
}
