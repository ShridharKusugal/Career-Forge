package com.technocrate.platform.controller;

import com.technocrate.platform.model.Job;
import com.technocrate.platform.repository.JobRepository;
import com.technocrate.platform.service.JobAggregationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class JobController {

    private final JobRepository jobRepository;
    private final JobAggregationService jobAggregationService;

    public JobController(JobRepository jobRepository, JobAggregationService jobAggregationService) {
        this.jobRepository = jobRepository;
        this.jobAggregationService = jobAggregationService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String salary,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String experience,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer companyId) {
        
        List<Job> jobs;
        if (companyId != null) {
            jobs = jobRepository.findByCompanyId(companyId);
        } else {
            jobs = jobRepository.searchJobs(query, location, salary, type, industry, experience, sort);
        }
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable int id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getJobStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Count unique companies in jobs
        int activeJobs = jobRepository.countActiveJobs();
        int totalApplicants = jobRepository.countTotalApplicants();
        double avgPackage = jobRepository.getAveragePackage();
        
        stats.put("totalRecruiters", 35); // 35 default seeded companies
        stats.put("activeJobs", activeJobs);
        stats.put("applicantsCount", totalApplicants);
        stats.put("averagePackage", String.format("%.1f LPA", avgPackage));
        
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/admin/aggregate")
    public ResponseEntity<Map<String, Object>> triggerAggregation() {
        int added = jobAggregationService.aggregateAllJobs();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Job aggregation completed successfully.");
        response.put("jobsAdded", added);
        return ResponseEntity.ok(response);
    }
}
