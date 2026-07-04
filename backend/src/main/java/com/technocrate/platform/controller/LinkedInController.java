package com.technocrate.platform.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.technocrate.platform.model.Company;
import com.technocrate.platform.model.Job;
import com.technocrate.platform.model.LinkedInProfile;
import com.technocrate.platform.model.User;
import com.technocrate.platform.repository.CompanyRepository;
import com.technocrate.platform.repository.JobRepository;
import com.technocrate.platform.repository.LinkedInProfileRepository;
import com.technocrate.platform.repository.UserRepository;
import com.technocrate.platform.service.OpenAiLinkedInService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/linkedin")
public class LinkedInController {

    private final LinkedInProfileRepository linkedInProfileRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final OpenAiLinkedInService openAiLinkedInService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // LinkedIn URL pattern: linkedin.com/in/<username>
    private static final Pattern LINKEDIN_URL_PATTERN =
        Pattern.compile("^https?://(www\\.)?linkedin\\.com/in/[a-zA-Z0-9\\-_%]+/?.*$");

    public LinkedInController(LinkedInProfileRepository linkedInProfileRepository,
                              UserRepository userRepository,
                              JobRepository jobRepository,
                              CompanyRepository companyRepository,
                              OpenAiLinkedInService openAiLinkedInService) {
        this.linkedInProfileRepository = linkedInProfileRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.openAiLinkedInService = openAiLinkedInService;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/linkedin/profile  — fetch previously saved analysis for this user
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        User user = getAuthenticatedUser();
        Optional<LinkedInProfile> profileOpt = linkedInProfileRepository.findByUserId(user.getId());
        return profileOpt.map(ResponseEntity::ok)
                         .orElseGet(() -> ResponseEntity.ok().build());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/linkedin/validate-url  — validate LinkedIn URL format
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/validate-url")
    public ResponseEntity<?> validateUrl(@RequestBody Map<String, String> body) {
        String url = body.getOrDefault("url", "").trim();

        if (url.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "valid", false,
                "message", "Please enter a LinkedIn profile URL."
            ));
        }

        if (!LINKEDIN_URL_PATTERN.matcher(url).matches()) {
            return ResponseEntity.badRequest().body(Map.of(
                "valid", false,
                "message", "Invalid LinkedIn Profile URL. Please use the format: https://www.linkedin.com/in/your-name"
            ));
        }

        return ResponseEntity.ok(Map.of(
            "valid", true,
            "message", "Valid LinkedIn profile URL format."
        ));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/linkedin/analyze  — real AI analysis on submitted profile data
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeProfile(@RequestBody LinkedInAnalysisRequest request) {
        // 1. Re-validate URL
        if (request.getUrl() == null || !LINKEDIN_URL_PATTERN.matcher(request.getUrl().trim()).matches()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid LinkedIn Profile URL."
            ));
        }

        // 2. Validate that at least some real data was provided
        boolean hasData = isNotEmpty(request.getName())
            || isNotEmpty(request.getHeadline())
            || isNotEmpty(request.getSkills())
            || isNotEmpty(request.getAbout());
        if (!hasData) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Profile data is empty. Please fill in at least your Name, Headline, or Skills."
            ));
        }

        User user = getAuthenticatedUser();

        // 3. Build profile data map for AI analysis
        Map<String, Object> profileData = new LinkedHashMap<>();
        profileData.put("name",            safe(request.getName()));
        profileData.put("headline",        safe(request.getHeadline()));
        profileData.put("about",           safe(request.getAbout()));
        profileData.put("skills",          safe(request.getSkills()));
        profileData.put("experience",      safe(request.getExperience()));
        profileData.put("education",       safe(request.getEducation()));
        profileData.put("certifications",  safe(request.getCertifications()));
        profileData.put("projects",        safe(request.getProjects()));
        profileData.put("languages",       safe(request.getLanguages()));
        profileData.put("awards",          safe(request.getAwards()));
        profileData.put("volunteer",       safe(request.getVolunteer()));

        // 4. Run AI analysis (OpenAI or rule-based fallback)
        Map<String, Object> aiResult;
        try {
            aiResult = openAiLinkedInService.analyzeProfile(profileData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "AI analysis failed. Please try again."
            ));
        }

        // 5. Compute job & company matches from real DB
        List<String> skillsList = parseSkills(request.getSkills());
        Set<String> skillsLower = skillsList.stream().map(String::toLowerCase).collect(Collectors.toSet());

        List<Map<String, Object>> topJobMatches    = matchJobs(skillsLower);
        List<Map<String, Object>> topCompanyMatches = matchCompanies(skillsLower);

        // 6. Save to DB
        LinkedInProfile profile = new LinkedInProfile();
        profile.setUserId(user.getId());
        profile.setLinkedinUrl(request.getUrl());

        Integer profileScore = toInt(aiResult.get("profileScore"), 50);
        Integer atsScore     = toInt(aiResult.get("atsScore"), 50);
        profile.setProfileScore(profileScore);
        profile.setAtsScore(atsScore);
        profile.setSkillsExtracted(request.getSkills());
        profile.setMissingSkills(joinList(aiResult.get("missingKeywords")));
        profile.setSalaryPrediction(str(aiResult.get("salaryIndia")));
        profile.setHiringReadinessScore(toInt(aiResult.get("hiringReadinessScore"), 50));
        profile.setInterviewReadinessScore(toInt(aiResult.get("interviewReadinessScore"), 50));
        profile.setCertificationsSuggested(request.getCertifications());
        profile.setProjectsSuggested(request.getProjects());

        try {
            // Roadmap JSON
            Object roadmapObj = aiResult.get("roadmap");
            profile.setRoadmapJson(objectMapper.writeValueAsString(roadmapObj));

            // Optimization JSON
            Object optObj = aiResult.get("optimization");
            profile.setOptimizationJson(objectMapper.writeValueAsString(optObj));

            // Recruiter view JSON (include aiResult fields)
            Object recObj = aiResult.get("recruiterView");
            profile.setRecruiterViewJson(objectMapper.writeValueAsString(recObj));

            // Radar data JSON
            Object radarObj = aiResult.get("radarData");
            profile.setRadarDataJson(objectMapper.writeValueAsString(radarObj));

            // Role matches JSON (from real DB)
            profile.setRoleMatchesJson(objectMapper.writeValueAsString(Map.of(
                "jobMatches",     topJobMatches,
                "companyMatches", topCompanyMatches
            )));

            // Extra AI fields stored as part of roleMatchesJson extended info
            Map<String, Object> aiExtras = new LinkedHashMap<>();
            aiExtras.put("candidateSummary",       aiResult.get("candidateSummary"));
            aiExtras.put("careerStage",             aiResult.get("careerStage"));
            aiExtras.put("domain",                  aiResult.get("domain"));
            aiExtras.put("atsReasoning",            aiResult.get("atsReasoning"));
            aiExtras.put("missingKeywords",         aiResult.get("missingKeywords"));
            aiExtras.put("recommendedKeywords",     aiResult.get("recommendedKeywords"));
            aiExtras.put("salaryIndia",             aiResult.get("salaryIndia"));
            aiExtras.put("salaryUS",                aiResult.get("salaryUS"));
            aiExtras.put("salaryConfidence",        aiResult.get("salaryConfidence"));
            aiExtras.put("salaryReasoning",         aiResult.get("salaryReasoning"));
            aiExtras.put("missingSkills",           aiResult.get("missingSkills"));
            aiExtras.put("targetRole",              aiResult.get("targetRole"));
            aiExtras.put("skillsFound",             aiResult.get("skillsFound"));
            aiExtras.put("jobMatches",              topJobMatches);
            aiExtras.put("companyMatches",          topCompanyMatches);
            profile.setProfileDataJson(objectMapper.writeValueAsString(aiExtras));

            // Legacy job matches field
            String legacyJobMatches = topCompanyMatches.stream()
                .map(m -> m.get("companyName") + " (" + m.get("matchPercent") + "% Match)")
                .collect(Collectors.joining(", "));
            profile.setJobMatches(legacyJobMatches);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to serialize analysis results."
            ));
        }

        LinkedInProfile saved = linkedInProfileRepository.save(profile);
        return ResponseEntity.ok(saved);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE /api/linkedin/profile  — clear saved profile for re-analysis
    // ─────────────────────────────────────────────────────────────────────────
    @DeleteMapping("/profile")
    public ResponseEntity<?> clearProfile() {
        User user = getAuthenticatedUser();
        linkedInProfileRepository.findByUserId(user.getId()).ifPresent(linkedInProfileRepository::delete);
        return ResponseEntity.ok(Map.of("success", true));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────

    private List<Map<String, Object>> matchJobs(Set<String> userSkills) {
        List<Job> allJobs = jobRepository.findAll();
        List<Map<String, Object>> jobMatches = new ArrayList<>();
        for (Job j : allJobs) {
            Set<String> req = parseSkillSet(j.getSkillsRequired());
            int match = computeMatch(userSkills, req, 30);
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("jobId",       j.getId());
            m.put("jobTitle",    j.getTitle());
            m.put("companyName", j.getCompanyName());
            m.put("salary",      j.getSalaryRange());
            m.put("location",    j.getLocation());
            m.put("matchPercent", match);
            jobMatches.add(m);
        }
        jobMatches.sort((a, b) -> Integer.compare((int) b.get("matchPercent"), (int) a.get("matchPercent")));
        return jobMatches.stream().limit(4).collect(Collectors.toList());
    }

    private List<Map<String, Object>> matchCompanies(Set<String> userSkills) {
        List<Company> allCompanies = companyRepository.findAll();
        List<Map<String, Object>> companyMatches = new ArrayList<>();
        for (Company c : allCompanies) {
            Set<String> req = parseSkillSet(c.getRequiredSkills());
            int match = computeMatch(userSkills, req, 40);
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("companyId",   c.getId());
            m.put("companyName", c.getName());
            m.put("logoUrl",     c.getLogoUrl());
            m.put("matchPercent", match);
            companyMatches.add(m);
        }
        companyMatches.sort((a, b) -> Integer.compare((int) b.get("matchPercent"), (int) a.get("matchPercent")));
        return companyMatches.stream().limit(4).collect(Collectors.toList());
    }

    private int computeMatch(Set<String> user, Set<String> required, int baseline) {
        if (required.isEmpty()) return baseline;
        long hits = user.stream().filter(us ->
            required.stream().anyMatch(rs -> rs.contains(us) || us.contains(rs))
        ).count();
        int raw = (int) Math.round((double) hits / required.size() * 100);
        return Math.min(100, Math.max(baseline, raw + (user.size() > 5 ? 8 : 0)));
    }

    private Set<String> parseSkillSet(String raw) {
        if (raw == null || raw.isBlank()) return Collections.emptySet();
        return Arrays.stream(raw.split(",")).map(String::trim).map(String::toLowerCase)
                     .filter(s -> !s.isEmpty()).collect(Collectors.toSet());
    }

    private List<String> parseSkills(String raw) {
        if (raw == null || raw.isBlank()) return Collections.emptyList();
        return Arrays.stream(raw.split(",")).map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
    }

    private boolean isNotEmpty(String s) { return s != null && !s.trim().isEmpty(); }
    private String safe(String s)        { return s == null ? "" : s.trim(); }
    private String str(Object o)         { return o == null ? "" : o.toString(); }

    private Integer toInt(Object o, int def) {
        if (o == null) return def;
        try { return Integer.parseInt(o.toString()); } catch (Exception e) { return def; }
    }

    @SuppressWarnings("unchecked")
    private String joinList(Object o) {
        if (o == null) return "";
        if (o instanceof List) return String.join(", ", (List<String>) o);
        return o.toString();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Request DTO
    // ─────────────────────────────────────────────────────────────────────────
    public static class LinkedInAnalysisRequest {
        private String url;
        private String name;
        private String headline;
        private String about;
        private String skills;
        private String experience;
        private String education;
        private String certifications;
        private String projects;
        private String languages;
        private String awards;
        private String volunteer;

        public String getUrl()            { return url; }
        public void setUrl(String v)      { this.url = v; }
        public String getName()           { return name; }
        public void setName(String v)     { this.name = v; }
        public String getHeadline()       { return headline; }
        public void setHeadline(String v) { this.headline = v; }
        public String getAbout()          { return about; }
        public void setAbout(String v)    { this.about = v; }
        public String getSkills()         { return skills; }
        public void setSkills(String v)   { this.skills = v; }
        public String getExperience()     { return experience; }
        public void setExperience(String v) { this.experience = v; }
        public String getEducation()      { return education; }
        public void setEducation(String v){ this.education = v; }
        public String getCertifications() { return certifications; }
        public void setCertifications(String v) { this.certifications = v; }
        public String getProjects()       { return projects; }
        public void setProjects(String v) { this.projects = v; }
        public String getLanguages()      { return languages; }
        public void setLanguages(String v){ this.languages = v; }
        public String getAwards()         { return awards; }
        public void setAwards(String v)   { this.awards = v; }
        public String getVolunteer()      { return volunteer; }
        public void setVolunteer(String v){ this.volunteer = v; }
    }
}
