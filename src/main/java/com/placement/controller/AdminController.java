package com.placement.controller;

import com.placement.dto.ApiResponse;
import com.placement.model.Admin;
import com.placement.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createAdmin(@RequestBody Map<String, String> body) {
        try {
            Admin admin = adminService.createAdmin(
                    body.get("name"),
                    body.get("email"),
                    body.get("password")
            );
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Admin created successfully", admin));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(new ApiResponse(true, "Use id in drives", id));
    }
}
