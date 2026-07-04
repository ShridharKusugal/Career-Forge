package com.technocrate.platform.repository;

import com.technocrate.platform.model.Resume;
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
public class ResumeRepository {

    private final JdbcTemplate jdbcTemplate;

    public ResumeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Resume> rowMapper = (rs, rowNum) -> {
        Resume r = new Resume();
        r.setId(rs.getInt("id"));
        r.setUserId(rs.getInt("user_id"));
        r.setName(rs.getString("name"));
        r.setEducation(rs.getString("education"));
        r.setExperience(rs.getString("experience"));
        r.setProjects(rs.getString("projects"));
        r.setSkills(rs.getString("skills"));
        r.setAtsScore(rs.getInt("ats_score"));
        r.setSuggestions(rs.getString("suggestions"));
        r.setPhone(rs.getString("phone"));
        r.setEmail(rs.getString("email"));
        r.setLinkedinUrl(rs.getString("linkedin_url"));
        r.setGithubUrl(rs.getString("github_url"));
        r.setSummary(rs.getString("summary"));
        r.setCertifications(rs.getString("certifications"));
        r.setAchievements(rs.getString("achievements"));
        r.setTemplateId(rs.getString("template_id"));
        r.setIsPublic(rs.getBoolean("is_public"));
        return r;
    };

    public List<Resume> findByUserId(int userId) {
        String sql = "SELECT * FROM resumes WHERE user_id = ?";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    public Optional<Resume> findById(int id) {
        String sql = "SELECT * FROM resumes WHERE id = ?";
        List<Resume> list = jdbcTemplate.query(sql, rowMapper, id);
        return list.stream().findFirst();
    }

    public List<Resume> findPublicResumes() {
        String sql = "SELECT * FROM resumes WHERE is_public = true";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Resume save(Resume r) {
        if (r.getId() == null) {
            String sql = "INSERT INTO resumes (user_id, name, education, experience, projects, skills, ats_score, suggestions, phone, email, linkedin_url, github_url, summary, certifications, achievements, template_id, is_public) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, r.getUserId());
                ps.setString(2, r.getName());
                ps.setString(3, r.getEducation());
                ps.setString(4, r.getExperience());
                ps.setString(5, r.getProjects());
                ps.setString(6, r.getSkills());
                ps.setInt(7, r.getAtsScore() != null ? r.getAtsScore() : 0);
                ps.setString(8, r.getSuggestions());
                ps.setString(9, r.getPhone());
                ps.setString(10, r.getEmail());
                ps.setString(11, r.getLinkedinUrl());
                ps.setString(12, r.getGithubUrl());
                ps.setString(13, r.getSummary());
                ps.setString(14, r.getCertifications());
                ps.setString(15, r.getAchievements());
                ps.setString(16, r.getTemplateId());
                ps.setBoolean(17, r.getIsPublic() != null ? r.getIsPublic() : false);
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                r.setId(keyHolder.getKey().intValue());
            }
            return r;
        } else {
            String sql = "UPDATE resumes SET user_id = ?, name = ?, education = ?, experience = ?, projects = ?, skills = ?, ats_score = ?, suggestions = ?, phone = ?, email = ?, linkedin_url = ?, github_url = ?, summary = ?, certifications = ?, achievements = ?, template_id = ?, is_public = ? WHERE id = ?";
            jdbcTemplate.update(sql, r.getUserId(), r.getName(), r.getEducation(), r.getExperience(), r.getProjects(), r.getSkills(), r.getAtsScore(), r.getSuggestions(), r.getPhone(), r.getEmail(), r.getLinkedinUrl(), r.getGithubUrl(), r.getSummary(), r.getCertifications(), r.getAchievements(), r.getTemplateId(), r.getIsPublic(), r.getId());
            return r;
        }
    }

    public void delete(int id) {
        String sql = "DELETE FROM resumes WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
