package com.technocrate.platform.repository;

import com.technocrate.platform.model.LinkedInProfile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class LinkedInProfileRepository {

    private final JdbcTemplate jdbcTemplate;

    public LinkedInProfileRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<LinkedInProfile> rowMapper = (rs, rowNum) -> {
        LinkedInProfile p = new LinkedInProfile();
        p.setId(rs.getInt("id"));
        p.setUserId(rs.getInt("user_id"));
        p.setLinkedinUrl(rs.getString("linkedin_url"));
        p.setProfileScore(rs.getInt("profile_score"));
        p.setSkillsExtracted(rs.getString("skills_extracted"));
        p.setMissingSkills(rs.getString("missing_skills"));
        p.setCertificationsSuggested(rs.getString("certifications_suggested"));
        p.setProjectsSuggested(rs.getString("projects_suggested"));
        p.setJobMatches(rs.getString("job_matches"));
        
        p.setAtsScore(rs.getInt("ats_score"));
        p.setSalaryPrediction(rs.getString("salary_prediction"));
        p.setHiringReadinessScore(rs.getInt("hiring_readiness_score"));
        p.setInterviewReadinessScore(rs.getInt("interview_readiness_score"));
        p.setRoadmapJson(rs.getString("roadmap_json"));
        p.setOptimizationJson(rs.getString("optimization_json"));
        p.setRecruiterViewJson(rs.getString("recruiter_view_json"));
        p.setRadarDataJson(rs.getString("radar_data_json"));
        p.setRoleMatchesJson(rs.getString("role_matches_json"));
        p.setProfileDataJson(rs.getString("profile_data_json"));
        return p;
    };

    public Optional<LinkedInProfile> findByUserId(int userId) {
        String sql = "SELECT * FROM linkedin_profiles WHERE user_id = ?";
        List<LinkedInProfile> list = jdbcTemplate.query(sql, rowMapper, userId);
        return list.stream().findFirst();
    }

    public LinkedInProfile save(LinkedInProfile p) {
        Optional<LinkedInProfile> existing = findByUserId(p.getUserId());
        if (existing.isEmpty() && p.getId() == null) {
            String sql = "INSERT INTO linkedin_profiles (user_id, linkedin_url, profile_score, skills_extracted, missing_skills, certifications_suggested, projects_suggested, job_matches, ats_score, salary_prediction, hiring_readiness_score, interview_readiness_score, roadmap_json, optimization_json, recruiter_view_json, radar_data_json, role_matches_json, profile_data_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, p.getUserId());
                ps.setString(2, p.getLinkedinUrl());
                ps.setInt(3, p.getProfileScore());
                ps.setString(4, p.getSkillsExtracted());
                ps.setString(5, p.getMissingSkills());
                ps.setString(6, p.getCertificationsSuggested());
                ps.setString(7, p.getProjectsSuggested());
                ps.setString(8, p.getJobMatches());
                ps.setInt(9, p.getAtsScore() != null ? p.getAtsScore() : 0);
                ps.setString(10, p.getSalaryPrediction());
                ps.setInt(11, p.getHiringReadinessScore() != null ? p.getHiringReadinessScore() : 0);
                ps.setInt(12, p.getInterviewReadinessScore() != null ? p.getInterviewReadinessScore() : 0);
                ps.setString(13, p.getRoadmapJson());
                ps.setString(14, p.getOptimizationJson());
                ps.setString(15, p.getRecruiterViewJson());
                ps.setString(16, p.getRadarDataJson());
                ps.setString(17, p.getRoleMatchesJson());
                ps.setString(18, p.getProfileDataJson());
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                p.setId(keyHolder.getKey().intValue());
            }
            return p;
        } else {
            int id = p.getId() != null ? p.getId() : existing.get().getId();
            String sql = "UPDATE linkedin_profiles SET user_id = ?, linkedin_url = ?, profile_score = ?, skills_extracted = ?, missing_skills = ?, certifications_suggested = ?, projects_suggested = ?, job_matches = ?, ats_score = ?, salary_prediction = ?, hiring_readiness_score = ?, interview_readiness_score = ?, roadmap_json = ?, optimization_json = ?, recruiter_view_json = ?, radar_data_json = ?, role_matches_json = ?, profile_data_json = ? WHERE id = ?";
            jdbcTemplate.update(sql, 
                p.getUserId(), 
                p.getLinkedinUrl(), 
                p.getProfileScore(), 
                p.getSkillsExtracted(), 
                p.getMissingSkills(), 
                p.getCertificationsSuggested(), 
                p.getProjectsSuggested(), 
                p.getJobMatches(),
                p.getAtsScore(),
                p.getSalaryPrediction(),
                p.getHiringReadinessScore(),
                p.getInterviewReadinessScore(),
                p.getRoadmapJson(),
                p.getOptimizationJson(),
                p.getRecruiterViewJson(),
                p.getRadarDataJson(),
                p.getRoleMatchesJson(),
                p.getProfileDataJson(),
                id
            );
            p.setId(id);
            return p;
        }
    }

    public void delete(LinkedInProfile p) {
        jdbcTemplate.update("DELETE FROM linkedin_profiles WHERE id = ?", p.getId());
    }

    public void deleteByUserId(int userId) {
        jdbcTemplate.update("DELETE FROM linkedin_profiles WHERE user_id = ?", userId);
    }
}

