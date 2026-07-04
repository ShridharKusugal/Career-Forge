package com.technocrate.platform.repository;

import com.technocrate.platform.model.Course;
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
public class CourseRepository {

    private final JdbcTemplate jdbcTemplate;

    public CourseRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Course> courseRowMapper = (rs, rowNum) -> {
        Course course = new Course();
        course.setId(rs.getInt("id"));
        course.setDomainId(rs.getInt("domain_id"));
        course.setTitle(rs.getString("title"));
        course.setDescription(rs.getString("description"));
        course.setDifficulty(rs.getString("difficulty"));
        course.setVideoUrl(rs.getString("video_url"));
        course.setNotesPath(rs.getString("notes_path"));
        course.setAssignment(rs.getString("assignment"));
        course.setProject(rs.getString("project"));
        return course;
    };

    public List<Course> findAll() {
        String sql = "SELECT * FROM courses";
        return jdbcTemplate.query(sql, courseRowMapper);
    }

    public List<Course> findByDomainId(int domainId) {
        String sql = "SELECT * FROM courses WHERE domain_id = ?";
        return jdbcTemplate.query(sql, courseRowMapper, domainId);
    }

    public Optional<Course> findById(int id) {
        String sql = "SELECT * FROM courses WHERE id = ?";
        List<Course> courses = jdbcTemplate.query(sql, courseRowMapper, id);
        return courses.stream().findFirst();
    }

    public Course save(Course course) {
        if (course.getId() == null) {
            String sql = "INSERT INTO courses (domain_id, title, description, difficulty, video_url, notes_path, assignment, project) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, course.getDomainId());
                ps.setString(2, course.getTitle());
                ps.setString(3, course.getDescription());
                ps.setString(4, course.getDifficulty());
                ps.setString(5, course.getVideoUrl());
                ps.setString(6, course.getNotesPath());
                ps.setString(7, course.getAssignment());
                ps.setString(8, course.getProject());
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                course.setId(keyHolder.getKey().intValue());
            }
            return course;
        } else {
            String sql = "UPDATE courses SET domain_id = ?, title = ?, description = ?, difficulty = ?, video_url = ?, notes_path = ?, assignment = ?, project = ? WHERE id = ?";
            jdbcTemplate.update(sql, course.getDomainId(), course.getTitle(), course.getDescription(), course.getDifficulty(), course.getVideoUrl(), course.getNotesPath(), course.getAssignment(), course.getProject(), course.getId());
            return course;
        }
    }

    public void delete(int id) {
        String sql = "DELETE FROM courses WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
