package com.technocrate.platform.controller;

import com.technocrate.platform.model.Company;
import com.technocrate.platform.model.InterviewQuestion;
import com.technocrate.platform.repository.CompanyRepository;
import com.technocrate.platform.repository.InterviewQuestionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyRepository companyRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;

    public CompanyController(CompanyRepository companyRepository, 
                             InterviewQuestionRepository interviewQuestionRepository) {
        this.companyRepository = companyRepository;
        this.interviewQuestionRepository = interviewQuestionRepository;
    }

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable int id) {
        Optional<Company> companyOpt = companyRepository.findById(id);
        if (companyOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(companyOpt.get());
    }

    @GetMapping("/{id}/prep")
    public ResponseEntity<?> getCompanyPreparation(@PathVariable int id) {
        Optional<Company> companyOpt = companyRepository.findById(id);
        if (companyOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<InterviewQuestion> questions = interviewQuestionRepository.findByCompanyId(id);
        return ResponseEntity.ok(questions);
    }

    @PostMapping
    public ResponseEntity<?> saveCompany(@RequestBody Company company) {
        // Safe check for role in SecurityConfig will block non-admin if configured,
        // but here we just write standard handler.
        Company saved = companyRepository.save(company);
        return ResponseEntity.ok(saved);
    }
}
