package com.technocrate.platform.controller;

import com.technocrate.platform.model.CodingProblem;
import com.technocrate.platform.model.Company;
import com.technocrate.platform.model.Course;
import com.technocrate.platform.model.InterviewQuestion;
import com.technocrate.platform.repository.CodingProblemRepository;
import com.technocrate.platform.repository.CompanyRepository;
import com.technocrate.platform.repository.CourseRepository;
import com.technocrate.platform.repository.InterviewQuestionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final CodingProblemRepository codingProblemRepository;
    private final CourseRepository courseRepository;
    private final CompanyRepository companyRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;

    public PublicController(CodingProblemRepository codingProblemRepository,
                            CourseRepository courseRepository,
                            CompanyRepository companyRepository,
                            InterviewQuestionRepository interviewQuestionRepository) {
        this.codingProblemRepository = codingProblemRepository;
        this.courseRepository = courseRepository;
        this.companyRepository = companyRepository;
        this.interviewQuestionRepository = interviewQuestionRepository;
    }

    @GetMapping("/coding")
    public ResponseEntity<?> getPublicCodingProblems() {
        List<CodingProblem> all = codingProblemRepository.findAll();
        // Return max 10 for preview, map to simple structure to avoid exposing full starter code/test cases
        List<Map<String, Object>> preview = all.stream().limit(10).map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("title", p.getTitle());
            map.put("difficulty", p.getDifficulty());
            map.put("topicTags", p.getTopicTags());
            map.put("description", p.getDescription());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(preview);
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getPublicCourses() {
        List<Course> all = courseRepository.findAll();
        List<Map<String, Object>> preview = all.stream().limit(10).map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("title", c.getTitle());
            map.put("description", c.getDescription());
            map.put("difficulty", c.getDifficulty());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(preview);
    }

    @GetMapping("/companies")
    public ResponseEntity<?> getPublicCompanies() {
        List<Company> all = companyRepository.findAll();
        List<Map<String, Object>> preview = all.stream().limit(10).map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("name", c.getName());
            map.put("logoUrl", c.getLogoUrl());
            map.put("hiringRoles", c.getHiringRoles());
            map.put("eligibility", c.getEligibility());
            map.put("requiredSkills", c.getRequiredSkills());
            map.put("hiringRounds", c.getHiringRounds());
            map.put("salaryPackage", c.getSalaryPackage());
            map.put("jobLocation", c.getJobLocation());
            map.put("applicationLink", c.getApplicationLink());
            map.put("lastDate", c.getLastDate());
            map.put("experienceLevel", c.getExperienceLevel());
            map.put("hiringTrends", c.getHiringTrends());
            map.put("jobPostsCount", c.getJobPostsCount());
            map.put("totalApplicants", c.getTotalApplicants());
            map.put("companyDescription", c.getCompanyDescription());
            map.put("industry", c.getIndustry());
            map.put("foundedYear", c.getFoundedYear());
            map.put("headquarters", c.getHeadquarters());
            map.put("employeeCount", c.getEmployeeCount());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(preview);
    }

    @GetMapping("/interviews")
    public ResponseEntity<?> getPublicInterviews() {
        List<InterviewQuestion> all = interviewQuestionRepository.findAll();
        if (all == null) {
            all = new ArrayList<>();
        }
        List<Map<String, Object>> preview = all.stream().limit(10).map(q -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", q.getId());
            map.put("question", q.getQuestion());
            map.put("difficulty", q.getDifficulty());
            map.put("type", q.getType());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(preview);
    }

    @GetMapping("/companies/{id}/prep")
    public ResponseEntity<?> getPublicCompanyPreparation(@PathVariable int id) {
        Optional<Company> companyOpt = companyRepository.findById(id);
        if (companyOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<InterviewQuestion> questions = interviewQuestionRepository.findByCompanyId(id);
        return ResponseEntity.ok(questions);
    }
}
