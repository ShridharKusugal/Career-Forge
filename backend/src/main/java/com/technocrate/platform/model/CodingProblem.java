package com.technocrate.platform.model;

public class CodingProblem {
    private Integer id;
    private String title;
    private String description;
    private String difficulty; // EASY, MEDIUM, HARD
    private Integer companyId;
    private String testCases; // JSON representation of test cases
    private String starterCode; // JSON structure for Java, Python, C++, JS
    private String topicTags; // e.g. "Arrays, HashMap, Two Pointers"
    private String hints; // JSON array of hints
    private String solutionExplanation;
    private String timeComplexity;
    private String spaceComplexity;

    public CodingProblem() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getCompanyId() { return companyId; }
    public void setCompanyId(Integer companyId) { this.companyId = companyId; }

    public String getTestCases() { return testCases; }
    public void setTestCases(String testCases) { this.testCases = testCases; }

    public String getStarterCode() { return starterCode; }
    public void setStarterCode(String starterCode) { this.starterCode = starterCode; }

    public String getTopicTags() { return topicTags; }
    public void setTopicTags(String topicTags) { this.topicTags = topicTags; }

    public String getHints() { return hints; }
    public void setHints(String hints) { this.hints = hints; }

    public String getSolutionExplanation() { return solutionExplanation; }
    public void setSolutionExplanation(String solutionExplanation) { this.solutionExplanation = solutionExplanation; }

    public String getTimeComplexity() { return timeComplexity; }
    public void setTimeComplexity(String timeComplexity) { this.timeComplexity = timeComplexity; }

    public String getSpaceComplexity() { return spaceComplexity; }
    public void setSpaceComplexity(String spaceComplexity) { this.spaceComplexity = spaceComplexity; }
}
