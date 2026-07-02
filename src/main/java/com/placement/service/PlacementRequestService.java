package com.placement.service;

import com.placement.model.Company;
import com.placement.model.PlacementRequest;
import com.placement.repository.CompanyRepo;
import com.placement.repository.PlacementRequestRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlacementRequestService {

    @Autowired
    private PlacementRequestRepo requestRepo;

    @Autowired
    private CompanyRepo companyRepo;

    public PlacementRequest createRequest(Integer companyId, PlacementRequest req) {
        Company company = companyRepo.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        req.setCompany(company);
        req.setStatus("PENDING");
        return requestRepo.save(req);
    }

    public List<PlacementRequest> getRequestsByCompany(Integer companyId) {
        return requestRepo.findByCompanyIdOrderByCreatedAtDesc(companyId);
    }

    public List<PlacementRequest> getPendingRequests() {
        return requestRepo.findByStatusOrderByCreatedAtDesc("PENDING");
    }

    public PlacementRequest updateStatus(Integer requestId, String status) {
        PlacementRequest req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setStatus(status);
        return requestRepo.save(req);
    }
}
