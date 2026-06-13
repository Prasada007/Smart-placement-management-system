package com.placement.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "eligibility_rules")
public class EligibilityRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "company_id", unique = true, nullable = false)
    private Company company;

    @Column(name = "min_cgpa", nullable = false, columnDefinition = "DECIMAL(3,2)")
    private Double minCgpa;

    @Column(name = "allowed_branches", nullable = false)
    private String allowedBranches;

    @Column(name = "required_skills")
    private String requiredSkills;

    @Column(name = "backlog_allowed")
    private Boolean backlogAllowed = false;
}