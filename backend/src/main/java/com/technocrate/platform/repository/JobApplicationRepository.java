package com.technocrate.platform.repository;

import com.technocrate.platform.model.JobApplication;
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
public class JobApplicationRepository {

    private final JdbcTemplate jdbcTemplate;

    public JobApplicationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<JobApplication> rowMapper = (rs, rowNum) -> {
        JobApplication ja = new JobApplication();
        ja.setId(rs.getInt("id"));
        ja.setUserId(rs.getInt("user_id"));
        ja.setCompanyId(rs.getInt("company_id"));
        ja.setJobId(rs.getObject("job_id") != null ? rs.getInt("job_id") : null);
        ja.setJobTitle(rs.getString("job_title"));
        ja.setJobCode(rs.getString("job_code"));
        ja.setFullName(rs.getString("full_name"));
        ja.setEmail(rs.getString("email"));
        ja.setPhone(rs.getString("phone"));
        ja.setGithubUrl(rs.getString("github_url"));
        ja.setLinkedinUrl(rs.getString("linkedin_url"));
        ja.setResumeText(rs.getString("resume_text"));
        ja.setCoverLetter(rs.getString("cover_letter"));
        ja.setStatus(rs.getString("status"));
        if (rs.getTimestamp("clicked_at") != null) {
            ja.setClickedAt(rs.getTimestamp("clicked_at").toLocalDateTime());
        }
        if (rs.getTimestamp("applied_at") != null) {
            ja.setAppliedAt(rs.getTimestamp("applied_at").toLocalDateTime());
        }
        
        // Retrieve company name if present in result set
        try {
            ja.setCompanyName(rs.getString("company_name"));
        } catch (Exception e) {
            // Ignored if column not in query
        }
        
        return ja;
    };

    public List<JobApplication> findAll() {
        String sql = "SELECT ja.*, c.name AS company_name FROM job_applications ja " +
                     "JOIN companies c ON ja.company_id = c.id ORDER BY ja.applied_at DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<JobApplication> findByUserId(int userId) {
        String sql = "SELECT ja.*, c.name AS company_name FROM job_applications ja " +
                     "JOIN companies c ON ja.company_id = c.id " +
                     "WHERE ja.user_id = ? ORDER BY ja.applied_at DESC";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    public List<JobApplication> findByCompanyId(int companyId) {
        String sql = "SELECT ja.*, c.name AS company_name FROM job_applications ja " +
                     "JOIN companies c ON ja.company_id = c.id " +
                     "WHERE ja.company_id = ? ORDER BY ja.applied_at DESC";
        return jdbcTemplate.query(sql, rowMapper, companyId);
    }

    public Optional<JobApplication> findById(int id) {
        String sql = "SELECT ja.*, c.name AS company_name FROM job_applications ja " +
                     "JOIN companies c ON ja.company_id = c.id WHERE ja.id = ?";
        List<JobApplication> list = jdbcTemplate.query(sql, rowMapper, id);
        return list.stream().findFirst();
    }

    public JobApplication save(JobApplication ja) {
        if (ja.getId() == null) {
            String sql = "INSERT INTO job_applications (user_id, company_id, job_id, job_title, job_code, full_name, email, phone, github_url, linkedin_url, resume_text, cover_letter, status, clicked_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, ja.getUserId());
                ps.setInt(2, ja.getCompanyId());
                if (ja.getJobId() != null) {
                    ps.setInt(3, ja.getJobId());
                } else {
                    ps.setNull(3, java.sql.Types.INTEGER);
                }
                ps.setString(4, ja.getJobTitle());
                ps.setString(5, ja.getJobCode());
                ps.setString(6, ja.getFullName());
                ps.setString(7, ja.getEmail());
                ps.setString(8, ja.getPhone());
                ps.setString(9, ja.getGithubUrl());
                ps.setString(10, ja.getLinkedinUrl());
                ps.setString(11, ja.getResumeText());
                ps.setString(12, ja.getCoverLetter());
                ps.setString(13, ja.getStatus() != null ? ja.getStatus() : "STARTED");
                if (ja.getClickedAt() != null) {
                    ps.setTimestamp(14, java.sql.Timestamp.valueOf(ja.getClickedAt()));
                } else {
                    ps.setNull(14, java.sql.Types.TIMESTAMP);
                }
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                ja.setId(keyHolder.getKey().intValue());
            }
            return ja;
        } else {
            String sql = "UPDATE job_applications SET status = ? WHERE id = ?";
            jdbcTemplate.update(sql, ja.getStatus(), ja.getId());
            return ja;
        }
    }
}
