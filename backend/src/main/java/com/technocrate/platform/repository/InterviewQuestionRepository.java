package com.technocrate.platform.repository;

import com.technocrate.platform.model.InterviewQuestion;
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
public class InterviewQuestionRepository {

    private final JdbcTemplate jdbcTemplate;

    public InterviewQuestionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<InterviewQuestion> rowMapper = (rs, rowNum) -> {
        InterviewQuestion q = new InterviewQuestion();
        q.setId(rs.getInt("id"));
        q.setCompanyId(rs.getInt("company_id"));
        q.setQuestion(rs.getString("question"));
        q.setAnswer(rs.getString("answer"));
        q.setType(rs.getString("type"));
        q.setDifficulty(rs.getString("difficulty"));
        return q;
    };

    public List<InterviewQuestion> findAll() {
        String sql = "SELECT * FROM interview_questions";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public List<InterviewQuestion> findByCompanyId(int companyId) {
        String sql = "SELECT * FROM interview_questions WHERE company_id = ?";
        return jdbcTemplate.query(sql, rowMapper, companyId);
    }

    public Optional<InterviewQuestion> findById(int id) {
        String sql = "SELECT * FROM interview_questions WHERE id = ?";
        List<InterviewQuestion> questions = jdbcTemplate.query(sql, rowMapper, id);
        return questions.stream().findFirst();
    }

    public InterviewQuestion save(InterviewQuestion q) {
        if (q.getId() == null) {
            String sql = "INSERT INTO interview_questions (company_id, question, answer, type, difficulty) VALUES (?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                if (q.getCompanyId() != null && q.getCompanyId() != 0) {
                    ps.setInt(1, q.getCompanyId());
                } else {
                    ps.setNull(1, Types.INTEGER);
                }
                ps.setString(2, q.getQuestion());
                ps.setString(3, q.getAnswer());
                ps.setString(4, q.getType());
                ps.setString(5, q.getDifficulty());
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                q.setId(keyHolder.getKey().intValue());
            }
            return q;
        } else {
            String sql = "UPDATE interview_questions SET company_id = ?, question = ?, answer = ?, type = ?, difficulty = ? WHERE id = ?";
            Integer cid = (q.getCompanyId() != null && q.getCompanyId() != 0) ? q.getCompanyId() : null;
            jdbcTemplate.update(sql, cid, q.getQuestion(), q.getAnswer(), q.getType(), q.getDifficulty(), q.getId());
            return q;
        }
    }

    public void delete(int id) {
        String sql = "DELETE FROM interview_questions WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
