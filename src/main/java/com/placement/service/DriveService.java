package com.placement.service;

import com.placement.dto.DriveRequest;
import com.placement.model.Admin;
import com.placement.model.Company;
import com.placement.model.PlacementDrive;
import com.placement.repository.AdminRepo;
import com.placement.repository.CompanyRepo;
import com.placement.repository.PlacementDriveRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriveService {

    @Autowired
    private PlacementDriveRepo driveRepo;

    @Autowired
    private CompanyRepo companyRepo;

    @Autowired
    private AdminRepo adminRepo;

    public PlacementDrive createDrive(DriveRequest req) {
        Company company = companyRepo.findById(req.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));
        Admin admin = adminRepo.findById(req.getAdminId())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        PlacementDrive drive = new PlacementDrive();
        drive.setCompany(company);
        drive.setAdmin(admin);
        drive.setTestDate(req.getTestDate());
        drive.setInterviewDate(req.getInterviewDate());
        drive.setResultDate(req.getResultDate());
        drive.setVenue(req.getVenue());
        drive.setStatus("UPCOMING");
        return driveRepo.save(drive);
    }

    public List<PlacementDrive> getAllDrives() {
        return driveRepo.findAll();
    }

    public List<PlacementDrive> getUpcomingDrives() {
        return driveRepo.findByStatus("UPCOMING");
    }

    public Optional<PlacementDrive> getById(Integer id) {
        return driveRepo.findById(id);
    }

    public PlacementDrive updateStatus(Integer id, String status) {
        PlacementDrive drive = driveRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Drive not found"));
        drive.setStatus(status);
        return driveRepo.save(drive);
    }
}