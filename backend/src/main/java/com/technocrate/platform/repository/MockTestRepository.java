package com.technocrate.platform.repository;

import com.technocrate.platform.model.MockTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Types;
import java.util.List;
import java.util.Optional;

@Repository
public class MockTestRepository {

    private final JdbcTemplate jdbcTemplate;

    public MockTestRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<MockTest> rowMapper = (rs, rowNum) -> {
        MockTest t = new MockTest();
        t.setId(rs.getInt("id"));
        t.setTitle(rs.getString("title"));
        t.setType(rs.getString("type"));
        t.setDurationMinutes(rs.getInt("duration_minutes"));
        t.setQuestions(rs.getString("questions"));
        int companyId = rs.getInt("company_id");
        t.setCompanyId(rs.wasNull() ? null : companyId);
        t.setCategory(rs.getString("category"));
        return t;
    };

    public List<MockTest> findAll() {
        String sql = "SELECT * FROM mock_tests";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<MockTest> findById(int id) {
        String sql = "SELECT * FROM mock_tests WHERE id = ?";
        List<MockTest> tests = jdbcTemplate.query(sql, rowMapper, id);
        return tests.stream().findFirst();
    }

    public List<MockTest> findByCategory(String category) {
        String sql = "SELECT * FROM mock_tests WHERE category = ?";
        return jdbcTemplate.query(sql, rowMapper, category);
    }

    public List<MockTest> findByCompanyId(int companyId) {
        String sql = "SELECT * FROM mock_tests WHERE company_id = ?";
        return jdbcTemplate.query(sql, rowMapper, companyId);
    }

    public MockTest save(MockTest t) {
        if (t.getId() == null) {
            String sql = "INSERT INTO mock_tests (title, type, duration_minutes, questions, company_id, category) VALUES (?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, t.getTitle());
                ps.setString(2, t.getType());
                ps.setInt(3, t.getDurationMinutes());
                ps.setString(4, t.getQuestions());
                if (t.getCompanyId() != null) { ps.setInt(5, t.getCompanyId()); } else { ps.setNull(5, Types.INTEGER); }
                ps.setString(6, t.getCategory());
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                t.setId(keyHolder.getKey().intValue());
            }
            return t;
        } else {
            String sql = "UPDATE mock_tests SET title = ?, type = ?, duration_minutes = ?, questions = ?, company_id = ?, category = ? WHERE id = ?";
            jdbcTemplate.update(sql, t.getTitle(), t.getType(), t.getDurationMinutes(), t.getQuestions(), t.getCompanyId(), t.getCategory(), t.getId());
            return t;
        }
    }
}
