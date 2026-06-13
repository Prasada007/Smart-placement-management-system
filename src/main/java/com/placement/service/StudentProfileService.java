package com.placement.service;

import com.placement.model.Student;
import com.placement.model.StudentProfile;
import com.placement.repository.StudentProfileRepo;
import com.placement.repository.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StudentProfileService {

    @Autowired
    private StudentProfileRepo profileRepo;

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private FileStorageService fileStorageService;

    public StudentProfile updateSkills(Integer studentId, String skills,
                                       String internshipDetails,
                                       Integer certificationScore) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        StudentProfile profile = profileRepo
                .findByStudentId(studentId)
                .orElse(new StudentProfile());

        profile.setStudent(student);
        profile.setSkills(skills);
        profile.setInternshipDetails(internshipDetails);
        profile.setCertificationScore(certificationScore);
        return profileRepo.save(profile);
    }

    public StudentProfile uploadResume(Integer studentId, MultipartFile file) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        String path = fileStorageService.storeResume(file, studentId);

        StudentProfile profile = profileRepo
                .findByStudentId(studentId)
                .orElse(new StudentProfile());

        profile.setStudent(student);
        profile.setResumePath(path);
        return profileRepo.save(profile);
    }

    public StudentProfile getProfile(Integer studentId) {
        return profileRepo.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }
}