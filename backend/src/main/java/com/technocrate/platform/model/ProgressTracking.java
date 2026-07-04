package com.technocrate.platform.model;

import java.time.LocalDateTime;

public class ProgressTracking {
    private Integer id;
    private Integer userId;
    private String entityType; // COURSE, MOCK_TEST, CODING_PROBLEM
    private Integer entityId;
    private String status; // IN_PROGRESS, COMPLETED
    private Integer score;
    private LocalDateTime updatedAt;

    public ProgressTracking() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public Integer getEntityId() { return entityId; }
    public void setEntityId(Integer entityId) { this.entityId = entityId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
