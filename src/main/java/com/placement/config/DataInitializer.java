package com.placement.config;

import com.placement.model.Admin;
import com.placement.repository.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.annotation.PostConstruct;

@Configuration
public class DataInitializer {

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void seed() {
        if (adminRepo.findByEmail("admin@spms.com").isEmpty()) {
            Admin admin = new Admin();
            admin.setName("Super Admin");
            admin.setEmail("admin@spms.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole("PLACEMENT_OFFICER");
            adminRepo.save(admin);
            System.out.println("=== DEFAULT ADMIN CREATED: admin@spms.com / Admin@123 ===");
        }
        if (adminRepo.findByEmail("admin@spm.com").isEmpty()) {
            Admin admin = new Admin();
            admin.setName("Admin SPMS");
            admin.setEmail("admin@spm.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("PLACEMENT_OFFICER");
            adminRepo.save(admin);
            System.out.println("=== DEFAULT ADMIN CREATED: admin@spm.com / admin123 ===");
        }
    }
}
