package com.placement.service;

import com.placement.model.EligibilityRule;
import com.placement.model.Student;
import com.placement.model.StudentProfile;
import com.placement.repository.EligibilityRuleRepo;
import com.placement.repository.StudentProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class EligibilityService {

    @Autowired
    private EligibilityRuleRepo eligibilityRuleRepo;

    @Autowired
    private StudentProfileRepo studentProfileRepo;

    // Check if a single student is eligible for a company
    public boolean isEligible(Student student, Integer companyId) {
        EligibilityRule rule = eligibilityRuleRepo
                .findByCompanyId(companyId)
                .orElseThrow(() -> new RuntimeException("No eligibility rule found for company"));

        // Check CGPA
        if (student.getCgpa() < rule.getMinCgpa()) {
            return false;
        }

        // Check Backlog
        if (!rule.getBacklogAllowed() && student.getHasBacklog()) {
            return false;
        }

        // Check Branch
        List<String> allowedBranches = Arrays.asList(
                rule.getAllowedBranches().split(",")
        );
        boolean branchMatch = allowedBranches.stream()
                .map(String::trim)
                .anyMatch(b -> b.equalsIgnoreCase(student.getBranch()));
        if (!branchMatch) {
            return false;
        }

        // Check Skills (if required)
        if (rule.getRequiredSkills() != null && !rule.getRequiredSkills().isEmpty()) {
            StudentProfile profile = studentProfileRepo
                    .findByStudentId(student.getId())
                    .orElse(null);

            if (profile == null || profile.getSkills() == null) {
                return false;
            }

            List<String> requiredSkills = Arrays.asList(
                    rule.getRequiredSkills().split(",")
            );
            List<String> studentSkills = Arrays.asList(
                    profile.getSkills().split(",")
            );

            // Student must have ALL required skills
            for (String required : requiredSkills) {
                boolean hasSkill = studentSkills.stream()
                        .map(String::trim)
                        .anyMatch(s -> s.equalsIgnoreCase(required.trim()));
                if (!hasSkill) {
                    return false;
                }
            }
        }

        return true;
    }

    // Return reasons why student is NOT eligible
    public List<String> getIneligibilityReasons(Student student, Integer companyId) {
        List<String> reasons = new ArrayList<>();

        EligibilityRule rule = eligibilityRuleRepo
                .findByCompanyId(companyId)
                .orElseThrow(() -> new RuntimeException("No eligibility rule found"));

        if (student.getCgpa() < rule.getMinCgpa()) {
            reasons.add("CGPA " + student.getCgpa() +
                    " is below required " + rule.getMinCgpa());
        }

        if (!rule.getBacklogAllowed() && student.getHasBacklog()) {
            reasons.add("Student has active backlog");
        }

        List<String> allowedBranches = Arrays.asList(
                rule.getAllowedBranches().split(",")
        );
        boolean branchMatch = allowedBranches.stream()
                .map(String::trim)
                .anyMatch(b -> b.equalsIgnoreCase(student.getBranch()));
        if (!branchMatch) {
            reasons.add("Branch " + student.getBranch() +
                    " not in allowed list: " + rule.getAllowedBranches());
        }

        if (rule.getRequiredSkills() != null && !rule.getRequiredSkills().isEmpty()) {
            StudentProfile profile = studentProfileRepo
                    .findByStudentId(student.getId()).orElse(null);

            if (profile == null || profile.getSkills() == null) {
                reasons.add("Student has no skills listed");
            } else {
                List<String> requiredSkills = Arrays.asList(
                        rule.getRequiredSkills().split(","));
                List<String> studentSkills = Arrays.asList(
                        profile.getSkills().split(","));

                for (String required : requiredSkills) {
                    boolean has = studentSkills.stream()
                            .map(String::trim)
                            .anyMatch(s -> s.equalsIgnoreCase(required.trim()));
                    if (!has) {
                        reasons.add("Missing required skill: " + required.trim());
                    }
                }
            }
        }

        return reasons;
    }
}