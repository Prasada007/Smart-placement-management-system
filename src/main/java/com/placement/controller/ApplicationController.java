package com.placement.controller;

import com.placement.dto.ApiResponse;
import com.placement.model.Application;
import com.placement.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse> apply(@RequestParam("studentId") Integer studentId,
                                             @RequestParam("driveId") Integer driveId) {
        try {
            Application application = applicationService.apply(studentId, driveId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Applied successfully", application));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse> getByStudent(@PathVariable("studentId") Integer studentId) {
        List<Application> applications = applicationService.getByStudent(studentId);
        return ResponseEntity.ok(new ApiResponse(true, "Applications fetched", applications));
    }

    @GetMapping("/drive/{driveId}")
    public ResponseEntity<ApiResponse> getByDrive(@PathVariable("driveId") Integer driveId) {
        List<Application> applications = applicationService.getByDrive(driveId);
        return ResponseEntity.ok(new ApiResponse(true, "Applications fetched", applications));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateStatus(@PathVariable("id") Integer id,
                                                    @RequestParam("value") String value) {
        try {
            Application application = applicationService.updateStatus(id, value);
            return ResponseEntity.ok(new ApiResponse(true, "Application status updated", application));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }
}
