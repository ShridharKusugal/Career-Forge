package com.technocrate.platform.model;

public class MockTest {
    private Integer id;
    private String title;
    private String type; // APTITUDE, TECHNICAL, COMPETITIVE, INTERVIEW, DOMAIN
    private Integer durationMinutes;
    private String questions; // JSON representation of questions
    private Integer companyId;
    private String category; // COMPETITIVE, INTERVIEW, DOMAIN

    public MockTest() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getQuestions() { return questions; }
    public void setQuestions(String questions) { this.questions = questions; }

    public Integer getCompanyId() { return companyId; }
    public void setCompanyId(Integer companyId) { this.companyId = companyId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
