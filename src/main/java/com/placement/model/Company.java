package com.placement.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "job_role")
    private String jobRole;

    @Column(name = "salary_lpa", columnDefinition = "DECIMAL(5,2)")
    private Double salaryLpa;

    private String status = "PENDING";

    @Column(nullable = false)
    private String password;

    @OneToOne(mappedBy = "company", cascade = CascadeType.ALL)
    private EligibilityRule eligibilityRule;
}