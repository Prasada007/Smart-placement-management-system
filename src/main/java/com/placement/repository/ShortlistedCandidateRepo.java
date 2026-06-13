package com.placement.repository;
import com.placement.model.ShortlistedCandidate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShortlistedCandidateRepo extends JpaRepository<ShortlistedCandidate, Integer> {
    List<ShortlistedCandidate> findByDriveId(Integer driveId);
    List<ShortlistedCandidate> findByStudentId(Integer studentId);
}