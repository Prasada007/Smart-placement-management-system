package com.placement.service;

import com.placement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private CompanyRepo companyRepo;

    @Autowired
    private PlacementRequestRepo requestRepo;

    @Autowired
    private PlacementDriveRepo driveRepo;

    @Autowired
    private ApplicationRepo applicationRepo;

    @Autowired
    private ShortlistedCandidateRepo shortlistedRepo;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total counts
        long totalStudents = studentRepo.count();
        long totalCompanies = companyRepo.count();
        long totalDrives = driveRepo.count();
        long totalApplications = applicationRepo.count();

        // Students placed = shortlisted with result SELECTED
        long studentsPlaced = shortlistedRepo.findAll()
                .stream()
                .filter(sc -> "SELECTED".equalsIgnoreCase(sc.getResult()))
                .map(sc -> sc.getStudent().getId())
                .distinct()
                .count();

        // Placement percentage
        double placementPercentage = totalStudents > 0
                ? (double) studentsPlaced / totalStudents * 100
                : 0;

        // Highest package
        double highestPackage = requestRepo.findAll()
                .stream()
                .filter(r -> r.getSalaryLpa() != null)
                .mapToDouble(r -> r.getSalaryLpa())
                .max()
                .orElse(0);

        // Students yet to apply
        long studentsApplied = applicationRepo.findAll()
                .stream()
                .map(a -> a.getStudent().getId())
                .distinct()
                .count();
        long studentsYetToApply = totalStudents - studentsApplied;

        // Upcoming drives
        long upcomingDrives = driveRepo.findByStatus("UPCOMING").size();

        stats.put("totalStudents", totalStudents);
        stats.put("totalCompanies", totalCompanies);
        stats.put("totalDrives", totalDrives);
        stats.put("totalApplications", totalApplications);
        stats.put("studentsPlaced", studentsPlaced);
        stats.put("placementPercentage",
                Math.round(placementPercentage * 100.0) / 100.0);
        stats.put("highestPackageLpa", highestPackage);
        stats.put("studentsYetToApply", studentsYetToApply);
        stats.put("upcomingDrives", upcomingDrives);

        return stats;
    }
}