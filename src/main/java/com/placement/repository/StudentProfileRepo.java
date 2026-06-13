package com.placement.repository;
import com.placement.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentProfileRepo extends JpaRepository<StudentProfile, Integer> {
    Optional<StudentProfile> findByStudentId(Integer studentId);
}