package com.placement.service;

import com.placement.dto.StudentRegisterRequest;
import com.placement.model.Student;
import com.placement.repository.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Student register(StudentRegisterRequest req) {
        if (studentRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        Student student = new Student();
        student.setRollNumber(req.getRollNumber());
        student.setName(req.getName());
        student.setEmail(req.getEmail());
        student.setPhone(req.getPhone());
        student.setBranch(req.getBranch());
        student.setCgpa(req.getCgpa());
        student.setYearOfPassing(req.getYearOfPassing());
        student.setPassword(passwordEncoder.encode(req.getPassword()));
        student.setHasBacklog(false);
        return studentRepo.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    public Optional<Student> getById(Integer id) {
        return studentRepo.findById(id);
    }

    public Optional<Student> getByEmail(String email) {
        return studentRepo.findByEmail(email);
    }

    public Student update(Integer id, Student updated) {
        Student existing = studentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setCgpa(updated.getCgpa());
        existing.setBranch(updated.getBranch());
        existing.setHasBacklog(updated.getHasBacklog());
        return studentRepo.save(existing);
    }
}