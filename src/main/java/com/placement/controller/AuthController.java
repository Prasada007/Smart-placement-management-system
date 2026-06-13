package com.placement.controller;

import com.placement.dto.ApiResponse;
import com.placement.dto.AuthResponse;
import com.placement.dto.LoginRequest;
import com.placement.model.Admin;
import com.placement.model.Company;
import com.placement.model.Student;
import com.placement.repository.AdminRepo;
import com.placement.repository.CompanyRepo;
import com.placement.repository.StudentRepo;
import com.placement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private StudentRepo studentRepo;
    @Autowired private CompanyRepo companyRepo;
    @Autowired private AdminRepo adminRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest req) {

        String email    = req.getEmail();
        String password = req.getPassword();

        // STUDENT
        Optional<Student> studentOpt = studentRepo.findByEmail(email);
        if (studentOpt.isPresent()) {
            Student s = studentOpt.get();
            if (passwordEncoder.matches(password, s.getPassword())) {
                String token = jwtUtil.generateToken(email, "STUDENT");
                return ResponseEntity.ok(new ApiResponse(true, "Login successful",
                        new AuthResponse(token, "STUDENT", s.getId())));
            }
            return unauthorized("Invalid password");
        }

        // COMPANY
        Optional<Company> companyOpt = companyRepo.findByEmail(email);
        if (companyOpt.isPresent()) {
            Company c = companyOpt.get();
            if (passwordEncoder.matches(password, c.getPassword())) {
                String token = jwtUtil.generateToken(email, "COMPANY");
                return ResponseEntity.ok(new ApiResponse(true, "Login successful",
                        new AuthResponse(token, "COMPANY", c.getId())));
            }
            return unauthorized("Invalid password");
        }

        // ADMIN
        Optional<Admin> adminOpt = adminRepo.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin a = adminOpt.get();
            if (passwordEncoder.matches(password, a.getPassword())) {
                String token = jwtUtil.generateToken(email, "ADMIN");
                return ResponseEntity.ok(new ApiResponse(true, "Login successful",
                        new AuthResponse(token, "ADMIN", a.getId())));
            }
            return unauthorized("Invalid password");
        }

        // Not found in any table
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Email not registered", null));
    }

    private ResponseEntity<ApiResponse> unauthorized(String msg) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, msg, null));
    }
}
