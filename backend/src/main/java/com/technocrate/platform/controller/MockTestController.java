package com.technocrate.platform.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.technocrate.platform.model.MockTest;
import com.technocrate.platform.model.ProgressTracking;
import com.technocrate.platform.model.User;
import com.technocrate.platform.repository.MockTestRepository;
import com.technocrate.platform.repository.ProgressTrackingRepository;
import com.technocrate.platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/mock-tests")
public class MockTestController {

    private final MockTestRepository mockTestRepository;
    private final ProgressTrackingRepository progressTrackingRepository;
    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;

    public MockTestController(MockTestRepository mockTestRepository, 
                              ProgressTrackingRepository progressTrackingRepository,
                              UserRepository userRepository,
                              JdbcTemplate jdbcTemplate) {
        this.mockTestRepository = mockTestRepository;
        this.progressTrackingRepository = progressTrackingRepository;
        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<MockTest>> getAllTests() {
        return ResponseEntity.ok(mockTestRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTestById(@PathVariable int id) {
        Optional<MockTest> testOpt = mockTestRepository.findById(id);
        if (testOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(testOpt.get());
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitTest(@PathVariable int id, @RequestBody Map<String, String> answers) {
        User user = getAuthenticatedUser();
        Optional<MockTest> testOpt = mockTestRepository.findById(id);
        if (testOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        MockTest test = testOpt.get();
        int correctCount = 0;
        int totalQuestions = 0;

        try {
            ObjectMapper mapper = new ObjectMapper();
            List<Map<String, Object>> questionsList = mapper.readValue(
                    test.getQuestions(), 
                    new TypeReference<List<Map<String, Object>>>() {}
            );
            
            totalQuestions = questionsList.size();
            for (Map<String, Object> q : questionsList) {
                String qId = String.valueOf(q.get("id"));
                String correctAnswer = (String) q.get("answer");
                String submittedAnswer = answers.get(qId);
                
                if (submittedAnswer != null && submittedAnswer.equalsIgnoreCase(correctAnswer)) {
                    correctCount++;
                }
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error parsing mock test questions");
        }

        int scorePercentage = totalQuestions > 0 ? (correctCount * 100) / totalQuestions : 0;

        // Save progress
        ProgressTracking progress = new ProgressTracking();
        progress.setUserId(user.getId());
        progress.setEntityType("MOCK_TEST");
        progress.setEntityId(id);
        progress.setStatus("COMPLETED");
        progress.setScore(scorePercentage);
        progressTrackingRepository.save(progress);

        Map<String, Object> result = new HashMap<>();
        result.put("correctCount", correctCount);
        result.put("totalQuestions", totalQuestions);
        result.put("scorePercentage", scorePercentage);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        String sql = "SELECT u.username, SUM(p.score) as total_score, " +
                "COUNT(CASE WHEN p.entity_type = 'MOCK_TEST' THEN 1 END) as tests_completed, " +
                "COUNT(CASE WHEN p.entity_type = 'CODING_PROBLEM' THEN 1 END) as coding_completed " +
                "FROM progress_tracking p " +
                "JOIN users u ON p.user_id = u.id " +
                "WHERE p.status = 'COMPLETED' " +
                "GROUP BY u.id, u.username " +
                "ORDER BY total_score DESC " +
                "LIMIT 10";

        List<Map<String, Object>> leaderboard = jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> row = new HashMap<>();
            row.put("rank", rowNum + 1);
            row.put("username", rs.getString("username"));
            row.put("score", rs.getInt("total_score"));
            row.put("testsCompleted", rs.getInt("tests_completed"));
            row.put("codingCompleted", rs.getInt("coding_completed"));
            return row;
        });

        return ResponseEntity.ok(leaderboard);
    }
}
