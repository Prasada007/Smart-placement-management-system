package com.placement.controller;

import com.placement.dto.ApiResponse;
import com.placement.model.StudentProfile;
import com.placement.service.StudentProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/students")
public class ResumeController {

    @Autowired
    private StudentProfileService profileService;

    // Upload resume
    @PostMapping("/{studentId}/resume")
    public ResponseEntity<ApiResponse> uploadResume(
            @PathVariable Integer studentId,
            @RequestParam("file") MultipartFile file) {

        StudentProfile profile = profileService.uploadResume(studentId, file);
        return ResponseEntity.ok(new ApiResponse(
                true,
                "Resume uploaded successfully",
                profile.getResumePath()
        ));
    }

    // Update profile skills
    @PutMapping("/{studentId}/profile")
    public ResponseEntity<ApiResponse> updateProfile(
            @PathVariable Integer studentId,
            @RequestParam String skills,
            @RequestParam(required = false) String internshipDetails,
            @RequestParam(required = false, defaultValue = "0")
                Integer certificationScore) {

        StudentProfile profile = profileService.updateSkills(
                studentId, skills, internshipDetails, certificationScore);
        return ResponseEntity.ok(new ApiResponse(
                true, "Profile updated", profile));
    }

    // Get profile
    @GetMapping("/{studentId}/profile")
    public ResponseEntity<ApiResponse> getProfile(
            @PathVariable Integer studentId) {
        StudentProfile profile = profileService.getProfile(studentId);
        return ResponseEntity.ok(new ApiResponse(true, "Success", profile));
    }

    @GetMapping("/{studentId}/resume")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Integer studentId) {
        StudentProfile profile = profileService.getProfile(studentId);
        String path = profile.getResumePath();

        if (path == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            Path filePath = Paths.get(path);
            byte[] fileBytes = Files.readAllBytes(filePath);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=resume.pdf")
                    .body(fileBytes);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}