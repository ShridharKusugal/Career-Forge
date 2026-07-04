package com.technocrate.platform.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.technocrate.platform.model.CodingProblem;
import com.technocrate.platform.model.ProgressTracking;
import com.technocrate.platform.model.User;
import com.technocrate.platform.repository.CodingProblemRepository;
import com.technocrate.platform.repository.ProgressTrackingRepository;
import com.technocrate.platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.technocrate.platform.service.LocalCodeExecutor;
import com.technocrate.platform.service.LocalCodeExecutor.ExecutionResult;

import java.util.*;

@RestController
@RequestMapping("/api/coding-problems")
public class CodingProblemController {

    private final CodingProblemRepository codingProblemRepository;
    private final ProgressTrackingRepository progressTrackingRepository;
    private final UserRepository userRepository;

    public CodingProblemController(CodingProblemRepository codingProblemRepository,
                                   ProgressTrackingRepository progressTrackingRepository,
                                   UserRepository userRepository) {
        this.codingProblemRepository = codingProblemRepository;
        this.progressTrackingRepository = progressTrackingRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<CodingProblem>> getAllProblems() {
        return ResponseEntity.ok(codingProblemRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProblemById(@PathVariable int id) {
        Optional<CodingProblem> problemOpt = codingProblemRepository.findById(id);
        if (problemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(problemOpt.get());
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitCode(@PathVariable int id, @RequestBody CodeSubmissionRequest request) {
        User user = getAuthenticatedUser();
        Optional<CodingProblem> problemOpt = codingProblemRepository.findById(id);
        if (problemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CodingProblem problem = problemOpt.get();
        String code = request.getCode();
        String lang = request.getLanguage();

        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> testCaseResults = new ArrayList<>();
        
        if (code == null || code.trim().isEmpty()) {
            response.put("success", false);
            response.put("compilationError", true);
            response.put("message", "Compilation Error: Code is empty.");
            return ResponseEntity.ok(response);
        }

        // 2. Parse and execute test cases
        int passedCount = 0;
        int totalTestCases = 0;
        boolean compError = false;
        String errorMessage = "";

        try {
            ObjectMapper mapper = new ObjectMapper();
            List<Map<String, String>> testCases = mapper.readValue(
                    problem.getTestCases(),
                    new TypeReference<List<Map<String, String>>>() {}
            );
            totalTestCases = testCases.size();

            for (int i = 0; i < testCases.size(); i++) {
                Map<String, String> tc = testCases.get(i);
                String inputVal = tc.get("input");
                String expectedOutputVal = tc.get("output");

                // Execute the code via LocalCodeExecutor
                ExecutionResult execResult = LocalCodeExecutor.execute(lang, code, inputVal);

                if (execResult.isCompilationError()) {
                    compError = true;
                    errorMessage = execResult.getStderr();
                    break;
                }

                Map<String, Object> tcResult = new HashMap<>();
                tcResult.put("testCaseIndex", i + 1);
                tcResult.put("input", inputVal);
                tcResult.put("expectedOutput", expectedOutputVal);
                tcResult.put("actualOutput", execResult.getStdout());

                // Normalize output to compare
                String normActual = normalizeOutput(execResult.getStdout());
                String normExpected = normalizeOutput(expectedOutputVal);

                boolean passed = normActual.equals(normExpected);
                if (passed) {
                    passedCount++;
                    tcResult.put("status", "Passed");
                } else {
                    tcResult.put("status", "Failed (Incorrect Output)");
                    // Show error details if any occurred during execution (e.g. division by zero, null pointer)
                    if (execResult.getStderr() != null && !execResult.getStderr().trim().isEmpty()) {
                        tcResult.put("actualOutput", execResult.getStdout() + "\nError:\n" + execResult.getStderr());
                    }
                }
                testCaseResults.add(tcResult);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error executing test cases: " + e.getMessage());
            return ResponseEntity.ok(response);
        }

        if (compError) {
            response.put("success", false);
            response.put("compilationError", true);
            response.put("message", errorMessage);
            return ResponseEntity.ok(response);
        }

        boolean solved = (passedCount == totalTestCases);
        int score = solved ? 100 : (passedCount * 100) / Math.max(1, totalTestCases);

        // 3. Save progress
        ProgressTracking progress = new ProgressTracking();
        progress.setUserId(user.getId());
        progress.setEntityType("CODING_PROBLEM");
        progress.setEntityId(id);
        progress.setStatus(solved ? "COMPLETED" : "IN_PROGRESS");
        progress.setScore(score);
        progressTrackingRepository.save(progress);

        response.put("success", solved);
        response.put("compilationError", false);
        response.put("passedCount", passedCount);
        response.put("totalCount", totalTestCases);
        response.put("testCases", testCaseResults);
        response.put("message", solved ? "All test cases passed successfully! Code submitted." : "Some test cases failed. Please optimize your logic.");
        
        return ResponseEntity.ok(response);
    }

    private String normalizeOutput(String val) {
        if (val == null) return "";
        return val.trim().replaceAll("\\r\\n", "\n").replaceAll("\\n+", "\n").trim();
    }

    @PostMapping("/{id}/run")
    public ResponseEntity<?> runCode(@PathVariable int id, @RequestBody CodeRunRequest request) {
        String code = request.getCode();
        String lang = request.getLanguage();
        String stdin = request.getStdin();

        Map<String, Object> response = new HashMap<>();
        
        if (code == null || code.trim().isEmpty()) {
            response.put("success", false);
            response.put("compilationError", true);
            response.put("message", "Compilation Error: Code is empty.");
            return ResponseEntity.ok(response);
        }

        ExecutionResult execResult = LocalCodeExecutor.execute(lang, code, stdin);
        
        response.put("success", execResult.isSuccess() && (execResult.getStderr() == null || execResult.getStderr().trim().isEmpty()));
        response.put("compilationError", execResult.isCompilationError());
        response.put("stdout", execResult.getStdout());
        response.put("stderr", execResult.getStderr());
        
        return ResponseEntity.ok(response);
    }

    public static class CodeSubmissionRequest {
        private String language;
        private String code;

        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    public static class CodeRunRequest {
        private String language;
        private String code;
        private String stdin;

        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public String getStdin() { return stdin; }
        public void setStdin(String stdin) { this.stdin = stdin; }
    }
}
