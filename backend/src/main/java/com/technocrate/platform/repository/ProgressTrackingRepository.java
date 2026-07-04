package com.technocrate.platform.repository;

import com.technocrate.platform.model.ProgressTracking;
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
public class ProgressTrackingRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProgressTrackingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ProgressTracking> rowMapper = (rs, rowNum) -> {
        ProgressTracking t = new ProgressTracking();
        t.setId(rs.getInt("id"));
        t.setUserId(rs.getInt("user_id"));
        t.setEntityType(rs.getString("entity_type"));
        t.setEntityId(rs.getInt("entity_id"));
        t.setStatus(rs.getString("status"));
        int score = rs.getInt("score");
        if (!rs.wasNull()) {
            t.setScore(score);
        }
        if (rs.getTimestamp("updated_at") != null) {
            t.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        }
        return t;
    };

    public List<ProgressTracking> findByUserId(int userId) {
        String sql = "SELECT * FROM progress_tracking WHERE user_id = ?";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    public Optional<ProgressTracking> findByUniqueKey(int userId, String entityType, int entityId) {
        String sql = "SELECT * FROM progress_tracking WHERE user_id = ? AND entity_type = ? AND entity_id = ?";
        List<ProgressTracking> list = jdbcTemplate.query(sql, rowMapper, userId, entityType, entityId);
        return list.stream().findFirst();
    }

    public ProgressTracking save(ProgressTracking t) {
        Optional<ProgressTracking> existing = findByUniqueKey(t.getUserId(), t.getEntityType(), t.getEntityId());
        if (existing.isEmpty() && t.getId() == null) {
            String sql = "INSERT INTO progress_tracking (user_id, entity_type, entity_id, status, score) VALUES (?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, t.getUserId());
                ps.setString(2, t.getEntityType());
                ps.setInt(3, t.getEntityId());
                ps.setString(4, t.getStatus());
                if (t.getScore() != null) {
                    ps.setInt(5, t.getScore());
                } else {
                    ps.setNull(5, Types.INTEGER);
                }
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                t.setId(keyHolder.getKey().intValue());
            }
            return t;
        } else {
            int id = t.getId() != null ? t.getId() : existing.get().getId();
            ProgressTracking prev = existing.get();
            
            // Keep status as COMPLETED if it was once completed
            String newStatus = t.getStatus();
            if ("COMPLETED".equalsIgnoreCase(prev.getStatus())) {
                newStatus = "COMPLETED";
            }
            
            // Keep the maximum score
            Integer newScore = t.getScore();
            if (prev.getScore() != null && newScore != null) {
                newScore = Math.max(prev.getScore(), newScore);
            } else if (prev.getScore() != null) {
                newScore = prev.getScore();
            }
            
            String sql = "UPDATE progress_tracking SET status = ?, score = ? WHERE id = ?";
            jdbcTemplate.update(sql, newStatus, newScore, id);
            
            t.setId(id);
            t.setStatus(newStatus);
            t.setScore(newScore);
            return t;
        }
    }
}
