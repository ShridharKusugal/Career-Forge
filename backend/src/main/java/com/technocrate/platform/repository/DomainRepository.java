package com.technocrate.platform.repository;

import com.technocrate.platform.model.Domain;
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
public class DomainRepository {

    private final JdbcTemplate jdbcTemplate;

    public DomainRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Domain> domainRowMapper = (rs, rowNum) -> {
        Domain domain = new Domain();
        domain.setId(rs.getInt("id"));
        domain.setName(rs.getString("name"));
        domain.setDescription(rs.getString("description"));
        domain.setRoadmap(rs.getString("roadmap"));
        domain.setLogoUrl(rs.getString("logo_url"));
        return domain;
    };

    public List<Domain> findAll() {
        String sql = "SELECT * FROM domains";
        return jdbcTemplate.query(sql, domainRowMapper);
    }

    public Optional<Domain> findById(int id) {
        String sql = "SELECT * FROM domains WHERE id = ?";
        List<Domain> domains = jdbcTemplate.query(sql, domainRowMapper, id);
        return domains.stream().findFirst();
    }

    public Domain save(Domain domain) {
        if (domain.getId() == null) {
            String sql = "INSERT INTO domains (name, description, roadmap, logo_url) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, domain.getName());
                ps.setString(2, domain.getDescription());
                ps.setString(3, domain.getRoadmap());
                ps.setString(4, domain.getLogoUrl());
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                domain.setId(keyHolder.getKey().intValue());
            }
            return domain;
        } else {
            String sql = "UPDATE domains SET name = ?, description = ?, roadmap = ?, logo_url = ? WHERE id = ?";
            jdbcTemplate.update(sql, domain.getName(), domain.getDescription(), domain.getRoadmap(), domain.getLogoUrl(), domain.getId());
            return domain;
        }
    }
}
