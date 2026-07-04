package com.technocrate.platform.controller;

import com.technocrate.platform.model.Course;
import com.technocrate.platform.model.Domain;
import com.technocrate.platform.model.ProgressTracking;
import com.technocrate.platform.model.User;
import com.technocrate.platform.repository.CourseRepository;
import com.technocrate.platform.repository.DomainRepository;
import com.technocrate.platform.repository.ProgressTrackingRepository;
import com.technocrate.platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/domains")
public class LearningController {

    private final DomainRepository domainRepository;
    private final CourseRepository courseRepository;
    private final ProgressTrackingRepository progressTrackingRepository;
    private final UserRepository userRepository;

    public LearningController(DomainRepository domainRepository, CourseRepository courseRepository,
                              ProgressTrackingRepository progressTrackingRepository, UserRepository userRepository) {
        this.domainRepository = domainRepository;
        this.courseRepository = courseRepository;
        this.progressTrackingRepository = progressTrackingRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<Domain>> getAllDomains() {
        return ResponseEntity.ok(domainRepository.findAll());
    }

    @GetMapping("/{id}/roadmap")
    public ResponseEntity<?> getRoadmap(@PathVariable int id) {
        Optional<Domain> domainOpt = domainRepository.findById(id);
        if (domainOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Course> courses = courseRepository.findByDomainId(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("domain", domainOpt.get());
        response.put("courses", courses);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/progress")
    public ResponseEntity<?> getStudentProgress() {
        User user = getAuthenticatedUser();
        List<ProgressTracking> progress = progressTrackingRepository.findByUserId(user.getId());
        return ResponseEntity.ok(progress);
    }

    @PostMapping("/progress")
    public ResponseEntity<?> updateProgress(@RequestBody ProgressRequest request) {
        User user = getAuthenticatedUser();

        ProgressTracking tracking = new ProgressTracking();
        tracking.setUserId(user.getId());
        tracking.setEntityType(request.getEntityType().toUpperCase());
        tracking.setEntityId(request.getEntityId());
        tracking.setStatus(request.getStatus().toUpperCase());
        tracking.setScore(request.getScore());

        ProgressTracking saved = progressTrackingRepository.save(tracking);
        return ResponseEntity.ok(saved);
    }

    public static class ProgressRequest {
        private String entityType;
        private int entityId;
        private String status;
        private Integer score;

        public String getEntityType() { return entityType; }
        public void setEntityType(String entityType) { this.entityType = entityType; }

        public int getEntityId() { return entityId; }
        public void setEntityId(int entityId) { this.entityId = entityId; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }
    }
}
