package com.placement.service;

import com.placement.model.Application;
import com.placement.model.PlacementDrive;
import com.placement.model.Student;
import com.placement.repository.ApplicationRepo;
import com.placement.repository.PlacementDriveRepo;
import com.placement.repository.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepo applicationRepo;

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private PlacementDriveRepo driveRepo;

    public Application apply(Integer studentId, Integer driveId) {
        if (applicationRepo.findByStudentIdAndDriveId(studentId, driveId).isPresent()) {
            throw new RuntimeException("Already applied to this drive");
        }
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        PlacementDrive drive = driveRepo.findById(driveId)
                .orElseThrow(() -> new RuntimeException("Drive not found"));

        Application application = new Application();
        application.setStudent(student);
        application.setDrive(drive);
        application.setStatus("APPLIED");
        return applicationRepo.save(application);
    }

    public List<Application> getByStudent(Integer studentId) {
        return applicationRepo.findByStudentId(studentId);
    }

    public List<Application> getByDrive(Integer driveId) {
        return applicationRepo.findByDriveId(driveId);
    }

    public Application updateStatus(Integer id, String status) {
        Application app = applicationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(status);
        return applicationRepo.save(app);
    }
}