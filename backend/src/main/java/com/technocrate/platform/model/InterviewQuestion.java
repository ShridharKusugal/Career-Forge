package com.technocrate.platform.model;

public class InterviewQuestion {
    private Integer id;
    private Integer companyId;
    private String question;
    private String answer;
    private String type; // TECHNICAL, HR, CODING, APTITUDE
    private String difficulty; // EASY, MEDIUM, HARD

    public InterviewQuestion() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getCompanyId() { return companyId; }
    public void setCompanyId(Integer companyId) { this.companyId = companyId; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
}
