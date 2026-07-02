package com.placement.dto;

import lombok.Data;

@Data
public class CompanyRequest {
    private String name;
    private String email;
    private String password;
    private String jobRole;
    private Double salaryLpa;
    private Double minCgpa;
    private String allowedBranches;
    private String requiredSkills;
    private Boolean backlogAllowed;
}