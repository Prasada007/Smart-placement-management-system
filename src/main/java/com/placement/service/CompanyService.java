package com.placement.service;

import com.placement.dto.CompanyRequest;
import com.placement.model.Company;
import com.placement.repository.CompanyRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepo companyRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public Company registerCompany(CompanyRequest req) {
        if (companyRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        Company company = new Company();
        company.setName(req.getName());
        company.setEmail(req.getEmail());
        company.setPassword(passwordEncoder.encode(req.getPassword()));
        company.setStatus("PENDING");
        return companyRepo.save(company);
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