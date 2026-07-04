package com.technocrate.platform.repository;

import com.technocrate.platform.model.Job;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class JobRepository {

    private final JdbcTemplate jdbcTemplate;

    public JobRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Job> rowMapper = (rs, rowNum) -> {
        Job job = new Job();
        job.setId(rs.getInt("id"));
        job.setCompanyId(rs.getInt("company_id"));
        job.setCompanyName(rs.getString("company_name"));
        job.setTitle(rs.getString("title"));
        job.setJobCode(rs.getString("job_code"));
        job.setApplicationUrl(rs.getString("application_url"));
        job.setDescription(rs.getString("description"));
        job.setEligibility(rs.getString("eligibility"));
        job.setLocation(rs.getString("location"));
        job.setSalaryRange(rs.getString("salary_range"));
        job.setHiringStatus(rs.getString("hiring_status"));
        if (rs.getDate("deadline") != null) {
            job.setDeadline(rs.getDate("deadline").toLocalDate());
        }
        job.setExperienceLevel(rs.getString("experience_level"));
        job.setSkillsRequired(rs.getString("skills_required"));
        job.setSource(rs.getString("source"));
        if (rs.getTimestamp("created_at") != null) {
            job.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        }
        return job;
    };

    public List<Job> findAll() {
        String sql = "SELECT * FROM jobs ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<Job> findById(int id) {
        String sql = "SELECT * FROM jobs WHERE id = ?";
        List<Job> list = jdbcTemplate.query(sql, rowMapper, id);
        return list.stream().findFirst();
    }

    public List<Job> findByCompanyId(int companyId) {
        String sql = "SELECT * FROM jobs WHERE company_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, rowMapper, companyId);
    }

    public List<Job> searchJobs(String query, String location, String salary, String type, String industry, String experience, String sort) {
        StringBuilder sql = new StringBuilder("SELECT j.* FROM jobs j JOIN companies c ON j.company_id = c.id WHERE j.hiring_status = 'ACTIVE' ");
        List<Object> params = new ArrayList<>();

        if (query != null && !query.trim().isEmpty()) {
            String q = "%" + query.toLowerCase().trim() + "%";
            sql.append("AND (LOWER(j.title) LIKE ? OR LOWER(j.company_name) LIKE ? OR LOWER(j.skills_required) LIKE ? OR LOWER(j.description) LIKE ?) ");
            params.add(q);
            params.add(q);
            params.add(q);
            params.add(q);
        }

        if (location != null && !location.trim().isEmpty()) {
            if ("remote".equalsIgnoreCase(location)) {
                sql.append("AND LOWER(j.location) LIKE '%remote%' ");
            } else if ("hybrid".equalsIgnoreCase(location)) {
                sql.append("AND LOWER(j.location) LIKE '%hybrid%' ");
            } else {
                sql.append("AND LOWER(j.location) LIKE ? ");
                params.add("%" + location.toLowerCase().trim() + "%");
            }
        }

        if (experience != null && !experience.trim().isEmpty()) {
            if ("fresher".equalsIgnoreCase(experience) || "0".equalsIgnoreCase(experience)) {
                sql.append("AND (LOWER(j.experience_level) LIKE '%fresher%' OR LOWER(j.experience_level) LIKE '%0-1%' OR LOWER(j.experience_level) LIKE '%0-2%') ");
            } else {
                sql.append("AND LOWER(j.experience_level) LIKE ? ");
                params.add("%" + experience.toLowerCase().trim() + "%");
            }
        }

        if (industry != null && !industry.trim().isEmpty()) {
            sql.append("AND LOWER(c.industry) LIKE ? ");
            params.add("%" + industry.toLowerCase().trim() + "%");
        }

        // Apply sorting
        if (sort != null && !sort.trim().isEmpty()) {
            switch (sort.toLowerCase()) {
                case "a-z":
                    sql.append("ORDER BY j.title ASC");
                    break;
                case "newest":
                    sql.append("ORDER BY j.created_at DESC");
                    break;
                case "deadline":
                    sql.append("ORDER BY j.deadline ASC");
                    break;
                case "highest-salary":
                    sql.append("ORDER BY CAST(SUBSTRING_INDEX(j.salary_range, ' ', 1) AS DECIMAL) DESC, j.created_at DESC");
                    break;
                default:
                    sql.append("ORDER BY j.created_at DESC");
            }
        } else {
            sql.append("ORDER BY j.created_at DESC");
        }

        return jdbcTemplate.query(sql.toString(), rowMapper, params.toArray());
    }

    public Job save(Job job) {
        if (job.getId() == null) {
            String sql = "INSERT INTO jobs (company_id, company_name, title, job_code, application_url, description, eligibility, location, salary_range, hiring_status, deadline, experience_level, skills_required, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, job.getCompanyId());
                ps.setString(2, job.getCompanyName());
                ps.setString(3, job.getTitle());
                ps.setString(4, job.getJobCode());
                ps.setString(5, job.getApplicationUrl());
                ps.setString(6, job.getDescription());
                ps.setString(7, job.getEligibility());
                ps.setString(8, job.getLocation());
                ps.setString(9, job.getSalaryRange());
                ps.setString(10, job.getHiringStatus() != null ? job.getHiringStatus() : "ACTIVE");
                ps.setDate(11, job.getDeadline() != null ? Date.valueOf(job.getDeadline()) : null);
                ps.setString(12, job.getExperienceLevel());
                ps.setString(13, job.getSkillsRequired());
                ps.setString(14, job.getSource());
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                job.setId(keyHolder.getKey().intValue());
            }
            return job;
        } else {
            String sql = "UPDATE jobs SET company_id = ?, company_name = ?, title = ?, job_code = ?, application_url = ?, description = ?, eligibility = ?, location = ?, salary_range = ?, hiring_status = ?, deadline = ?, experience_level = ?, skills_required = ?, source = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                job.getCompanyId(),
                job.getCompanyName(),
                job.getTitle(),
                job.getJobCode(),
                job.getApplicationUrl(),
                job.getDescription(),
                job.getEligibility(),
                job.getLocation(),
                job.getSalaryRange(),
                job.getHiringStatus(),
                job.getDeadline() != null ? Date.valueOf(job.getDeadline()) : null,
                job.getExperienceLevel(),
                job.getSkillsRequired(),
                job.getSource(),
                job.getId()
            );
            return job;
        }
    }

    public int countActiveJobs() {
        String sql = "SELECT COUNT(*) FROM jobs WHERE hiring_status = 'ACTIVE'";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count : 0;
    }

    public int countTotalApplicants() {
        String sql = "SELECT COUNT(*) FROM job_applications";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count : 0;
    }

    public double getAveragePackage() {
        String sql = "SELECT j.salary_range FROM jobs j";
        List<String> packages = jdbcTemplate.queryForList(sql, String.class);
        if (packages.isEmpty()) return 12.5; // baseline package
        double sum = 0;
        int count = 0;
        for (String p : packages) {
            if (p != null) {
                try {
                    // Extract first numeric token (e.g. "25 - 45 LPA" -> 25)
                    String cleaned = p.replaceAll("[^0-9.]", " ").trim();
                    if (!cleaned.isEmpty()) {
                        String firstToken = cleaned.split("\\s+")[0];
                        sum += Double.parseDouble(firstToken);
                        count++;
                    }
                } catch (Exception e) {
                    // ignore format errors
                }
            }
        }
        return count > 0 ? (sum / count) : 12.5;
    }
}
