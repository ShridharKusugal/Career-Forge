package com.technocrate.platform.repository;

import com.technocrate.platform.model.Notification;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class NotificationRepository {

    private final JdbcTemplate jdbcTemplate;

    public NotificationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Notification> rowMapper = (rs, rowNum) -> {
        Notification n = new Notification();
        n.setId(rs.getInt("id"));
        n.setUserId(rs.getInt("user_id"));
        n.setTitle(rs.getString("title"));
        n.setMessage(rs.getString("message"));
        n.setIsRead(rs.getBoolean("is_read"));
        if (rs.getTimestamp("created_at") != null) {
            n.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        }
        return n;
    };

    public List<Notification> findByUserId(int userId) {
        String sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    public Notification save(Notification n) {
        if (n.getId() == null) {
            String sql = "INSERT INTO notifications (user_id, title, message, is_read) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, n.getUserId());
                ps.setString(2, n.getTitle());
                ps.setString(3, n.getMessage());
                ps.setBoolean(4, n.getIsRead() != null ? n.getIsRead() : false);
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                n.setId(keyHolder.getKey().intValue());
            }
            return n;
        } else {
            String sql = "UPDATE notifications SET title = ?, message = ?, is_read = ? WHERE id = ?";
            jdbcTemplate.update(sql, n.getTitle(), n.getMessage(), n.getIsRead(), n.getId());
            return n;
        }
    }

    public void markAllAsRead(int userId) {
        String sql = "UPDATE notifications SET is_read = true WHERE user_id = ?";
        jdbcTemplate.update(sql, userId);
    }
}
