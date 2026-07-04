package com.technocrate.platform.repository;

import com.technocrate.platform.model.Company;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Types;
import java.util.List;
import java.util.Optional;

@Repository
public class CompanyRepository {

    private final JdbcTemplate jdbcTemplate;

    public CompanyRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Company> companyRowMapper = (rs, rowNum) -> {
        Company company = new Company();
        company.setId(rs.getInt("id"));
        company.setName(rs.getString("name"));
        company.setLogoUrl(rs.getString("logo_url"));
        company.setHiringRoles(rs.getString("hiring_roles"));
        company.setEligibility(rs.getString("eligibility"));
        company.setRequiredSkills(rs.getString("required_skills"));
        company.setHiringRounds(rs.getString("hiring_rounds"));
        company.setSalaryPackage(rs.getString("salary_package"));
        company.setJobLocation(rs.getString("job_location"));
        company.setApplicationLink(rs.getString("application_link"));
        if (rs.getDate("last_date") != null) {
            company.setLastDate(rs.getDate("last_date").toLocalDate());
        }
        company.setExperienceLevel(rs.getString("experience_level"));
        company.setHiringTrends(rs.getString("hiring_trends"));
        int jobPostsCount = rs.getInt("job_posts_count");
        company.setJobPostsCount(rs.wasNull() ? null : jobPostsCount);
        int totalApplicants = rs.getInt("total_applicants");
        company.setTotalApplicants(rs.wasNull() ? null : totalApplicants);
        company.setCompanyDescription(rs.getString("company_description"));
        company.setIndustry(rs.getString("industry"));
        int foundedYear = rs.getInt("founded_year");
        company.setFoundedYear(rs.wasNull() ? null : foundedYear);
        company.setHeadquarters(rs.getString("headquarters"));
        company.setEmployeeCount(rs.getString("employee_count"));
        return company;
    };

    public List<Company> findAll() {
        String sql = "SELECT * FROM companies";
        return jdbcTemplate.query(sql, companyRowMapper);
    }

    public Optional<Company> findById(int id) {
        String sql = "SELECT * FROM companies WHERE id = ?";
        List<Company> companies = jdbcTemplate.query(sql, companyRowMapper, id);
        return companies.stream().findFirst();
    }

    public Company save(Company company) {
        if (company.getId() == null) {
            String sql = "INSERT INTO companies (name, logo_url, hiring_roles, eligibility, required_skills, hiring_rounds, salary_package, job_location, application_link, last_date, experience_level, hiring_trends, job_posts_count, total_applicants, company_description, industry, founded_year, headquarters, employee_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, company.getName());
                ps.setString(2, company.getLogoUrl());
                ps.setString(3, company.getHiringRoles());
                ps.setString(4, company.getEligibility());
                ps.setString(5, company.getRequiredSkills());
                ps.setString(6, company.getHiringRounds());
                ps.setString(7, company.getSalaryPackage());
                ps.setString(8, company.getJobLocation());
                ps.setString(9, company.getApplicationLink());
                ps.setDate(10, company.getLastDate() != null ? Date.valueOf(company.getLastDate()) : null);
                ps.setString(11, company.getExperienceLevel());
                ps.setString(12, company.getHiringTrends());
                if (company.getJobPostsCount() != null) { ps.setInt(13, company.getJobPostsCount()); } else { ps.setNull(13, Types.INTEGER); }
                if (company.getTotalApplicants() != null) { ps.setInt(14, company.getTotalApplicants()); } else { ps.setNull(14, Types.INTEGER); }
                ps.setString(15, company.getCompanyDescription());
                ps.setString(16, company.getIndustry());
                if (company.getFoundedYear() != null) { ps.setInt(17, company.getFoundedYear()); } else { ps.setNull(17, Types.INTEGER); }
                ps.setString(18, company.getHeadquarters());
                ps.setString(19, company.getEmployeeCount());
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                company.setId(keyHolder.getKey().intValue());
            }
            return company;
        } else {
            String sql = "UPDATE companies SET name=?, logo_url=?, hiring_roles=?, eligibility=?, required_skills=?, hiring_rounds=?, salary_package=?, job_location=?, application_link=?, last_date=?, experience_level=?, hiring_trends=?, job_posts_count=?, total_applicants=?, company_description=?, industry=?, founded_year=?, headquarters=?, employee_count=? WHERE id=?";
            jdbcTemplate.update(sql, company.getName(), company.getLogoUrl(), company.getHiringRoles(), company.getEligibility(), company.getRequiredSkills(), company.getHiringRounds(), company.getSalaryPackage(), company.getJobLocation(), company.getApplicationLink(), company.getLastDate() != null ? Date.valueOf(company.getLastDate()) : null, company.getExperienceLevel(), company.getHiringTrends(), company.getJobPostsCount(), company.getTotalApplicants(), company.getCompanyDescription(), company.getIndustry(), company.getFoundedYear(), company.getHeadquarters(), company.getEmployeeCount(), company.getId());
            return company;
        }
    }

    public void delete(int id) {
        String sql = "DELETE FROM companies WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
