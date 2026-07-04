package com.technocrate.platform.controller;

import com.technocrate.platform.model.JobApplication;
import com.technocrate.platform.model.Notification;
import com.technocrate.platform.repository.JobApplicationRepository;
import com.technocrate.platform.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ats")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AtsWebhookController {

    private final JobApplicationRepository jobApplicationRepository;
    private final NotificationRepository notificationRepository;
    private final JdbcTemplate jdbcTemplate;

    public AtsWebhookController(JobApplicationRepository jobApplicationRepository,
                                NotificationRepository notificationRepository,
                                JdbcTemplate jdbcTemplate) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.notificationRepository = notificationRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Endpoint to receive simulated webhooks from ATS systems.
     * Providers: greenhouse, lever, workday, successfactors, smartrecruiters, icims
     *
     * Example Greenhouse Payload:
     * {
     *   "email": "student@careerforge.com",
     *   "job_code": "ADOBE-FE-593",
     *   "event": "candidate.applied", // candidate.applied, assessment.sent, interview.scheduled, hired, rejected
     *   "details": "Submitted via Greenhouse Board"
     * }
     */
    @PostMapping("/webhook/{provider}")
    public ResponseEntity<?> receiveWebhook(
            @PathVariable String provider,
            @RequestBody Map<String, Object> payload) {

        String email = (String) payload.get("email");
        String jobCode = (String) payload.get("job_code");
        String event = (String) payload.get("event");
        String details = (String) payload.getOrDefault("details", "Triggered via webhook provider: " + provider);

        if (email == null || jobCode == null || event == null) {
            return ResponseEntity.badRequest().body("Required payload properties: email, job_code, event.");
        }

        // Locate application matching email and jobCode
        String selectSql = "SELECT ja.*, c.name AS company_name FROM job_applications ja " +
                           "JOIN companies c ON ja.company_id = c.id " +
                           "WHERE LOWER(ja.email) = ? AND LOWER(ja.job_code) = ?";
        List<JobApplication> apps = jdbcTemplate.query(selectSql, (rs, rowNum) -> {
            JobApplication ja = new JobApplication();
            ja.setId(rs.getInt("id"));
            ja.setUserId(rs.getInt("user_id"));
            ja.setCompanyId(rs.getInt("company_id"));
            ja.setCompanyName(rs.getString("company_name"));
            ja.setJobTitle(rs.getString("job_title"));
            ja.setJobCode(rs.getString("job_code"));
            ja.setEmail(rs.getString("email"));
            ja.setStatus(rs.getString("status"));
            return ja;
        }, email.toLowerCase().trim(), jobCode.toLowerCase().trim());

        if (apps.isEmpty()) {
            return ResponseEntity.badRequest().body("No application found matching candidate email: " + email + " and job code: " + jobCode);
        }

        JobApplication app = apps.get(0);
        String oldStatus = app.getStatus();
        String newStatus = oldStatus;
        String eventMessage = "";

        switch (event.toLowerCase()) {
            case "candidate.applied":
                newStatus = "APPLIED";
                eventMessage = "ATS " + provider + " webhook confirmed application submission.";
                break;
            case "assessment.sent":
                newStatus = "ASSESSMENT_RECEIVED";
                eventMessage = "ATS " + provider + " triggered technical assessment. Link sent to candidate.";
                break;
            case "interview.scheduled":
                newStatus = "INTERVIEW_SCHEDULED";
                eventMessage = "ATS " + provider + " confirmed interview schedule booking.";
                break;
            case "hired":
                newStatus = "OFFER_RECEIVED";
                eventMessage = "Congratulations! ATS " + provider + " moved candidate to Hired stage (Offer Generated).";
                break;
            case "rejected":
                newStatus = "REJECTED";
                eventMessage = "ATS " + provider + " marked application as Rejected / Archive.";
                break;
            default:
                eventMessage = "ATS Hook event '" + event + "' processed with details: " + details;
        }

        // Update application status
        app.setStatus(newStatus);
        jobApplicationRepository.save(app);

        // Record history log
        jdbcTemplate.update("INSERT INTO application_status_history (application_id, status, notes) VALUES (?, ?, ?)",
                app.getId(), newStatus, eventMessage + " Details: " + details);

        // Send notification
        Notification notification = new Notification();
        notification.setUserId(app.getUserId());
        notification.setTitle("ATS Hook Update: " + app.getCompanyName());
        notification.setMessage("Automatic update from " + provider + ": Status for '" + app.getJobTitle() + "' changed to " + newStatus);
        notification.setIsRead(false);
        notificationRepository.save(notification);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("provider", provider);
        response.put("applicationId", app.getId());
        response.put("oldStatus", oldStatus);
        response.put("newStatus", newStatus);
        response.put("log", eventMessage);
        return ResponseEntity.ok(response);
    }
}
