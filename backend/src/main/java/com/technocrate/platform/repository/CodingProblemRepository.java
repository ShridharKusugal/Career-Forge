package com.technocrate.platform.repository;

import com.technocrate.platform.model.CodingProblem;
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
public class CodingProblemRepository {

    private final JdbcTemplate jdbcTemplate;

    public CodingProblemRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<CodingProblem> rowMapper = (rs, rowNum) -> {
        CodingProblem p = new CodingProblem();
        p.setId(rs.getInt("id"));
        p.setTitle(rs.getString("title"));
        p.setDescription(rs.getString("description"));
        p.setDifficulty(rs.getString("difficulty"));
        int companyId = rs.getInt("company_id");
        if (!rs.wasNull()) {
            p.setCompanyId(companyId);
        }
        p.setTestCases(rs.getString("test_cases"));
        p.setStarterCode(rs.getString("starter_code"));
        p.setTopicTags(rs.getString("topic_tags"));
        p.setHints(rs.getString("hints"));
        p.setSolutionExplanation(rs.getString("solution_explanation"));
        p.setTimeComplexity(rs.getString("time_complexity"));
        p.setSpaceComplexity(rs.getString("space_complexity"));
        return p;
    };

    public List<CodingProblem> findAll() {
        String sql = "SELECT * FROM coding_problems";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<CodingProblem> findByCompanyId(int companyId) {
        String sql = "SELECT * FROM coding_problems WHERE company_id = ?";
        return jdbcTemplate.query(sql, rowMapper, companyId);
    }

    public Optional<CodingProblem> findById(int id) {
        String sql = "SELECT * FROM coding_problems WHERE id = ?";
        List<CodingProblem> problems = jdbcTemplate.query(sql, rowMapper, id);
        return problems.stream().findFirst();
    }

    public CodingProblem save(CodingProblem p) {
        if (p.getId() == null) {
            String sql = "INSERT INTO coding_problems (title, description, difficulty, company_id, test_cases, starter_code, topic_tags, hints, solution_explanation, time_complexity, space_complexity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, p.getTitle());
                ps.setString(2, p.getDescription());
                ps.setString(3, p.getDifficulty());
                if (p.getCompanyId() != null) { ps.setInt(4, p.getCompanyId()); } else { ps.setNull(4, Types.INTEGER); }
                ps.setString(5, p.getTestCases());
                ps.setString(6, p.getStarterCode());
                ps.setString(7, p.getTopicTags());
                ps.setString(8, p.getHints());
                ps.setString(9, p.getSolutionExplanation());
                ps.setString(10, p.getTimeComplexity());
                ps.setString(11, p.getSpaceComplexity());
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                p.setId(keyHolder.getKey().intValue());
            }
            return p;
        } else {
            String sql = "UPDATE coding_problems SET title = ?, description = ?, difficulty = ?, company_id = ?, test_cases = ?, starter_code = ?, topic_tags = ?, hints = ?, solution_explanation = ?, time_complexity = ?, space_complexity = ? WHERE id = ?";
            jdbcTemplate.update(sql, p.getTitle(), p.getDescription(), p.getDifficulty(), p.getCompanyId(), p.getTestCases(), p.getStarterCode(), p.getTopicTags(), p.getHints(), p.getSolutionExplanation(), p.getTimeComplexity(), p.getSpaceComplexity(), p.getId());
            return p;
        }
    }

    public void delete(int id) {
        String sql = "DELETE FROM coding_problems WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
