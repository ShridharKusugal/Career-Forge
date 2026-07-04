package com.technocrate.platform.controller;

import com.technocrate.platform.model.ProgressTracking;
import com.technocrate.platform.model.User;
import com.technocrate.platform.repository.ProgressTrackingRepository;
import com.technocrate.platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final ProgressTrackingRepository progressTrackingRepository;
    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;

    public AiController(ProgressTrackingRepository progressTrackingRepository, UserRepository userRepository, JdbcTemplate jdbcTemplate) {
        this.progressTrackingRepository = progressTrackingRepository;
        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    // 1. AI Career Recommendations and Readiness
    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations() {
        User user = getAuthenticatedUser();
        List<ProgressTracking> progressList = progressTrackingRepository.findByUserId(user.getId());

        int coursesCompleted = 0;
        int testsCompleted = 0;
        int codingCompleted = 0;
        int interviewsCompleted = 0;
        int totalScoreSum = 0;
        int totalInterviewScoreSum = 0;

        for (ProgressTracking p : progressList) {
            if (p.getStatus() != null && p.getStatus().equalsIgnoreCase("COMPLETED")) {
                String type = p.getEntityType();
                if (type != null) {
                    if (type.equalsIgnoreCase("COURSE")) {
                        coursesCompleted++;
                    } else if (type.equalsIgnoreCase("MOCK_TEST")) {
                        testsCompleted++;
                        if (p.getScore() != null) totalScoreSum += p.getScore();
                    } else if (type.equalsIgnoreCase("CODING_PROBLEM")) {
                        codingCompleted++;
                        if (p.getScore() != null) totalScoreSum += p.getScore();
                    } else if (type.equalsIgnoreCase("MOCK_INTERVIEW")) {
                        interviewsCompleted++;
                        if (p.getScore() != null) totalInterviewScoreSum += p.getScore();
                    }
                }
            }
        }

        int totalEvaluated = testsCompleted + codingCompleted;
        int averageScore = totalEvaluated > 0 ? totalScoreSum / totalEvaluated : 0;
        int averageInterviewScore = interviewsCompleted > 0 ? totalInterviewScoreSum / interviewsCompleted : 0;

        // Calculate readiness score
        int readinessScore = Math.min(100, (coursesCompleted * 10) + (testsCompleted * 15) + (codingCompleted * 20) + (interviewsCompleted * 25));
        if (readinessScore == 0) readinessScore = 35; // Default baseline

        // Recommendations
        List<String> domains = new ArrayList<>();
        List<String> skillsToLearn = new ArrayList<>();
        String companyMatch = "TCS Ninja / Wipro";

        if (readinessScore < 50) {
            domains.add("Full Stack Development (Foundations)");
            skillsToLearn.add("Data Structures & Algorithms");
            skillsToLearn.add("Core Java Programming");
            companyMatch = "TCS Ninja / Accenture ASE";
        } else if (readinessScore < 75) {
            domains.add("Full Stack Development");
            domains.add("Software Engineering");
            skillsToLearn.add("Spring Boot REST APIs");
            skillsToLearn.add("System Design (LLD)");
            companyMatch = "Infosys Specialist Programmer / Accenture AASE";
        } else {
            domains.add("Software Engineering (Advanced)");
            domains.add("DevOps / Cloud Architecture");
            skillsToLearn.add("System Design (HLD)");
            skillsToLearn.add("Docker & Kubernetes");
            companyMatch = "Google / Microsoft / Amazon";
        }

        List<Map<String, String>> nextSteps = new ArrayList<>();

        // 1. Coding step
        Map<String, String> codingStep = new HashMap<>();
        codingStep.put("icon", "Code2");
        codingStep.put("color", "sky");
        codingStep.put("tag", "Coding Arena");
        if (codingCompleted == 0) {
            codingStep.put("label", "Solve your first DSA problem");
        } else if (codingCompleted < 5) {
            codingStep.put("label", "Solve 3 Medium DSA problems");
        } else {
            codingStep.put("label", "Try an Advanced DSA Challenge");
        }
        nextSteps.add(codingStep);

        // 2. Interview step
        Map<String, String> interviewStep = new HashMap<>();
        interviewStep.put("icon", "Brain");
        interviewStep.put("color", "indigo");
        interviewStep.put("tag", "Mock Interview");
        if (readinessScore < 50) {
            interviewStep.put("label", "Start a Full Stack Mock Interview");
        } else {
            interviewStep.put("label", "Practice Google SWE Mock Interview");
        }
        nextSteps.add(interviewStep);

        // 3. Learning/Course step
        Map<String, String> courseStep = new HashMap<>();
        courseStep.put("icon", "BookOpen");
        courseStep.put("color", "emerald");
        courseStep.put("tag", "Learning");
        if (coursesCompleted == 0) {
            courseStep.put("label", "Start learning with a video course");
        } else if (coursesCompleted < 3) {
            courseStep.put("label", "Finish another video course to build your roadmap");
        } else {
            courseStep.put("label", "Explore Advanced DevOps / Cloud topics");
        }
        nextSteps.add(courseStep);

        // 4. Mock Test step
        Map<String, String> testStep = new HashMap<>();
        testStep.put("icon", "Target");
        testStep.put("color", "amber");
        testStep.put("tag", "Mock Tests");
        if (testsCompleted == 0) {
            testStep.put("label", "Take your first Mock Test");
        } else if (averageScore < 70) {
            testStep.put("label", "Retake a Mock Test to improve your score");
        } else {
            testStep.put("label", "Challenge yourself with a Company Specific Test");
        }
        nextSteps.add(testStep);

        Map<String, Object> response = new HashMap<>();
        response.put("readinessScore", readinessScore);
        response.put("averageScore", averageScore);
        response.put("interviewsCompleted", interviewsCompleted);
        response.put("averageInterviewScore", averageInterviewScore);
        response.put("recommendedDomains", domains);
        response.put("suggestedSkills", skillsToLearn);
        response.put("companyMatchPrediction", companyMatch);
        response.put("learningStreak", 3); // Simulated daily streak
        response.put("nextSteps", nextSteps);

        return ResponseEntity.ok(response);
    }

    // 2. AI Chatbot Assistant
    @PostMapping("/chat")
    public ResponseEntity<?> chatbot(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message cannot be empty.");
        }

        String reply = "I am your TechnoCrate AI Career Counselor. Please let me know how I can help you prepare for your upcoming placement!";
        
        String cleanMsg = userMessage.toLowerCase();
        if (cleanMsg.contains("tcs") || cleanMsg.contains("nqt")) {
            reply = "TCS hiring typically happens through the TCS National Qualifier Test (NQT). The test includes quantitative aptitude, logical reasoning, verbal ability, pseudo-code analysis, and basic coding tasks. I recommend starting with our timed Aptitude Assessments!";
        } else if (cleanMsg.contains("resume") || cleanMsg.contains("cv")) {
            reply = "To pass ATS screens, ensure your resume contains keywords matching the job description. In our Resume Builder, save your details to see a real-time ATS score and custom optimization suggestions!";
        } else if (cleanMsg.contains("java") || cleanMsg.contains("oops")) {
            reply = "Java is a class-based, object-oriented language. The four pillars of OOPs are Encapsulation, Abstraction, Inheritance, and Polymorphism. Try our Core Java Mock Test under the Assessment section to practice!";
        } else if (cleanMsg.contains("interview") || cleanMsg.contains("prep")) {
            reply = "Preparing for interviews requires: 1) Strong DSA knowledge (practice Two Sum in our Coding Platform). 2) Operating System / DBMS foundations. 3) Standard HR questions like 'Tell me about yourself'. Try our AI Mock Interview Simulator under the Interview panel!";
        } else if (cleanMsg.contains("hello") || cleanMsg.contains("hi ")) {
            reply = "Hello! I am your TechnoCrate AI Guide. Ask me anything about placements, company hiring eligibility, coding problems, or resume tips!";
        }

        Map<String, String> response = new HashMap<>();
        response.put("reply", reply);
        return ResponseEntity.ok(response);
    }

    // 3. AI Interactive Mock Interview Simulator
    @PostMapping("/mock-interview")
    public ResponseEntity<?> mockInterview(@RequestBody MockInterviewRequest request) {
        int stage = request.getStage(); // 0: Start, 1: Intro Response, 2: Tech Q1 Response, 3: Tech Q2 Response, 4: HR Q Response
        String field = request.getField(); // e.g. "Google" or "Full Stack"

        String nextQuestion = "";
        String feedback = "";
        boolean isFinished = false;
        int overallScore = 0;

        if (stage == 0) {
            nextQuestion = "Welcome to your Mock Interview for " + field + ". Let's start with a standard introduction. Please introduce yourself and highlight your academic/project backgrounds.";
            stage = 1;
        } else if (stage == 1) {
            feedback = "Good introduction. You highlighted your core projects well. Let's proceed to the Technical assessment phase.";
            nextQuestion = "Question 1: What is the difference between a Process and a Thread in Operating Systems, and how does multithreading improve app performance?";
            stage = 2;
        } else if (stage == 2) {
            feedback = "Clear answer! A process is a self-contained execution environment with its own memory space, whereas a thread is a lightweight execution unit sharing the process's memory.";
            nextQuestion = "Question 2: How do you handle database index optimization, and what is the difference between a clustered and non-clustered index?";
            stage = 3;
        } else if (stage == 3) {
            feedback = "Excellent technical detail! Clustered indexes define the physical ordering of database records, whereas non-clustered indexes create a separate logical ordering referencing physical locations.";
            nextQuestion = "Final Round (HR/Behavioral): Tell me about a time you faced a major obstacle during a technical project and how you resolved it.";
            stage = 4;
        } else if (stage == 4) {
            feedback = "Great breakdown of task resolution and teamwork. We have completed all the interview phases.";
            nextQuestion = "Interview Completed! Our AI system is calculating your final feedback scores...";
            isFinished = true;
            overallScore = 82; // Mock calculation
            stage = 5;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("stage", stage);
        response.put("nextQuestion", nextQuestion);
        response.put("feedback", feedback);
        response.put("isFinished", isFinished);
        if (isFinished) {
            response.put("overallScore", overallScore);
            response.put("performanceEvaluation", "Excellent technical knowledge and communication skills. Focus on explaining edge-case handling for system design queries.");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/mock-interview/save")
    public ResponseEntity<?> saveMockInterviewProgress(@RequestBody Map<String, Object> request) {
        User user = getAuthenticatedUser();
        Integer score = (Integer) request.get("score");
        String domain = (String) request.get("domain");

        ProgressTracking progress = new ProgressTracking();
        progress.setUserId(user.getId());
        progress.setEntityType("MOCK_INTERVIEW");
        progress.setEntityId(domain != null ? Math.abs(domain.hashCode()) : 0);
        progress.setStatus("COMPLETED");
        progress.setScore(score != null ? score : 0);
        progressTrackingRepository.save(progress);

        return ResponseEntity.ok(Map.of("success", true, "message", "Mock interview progress saved successfully"));
    }

    public static class MockInterviewRequest {
        private int stage;
        private String answer;
        private String field;

        public int getStage() { return stage; }
        public void setStage(int stage) { this.stage = stage; }

        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }

        public String getField() { return field; }
        public void setField(String field) { this.field = field; }
    }

    @PostMapping("/resume-match")
    public ResponseEntity<?> calculateResumeMatch(@RequestBody Map<String, String> body) {
        String resumeText = body.get("resumeText");
        String jobIdStr = body.get("jobId");
        String jobDescription = body.get("jobDescription");

        if (resumeText == null || resumeText.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Resume text is required");
        }

        String targetSkillsStr = "";
        String targetTitle = "Target Position";
        if (jobIdStr != null && !jobIdStr.trim().isEmpty()) {
            try {
                int jobId = Integer.parseInt(jobIdStr);
                Map<String, Object> job = jdbcTemplate.queryForMap("SELECT title, skills_required, description FROM jobs WHERE id = ?", jobId);
                targetSkillsStr = (String) job.get("skills_required");
                targetTitle = (String) job.get("title");
                if (jobDescription == null) {
                    jobDescription = (String) job.get("description");
                }
            } catch (Exception e) {
                // ignore and fall back
            }
        }

        if (targetSkillsStr.isEmpty() && jobDescription != null) {
            List<String> commonSkills = Arrays.asList("java", "python", "javascript", "react", "spring", "sql", "node", "aws", "docker", "kubernetes", "c++", "dsa", "oop");
            List<String> found = new ArrayList<>();
            for (String s : commonSkills) {
                if (jobDescription.toLowerCase().contains(s)) {
                    found.add(s);
                }
            }
            targetSkillsStr = String.join(", ", found);
        }

        if (targetSkillsStr.isEmpty()) {
            targetSkillsStr = "Java, React, SQL, Data Structures, Algorithms";
        }

        String[] required = targetSkillsStr.split(",");
        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        
        String cleanResume = resumeText.toLowerCase();

        for (String skill : required) {
            String trimmed = skill.trim();
            if (!trimmed.isEmpty()) {
                if (cleanResume.contains(trimmed.toLowerCase())) {
                    matched.add(trimmed);
                } else {
                    missing.add(trimmed);
                }
            }
        }

        int totalSkills = matched.size() + missing.size();
        int score = totalSkills > 0 ? (matched.size() * 100 / totalSkills) : 60;
        score = Math.max(10, Math.min(98, score + new Random().nextInt(15) - 5));

        Map<String, Object> response = new HashMap<>();
        response.put("score", score);
        response.put("jobTitle", targetTitle);
        response.put("matchedSkills", matched);
        response.put("missingSkills", missing);
        
        List<String> advice = new ArrayList<>();
        if (score < 60) {
            advice.add("Your resume does not closely align with the role. Add projects showcasing " + String.join(", ", missing) + ".");
            advice.add("Re-format section headings using industry standard terms (e.g. 'Work Experience' instead of 'My Career').");
        } else if (score < 80) {
            advice.add("Strong alignment. Improve by adding quantifiable impact statements to your projects (e.g. 'optimized API latency by 30%').");
            advice.add("Add certifications or coursework related to " + (missing.isEmpty() ? "System Design" : missing.get(0)) + ".");
        } else {
            advice.add("Excellent fit! Focus on brushing up on technical interview scenarios for " + targetTitle + ".");
            advice.add("Practice low-level design patterns and thread concurrency questions.");
        }
        response.put("improvementAdvice", advice);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/coach-questions")
    public ResponseEntity<?> getCoachQuestions(
            @RequestParam(required = false, defaultValue = "Google") String company,
            @RequestParam(required = false, defaultValue = "Software Engineer") String role) {

        List<Map<String, Object>> questions = new ArrayList<>();

        Map<String, Object> q1 = new HashMap<>();
        q1.put("type", "Data Structures & Algorithms");
        q1.put("question", "How would you design a system to find the top K most frequent keywords in a stream of real-time search queries at " + company + " scale?");
        q1.put("answerStrategy", "Use a Min-Heap of size K combined with a Hash Map to track occurrences. For real-time scale, consider distributed architectures like map-reduce, storm, or flink with count-min sketch algorithms.");
        q1.put("difficulty", "HARD");
        questions.add(q1);

        Map<String, Object> q2 = new HashMap<>();
        q2.put("type", "Object Oriented Design");
        q2.put("question", "Explain how you would design a Parking Lot system using SOLID principles. What classes and relationships would you define?");
        q2.put("answerStrategy", "Define key entities: ParkingLot, Level, ParkingSpot (base class for Compact, Large, Handicap), Vehicle (base class for Car, Truck, Bike), and Ticket. Use Factory Pattern for vehicle creation and Strategy Pattern for slot allocation policies.");
        q2.put("difficulty", "MEDIUM");
        questions.add(q2);

        Map<String, Object> q3 = new HashMap<>();
        q3.put("type", "System Design & Databases");
        q3.put("question", "How would you handle race conditions in database transactions during a heavy flash sale (e.g., ticket booking or swiggy checkout)?");
        q3.put("answerStrategy", "Explain Pessimistic Locking (SELECT FOR UPDATE) vs Optimistic Locking (version column check). For extreme scales, queue checkout requests in Redis/Kafka and process them asynchronously to decouple load.");
        q3.put("difficulty", "HARD");
        questions.add(q3);

        Map<String, Object> q4 = new HashMap<>();
        q4.put("type", "Behavioral (STAR Method)");
        q4.put("question", "Describe a situation where you had a disagreement with a team member or mentor on a technical decision. How did you resolve it?");
        q4.put("answerStrategy", "Focus on active listening, looking at objective facts, comparing pros/cons of both designs, doing a quick proof of concept to evaluate, and aligning under a consensus or 'agree to disagree and commit' philosophy.");
        q4.put("difficulty", "EASY");
        questions.add(q4);

        Map<String, Object> response = new HashMap<>();
        response.put("company", company);
        response.put("role", role);
        response.put("questions", questions);

        return ResponseEntity.ok(response);
    }
}
