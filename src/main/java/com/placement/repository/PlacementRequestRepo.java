package com.placement.repository;

import com.placement.model.PlacementRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlacementRequestRepo extends JpaRepository<PlacementRequest, Integer> {
    List<PlacementRequest> findByCompanyIdOrderByCreatedAtDesc(Integer companyId);
    List<PlacementRequest> findByStatusOrderByCreatedAtDesc(String status);
}
