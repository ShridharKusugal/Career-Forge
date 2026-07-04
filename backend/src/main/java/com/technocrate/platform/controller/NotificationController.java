package com.technocrate.platform.controller;

import com.technocrate.platform.model.Notification;
import com.technocrate.platform.model.User;
import com.technocrate.platform.repository.NotificationRepository;
import com.technocrate.platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationController(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications() {
        User user = getAuthenticatedUser();
        
        // Mock seeding if empty to show student something immediately!
        List<Notification> list = notificationRepository.findByUserId(user.getId());
        if (list.isEmpty()) {
            Notification n1 = new Notification();
            n1.setUserId(user.getId());
            n1.setTitle("New Hiring Alert: Google Software Engineer");
            n1.setMessage("Google is hiring B.Tech/MCA freshers for Software Engineer roles. Last date: June 30. Check Details!");
            notificationRepository.save(n1);

            Notification n2 = new Notification();
            n2.setUserId(user.getId());
            n2.setTitle("Daily Preparation Streak!");
            n2.setMessage("You've maintained a 3-day learning streak. Keep practicing coding to boost your score!");
            notificationRepository.save(n2);

            list = notificationRepository.findByUserId(user.getId());
        }

        return ResponseEntity.ok(list);
    }

    @PostMapping("/read")
    public ResponseEntity<?> markAsRead() {
        User user = getAuthenticatedUser();
        notificationRepository.markAllAsRead(user.getId());
        return ResponseEntity.ok("All notifications marked as read.");
    }
}
