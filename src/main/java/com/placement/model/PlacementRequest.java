package com.placement.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "placement_requests")
public class PlacementRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "job_role", nullable = false)
    private String jobRole;

    @Column(name = "salary_lpa", nullable = false, columnDefinition = "DECIMAL(5,2)")
    private Double salaryLpa;

    @Column(name = "min_cgpa", columnDefinition = "DECIMAL(3,2)")
    private Double minCgpa;

    @Column(name = "allowed_branches")
    private String allowedBranches;

    @Column(name = "required_skills")
    private String requiredSkills;

    @Column(name = "backlog_allowed")
    private Boolean backlogAllowed = false;

    private String status = "PENDING"; // PENDING, APPROVED (Drive created), REJECTED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
