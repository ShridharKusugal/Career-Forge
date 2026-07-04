package com.technocrate.platform.controller;

import com.technocrate.platform.model.JobApplication;
import com.technocrate.platform.model.Notification;
import com.technocrate.platform.model.User;
import com.technocrate.platform.repository.JobApplicationRepository;
import com.technocrate.platform.repository.NotificationRepository;
import com.technocrate.platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class EmailSyncController {

    private final UserRepository userRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final NotificationRepository notificationRepository;
    private final JdbcTemplate jdbcTemplate;

    public EmailSyncController(UserRepository userRepository,
                               JobApplicationRepository jobApplicationRepository,
                               NotificationRepository notificationRepository,
                               JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.notificationRepository = notificationRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @PostMapping("/connect")
    public ResponseEntity<?> connectEmail(@RequestBody Map<String, String> body) {
        User user = getAuthenticatedUser();
        String provider = body.get("provider");
        String emailAddress = body.get("emailAddress");

        if (provider == null || emailAddress == null) {
            return ResponseEntity.badRequest().body("Provider and email address are required.");
        }

        // Check if already integrated
        List<Map<String, Object>> existing = jdbcTemplate.queryForList(
                "SELECT * FROM email_integrations WHERE user_id = ? AND provider = ?", user.getId(), provider);
        
        if (existing.isEmpty()) {
            String sql = "INSERT INTO email_integrations (user_id, provider, email_address, access_token, refresh_token) VALUES (?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, user.getId(), provider, emailAddress, "mock_access_token", "mock_refresh_token");
        } else {
            String sql = "UPDATE email_integrations SET email_address = ?, last_synced_at = ? WHERE user_id = ? AND provider = ?";
            jdbcTemplate.update(sql, emailAddress, null, user.getId(), provider);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Simulated OAuth connection to " + provider + " complete.");
        response.put("email", emailAddress);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<?> getIntegrationStatus() {
        User user = getAuthenticatedUser();
        List<Map<String, Object>> integrations = jdbcTemplate.queryForList(
                "SELECT id, provider, email_address, connected_at, last_synced_at FROM email_integrations WHERE user_id = ?", user.getId());
        return ResponseEntity.ok(integrations);
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncEmails() {
        User user = getAuthenticatedUser();
        
        // Find integrations
        List<Map<String, Object>> integrations = jdbcTemplate.queryForList(
                "SELECT provider, email_address FROM email_integrations WHERE user_id = ?", user.getId());
        if (integrations.isEmpty()) {
            return ResponseEntity.badRequest().body("No email accounts integrated. Please connect a Gmail or Outlook account first.");
        }
        
        String connectedEmail = (String) integrations.get(0).get("email_address");

        // Fetch user's active applications
        List<JobApplication> apps = jobApplicationRepository.findByUserId(user.getId());
        List<Map<String, Object>> syncedEmailsLog = new ArrayList<>();
        int statusUpdatesCount = 0;

        for (JobApplication app : apps) {
            String currentStatus = app.getStatus();

            // Case 1: Application just started (STARTED). Sync will transition it to APPLIED
            if ("STARTED".equalsIgnoreCase(currentStatus)) {
                app.setStatus("APPLIED");
                jobApplicationRepository.save(app);
                
                // Add status history
                jdbcTemplate.update("INSERT INTO application_status_history (application_id, status, notes) VALUES (?, ?, ?)",
                        app.getId(), "APPLIED", "Auto-verified via email keyword matches: 'submission received'");

                // Add to email simulation logs
                Map<String, Object> emailLog = new HashMap<>();
                emailLog.put("from", "careers@" + app.getCompanyName().toLowerCase().replace(" ", "") + ".com");
                emailLog.put("subject", "Application Confirmation - " + app.getJobTitle() + " (" + app.getJobCode() + ")");
                emailLog.put("body", "Hi " + app.getFullName() + ", thank you for applying for the role of " + app.getJobTitle() + ". We have received your application and will review it shortly.");
                emailLog.put("receivedAt", LocalDateTime.now().minusHours(2));
                emailLog.put("resolvedAction", "Status updated to APPLIED");
                syncedEmailsLog.add(emailLog);
                
                statusUpdatesCount++;

                // Notify user
                sendNotification(user.getId(), "Application Confirmed: " + app.getCompanyName(), 
                        "We found an email confirmation. Your application for '" + app.getJobTitle() + "' has been verified!");
            }
            
            // Case 2: Application is APPLIED. Sync will transition it to ASSESSMENT_RECEIVED
            else if ("APPLIED".equalsIgnoreCase(currentStatus) && randomChoice()) {
                app.setStatus("ASSESSMENT_RECEIVED");
                jobApplicationRepository.save(app);

                // Add status history
                jdbcTemplate.update("INSERT INTO application_status_history (application_id, status, notes) VALUES (?, ?, ?)",
                        app.getId(), "ASSESSMENT_RECEIVED", "Auto-verified via email keyword matches: 'Online Assessment'");

                // Add mock assessment
                String testUrl = "https://codesignal.com/test-invite/" + UUID.randomUUID().toString().substring(0, 8);
                String testName = app.getCompanyName() + " Technical Hackathon Round";
                jdbcTemplate.update("INSERT INTO assessments (application_id, user_id, test_name, received_at, deadline, status, test_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        app.getId(), user.getId(), testName, new Date(), new Date(System.currentTimeMillis() + 86400000 * 3), "RECEIVED", testUrl);

                // Add to logs
                Map<String, Object> emailLog = new HashMap<>();
                emailLog.put("from", "recruiting@" + app.getCompanyName().toLowerCase().replace(" ", "") + ".com");
                emailLog.put("subject", "Action Required: Complete Coding Test for " + app.getJobTitle());
                emailLog.put("body", "Dear candidate, please complete the online assessment on CodeSignal. Link: " + testUrl + ". The deadline is within 3 days.");
                emailLog.put("receivedAt", LocalDateTime.now().minusMinutes(45));
                emailLog.put("resolvedAction", "Assessment scheduled: " + testName);
                syncedEmailsLog.add(emailLog);

                statusUpdatesCount++;

                sendNotification(user.getId(), "New Assessment: " + app.getCompanyName(), 
                        "You received a coding assessment for '" + app.getJobTitle() + "'! Check your tracking dashboard.");
            }
            
            // Case 3: Assessment is RECEIVED. Sync will transition it to INTERVIEW_SCHEDULED
            else if ("ASSESSMENT_RECEIVED".equalsIgnoreCase(currentStatus) && randomChoice()) {
                // First simulate completing the assessment with a score
                jdbcTemplate.update("UPDATE assessments SET score = ?, status = 'COMPLETED' WHERE application_id = ?", 85 + new Random().nextInt(15), app.getId());
                
                app.setStatus("INTERVIEW_SCHEDULED");
                jobApplicationRepository.save(app);

                // Add status history
                jdbcTemplate.update("INSERT INTO application_status_history (application_id, status, notes) VALUES (?, ?, ?)",
                        app.getId(), "INTERVIEW_SCHEDULED", "Auto-verified via email invitation keywords: 'Interview scheduled'");

                // Add mock interview
                String meetUrl = "https://meet.google.com/" + UUID.randomUUID().toString().substring(0, 4) + "-" + UUID.randomUUID().toString().substring(0, 3) + "-" + UUID.randomUUID().toString().substring(0, 3);
                String roundName = "Technical Interview 1 (System Design & Code)";
                jdbcTemplate.update("INSERT INTO interviews (application_id, user_id, round_name, scheduled_time, status, meeting_link) VALUES (?, ?, ?, ?, ?, ?)",
                        app.getId(), user.getId(), roundName, new java.sql.Timestamp(System.currentTimeMillis() + 86400000 * 2), "SCHEDULED", meetUrl);

                // Add to logs
                Map<String, Object> emailLog = new HashMap<>();
                emailLog.put("from", "talent@" + app.getCompanyName().toLowerCase().replace(" ", "") + ".com");
                emailLog.put("subject", "Interview Scheduled: " + app.getCompanyName() + " x " + app.getJobTitle());
                emailLog.put("body", "Hi, we are pleased to invite you for a virtual interview. Round details: " + roundName + ". Meeting link: " + meetUrl);
                emailLog.put("receivedAt", LocalDateTime.now().minusMinutes(10));
                emailLog.put("resolvedAction", "Interview booked: " + roundName);
                syncedEmailsLog.add(emailLog);

                statusUpdatesCount++;

                sendNotification(user.getId(), "Interview Scheduled: " + app.getCompanyName(), 
                        "Your interview for '" + app.getJobTitle() + "' has been scheduled! Google Meet link attached.");
            }
        }

        // Update last synced time
        jdbcTemplate.update("UPDATE email_integrations SET last_synced_at = ? WHERE user_id = ?", new Date(), user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("syncedCount", syncedEmailsLog.size());
        response.put("updatesCount", statusUpdatesCount);
        response.put("logs", syncedEmailsLog);
        return ResponseEntity.ok(response);
    }

    private boolean randomChoice() {
        return new Random().nextDouble() > 0.4;
    }

    private void sendNotification(int userId, String title, String msg) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(msg);
        notification.setIsRead(false);
        notificationRepository.save(notification);
    }
}
