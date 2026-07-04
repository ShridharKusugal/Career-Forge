package com.technocrate.platform.controller;

import com.technocrate.platform.model.*;
import com.technocrate.platform.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;
    private final CompanyRepository companyRepository;
    private final CourseRepository courseRepository;
    private final DomainRepository domainRepository;
    private final MockTestRepository mockTestRepository;
    private final CodingProblemRepository codingProblemRepository;
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository,
                           InterviewQuestionRepository interviewQuestionRepository,
                           CompanyRepository companyRepository,
                           CourseRepository courseRepository,
                           DomainRepository domainRepository,
                           MockTestRepository mockTestRepository,
                           CodingProblemRepository codingProblemRepository,
                           JdbcTemplate jdbcTemplate,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.interviewQuestionRepository = interviewQuestionRepository;
        this.companyRepository = companyRepository;
        this.courseRepository = courseRepository;
        this.domainRepository = domainRepository;
        this.mockTestRepository = mockTestRepository;
        this.codingProblemRepository = codingProblemRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    // ─── DASHBOARD ANALYTICS ───────────────────────────────────────────────────

    @GetMapping("/analytics")
    public ResponseEntity<?> getSystemAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        Integer totalStudents = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE role = 'STUDENT'", Integer.class);
        analytics.put("totalStudents", totalStudents != null ? totalStudents : 0);

        Integer totalAdmins = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE role = 'ADMIN'", Integer.class);
        analytics.put("totalAdmins", totalAdmins != null ? totalAdmins : 0);

        Integer totalCompanies = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM companies", Integer.class);
        analytics.put("totalCompanies", totalCompanies != null ? totalCompanies : 0);

        Integer totalCourses = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM courses", Integer.class);
        analytics.put("totalCourses", totalCourses != null ? totalCourses : 0);

        Integer totalAssessments = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM mock_tests", Integer.class);
        analytics.put("totalAssessments", totalAssessments != null ? totalAssessments : 0);

        Integer totalCodingProblems = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM coding_problems", Integer.class);
        analytics.put("totalCodingProblems", totalCodingProblems != null ? totalCodingProblems : 0);

        Double avgMockScore = jdbcTemplate.queryForObject(
                "SELECT AVG(score) FROM progress_tracking WHERE entity_type = 'MOCK_TEST' AND status = 'COMPLETED'",
                Double.class);
        analytics.put("averageMockScore", avgMockScore != null ? Math.round(avgMockScore * 10.0) / 10.0 : 0.0);

        Integer totalSubmissions = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM progress_tracking WHERE status = 'COMPLETED'", Integer.class);
        analytics.put("totalSubmissions", totalSubmissions != null ? totalSubmissions : 0);

        // Domain popularity
        String domainSql = "SELECT d.name, COUNT(p.id) as enrollments " +
                "FROM progress_tracking p " +
                "JOIN courses c ON p.entity_id = c.id AND p.entity_type = 'COURSE' " +
                "JOIN domains d ON c.domain_id = d.id " +
                "GROUP BY d.id, d.name ORDER BY enrollments DESC";
        List<Map<String, Object>> popularDomains = jdbcTemplate.query(domainSql, (rs, rowNum) -> {
            Map<String, Object> row = new HashMap<>();
            row.put("name", rs.getString("name"));
            row.put("value", rs.getInt("enrollments"));
            return row;
        });
        if (popularDomains.isEmpty()) {
            popularDomains.add(Map.of("name", "Full Stack Dev", "value", 12));
            popularDomains.add(Map.of("name", "Software Eng", "value", 8));
            popularDomains.add(Map.of("name", "Data Analytics", "value", 5));
            popularDomains.add(Map.of("name", "Cyber Security", "value", 3));
        }
        analytics.put("domainPopularity", popularDomains);

        // Skills demanded
        String skillsSql = "SELECT required_skills FROM companies";
        List<String> rawSkills = jdbcTemplate.query(skillsSql, (rs, rowNum) -> rs.getString("required_skills"));
        Map<String, Integer> skillCounts = new HashMap<>();
        for (String skills : rawSkills) {
            if (skills != null) {
                for (String s : skills.split(",")) {
                    String clean = s.trim();
                    if (!clean.isEmpty()) {
                        skillCounts.put(clean, skillCounts.getOrDefault(clean, 0) + 1);
                    }
                }
            }
        }
        List<Map<String, Object>> demandedSkills = new ArrayList<>();
        skillCounts.forEach((skill, count) -> demandedSkills.add(Map.of("skill", skill, "count", count)));
        demandedSkills.sort((a, b) -> ((Integer) b.get("count")).compareTo((Integer) a.get("count")));
        analytics.put("demandedSkills", demandedSkills.subList(0, Math.min(6, demandedSkills.size())));

        // Recent user registrations (last 7 days)
        String recentUsersSql = "SELECT DATE(created_at) as reg_date, COUNT(*) as count " +
                "FROM users WHERE created_at >= NOW() - INTERVAL 7 DAY " +
                "GROUP BY DATE(created_at) ORDER BY reg_date ASC";
        List<Map<String, Object>> recentRegistrations;
        try {
            recentRegistrations = jdbcTemplate.query(recentUsersSql, (rs, rowNum) -> {
                Map<String, Object> row = new HashMap<>();
                row.put("date", rs.getString("reg_date"));
                row.put("count", rs.getInt("count"));
                return row;
            });
        } catch (Exception e) {
            recentRegistrations = new ArrayList<>();
        }
        analytics.put("recentRegistrations", recentRegistrations);

        return ResponseEntity.ok(analytics);
    }

    // ─── USER MANAGEMENT ────────────────────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String newRole = body.get("role");
        if (newRole == null || newRole.isBlank()) {
            return ResponseEntity.badRequest().body("Role is required");
        }
        try {
            int updated = jdbcTemplate.update(
                    "UPDATE users SET role = ? WHERE id = ?",
                    newRole.toUpperCase(), id);
            if (updated == 0) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(Map.of("message", "Role updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update role: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        try {
            jdbcTemplate.update("DELETE FROM progress_tracking WHERE user_id = ?", id);
            jdbcTemplate.update("DELETE FROM resumes WHERE user_id = ?", id);
            jdbcTemplate.update("DELETE FROM notifications WHERE user_id = ?", id);
            int deleted = jdbcTemplate.update("DELETE FROM users WHERE id = ?", id);
            if (deleted == 0) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete user: " + e.getMessage());
        }
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");
        String role = body.getOrDefault("role", "STUDENT");
        if (username == null || email == null || password == null) {
            return ResponseEntity.badRequest().body("username, email and password are required");
        }
        String hashed = passwordEncoder.encode(password);
        jdbcTemplate.update(
                "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
                username, email, hashed, role.toUpperCase());
        return ResponseEntity.ok(Map.of("message", "User created successfully"));
    }

    // ─── COMPANY MANAGEMENT ─────────────────────────────────────────────────────

    @GetMapping("/companies")
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyRepository.findAll());
    }

    @PostMapping("/companies")
    public ResponseEntity<?> createCompany(@RequestBody Company company) {
        Company saved = companyRepository.save(company);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/companies/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable Integer id, @RequestBody Company company) {
        company.setId(id);
        try {
            jdbcTemplate.update(
                "UPDATE companies SET name=?, logo_url=?, hiring_roles=?, eligibility=?, required_skills=?, " +
                "hiring_rounds=?, salary_package=?, job_location=?, application_link=?, experience_level=?, " +
                "hiring_trends=?, job_posts_count=?, total_applicants=?, company_description=?, industry=?, " +
                "founded_year=?, headquarters=?, employee_count=? WHERE id=?",
                company.getName(), company.getLogoUrl(), company.getHiringRoles(), company.getEligibility(),
                company.getRequiredSkills(), company.getHiringRounds(), company.getSalaryPackage(),
                company.getJobLocation(), company.getApplicationLink(), company.getExperienceLevel(),
                company.getHiringTrends(), company.getJobPostsCount(), company.getTotalApplicants(),
                company.getCompanyDescription(), company.getIndustry(), company.getFoundedYear(),
                company.getHeadquarters(), company.getEmployeeCount(), id
            );
            return ResponseEntity.ok(Map.of("message", "Company updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update company: " + e.getMessage());
        }
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable Integer id) {
        try {
            int deleted = jdbcTemplate.update("DELETE FROM companies WHERE id = ?", id);
            if (deleted == 0) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(Map.of("message", "Company deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete company: " + e.getMessage());
        }
    }

    // ─── COURSE / LEARNING MANAGEMENT ──────────────────────────────────────────

    @GetMapping("/courses")
    public ResponseEntity<?> getAllCourses() {
        String sql = "SELECT c.*, d.name as domain_name FROM courses c " +
                     "JOIN domains d ON c.domain_id = d.id ORDER BY c.id ASC";
        List<Map<String, Object>> courses = jdbcTemplate.queryForList(sql);
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/courses")
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        Course saved = courseRepository.save(course);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Integer id, @RequestBody Course course) {
        try {
            jdbcTemplate.update(
                "UPDATE courses SET domain_id=?, title=?, description=?, difficulty=?, " +
                "video_url=?, notes_path=?, assignment=?, project=? WHERE id=?",
                course.getDomainId(), course.getTitle(), course.getDescription(), course.getDifficulty(),
                course.getVideoUrl(), course.getNotesPath(), course.getAssignment(), course.getProject(), id
            );
            return ResponseEntity.ok(Map.of("message", "Course updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update course: " + e.getMessage());
        }
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Integer id) {
        try {
            jdbcTemplate.update("DELETE FROM progress_tracking WHERE entity_type='COURSE' AND entity_id=?", id);
            int deleted = jdbcTemplate.update("DELETE FROM courses WHERE id = ?", id);
            if (deleted == 0) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(Map.of("message", "Course deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete course: " + e.getMessage());
        }
    }

    @GetMapping("/domains")
    public ResponseEntity<?> getAllDomains() {
        return ResponseEntity.ok(domainRepository.findAll());
    }

    @PostMapping("/domains")
    public ResponseEntity<?> createDomain(@RequestBody Domain domain) {
        Domain saved = domainRepository.save(domain);
        return ResponseEntity.ok(saved);
    }

    // ─── ASSESSMENT / MOCK TEST MANAGEMENT ─────────────────────────────────────

    @GetMapping("/assessments")
    public ResponseEntity<List<MockTest>> getAllAssessments() {
        return ResponseEntity.ok(mockTestRepository.findAll());
    }

    @PostMapping("/assessments")
    public ResponseEntity<?> createAssessment(@RequestBody MockTest mockTest) {
        MockTest saved = mockTestRepository.save(mockTest);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/assessments/{id}")
    public ResponseEntity<?> updateAssessment(@PathVariable Integer id, @RequestBody MockTest mockTest) {
        try {
            jdbcTemplate.update(
                "UPDATE mock_tests SET title=?, type=?, duration_minutes=?, questions=?, company_id=?, category=? WHERE id=?",
                mockTest.getTitle(), mockTest.getType(), mockTest.getDurationMinutes(),
                mockTest.getQuestions(), mockTest.getCompanyId(), mockTest.getCategory(), id
            );
            return ResponseEntity.ok(Map.of("message", "Assessment updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update assessment: " + e.getMessage());
        }
    }

    @DeleteMapping("/assessments/{id}")
    public ResponseEntity<?> deleteAssessment(@PathVariable Integer id) {
        try {
            jdbcTemplate.update("DELETE FROM progress_tracking WHERE entity_type='MOCK_TEST' AND entity_id=?", id);
            int deleted = jdbcTemplate.update("DELETE FROM mock_tests WHERE id = ?", id);
            if (deleted == 0) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(Map.of("message", "Assessment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete assessment: " + e.getMessage());
        }
    }

    // ─── CODING PROBLEM MANAGEMENT ──────────────────────────────────────────────

    @GetMapping("/coding-problems")
    public ResponseEntity<List<CodingProblem>> getAllCodingProblems() {
        return ResponseEntity.ok(codingProblemRepository.findAll());
    }

    @PostMapping("/coding-problems")
    public ResponseEntity<?> createCodingProblem(@RequestBody CodingProblem problem) {
        CodingProblem saved = codingProblemRepository.save(problem);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/coding-problems/{id}")
    public ResponseEntity<?> updateCodingProblem(@PathVariable Integer id, @RequestBody CodingProblem problem) {
        try {
            jdbcTemplate.update(
                "UPDATE coding_problems SET title=?, description=?, difficulty=?, company_id=?, " +
                "test_cases=?, starter_code=?, topic_tags=?, hints=?, solution_explanation=?, " +
                "time_complexity=?, space_complexity=? WHERE id=?",
                problem.getTitle(), problem.getDescription(), problem.getDifficulty(),
                problem.getCompanyId(), problem.getTestCases(), problem.getStarterCode(),
                problem.getTopicTags(), problem.getHints(), problem.getSolutionExplanation(),
                problem.getTimeComplexity(), problem.getSpaceComplexity(), id
            );
            return ResponseEntity.ok(Map.of("message", "Problem updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update problem: " + e.getMessage());
        }
    }

    @DeleteMapping("/coding-problems/{id}")
    public ResponseEntity<?> deleteCodingProblem(@PathVariable Integer id) {
        try {
            jdbcTemplate.update("DELETE FROM progress_tracking WHERE entity_type='CODING_PROBLEM' AND entity_id=?", id);
            int deleted = jdbcTemplate.update("DELETE FROM coding_problems WHERE id = ?", id);
            if (deleted == 0) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(Map.of("message", "Problem deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete problem: " + e.getMessage());
        }
    }

    // ─── INTERVIEW QUESTIONS ────────────────────────────────────────────────────

    @GetMapping("/interview-questions")
    public ResponseEntity<?> getAllInterviewQuestions() {
        return ResponseEntity.ok(interviewQuestionRepository.findAll());
    }

    @PostMapping("/interview-questions")
    public ResponseEntity<?> addInterviewQuestion(@RequestBody InterviewQuestion question) {
        InterviewQuestion saved = interviewQuestionRepository.save(question);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/interview-questions/{id}")
    public ResponseEntity<?> deleteInterviewQuestion(@PathVariable Integer id) {
        try {
            int deleted = jdbcTemplate.update("DELETE FROM interview_questions WHERE id = ?", id);
            if (deleted == 0) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(Map.of("message", "Question deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete question: " + e.getMessage());
        }
    }

    // ─── PLATFORM STATS SUMMARY ─────────────────────────────────────────────────

    @GetMapping("/stats")
    public ResponseEntity<?> getPlatformStats() {
        Map<String, Object> stats = new HashMap<>();
        try {
            stats.put("users", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class));
            stats.put("companies", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM companies", Integer.class));
            stats.put("courses", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM courses", Integer.class));
            stats.put("assessments", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM mock_tests", Integer.class));
            stats.put("codingProblems", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM coding_problems", Integer.class));
            stats.put("completedSubmissions", jdbcTemplate.queryForObject("SELECT COUNT(*) FROM progress_tracking WHERE status='COMPLETED'", Integer.class));
        } catch (Exception e) {
            stats.put("error", e.getMessage());
        }
        return ResponseEntity.ok(stats);
    }
}
