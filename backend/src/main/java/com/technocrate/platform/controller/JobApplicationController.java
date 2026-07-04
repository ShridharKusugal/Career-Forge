package com.technocrate.platform.controller;

import com.technocrate.platform.model.Company;
import com.technocrate.platform.model.Job;
import com.technocrate.platform.model.JobApplication;
import com.technocrate.platform.model.Notification;
import com.technocrate.platform.model.User;
import com.technocrate.platform.repository.CompanyRepository;
import com.technocrate.platform.repository.JobApplicationRepository;
import com.technocrate.platform.repository.JobRepository;
import com.technocrate.platform.repository.NotificationRepository;
import com.technocrate.platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class JobApplicationController {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final JdbcTemplate jdbcTemplate;

    public JobApplicationController(JobApplicationRepository jobApplicationRepository,
                                    UserRepository userRepository,
                                    NotificationRepository notificationRepository,
                                    CompanyRepository companyRepository,
                                    JobRepository jobRepository,
                                    JdbcTemplate jdbcTemplate) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestBody JobApplication request) {
        User user = getAuthenticatedUser();
        
        Integer companyId = request.getCompanyId();
        String jobTitle = request.getJobTitle();
        String jobCode = request.getJobCode();
        Integer jobId = request.getJobId();

        if (jobId != null) {
            Optional<Job> jobOpt = jobRepository.findById(jobId);
            if (jobOpt.isPresent()) {
                Job job = jobOpt.get();
                companyId = job.getCompanyId();
                jobTitle = job.getTitle();
                jobCode = job.getJobCode();
            }
        }

        if (companyId == null || jobTitle == null || jobTitle.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Company ID and Job Title are required.");
        }

        // Fetch company details to get the exact name
        Optional<Company> companyOpt = companyRepository.findById(companyId);
        if (companyOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid Company ID.");
        }
        Company company = companyOpt.get();

        JobApplication ja = new JobApplication();
        ja.setUserId(user.getId());
        ja.setCompanyId(company.getId());
        ja.setJobId(jobId);
        ja.setJobTitle(jobTitle);
        ja.setJobCode(jobCode);
        ja.setFullName(request.getFullName() != null ? request.getFullName() : user.getUsername());
        ja.setEmail(request.getEmail() != null ? request.getEmail() : user.getEmail());
        ja.setPhone(request.getPhone());
        ja.setGithubUrl(request.getGithubUrl());
        ja.setLinkedinUrl(request.getLinkedinUrl());
        ja.setResumeText(request.getResumeText());
        ja.setCoverLetter(request.getCoverLetter());
        ja.setStatus(request.getStatus() != null ? request.getStatus() : "STARTED");
        ja.setClickedAt(LocalDateTime.now());

        JobApplication saved = jobApplicationRepository.save(ja);

        // Log status history
        jdbcTemplate.update("INSERT INTO application_status_history (application_id, status, notes) VALUES (?, ?, ?)",
            saved.getId(), saved.getStatus(), "Application session initiated");

        // Increment company's applicant count
        if (company.getTotalApplicants() == null) {
            company.setTotalApplicants(1);
        } else {
            company.setTotalApplicants(company.getTotalApplicants() + 1);
        }
        companyRepository.save(company);

        // Send a notification to the student
        Notification notification = new Notification();
        notification.setUserId(user.getId());
        notification.setTitle("Application Session Started: " + company.getName());
        notification.setMessage("You started the application process for the role of '" + jobTitle + 
                                "' at " + company.getName() + ". Please complete it on the company site.");
        notification.setIsRead(false);
        notificationRepository.save(notification);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<JobApplication>> getMyApplications() {
        User user = getAuthenticatedUser();
        List<JobApplication> apps;
        if ("ADMIN".equals(user.getRole())) {
            apps = jobApplicationRepository.findAll();
        } else {
            apps = jobApplicationRepository.findByUserId(user.getId());
        }
        return ResponseEntity.ok(apps);
    }

    @GetMapping("/applications/{id}/details")
    public ResponseEntity<?> getApplicationDetails(@PathVariable int id) {
        User user = getAuthenticatedUser();
        Optional<JobApplication> appOpt = jobApplicationRepository.findById(id);
        if (appOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        JobApplication app = appOpt.get();
        if (!"ADMIN".equals(user.getRole()) && !app.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Access denied");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("application", app);

        // Fetch status history
        List<Map<String, Object>> history = jdbcTemplate.queryForList(
            "SELECT * FROM application_status_history WHERE application_id = ? ORDER BY updated_at ASC", id);
        result.put("history", history);

        // Fetch interviews
        List<Map<String, Object>> interviews = jdbcTemplate.queryForList(
            "SELECT * FROM interviews WHERE application_id = ? ORDER BY scheduled_time ASC", id);
        result.put("interviews", interviews);

        // Fetch assessments
        List<Map<String, Object>> assessments = jdbcTemplate.queryForList(
            "SELECT * FROM assessments WHERE application_id = ? ORDER BY received_at ASC", id);
        result.put("assessments", assessments);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/applications/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable int id, @RequestBody Map<String, String> body) {
        User user = getAuthenticatedUser();
        Optional<JobApplication> appOpt = jobApplicationRepository.findById(id);
        if (appOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        JobApplication app = appOpt.get();
        if (!"ADMIN".equals(user.getRole()) && !app.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Access denied");
        }

        String newStatus = body.get("status");
        String notes = body.getOrDefault("notes", "Status updated");
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Status is required");
        }

        app.setStatus(newStatus.toUpperCase());
        jobApplicationRepository.save(app);

        // Log history
        jdbcTemplate.update("INSERT INTO application_status_history (application_id, status, notes) VALUES (?, ?, ?)",
            id, newStatus.toUpperCase(), notes);

        // Send a notification
        Notification notification = new Notification();
        notification.setUserId(app.getUserId());
        notification.setTitle("Application Status Updated: " + app.getCompanyName());
        notification.setMessage("Your application status for '" + app.getJobTitle() + "' at " + app.getCompanyName() + " was updated to " + newStatus.toUpperCase());
        notification.setIsRead(false);
        notificationRepository.save(notification);

        return ResponseEntity.ok(app);
    }
}
