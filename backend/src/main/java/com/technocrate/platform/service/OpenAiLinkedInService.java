package com.technocrate.platform.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Service
public class OpenAiLinkedInService {

    @Value("${openai.api.key:}")
    private String openAiKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String openAiModel;

    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    /**
     * Analyze a LinkedIn profile using OpenAI GPT or the rule-based fallback.
     * Returns a structured map with all analysis fields.
     */
    public Map<String, Object> analyzeProfile(Map<String, Object> profileData) {
        if (openAiKey != null && !openAiKey.isBlank()) {
            try {
                return callOpenAi(profileData);
            } catch (Exception e) {
                System.err.println("[OpenAiLinkedInService] OpenAI call failed, using fallback: " + e.getMessage());
            }
        }
        return ruleBasedAnalysis(profileData);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // OpenAI Integration
    // ─────────────────────────────────────────────────────────────────────────

    private Map<String, Object> callOpenAi(Map<String, Object> profileData) throws Exception {
        String profileJson = mapper.writeValueAsString(profileData);

        String systemPrompt = """
            You are an expert AI career intelligence engine for a professional hiring platform.
            Analyze the given LinkedIn profile data and return a JSON object ONLY (no markdown, no explanation).
            
            Return this exact JSON structure:
            {
              "candidateSummary": "2-3 sentence professional AI summary of the candidate",
              "careerStage": "one of: Student | Fresher | Junior Developer | Mid-Level Engineer | Senior Engineer | Architect | Manager",
              "domain": "one of: Frontend | Backend | Full Stack | Data Science | AI/ML | DevOps | Cybersecurity | Cloud | Mobile Development | General Engineering",
              "atsScore": <integer 0-100>,
              "atsReasoning": "brief explanation of ATS score",
              "missingKeywords": ["keyword1", "keyword2"],
              "recommendedKeywords": ["keyword1", "keyword2"],
              "profileScore": <integer 0-100>,
              "salaryIndia": "e.g. ₹6 LPA – ₹10 LPA",
              "salaryUS": "e.g. $70k – $120k",
              "salaryConfidence": <integer 0-100>,
              "salaryReasoning": "brief explanation",
              "hiringReadinessScore": <integer 0-100>,
              "interviewReadinessScore": <integer 0-100>,
              "skillsFound": ["skill1", "skill2"],
              "missingSkills": [{"skill": "React", "priority": "High"}, {"skill": "Docker", "priority": "Medium"}],
              "targetRole": "Primary role title to target",
              "roadmap": {
                "estimatedTime": "e.g. 3 Months",
                "milestones": [
                  {"phase": "Month 1", "task": "description"},
                  {"phase": "Month 2-3", "task": "description"}
                ]
              },
              "optimization": {
                "currentHeadline": "the actual headline from profile",
                "recommendedHeadline": "optimized ATS-friendly headline",
                "aboutEvaluation": "evaluation of existing about section",
                "improvedAbout": "AI-rewritten improved about section",
                "experienceSuggestions": ["suggestion1", "suggestion2", "suggestion3"]
              },
              "recruiterView": {
                "weakSections": ["section1", "section2"],
                "strengthAreas": ["area1", "area2"],
                "missingKeywords": ["keyword1"]
              },
              "radarData": [
                {"subject": "Programming", "A": <0-100>},
                {"subject": "DSA", "A": <0-100>},
                {"subject": "Database", "A": <0-100>},
                {"subject": "Cloud", "A": <0-100>},
                {"subject": "AI/ML", "A": <0-100>},
                {"subject": "System Design", "A": <0-100>},
                {"subject": "Communication", "A": <0-100>}
              ]
            }
            """;

        String userPrompt = "Analyze this LinkedIn profile data:\n" + profileJson;

        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("model", openAiModel);
        requestBody.put("response_format", Map.of("type", "json_object"));
        requestBody.put("messages", List.of(
            Map.of("role", "system", "content", systemPrompt),
            Map.of("role", "user", "content", userPrompt)
        ));
        requestBody.put("temperature", 0.3);
        requestBody.put("max_tokens", 2000);

        String bodyJson = mapper.writeValueAsString(requestBody);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.openai.com/v1/chat/completions"))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + openAiKey)
            .POST(HttpRequest.BodyPublishers.ofString(bodyJson))
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("OpenAI API error: " + response.statusCode() + " " + response.body());
        }

        JsonNode root = mapper.readTree(response.body());
        String content = root.path("choices").get(0).path("message").path("content").asText();
        return mapper.readValue(content, Map.class);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Rule-Based Fallback (no OpenAI key needed)
    // ─────────────────────────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private Map<String, Object> ruleBasedAnalysis(Map<String, Object> profile) {
        String name = str(profile, "name");
        String headline = str(profile, "headline").toLowerCase();
        String about = str(profile, "about");
        String skillsRaw = str(profile, "skills");
        String experienceRaw = str(profile, "experience");
        String education = str(profile, "education");
        String certifications = str(profile, "certifications");
        String projects = str(profile, "projects");
        String languages = str(profile, "languages");

        // Parse skills
        Set<String> skillsLower = new HashSet<>();
        List<String> skillsList = new ArrayList<>();
        for (String s : skillsRaw.split(",")) {
            String t = s.trim();
            if (!t.isEmpty()) {
                skillsList.add(t);
                skillsLower.add(t.toLowerCase());
            }
        }

        // ── Domain & Career Stage Detection ──────────────────────────────────
        String domain = detectDomain(skillsLower, headline);
        String careerStage = detectCareerStage(headline, experienceRaw, education);
        String targetRole = getTargetRole(domain);

        // ── Target Skills for Domain ──────────────────────────────────────────
        List<String> targetSkills = getTargetSkills(domain);
        List<Map<String, String>> missingSkillsMaps = new ArrayList<>();
        List<String> missingSkillNames = new ArrayList<>();
        List<String> requiredSkillsForRoadmap = new ArrayList<>();

        for (int i = 0; i < targetSkills.size(); i++) {
            String ts = targetSkills.get(i);
            boolean found = skillsLower.stream().anyMatch(s -> s.contains(ts.toLowerCase()) || ts.toLowerCase().contains(s));
            if (!found) {
                missingSkillNames.add(ts);
                requiredSkillsForRoadmap.add(ts);
                String priority = i < 2 ? "High" : i < 4 ? "Medium" : "Low";
                missingSkillsMaps.add(Map.of("skill", ts, "priority", priority));
            }
        }

        // ── Scores ────────────────────────────────────────────────────────────
        int hasHeadline = !str(profile, "headline").isBlank() ? 15 : 0;
        int hasAbout = about.length() > 80 ? 20 : (about.length() > 20 ? 10 : 0);
        int hasExp = !experienceRaw.isBlank() ? 25 : 0;
        int hasSkills = skillsList.size() >= 5 ? 15 : (skillsList.size() >= 2 ? 8 : 0);
        int hasCerts = !certifications.isBlank() ? 10 : 0;
        int hasProj = !projects.isBlank() ? 5 : 0;
        int hasPhoto = 10;
        int profileScore = Math.min(100, hasPhoto + hasHeadline + hasAbout + hasExp + hasSkills + hasCerts + hasProj);

        double skillCoverage = targetSkills.isEmpty() ? 1.0
            : (double) (targetSkills.size() - missingSkillNames.size()) / targetSkills.size();
        int atsScore = (int) Math.min(100, Math.max(35, Math.round(skillCoverage * 60 + profileScore * 0.4)));
        int hiringReadiness = (int) Math.min(100, Math.round(profileScore * 0.7 + skillCoverage * 30));
        int interviewReadiness = (int) Math.min(100, Math.round(skillCoverage * 70 + (hasProj > 0 ? 20 : 5)));

        // ── Salary ────────────────────────────────────────────────────────────
        String salaryIndia = getSalaryIndia(domain, careerStage);
        String salaryUS = getSalaryUS(domain, careerStage);
        int salaryConfidence = 55 + (skillsList.size() > 5 ? 15 : 0) + (!certifications.isBlank() ? 10 : 0);

        // ── Radar Data ────────────────────────────────────────────────────────
        List<Map<String, Object>> radarData = new ArrayList<>();
        radarData.add(radar("Programming", skillsLower, "java", "python", "javascript", "c++", "typescript", "kotlin", "go"));
        radarData.add(radar("DSA", skillsLower, "data structures", "algorithms", "leetcode", "dsa", "java", "python"));
        radarData.add(radar("Database", skillsLower, "sql", "mysql", "postgresql", "mongodb", "redis", "oracle"));
        radarData.add(radar("Cloud", skillsLower, "aws", "azure", "gcp", "docker", "kubernetes", "terraform"));
        radarData.add(radar("AI/ML", skillsLower, "machine learning", "tensorflow", "pytorch", "scikit", "pandas", "numpy", "nlp"));
        radarData.add(radar("System Design", skillsLower, "system design", "spring boot", "microservices", "kafka", "rest api"));
        radarData.add(Map.of("subject", "Communication", "A", about.length() > 150 ? 85 : about.length() > 60 ? 70 : 55));

        // ── Missing Keywords ──────────────────────────────────────────────────
        List<String> missingKeywords = new ArrayList<>(missingSkillNames.subList(0, Math.min(5, missingSkillNames.size())));
        List<String> recommendedKeywords = new ArrayList<>(targetSkills.subList(0, Math.min(6, targetSkills.size())));

        // ── Candidate Summary ─────────────────────────────────────────────────
        String displayName = name.isBlank() ? "This professional" : name;
        String candidateSummary = buildSummary(displayName, careerStage, domain, skillsList, certifications);

        // ── ATS Reasoning ─────────────────────────────────────────────────────
        String atsReasoning = buildAtsReasoning(atsScore, missingSkillNames, skillsList, certifications, about);

        // ── Optimization ─────────────────────────────────────────────────────
        String currentHeadline = str(profile, "headline");
        String recHeadline = buildOptimizedHeadline(careerStage, targetRole, skillsList);
        String aboutEval = about.length() < 80
            ? "The About section is too brief. Recruiters and ATS systems prioritize keyword-rich summaries of 150+ words."
            : "Good length but could include more measurable impact statements and role-specific keywords.";
        String improvedAbout = buildImprovedAbout(displayName, targetRole, skillsList, certifications, projects);

        List<String> expSuggestions = List.of(
            "Start bullet points with strong action verbs: 'Developed', 'Architected', 'Optimized', 'Led', 'Delivered'.",
            "Quantify impact wherever possible (e.g., 'Reduced API latency by 40%', 'Managed a team of 5').",
            "Reference key technologies inline with your accomplishments for better ATS keyword density.",
            "Add measurable outcomes: cost savings, performance improvements, user growth, delivery timelines."
        );

        Map<String, Object> optimization = new LinkedHashMap<>();
        optimization.put("currentHeadline", currentHeadline);
        optimization.put("recommendedHeadline", recHeadline);
        optimization.put("aboutEvaluation", aboutEval);
        optimization.put("improvedAbout", improvedAbout);
        optimization.put("experienceSuggestions", expSuggestions);

        // ── Recruiter View ────────────────────────────────────────────────────
        List<String> weakSections = new ArrayList<>();
        List<String> strengthAreas = new ArrayList<>();
        if (about.length() < 80) weakSections.add("About section is too short — recruiters skip profiles without a strong summary");
        if (certifications.isBlank()) weakSections.add("No certifications listed — verified credentials significantly improve trust");
        if (missingSkillNames.size() > 3) weakSections.add("Critical skill gaps detected for " + targetRole + " roles");
        if (profileScore < 65) weakSections.add("Profile completeness score is below recruiter visibility threshold (65%)");
        if (!projects.isBlank()) strengthAreas.add("Project portfolio demonstrates hands-on technical capability");
        if (skillsList.size() >= 5) strengthAreas.add("Diverse technical skill set improves search ranking");
        if (!certifications.isBlank()) strengthAreas.add("Verified certifications build credibility with hiring managers");
        if (!experienceRaw.isBlank()) strengthAreas.add("Work experience demonstrates real-world application of skills");
        if (weakSections.isEmpty()) weakSections.add("No critical weak sections identified — profile is well-structured");
        if (strengthAreas.isEmpty()) strengthAreas.add("Complete the profile sections above to build key strength areas");

        Map<String, Object> recruiterView = new LinkedHashMap<>();
        recruiterView.put("weakSections", weakSections);
        recruiterView.put("strengthAreas", strengthAreas);
        recruiterView.put("missingKeywords", missingKeywords);

        // ── Career Roadmap ────────────────────────────────────────────────────
        List<Map<String, String>> milestones = new ArrayList<>();
        milestones.add(Map.of("phase", "Month 1", "task", "Solidify core skills: " + String.join(", ", targetSkills.subList(0, Math.min(3, targetSkills.size())))));
        if (!missingSkillNames.isEmpty()) {
            milestones.add(Map.of("phase", "Month 2–3", "task", "Close skill gaps: Learn " + String.join(", ", missingSkillNames.subList(0, Math.min(3, missingSkillNames.size())))));
        }
        milestones.add(Map.of("phase", "Month 3–4", "task", "Build 2 portfolio projects showcasing " + targetRole + " skills and deploy them publicly."));
        milestones.add(Map.of("phase", "Month 4–5", "task", "Optimize LinkedIn profile, build ATS-compliant resume, and apply to matched roles."));

        Map<String, Object> roadmap = new LinkedHashMap<>();
        roadmap.put("currentLevel", careerStage);
        roadmap.put("targetRole", targetRole);
        roadmap.put("requiredSkills", requiredSkillsForRoadmap);
        roadmap.put("estimatedTime", missingSkillNames.size() <= 2 ? "2 Months" : missingSkillNames.size() <= 4 ? "3 Months" : "5 Months");
        roadmap.put("milestones", milestones);

        // ── Assemble Final Result ─────────────────────────────────────────────
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("candidateSummary", candidateSummary);
        result.put("careerStage", careerStage);
        result.put("domain", domain);
        result.put("atsScore", atsScore);
        result.put("atsReasoning", atsReasoning);
        result.put("missingKeywords", missingKeywords);
        result.put("recommendedKeywords", recommendedKeywords);
        result.put("profileScore", profileScore);
        result.put("salaryIndia", salaryIndia);
        result.put("salaryUS", salaryUS);
        result.put("salaryConfidence", salaryConfidence);
        result.put("salaryReasoning", "Estimated based on detected domain (" + domain + "), career stage (" + careerStage + "), and skill coverage (" + String.format("%.0f", skillCoverage * 100) + "%).");
        result.put("hiringReadinessScore", hiringReadiness);
        result.put("interviewReadinessScore", interviewReadiness);
        result.put("skillsFound", skillsList);
        result.put("missingSkills", missingSkillsMaps);
        result.put("targetRole", targetRole);
        result.put("roadmap", roadmap);
        result.put("optimization", optimization);
        result.put("recruiterView", recruiterView);
        result.put("radarData", radarData);
        return result;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper Methods
    // ─────────────────────────────────────────────────────────────────────────

    private String detectDomain(Set<String> skills, String headline) {
        if (has(skills, headline, "react", "vue", "angular", "html", "css", "frontend", "next.js", "tailwind")) return "Frontend";
        if (has(skills, headline, "spring", "django", "node", "backend", "rest api", "express", "laravel", "fastapi")) return "Backend";
        if (has(skills, headline, "tensorflow", "pytorch", "machine learning", "nlp", "deep learning", "scikit", "ml", "ai")) return "AI/ML";
        if (has(skills, headline, "pandas", "tableau", "power bi", "data science", "data analyst", "matplotlib", "r programming")) return "Data Science";
        if (has(skills, headline, "aws", "azure", "gcp", "terraform", "cloud", "cloudformation")) return "Cloud";
        if (has(skills, headline, "docker", "kubernetes", "ci/cd", "devops", "jenkins", "ansible", "prometheus")) return "DevOps";
        if (has(skills, headline, "android", "ios", "flutter", "react native", "swift", "kotlin", "mobile")) return "Mobile Development";
        if (has(skills, headline, "cybersecurity", "ethical hacking", "penetration testing", "security", "splunk", "siem")) return "Cybersecurity";
        if (has(skills, headline, "react", "node", "full stack", "fullstack", "mongodb", "express")) return "Full Stack";
        return "General Engineering";
    }

    private String detectCareerStage(String headline, String experience, String education) {
        String combined = (headline + " " + experience + " " + education).toLowerCase();
        if (combined.contains("student") || combined.contains("fresher") || combined.contains("graduate") && experience.isBlank()) return "Student";
        if (combined.contains("intern") || combined.contains("fresher") || combined.contains("0-1 year") || combined.contains("entry level")) return "Fresher";
        if (combined.contains("junior") || combined.contains("associate developer") || combined.contains("1-2 year")) return "Junior Developer";
        if (combined.contains("senior") || combined.contains("sr.") || combined.contains("tech lead")) return "Senior Engineer";
        if (combined.contains("architect") || combined.contains("principal engineer")) return "Architect";
        if (combined.contains("manager") || combined.contains("engineering manager") || combined.contains("em ")) return "Manager";
        if (!experience.isBlank() && experience.length() > 100) return "Mid-Level Engineer";
        return "Fresher";
    }

    private String getTargetRole(String domain) {
        return switch (domain) {
            case "Frontend" -> "Frontend Developer";
            case "Backend" -> "Backend Engineer";
            case "Full Stack" -> "Full Stack Developer";
            case "AI/ML" -> "ML Engineer";
            case "Data Science" -> "Data Scientist";
            case "Cloud" -> "Cloud Engineer";
            case "DevOps" -> "DevOps Engineer";
            case "Mobile Development" -> "Mobile Developer";
            case "Cybersecurity" -> "Security Engineer";
            default -> "Software Engineer";
        };
    }

    private List<String> getTargetSkills(String domain) {
        return switch (domain) {
            case "Frontend" -> List.of("React", "TypeScript", "Next.js", "Redux", "Tailwind CSS", "REST APIs", "Testing");
            case "Backend" -> List.of("Spring Boot", "Docker", "Kubernetes", "AWS", "System Design", "SQL", "Redis");
            case "Full Stack" -> List.of("React", "Node.js", "MongoDB", "REST APIs", "Docker", "TypeScript", "AWS");
            case "AI/ML" -> List.of("Python", "TensorFlow", "PyTorch", "Scikit-learn", "SQL", "MLflow", "Cloud Computing");
            case "Data Science" -> List.of("Python", "SQL", "Pandas", "Tableau", "Statistical Analysis", "Power BI", "Machine Learning");
            case "Cloud" -> List.of("AWS", "Terraform", "Docker", "Kubernetes", "Azure", "CI/CD", "Python");
            case "DevOps" -> List.of("Docker", "Kubernetes", "Jenkins", "Terraform", "AWS", "Monitoring", "CI/CD");
            case "Mobile Development" -> List.of("Kotlin", "Swift", "Flutter", "Firebase", "REST APIs", "CI/CD", "App Store Deployment");
            case "Cybersecurity" -> List.of("Penetration Testing", "SIEM", "Network Security", "Python", "Splunk", "OWASP", "Risk Assessment");
            default -> List.of("Java", "Data Structures", "Algorithms", "SQL", "Git", "System Design", "REST APIs");
        };
    }

    private String getSalaryIndia(String domain, String stage) {
        return switch (stage) {
            case "Student", "Fresher" -> switch (domain) {
                case "AI/ML", "Data Science" -> "₹5 LPA – ₹9 LPA";
                case "Backend", "Full Stack" -> "₹5 LPA – ₹8 LPA";
                case "Cloud", "DevOps" -> "₹6 LPA – ₹10 LPA";
                default -> "₹4 LPA – ₹7 LPA";
            };
            case "Junior Developer" -> switch (domain) {
                case "AI/ML", "Data Science" -> "₹8 LPA – ₹14 LPA";
                case "Backend", "Full Stack", "Cloud" -> "₹7 LPA – ₹13 LPA";
                default -> "₹6 LPA – ₹10 LPA";
            };
            case "Mid-Level Engineer" -> switch (domain) {
                case "AI/ML", "Data Science" -> "₹15 LPA – ₹25 LPA";
                case "Backend", "Full Stack", "DevOps", "Cloud" -> "₹14 LPA – ₹22 LPA";
                default -> "₹12 LPA – ₹18 LPA";
            };
            case "Senior Engineer" -> "₹25 LPA – ₹45 LPA";
            case "Architect", "Manager" -> "₹40 LPA – ₹80 LPA";
            default -> "₹5 LPA – ₹10 LPA";
        };
    }

    private String getSalaryUS(String domain, String stage) {
        return switch (stage) {
            case "Student", "Fresher" -> "$65k – $90k";
            case "Junior Developer" -> switch (domain) {
                case "AI/ML", "Data Science" -> "$90k – $130k";
                default -> "$80k – $120k";
            };
            case "Mid-Level Engineer" -> switch (domain) {
                case "AI/ML", "Data Science" -> "$130k – $180k";
                default -> "$120k – $160k";
            };
            case "Senior Engineer" -> "$160k – $220k";
            case "Architect", "Manager" -> "$200k – $300k";
            default -> "$70k – $100k";
        };
    }

    private Map<String, Object> radar(String subject, Set<String> skills, String... keywords) {
        int base = 30;
        int hits = 0;
        for (String kw : keywords) {
            if (skills.stream().anyMatch(s -> s.contains(kw) || kw.contains(s))) hits++;
        }
        int score = Math.min(95, base + (hits * 12));
        return Map.of("subject", subject, "A", score);
    }

    private boolean has(Set<String> skills, String headline, String... keywords) {
        for (String kw : keywords) {
            if (skills.stream().anyMatch(s -> s.contains(kw) || kw.contains(s))) return true;
            if (headline.contains(kw)) return true;
        }
        return false;
    }

    private String str(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val == null ? "" : val.toString();
    }

    private String buildSummary(String name, String stage, String domain, List<String> skills, String certs) {
        String skillStr = skills.isEmpty() ? "software development" : String.join(", ", skills.subList(0, Math.min(4, skills.size())));
        String certStr = certs.isBlank() ? "" : " Holds verified credentials including " + certs.split(",")[0].trim() + ".";
        return name + " is a " + stage + " specializing in " + domain + " with expertise in " + skillStr + "." + certStr
            + " Demonstrates strong technical foundations and a drive to build impactful, production-grade solutions.";
    }

    private String buildAtsReasoning(int score, List<String> missing, List<String> skills, String certs, String about) {
        if (score >= 80) return "Strong ATS compatibility. Profile covers most required keywords for the target role with solid completeness.";
        if (score >= 60) return "Moderate ATS match. Adding skills like " + (missing.isEmpty() ? "system design" : missing.get(0)) + " and expanding the About section would improve searchability.";
        return "Low ATS compatibility. Profile is missing critical keywords (" + String.join(", ", missing.subList(0, Math.min(3, missing.size()))) + ") and completeness needs improvement.";
    }

    private String buildOptimizedHeadline(String stage, String targetRole, List<String> skills) {
        String topSkills = skills.isEmpty() ? targetRole : String.join(" | ", skills.subList(0, Math.min(3, skills.size())));
        if (stage.equals("Student") || stage.equals("Fresher")) {
            return stage + " | " + targetRole + " Aspirant | " + topSkills + " | Open to Opportunities";
        }
        return targetRole + " | " + topSkills + " | " + stage + " | Open to New Opportunities";
    }

    private String buildImprovedAbout(String name, String targetRole, List<String> skills, String certs, String projects) {
        String skillStr = skills.isEmpty() ? "modern software development practices" : String.join(", ", skills.subList(0, Math.min(5, skills.size())));
        String certPart = certs.isBlank() ? "" : " Holds " + certs.split(",")[0].trim() + " certification.";
        String projPart = projects.isBlank() ? "" : " Actively works on real-world projects demonstrating end-to-end delivery capability.";
        return "Passionate and results-driven " + targetRole + " with hands-on expertise in " + skillStr
            + "." + certPart + projPart
            + " Committed to writing clean, scalable code and continuously growing through challenging technical problems."
            + " Actively seeking opportunities to contribute to high-impact engineering teams.";
    }
}
