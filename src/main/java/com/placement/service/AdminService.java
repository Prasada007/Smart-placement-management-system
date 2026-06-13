package com.placement.service;

import com.placement.model.Admin;
import com.placement.repository.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Admin createAdmin(String name, String email, String password) {
        Admin admin = new Admin();
        admin.setName(name);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole("PLACEMENT_OFFICER");
        return adminRepo.save(admin);
    }

    public Optional<Admin> getByEmail(String email) {
        return adminRepo.findByEmail(email);
    }
}