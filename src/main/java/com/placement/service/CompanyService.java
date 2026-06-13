package com.placement.service;

import com.placement.dto.CompanyRequest;
import com.placement.model.Company;
import com.placement.model.EligibilityRule;
import com.placement.repository.CompanyRepo;
import com.placement.repository.EligibilityRuleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepo companyRepo;

    @Autowired
    private EligibilityRuleRepo eligibilityRuleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Company registerCompany(CompanyRequest req) {
        Company company = new Company();
        company.setName(req.getName());
        company.setEmail(req.getEmail());
        company.setJobRole(req.getJobRole());
        company.setSalaryLpa(req.getSalaryLpa());
        company.setPassword(passwordEncoder.encode(req.getPassword()));
        company.setStatus("PENDING");
        Company saved = companyRepo.save(company);

        EligibilityRule rule = new EligibilityRule();
        rule.setCompany(saved);
        rule.setMinCgpa(req.getMinCgpa());
        rule.setAllowedBranches(req.getAllowedBranches());
        rule.setRequiredSkills(req.getRequiredSkills());
        rule.setBacklogAllowed(req.getBacklogAllowed());
        eligibilityRuleRepo.save(rule);

        return saved;
    }

    public List<Company> getAllCompanies() {
        return companyRepo.findAll();
    }

    public Optional<Company> getById(Integer id) {
        return companyRepo.findById(id);
    }

    public Company approveCompany(Integer id) {
        Company company = companyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        company.setStatus("APPROVED");
        return companyRepo.save(company);
    }

    public Company rejectCompany(Integer id) {
        Company company = companyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        company.setStatus("REJECTED");
        return companyRepo.save(company);
    }
}