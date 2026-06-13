package com.placement.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DriveRequest {
    private Integer companyId;
    private Integer adminId;
    private LocalDate testDate;
    private LocalDate interviewDate;
    private LocalDate resultDate;
    private String venue;
}