package com.technocrate.platform.controller;

import com.technocrate.platform.model.Resume;
import com.technocrate.platform.model.User;
import com.technocrate.platform.repository.ResumeRepository;
import com.technocrate.platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeController(ResumeRepository resumeRepository, UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<Resume>> getResumes() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(resumeRepository.findByUserId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResumeById(@PathVariable int id) {
        Optional<Resume> resumeOpt = resumeRepository.findById(id);
        if (resumeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(resumeOpt.get());
    }

    @PostMapping
    public ResponseEntity<?> saveResume(@RequestBody Resume resume) {
        User user = getAuthenticatedUser();
        resume.setUserId(user.getId());

        // Perform ATS scoring simulation
        int score = 40;
        List<String> suggestions = new ArrayList<>();

        if (resume.getSkills() != null && !resume.getSkills().trim().isEmpty()) {
            int skillsCount = resume.getSkills().split(",").length;
            score += Math.min(25, skillsCount * 3);
            if (skillsCount < 5) {
                suggestions.add("Add at least 5-8 relevant core technical skills.");
            }
        } else {
            suggestions.add("Skills section is empty! Please list your programming languages and technologies.");
        }

        if (resume.getExperience() != null && !resume.getExperience().trim().isEmpty() && resume.getExperience().length() > 20) {
            score += 20;
        } else {
            suggestions.add("No professional experience listed. Add internships, training, or open-source contributions.");
        }

        if (resume.getProjects() != null && !resume.getProjects().trim().isEmpty() && resume.getProjects().length() > 20) {
            score += 15;
        } else {
            suggestions.add("List at least 2 technical projects with your core tech stack.");
        }

        if (resume.getEducation() != null && !resume.getEducation().trim().isEmpty()) {
            score += 10;
            if (resume.getEducation().contains("CGPA") || resume.getEducation().contains("%")) {
                score += 10;
            } else {
                suggestions.add("Specify your grade details (GPA or percentage) in the education section.");
            }
        } else {
            suggestions.add("Add your academic qualification details.");
        }

        score = Math.min(100, score);
        if (resume.getAtsScore() <= 0) {
            resume.setAtsScore(score);
        }
        if (resume.getSuggestions() == null || resume.getSuggestions().trim().isEmpty() || resume.getSuggestions().equals("Excellent! Your resume is highly optimized for applicant tracking systems.")) {
            if (suggestions.isEmpty()) {
                resume.setSuggestions("Excellent! Your resume is highly optimized for applicant tracking systems.");
            } else {
                resume.setSuggestions(String.join(" | ", suggestions));
            }
        }

        Resume saved = resumeRepository.save(resume);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable int id) {
        resumeRepository.delete(id);
        return ResponseEntity.ok().build();
    }
}
