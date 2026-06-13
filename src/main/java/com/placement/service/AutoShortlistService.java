package com.placement.service;

import com.placement.model.PlacementDrive;
import com.placement.model.ShortlistedCandidate;
import com.placement.model.Student;
import com.placement.repository.PlacementDriveRepo;
import com.placement.repository.ShortlistedCandidateRepo;
import com.placement.repository.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AutoShortlistService {

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private PlacementDriveRepo driveRepo;

    @Autowired
    private ShortlistedCandidateRepo shortlistRepo;

    @Autowired
    private EligibilityService eligibilityService;

    // Auto-shortlist all eligible students for a drive
    public List<ShortlistedCandidate> autoShortlist(Integer driveId) {
        PlacementDrive drive = driveRepo.findById(driveId)
                .orElseThrow(() -> new RuntimeException("Drive not found"));

        List<Student> allStudents = studentRepo.findAll();
        List<ShortlistedCandidate> shortlisted = new ArrayList<>();

        for (Student student : allStudents) {
            boolean eligible = eligibilityService
                    .isEligible(student, drive.getCompany().getId());

            if (eligible) {
                // Avoid duplicate shortlisting
                boolean alreadyShortlisted = shortlistRepo
                        .findByDriveId(driveId)
                        .stream()
                        .anyMatch(sc -> sc.getStudent().getId().equals(student.getId()));

                if (!alreadyShortlisted) {
                    ShortlistedCandidate candidate = new ShortlistedCandidate();
                    candidate.setStudent(student);
                    candidate.setDrive(drive);
                    candidate.setRound("INITIAL");
                    candidate.setResult("PENDING");
                    shortlisted.add(shortlistRepo.save(candidate));
                }
            }
        }

        return shortlisted;
    }

    // Get all shortlisted candidates for a drive
    public List<ShortlistedCandidate> getShortlistedByDrive(Integer driveId) {
        return shortlistRepo.findByDriveId(driveId);
    }
}